import { Request, Response } from "express";
import uuid from "uuid4";
import supabase from "../Db/supabase";
import { createfile } from "../services/post.service";

export const uploadFile = async (request: Request, response: Response) => {
    const { file } = request;
    const {creator, title, message, tags, owner } = request.body;
    if (!file || !owner || !creator) {
        response.status(400).json({
            message: "Require all fields",
            success: false,
        });
        return
    }
    
    try {
        const files = file.originalname.split(" ").join("");
        const uniqueFilename = `${uuid()}-${files}`;
        
        const { data, error } = await supabase.storage
        .from("toki")
        .upload(uniqueFilename, file.buffer, {
            contentType: file.mimetype,
            cacheControl: "3600",
            upsert: false,
        });
        
        if (error) {
            response.status(500).json({
                message: "Server error",
                success: false,
            });
            return
        }
        
        const publicUrlData = await supabase.storage
        .from("toki")
        .getPublicUrl(`${uniqueFilename}`);
        
        const parsedTags = JSON.parse(tags);
        
        const newFile = await createfile({
            creator:creator,
            title:title,
            message:message,
            tags: parsedTags,
            owner: owner,
            path: uniqueFilename,
            originalname: file?.originalname || "",
            pictureURL: publicUrlData.data.publicUrl || ""
        });
        response.status(200).json({
            message: "File Uploaded successfully",
            newFile,
            success: true,
        });
        return
    } catch (error) {
        response.status(500).json({
            message: "Internal server error",
            success: false,
        });
        return
    }
};