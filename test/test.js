const { expect } = require("chai");
const { ethers } = require("hardhat");
// const { SignerWithAddress } = require("@nomiclabs/hardhat-ethers/signers");

/* test/sample-test.js */
describe("AOJ NFT contract", () => {
it("Should initialize the name and symbol correctly", async () => {
  const NFT = await ethers.getContractFactory("NFT")
  //Random contract address inserted here to satisfy constructor arguments
  const nft = await NFT.deploy("0xcd234a471b72ba2f1ccf0a70fcaba648a5eecd8d")
  const name = await nft.name();
  const symbol = await nft.symbol();
  expect(await nft.name()).to.equal("AOJToken")
  expect(await nft.symbol()).to.equal("AOJ")
  console.log("name:" , name)
  console.log("symbol:", symbol)
 })
})



describe("AOJ NFT contract minting", () => {

  let owner;
  let addr1;
  let addr2;
  let addrs;
  let tokenURI = "https://www.mytokenlocation.com";
  let tokenURI2 ="https://www.mytokenlocation2.com";

  it("Should set the right owner", async () => {

  /* deploy the marketplace */
  const Market = await ethers.getContractFactory("NFTMarket")
  const market = await Market.deploy()
  await market.deployed()
  const marketAddress = market.address

  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners()

  const NFT = await ethers.getContractFactory("NFT")
  const nft = await NFT.deploy(marketAddress)

  await nft.createToken(tokenURI)

  expect(await nft.owner()).to.equal(owner.address);
  //console.log("Owner address:", addr1 )
  })

  it("Should mint an NFT", async () => {
  //   /* deploy the marketplace */
  // const Market = await ethers.getContractFactory("NFTMarket")
  // const market = await Market.deploy()
  // await market.deployed()
  // const marketAddress = market.address
  // const [owner, addr1, addr2, ...addrs] = await ethers.getSigners()
  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners()
  const NFT = await ethers.getContractFactory("NFT")
  const nft = await NFT.deploy("0xcd234a471b72ba2f1ccf0a70fcaba648a5eecd8d")

  await
  expect(nft.createToken(tokenURI)).to.emit(nft, "Transfer")
  console.log("The transfer has been successful")
  })

  it("should return the new Item ID", async () => {
  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners()
  const NFT = await ethers.getContractFactory("NFT")
  const nft = await NFT.deploy("0xcd234a471b72ba2f1ccf0a70fcaba648a5eecd8d")
  
  await expect(await nft.callStatic.createToken(tokenURI)).to.equal("1")
  const ID = await nft.callStatic.createToken(tokenURI)
  console.log("The new item ID is:", ID.toString())
  })

  it("should increment the Item ID", async () => {
  const startID = "2";
  const nextID = "3";
  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners()
  const NFT = await ethers.getContractFactory("NFT")
  const nft = await NFT.deploy("0xcd234a471b72ba2f1ccf0a70fcaba648a5eecd8d")
  
  await expect(nft.createToken(tokenURI)).to.emit(nft, "Transfer")
  await expect(await nft.callStatic.createToken(tokenURI)).to.equal(startID)
  const ID2 = await nft.callStatic.createToken(tokenURI)
  console.log("The next Item ID is:", ID2.toString())
  
  await expect(nft.createToken(tokenURI2)).to.emit(nft, "Transfer")
  await expect(await nft.callStatic.createToken(tokenURI2)).to.equal(nextID)
  const ID3 = await nft.callStatic.createToken(tokenURI2)
  console.log("The next Item ID is:", ID3.toString())
  })

})

describe("balanceOf", () => {

  let tokenURI = "https://www.mytokenlocation.com";

  it("Gets the count of NFTs for this address", async () => {
  const [owner, addr1, addr2, ...addrs] = await ethers.getSigners()
  const NFT = await ethers.getContractFactory("NFT")
  const nft = await NFT.deploy("0xcd234a471b72ba2f1ccf0a70fcaba648a5eecd8d")

  await expect (await nft.balanceOf(owner.address)).to.equal("0")
  await nft.createToken(tokenURI)

  expect(await nft.balanceOf(owner.address)).to.equal("1")
  const count = await nft.balanceOf(owner.address)
  console.log("The number of NFTs the Owner has is now:", count.toString())

  })

})

describe("NFTMarket", function() {
  it("Should create and execute market sales", async function() {
    /* deploy the marketplace */
    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    /* create two tokens */
    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")

    /* put both tokens for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })

    const [_, buyerAddress] = await ethers.getSigners()

    /* execute sale of token to another user */
    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice})

    /* query for and return the unsold items */
    items = await market.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('items: ', items)
  })


})