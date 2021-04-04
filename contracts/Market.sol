// contracts/Market.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

//@title this contract is NFTMarket and is the main contract that handles tracking and transfer of ownership. Uses @openzeppelin and solidity. 
contract NFTMarket is ReentrancyGuard {
  using Counters for Counters.Counter;
  //@dev Counters comes with @openzeppelin contracts. Increments number of nfts so you can add them to a state variable as seen directly below.
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;

  address payable owner;
//@dev Owner has to pay this. Since it's only the creator, it may be best to set this to 0
  uint256 listingPrice = 0.00023 ether;

//@dev Constructor sets variable owner, that must be payable and the one who calls functions as the sender to mint nfts.
  constructor() {
    owner = payable(msg.sender);
  }

//@dev Make a struct to store all the states applicable to each market item.
  struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

//@dev Store unique numbers of market items.
  mapping(uint256 => MarketItem) private idToMarketItem;

//@dev Emit an event which enters data about each market items to be stored in the above mapping. 
  event MarketItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  //@dev Returns the listing price of the contract
  function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }

  //@dev Places an item for sale on the marketplace. Three parameters and involves the open zeppelin contract reentrancy guard.
  //@dev Uses event to store data 
  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");
    //@dev increments the itemIds using the state variable above.
    _itemIds.increment();
    uint256 itemId = _itemIds.current();
    //@dev updates mapping above with a market item
    idToMarketItem[itemId] =  MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false
    );
    //@notice This is where the transfer happens from the creator to the MARKET. Prompts payment and metamask.
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    //@dev An item is created and the event logged. See event above.
    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false
    );
  }

  //@notice Creates the sale of a marketplace item
  //@notice Transfers ownership of the item, as well as funds between parties
  function createMarketSale(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    uint price = idToMarketItem[itemId].price;
    uint tokenId = idToMarketItem[itemId].tokenId;
    require(msg.value == price, "Please submit the asking price in order to complete the purchase");
    //@dev This is where the buyer transfers funds to to the seller
    idToMarketItem[itemId].seller.transfer(msg.value);
    //@dev This is where the transfer of the NFT happens from contract to the buyer
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    //@dev the new owner is now the person who purchased the NFT
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].sold = true;
    _itemsSold.increment();
    payable(owner).transfer(listingPrice);
  }

  //@notice Returns all unsold market items
  //@dev calls fetch function which is view only
  function fetchMarketItems() public view returns (MarketItem[] memory) {
    //@dev Gets the current item count accessing counters
    uint itemCount = _itemIds.current();
    //@dev does a bit of math to figure the difference using both state varaibles with counters
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;
    //@dev now uses new variable unsoldItemCount to add to the Market Item array
    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      //@dev Display all items owned by creator 
      if (idToMarketItem[i + 1].owner == address(0)) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  //@notice Returns only items that a user has purchased and populates to the my-assets page
  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  //@notice Returns only items a user has created and populates to the creator-dashboard page
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
}
