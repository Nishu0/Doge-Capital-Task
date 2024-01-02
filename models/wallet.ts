import mongoose from "mongoose";
const {Schema} = mongoose;

const WalletAddressSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  walletAddress: { 
    type: String, 
    required: true 
},
});

export default mongoose.models.WalletAddress || mongoose.model("WalletAddress", WalletAddressSchema);