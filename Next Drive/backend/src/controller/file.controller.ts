import { Request, Response } from "express";
import uuid from "uuid4";
import supabase from "../Db/supabase";
import { createfile, getfiles, renamefiles } from "../services/file.service";

export const uploadFile = async (request: Request, response: Response) => {
    const { file } = request;
    const { owner } = request.body;
    if (!file || !owner) {
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
            .from("box")
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
            .from("box")
            .getPublicUrl(`${uniqueFilename}`);

        const newFile = await createfile({
            owner: owner,
            path: uniqueFilename,
            originalname: file?.originalname || "",
            imageURL: publicUrlData.data.publicUrl || "",
            fileType: file?.mimetype || "",
            fileSize: file.size
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

export const getfile = async (request: Request, response: any) => {
    const id = request.user._id
    if(!id){
        response.status(400).json({
            message: "Require all fields",
            success: false,
        });
        return
    }

    const file = await getfiles({id})
    if(!file){
        response.status(400).json({
            message: "Require all fields",
            success: false,
        });
        return
    }
    return response.status(200).json({
        message: "File Present",
        file,
        success: true,
    });
}

export const renamefile = async (request: Request, response: any) => {
    const id = request.user._id
    const originalname = request.body.name
    if(!id){
        response.status(400).json({
            message: "Require all fields",
            success: false,
        });
        return
    }

    const file = await renamefiles({id,originalname})
    if(!file){
        response.status(400).json({
            message: "Require all fields",
            success: false,
        });
        return
    }
    return response.status(200).json({
        message: "File Present",
        file,
        success: true,
    });
}