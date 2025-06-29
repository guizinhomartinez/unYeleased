// legacy home fetching
export async function fetchHomeSongs() {
    const response = await fetch(`/song-files/fetchAlbums.json`);
    return response.json();
}

// album fetching
export async function fetchAlbumSongs(id: string) {
    let response;
    try {
        const res = await fetch(`../song-files/songLists/${id.toLowerCase()}.json`);
        res.ok ? response = await res.json() : response = "NOT FOUND";
    } catch (e) {
        response = "Network Error";
    }
    return response;
}

export async function fetchAlbumInfo(id: string) {
    const response = await fetch(`../song-files/albumInfo/${id.toLowerCase()}/explanation/albumExplanation.mdx`);
    return response.text();
}

// testing home fetching
export async function fetchHomeInfo() {
    const response = await fetch(`/song-files/fetchAlbumsExperimental.json`);
    return response.json();
}


// singles fetching
export async function fetchSinglesInfo(id: string) {
    const response = await fetch(`../song-files/singlesInfo/${id.toLowerCase()}/${id.toLowerCase()}.json`);
    return response.json();
}

export async function fetchSinglesLyrics(id: string) {
    const response = await fetch(`../song-files/singlesInfo/${id.toLowerCase()}/lyrics.txt`);
    return response.text();
}

export async function fetchSinglesExplanation(id: string) {
    const response = await fetch(`../song-files/singlesInfo/${id.toLowerCase()}/explanation/explanation.txt`);
    return response.text();
}

// album lyrics, more specifically fetching the lyric of each file on demand
export async function fetchAlbumLyrics(id: any, songName: any) {
    let response = "";
    try {
        const res = await fetch(`/song-files/songLyrics/${id.toLowerCase()}/${songName.toLowerCase()}.lrc`);
        res.ok ? response = await res.text() : response = "Unable to fetch the lyrics :C";
    } catch (e) {
        response = "Error: Network or server issue";
    }
    return response;
}

// fetches the credits for the albums
export async function fetchAlbumCredits(id: string) {
    const response = await fetch(`../song-files/albumInfo/${id.toLowerCase()}/credits/credits.json`);
    return response.json();
}