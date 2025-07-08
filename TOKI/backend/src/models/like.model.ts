import mongoose, { Schema, Types } from "mongoose";

interface Following{
    userID: Types.ObjectId,
    like: Types.ObjectId[]
}

const followingSchema:Schema<Following> = new mongoose.Schema({
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

const following = mongoose.model<Following>('followings',followingSchema)
export default following