import Head from 'next/head'
import '../styles/globals.css'
import Link from 'next/link'
import { connectWallet } from './interact.js'
import { useState } from 'react'
import NextNProgress from "nextjs-progressbar";
import { Provider } from "next-auth/client"

function Marketplace({ Component, pageProps }) {

const [walletAddress, setWallet] = useState("");
const [status, setStatus] = useState("");
const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [url, setURL] = useState("");


const connectWalletPressed = async () => {
  const walletResponse = await connectWallet();
  setStatus(walletResponse.status);
  setWallet(walletResponse.address);
};

  return (
    
    <Provider session={pageProps.session}>
    <div>
    <Head>
        <link rel="icon" href="/favicon.png" />
    </Head>

      <nav className="border-b p-6">
        <p className="text-4xl font-bold">The Art of Jaleh NFT Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">
              Home
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-pink-500">
              Sell Digital Asset
            </a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-pink-500">
              My Digital Assets
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-pink-500">
              Creator Dashboard
            </a>
          </Link>
            <button className="bg-pink-500 hover:bg-pink-400 text-white font-bold py-2 px-2 border-b-4 border-pink-700 hover:border-pink-500 rounded" id="walletButton" onClick={connectWalletPressed}>
            {walletAddress.length > 0 ? (
            "Connected: " +
            String(walletAddress).substring(0, 6) +
            "..." +
            String(walletAddress).substring(38)
            ) : (
            <span>🔒️ Connect Wallet</span>
            )}
            </button>
        </div>

      </nav>
      <NextNProgress />
      <Component {...pageProps} />
    </div>
   </Provider>
  )
}

export default Marketplace


