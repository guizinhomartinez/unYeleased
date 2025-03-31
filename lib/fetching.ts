// legacy home fetching
export async function fetchHomeSongs() {
    const response = await fetch(`/song-files/fetchAlbums.json`);
    return response.json();
}

// album fetching
export async function fetchAlbumSongs(id: string) {
  const response = await fetch(`../song-files/songLists/${id.toLowerCase()}.json`);
  return response.json();
}

export async function fetchAlbumInfo(id: string) {
  const response = await fetch(`../song-files/albumInfo/${id.toLowerCase()}/albumExplanation.mdx`);
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

export async function fetchSinglesLyrics(id:string) {
    const response = await fetch(`../song-files/singlesInfo/${id.toLowerCase()}/lyrics.txt`);
    return response.text();
}

export async function fetchSinglesExplanation(id:string) {
    const response = await fetch(`../song-files/singlesInfo/${id.toLowerCase()}/explanation.txt`);
    return response.text();
}

// album lyrics, more specifically fetching the lyric of each file on demand
export async function fetchAlbumLyrics(id: any, songName: any) {
    let response = "";
    try {
        const res = await fetch(`/song-files/songLyrics/${id.toLowerCase().replace(" ", "-")}/${songName.toLowerCase().replace(" ", "-")}.lrc`);
        res.ok ? response = await res.text() : response = "Unable to fetch the lyrics :C";
    } catch (e) {
        response = "Error: Network or server issue";
    }
    return response;
}