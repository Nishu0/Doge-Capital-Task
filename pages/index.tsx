"use client"
import React, { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import NFTDetails from "../components/NFTDetails";
import {
  Metaplex,
  keypairIdentity,
  irysStorage,
  toMetaplexFileFromBrowser,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { set } from "mongoose";
export default function Home() {
  const wallet = useWallet();
  const [file, setFile] = useState(null);
  const [nftName, setNFTName] = useState<string>("");
  const [nftDescription, setNFTDescription] = useState<string>("");
  const [arweaveImgUri, setArweaveImgUri] = useState<string>("");
  const [imgUri, setImgUri] = useState<string>("");
  const [explorerAddress, setExplorerAddress] = useState<string>("");
  const [metaDataUri, setMetaDataUri] = useState<string>("");
  const [showNFTDetails, setShowNFTDetails] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const walletUrl = "https://nft-minter-address-api.onrender.com/address";

  const mintNFT = async () => {
    if (!file || !wallet.connected || !wallet.publicKey) {
      toast.error("Pls connect wallet and select a file.");
      return;
    }

    // const postWalletAddress = async () => {
    //   const response = await axios.post(walletUrl, {
    //     walletAddress: wallet.publicKey.toBase58(),
    //   });
    //   console.log(response);
    // };
    //postWalletAddress();
    console.log("Wallet Address: ", wallet.publicKey.toBase58());

    try {
      setShowNFTDetails(true);
      const connection = new Connection(clusterApiUrl("devnet"));

      const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(
          irysStorage({
            address: "https://devnet.bundlr.network",
            providerUrl: "https://api.devnet.solana.com",
            timeout: 60000,
          })
        );
      //setWalletAddress(wallet.publicKey.toBase58());
      const metaplexFile = await toMetaplexFileFromBrowser(file);
      const imgUri = await metaplex.storage().upload(metaplexFile);
      setImgUri(imgUri);
      console.log("Upload Response:", imgUri);
      setArweaveImgUri(imgUri);
      toast.success("Image Uploaded to Arweave", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });

      const { uri } = await metaplex.nfts().uploadMetadata({
        image: imgUri,
        nftName,
        nftDescription,
        file,
        creator: wallet.publicKey.toBase58(),
        attributes: [
          { trait_type: "Color", value: "Blue" },
          { trait_type: "Size", value: "Large" },
        ],
      });
      console.log("Metadata URI:", uri);
      setMetaDataUri(uri);
      toast.success("MetaData uploaded to Arweave", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });

      const { nft } = await metaplex.nfts().create(
        {
          uri,
          name: nftName,
          sellerFeeBasisPoints: 500,
          isMutable: false,
        },
        {
          commitment: "finalized",
          confirmOptions: {
            commitment: "finalized",
            skipPreflight: false,
            maxRetries: 3,
          },
        }
      );
      if (nft.address !== undefined) {
        console.log(
          `Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`
        );
        setExplorerAddress(
          `https://explorer.solana.com/address/${nft.address}?cluster=devnet`
        );
        toast.success("NFT Minted Successfully!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setLoadingState(false);
        const nftData = {
          [nft.address.toString()]: wallet.publicKey,
        };
        console.log("NFT Data:", nftData);
          const response = await axios.post(walletUrl, {
            walletAddress: wallet.publicKey.toBase58(),
          });
          console.log(response);
        if (response.status === 201 && response.data) {
          console.log("Data sent to server successfully");
        } else {
          console.error("Failed to send data to the server");
        } 
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.success("NFT Minted Successfully!");
    }
  };
  return (
    <>
    <div className="flex items-center justify-center max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <main className="flex flex-col gap-8 ">
      <h1 className="text-xl font-bold leading-7 text-center text-blue-300 sm:truncate sm:text-3xl sm:tracking-tight">Mint NFT based on Solana</h1>

      <div className="basis-1/4 ">
        <div className="flex flex-col-reverse justify-center items-center my-6 gap-10">
          <button
            onClick={mintNFT}
            disabled={!wallet.connected}
            type="button"
            className="w-full inline-flex text-center justify-center items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md cursor-pointer hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mint NFT
          </button>
          <label
            htmlFor="file-upload"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Upload Image
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          placeholder="NFT Name"
          value={nftName}
          onChange={(e) => setNFTName(e.target.value)}
        />
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          placeholder="NFT Description"
          value={nftDescription}
          onChange={(e) => setNFTDescription(e.target.value)}
        />
        </div>

        {file && (
          <div className="flex flex-col gap-10 justify-center">
            <p className="text-sm text-white my-10">
              {wallet.publicKey && (
                <p>Nft Minting from Wallet Address: {wallet.publicKey.toBase58()}</p>
              )}
            </p>
            <img src={URL.createObjectURL(file)} />
          </div>
        )}
      </div>
      <ToastContainer position="bottom-center" />
      {showNFTDetails ? (
        <NFTDetails
          imgUri={arweaveImgUri}
          metaDataUri={metaDataUri}
          explorerAddress={explorerAddress}
          loadingState={loadingState}
        />
      ) : null}
    </main>
    
    </div>
    <div className="text-blue py-4 text-center ">
        <p className="text-lg">
          All wallet addresses that minted an NFT are here:
        </p>
        <Link href="/address" className="text-xl no-underline hover:text-slate-300 text-blue-300">
            Wallet Address
        </Link>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <Link href="https://www.nisargthakkar.me/" className="hover:underline">Nisarg Thakkar™</Link>. All Rights Reserved.</span>
    </>
  );
}