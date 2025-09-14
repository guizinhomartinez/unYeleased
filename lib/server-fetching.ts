'use server'

import path from "path";
import fs from "fs";

// album fetching
export async function fetchAlbumSongs(id: string) {
    try {
        const filePath = path.join(
            process.cwd(),
            "public", // adjust if needed
            "song-files",
            "albumTracklists",
            `${id.toLowerCase()}.json`
        );

        const fileContents = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(fileContents);
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return "NOT FOUND"; // file doesn't exist
        }
        return "File System Error"; // other errors
    }
}

// fetches the credits for the albums
export async function fetchAlbumCredits(id: string) {
    try {
        const filePath = path.join(
            process.cwd(),
            "public",
            "song-files",
            "albumInfo",
            id.toLowerCase(),
            "credits",
            "credits.json",
        );

        const fileContents = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(fileContents);
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return "NOT FOUND"; // file doesn't exist
        }
        return "File System Error"; // other errors
    }
}