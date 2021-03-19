// contracts/NFT.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//@dev Ownable allows in theory the payment of royalties on Opensea. One reason to deploy to polygon, cheaper fees!
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

//@dev Ownable allows for the secondary sales royalties on OpenSea for the contract owner. Need to define how to claim self as contract owner/originator.
//@title Contract is NFT and is a simple outline of an NFT contract implementing openzeppelin functions
contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    //@dev Constructor takes one argument, the market address and names each token an AOJ token after the creator
    constructor(address marketplaceAddress) ERC721("AOJToken", "AOJ") {
        contractAddress = marketplaceAddress;
        
    }
//@notice One function to create a token. Takes the URI which is uploaded by the creator. Returns an Item ID that is stored in the state variable above
    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        //@dev Mints the items from the creator and sets an item ID
        _mint(msg.sender, newItemId);
        //@dev sets the new token URI based on the upload to IPFS
        _setTokenURI(newItemId, tokenURI);
        //@dev below function is used to assign or revoke the full approval rights to the given operator. The caller of the function (msg.sender) is the approver.
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
}