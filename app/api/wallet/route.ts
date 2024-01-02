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

export async function POST(req: NextApiRequest, res: NextApiResponse){
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


// export async function POST(req: NextApiRequest, res: NextApiResponse){
//   const walletAddress = new WalletAddress({
//     _id: new mongoose.Types.ObjectId(),
//     walletAddress: (req as unknown as NextApiRequest).body.walletAddress,
//   });
//   walletAddress
//     .save()
//     .then((walletAddress) => {
//       res.status(200).json(walletAddress);
//     })
//     .catch((error) => {
//       res.status(500).json({
//         error: error,
//       });
//     });
//   }