import { createClient } from "@supabase/supabase-js";

const supabaseURI = 'https://dsiwprmwzkvgdcdhzhwa.supabase.co/storage/v1/s3'
const supabaseKEY = `${process.env.SUPABASE_KEY}`

const supabase = createClient(supabaseURI, supabaseKEY)

export default supabase