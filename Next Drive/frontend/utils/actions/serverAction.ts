'use server'

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateFilesPage() {
  revalidateTag('files'); // Path of the page to refresh
}

export async function revalidateShareTag() {
  revalidateTag('Share'); // Path of the page to refresh
}