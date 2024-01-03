import React, { FC, useState, useEffect, use } from "react";
import axios from "axios";
import Link from "next/link";
const wallet: FC = () => {
  const [walletAddress, setWalletAddress] = useState([]);
  const walletUrl = "https://nft-minter-address-api.onrender.com/address";
  useEffect(() => {
    const getWalletAddress = async () => {
      const response = await axios.get(walletUrl);
      setWalletAddress(response.data);
    };
    getWalletAddress();
  });

  return (
    <div>
      <h1 className="text-xl font-bold leading-7 text-center text-gray-600 sm:truncate sm:text-3xl sm:tracking-tight pb-10">
        Table containing All Wallet Addresses
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 text-center">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Wallet Address
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                {walletAddress.length > 0 &&
                    walletAddress.map(({ walletAddress, index }) => (
                        <div key={index}>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                {walletAddress}
                            </th>
                        </div>
                    ))
                }
            </tr>
        </tbody>
    </table>
</div>
      <Link href="/" className="relative inline-block text-lg group pt-10">
<span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
<span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
<span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
<span className="relative">Mint NFT</span>
</span>
<span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
</Link>
    </div>
  );
};

export default wallet;