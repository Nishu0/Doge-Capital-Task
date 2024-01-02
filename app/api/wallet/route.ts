import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import WalletAddress from "../../../models/wallet";
import connect from '../../../db';

// export async function GET() {
//   return NextResponse.json({Text: "Hello World"})
// }

export async function GET() {
    await connect();
    const data=await WalletAddress.find()
    console.log(data)
    return NextResponse.json(data)
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
        walletAddress: string;
    };
}
export async function POST(req: ExtendedNextApiRequest, res: NextApiResponse){
    await connect();
    const walletAddress = new WalletAddress({
      walletAddress: req.body.walletAddress,
    });
    try {
        const result = await walletAddress.save();
        console.log(result);  
      } catch (error) {
        console.log(error);
      }
}

