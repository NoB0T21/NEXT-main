import { Request, Response } from "express";
import uuid from "uuid4";
import supabase from "../Db/supabase";
import { createfile, decfollowerCount, decfollowingCount, declikeCount, getLikePost, getuserfollower, getuserfollowing, incfollowerCount, incfollowingCount, inclikeCount, LikePost } from "../services/post.service";

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
        
        const Postlike = await LikePost({
            userID: newFile?._id 
        })

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

export const likeFile = async (request: Request, response: any) => {
    const PostId = request.params.id
    const id = request.user._id
    if (!PostId) {
        response.status(400).json({
            message: "Require all fields",
            success: false,
        });
        return
    }
    
    try {
        const post = await getLikePost({PostId});
        if(!post){
            return response.status(204).json({message:'Post Not Found'})
        }

        const index = post.like.indexOf(id);
        if (index === -1) {
            post.like.push(id); // Like
            const postlikecount = await inclikeCount({PostId});
        } else {
            post.like.splice(index, 1); // Unlike
            const postlikecount = await declikeCount({PostId});
        }
        
        await post.save();
        return response.status(200).json({
            message: "you Liked this post",
            success:true
        })
    } catch (error) {
        response.status(500).json({
            message: "Internal server error",
            success: false,
        });
        return
    }
};

export const followuser = async (request: Request, response: any) => {
    const userId = request.user._id
    const id:any = request.params.id
    if (!userId) {
        response.status(400).json({
            message: "Require all fields",
            success: false,
        });
        return
    }
    
    try {
        const following = await getuserfollowing({ userId }); // the user performing the action
        const follower = await getuserfollower({ userId: id }); // the user being followed/unfollowed

        if (!following || !follower) {
        return response.status(404).json({ message: 'User not found' });
        }

        const alreadyFollowing = following.count.includes(id); // is userId following id?
        const index = following.count.indexOf(id);
        const index2 = follower.count.indexOf(userId);
        if (!alreadyFollowing) {
        // FOLLOW
        following.count.push(id);      // Add id to userId's following
        follower.count.push(userId);   // Add userId to id's followers
        await incfollowingCount({ userId }); // Increase following count of userId
        await incfollowerCount({ userId: id }); // Increase follower count of id
        } else {
        // UNFOLLOW
        following.count = following.count.splice(index, 1);
        follower.count = follower.count.splice(index2, 1);
        await decfollowingCount({ userId });
        await decfollowerCount({ userId: id });
        }

        await following.save();
        await follower.save();

        return response.status(200).json({
        message: alreadyFollowing ? 'Unfollowed successfully' : 'Followed successfully',
        success: true
        });
    } catch (error) {
        response.status(500).json({
            message: "Internal server error",
            success: false,
        });
        return
    }
};