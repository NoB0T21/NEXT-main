export const getFileType = (filename: string) => {
    // Extract extension
    const parts = filename.split(".");
    if (parts.length < 2) {
      return { type: "unknown", extension: "" };
    }
  
    const extension = parts.pop()?.toLowerCase() || "";
  
    // Infer type based on common extensions
    let type = "unknown";
  
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(extension)) {
      type = "image";
    } else if (["mp4", "mkv", "avi", "mov", "wmv", "webm"].includes(extension)) {
      type = "video";
    } else if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
      type = "audio";
    } else if (["pdf"].includes(extension)) {
      type = "document";
    } else if (["doc", "docx", "odt", "rtf"].includes(extension)) {
      type = "document";
    } else if (["xls", "xlsx", "csv"].includes(extension)) {
      type = "spreadsheet";
    } else if (["ppt", "pptx"].includes(extension)) {
      type = "presentation";
    } else if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
      type = "archive";
    } else if (["txt", "md", "json", "xml", "yaml", "yml"].includes(extension)) {
      type = "text";
    }
  
    return { type, extension };
  };
  
export const convertFileToUrl = (file: File) => URL.createObjectURL(file)