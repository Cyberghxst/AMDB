const mimeTypes = [
    "text/plain",
    "text/html",
    "text/css",
    "text/javascript",
    "application/javascript",
    "application/json",
    "application/xml",
    "application/pdf",
    "application/zip",
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
    "audio/mpeg",
    "audio/ogg",
    "video/mp4",
    "video/ogg",
    "video/webm",
    "font/woff",
    "font/woff2",
    "application/octet-stream"
]

export function getFileExtension(mimeType: string) {
    const mimeToExtension: Record<string, string> = {
        "text/plain": "txt",
        "text/html": "html",
        "text/css": "css",
        "application/javascript": "js",
        "application/json": "json",
        "application/xml": "xml",
        "application/pdf": "pdf",
        "application/zip": "zip",
        "image/jpeg": "jpeg",
        "image/png": "png",
        "image/gif": "gif",
        "image/svg+xml": "svg",
        "audio/mpeg": "mp3",
        "audio/ogg": "ogg",
        "video/mp4": "mp4",
        "video/ogg": "ogv",
        "video/webm": "webm",
        "font/woff": "woff",
        "font/woff2": "woff2",
        "application/octet-stream": "bin"
    }

    return mimeToExtension[mimeType] ?? null
}