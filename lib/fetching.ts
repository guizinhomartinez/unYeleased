export async function fetchAlbumInfo(id: string) {
    const response = await fetch(
        `../song-files/albumInfo/${id.toLowerCase()}/explanation/albumExplanation.mdx`
    );
    return response.text();
}

// album lyrics, more specifically fetching the lyric of each file on demand
export async function fetchAlbumLyrics(id: any, songName: any) {
    let response = "";

    if (songName === null || songName === "" || id === null || id === "")
        return;

    try {
        const res = await fetch(
            `/song-files/songLyrics/${id.toLowerCase()}/${songName.toLowerCase()}.lrc`
        );
        res.ok
            ? (response = await res.text())
            : (response = "LYRICS NOT FOUND");
    } catch (e) {
        response = "Error: Network or server issue";
    }
    return response;
}
