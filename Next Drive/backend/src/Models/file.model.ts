import mongoose, { Document, Types } from "mongoose";
import { Schema } from "mongoose";

interface files extends Document{
    owner: Types.ObjectId,
    createdAt: string,
    path: string,
    originalname: string,
    imageURL: string,
    fileType: string
}

const fileSchema: Schema <files> = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    createdAt:{
        type: String,
        default: () => new Date().toISOString(),
    },
    path:{
        type: String,
        required: true
    },
    originalname:{
        type: String,
        required: true
    },
    imageURL:{
        type: String,
    },
    fileType:{
        type: String,
        required: true
    },

})

const file = mongoose.models.file || mongoose.model<files>('file', fileSchema);

export default file