const apiUrl = import.meta.env.VITE_API_URL;

export async function getUrl(file: File): Promise<string> {
    const response = await fetch(`${apiUrl}/api/cloudstorage/generate-presigned-url?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
    if (!response.ok) {
        throw new Error("Failed to get URL");
    }

    const data = await response.json();
    return data.url;
}

export async function uploadFile(file: File): Promise<string> {
    const url = await getUrl(file);

    const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": file.type,
        },
        body: file,
    });

    if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
    }

    return url.split("?")[0];
}