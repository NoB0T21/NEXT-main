import { error } from 'console'
import mongoose from 'mongoose'

function connectToDb() {
    const URL: string | undefined = process.env.MONGO_URL
    if(URL == undefined){
        throw error
    }
    mongoose.connect(URL)
    .then(()=>{console.log('Connedted to Db')})
    .catch((error)=>{console.log('Failed to connect Db')})
}

export default connectToDb