import mongoose, { Schema, Types } from "mongoose";

interface Like{
    userID: Types.ObjectId,
    like: Types.ObjectId[]
}

const followingSchema:Schema<Like> = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }]
})

const like = mongoose.model<Like>('Like',followingSchema)
export default like