export async function fetchAlbumInfo(id: string) {
    const response = await fetch(`../song-files/albumInfo/${id.toLowerCase()}/explanation/albumExplanation.mdx`);
    return response.text();
}

// singles fetching
export async function fetchSinglesInfo(id: string) {
    const response = await fetch(`/song-files/singlesInfo/${id.toLowerCase()}/${id.toLowerCase()}.json`);
    return response.json();
}

export async function fetchSinglesLyrics(id: string) {
    const response = await fetch(`/song-files/singlesInfo/${id.toLowerCase()}/lyrics.txt`);
    return response.text();
}

export async function fetchSinglesExplanation(id: string) {
    let response = "";
    try {
        const res = await fetch(`/song-files/singlesInfo/${id.toLowerCase()}/explanation.txt`);
        res.ok ? response = await res.text() : response = "Explanation not found";
    } catch (e) {
        response = "Error: Network or server issue";
    }
    return response;
}

// album lyrics, more specifically fetching the lyric of each file on demand
export async function fetchAlbumLyrics(id: any, songName: any) {
    let response = "";

    if (songName === null || songName === "" || id === null || id === "") return;

    try {
        const res = await fetch(`/song-files/songLyrics/${id.toLowerCase()}/${songName.toLowerCase()}.lrc`);
        res.ok ? response = await res.text() : response = "LYRICS NOT FOUND";
    } catch (e) {
        response = "Error: Network or server issue";
    }
    return response;
}