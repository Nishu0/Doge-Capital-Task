import mongoose from "mongoose";

const connect=async()=>{
    try{
        await mongoose
        .connect("mongodb+srv://nishu:astro@nodenishu.tl2ymec.mongodb.net/nft?retryWrites=true&w=majority")
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((error) => {
            console.error(error);
        });
    }catch(error){
        console.error("Error connecting to MongoDB");
    }
}

export default connect;