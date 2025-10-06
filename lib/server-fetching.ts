"use server";

import path from "path";
import fs from "fs";
import { AlbumPageResponse, CreditsResponse } from "./interfaces";

// album fetching
export async function fetchAlbumSongs(id: string): Promise<AlbumPageResponse> {
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
        return "NOT FOUND"; // other errors
    }
}

// fetches the credits for the albums
export async function fetchAlbumCredits(id: string): Promise<CreditsResponse> {
    try {
        const filePath = path.join(
            process.cwd(),
            "public",
            "song-files",
            "albumInfo",
            id.toLowerCase(),
            "credits",
            "credits.json"
        );

        const fileContents = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(fileContents);
    } catch (error: any) {
        return 0;
    }
}

// home fetching
export async function fetchHomeInfo() {
    try {
        const filePath = path.join(
            process.cwd(),
            "public",
            "song-files",
            "fetchAlbums.json"
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

// singles fetching
export async function fetchSinglesInfo(id: string) {
    try {
        const filePath = path.join(
            process.cwd(),
            "public",
            "song-files",
            "singlesInfo",
            `${id.toLowerCase()}`,
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

export async function fetchSinglesLyrics(id: string) {
    try {
        const filePath = path.join(
            process.cwd(),
            "public",
            "song-files",
            "singlesInfo",
            `${id.toLowerCase()}`,
            "lyrics.txt"
        );

        const fileContents = fs.readFileSync(filePath, "utf-8");
        return fileContents;
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return "NOT FOUND"; // file doesn't exist
        }
        return "File System Error"; // other errors
    }
}

export async function fetchSinglesExplanation(id: string) {
    try {
        const filePath = path.join(
            process.cwd(),
            "public",
            "song-files",
            "singlesInfo",
            `${id.toLowerCase()}`,
            "explanation.txt"
        );

        const fileContents = fs.readFileSync(filePath, "utf-8");
        return fileContents;
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return "NOT FOUND"; // file doesn't exist
        }
        return "File System Error"; // other errors
    }
}
