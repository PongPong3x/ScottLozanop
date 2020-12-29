import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { connectWallet } from "./interact.js";
import { signIn, signOut, useSession } from "next-auth/client"


import {
  nftaddress, nftmarketaddress, rpc_url
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function Home() {

const [session, loading] = useSession()
 
const [walletAddress, setWallet] = useState("");
const [status, setStatus] = useState("");
const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [url, setURL] = useState("");

  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  // Runs on render and sets accounts and web3 provider and constants. In multiple pages
  useEffect(() => {
    loadNFTs()
  }, [])

 const connectWalletPressed = async () => {
  const walletResponse = await connectWallet();
  setStatus(walletResponse.status);
  setWallet(walletResponse.address);
  };

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(rpc_url)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    /* user will be prompted to pay the asking process to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }

   if (loading) {
    return <p>Loading...</p>
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  
  return (
<>
 {!session && (
        <>
         Check out my art! -JS <span>🎨</span> <br />
          
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.name} <br />
          <button onClick={signOut} className="bg-pink-500 hover:bg-pink-400 text-white font-bold py-2 px-2 border-b-4 border-pink-700 hover:border-pink-500 rounded">Sign out</button>
        </>
      )}

    <div className="flex justify-center">

 

      <div className="px-4" style={{ maxWidth: '1600px' }}>
    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                  <button className="bg-pink-500 hover:bg-pink-400 text-white font-bold py-2 px-12 border-b-4 border-pink-700 hover:border-pink-500 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    </>
  )
}
