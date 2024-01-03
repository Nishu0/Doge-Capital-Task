import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import dynamic from "next/dynamic";
import ThemeToggle from "./ThemeToggle";
export default function Navbar() {
  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );
  return (
    <nav className="flex w-full justify-between h-10 gap-4 pt-4 pb-20 font-sans text-zinc-900 md:px-20 md:gap-10">
      
      <div className="flex flex-row gap-20">
        <Link
          className="text-2xl no-underline font-bold hover:text-slate-300"
          href="/"
        >
          <span className="text-blue-300">NFT Minter</span>
        </Link>
      
      </div>
      <div className="bg-blue-800">
      <WalletMultiButtonDynamic />

      </div>
      <ThemeToggle />
    </nav>
  );
}