"use client"

import { Player } from "@/components/player";
import { use, useEffect, useState } from "react";

async function fetchSongs(id: string) {
    const response = await fetch(`../song-files/singlesInfo/${id.toLowerCase()}/${id.toLowerCase()}.json`);
    return response.json();
}

async function fetchLyrics(id:string) {
    const response = await fetch(`../song-files/singlesInfo/${id.toLowerCase()}/lyrics.txt`);
    return response.text();
}

async function fetchExplanation(id:string) {
    const response = await fetch(`../song-files/singlesInfo/${id.toLowerCase()}/explanation.txt`);
    return response.text();
}

export default function SinglesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [image, setImage] = useState("");
    const [text, setText] = useState("");
    const [subtext, setSubtext] = useState("");
    const [songVal, setSongVal] = useState("");
    const [link, setLink] = useState("");
    const [lyrics, setLyrics] = useState("");
    const [explanation, setExplanation] = useState("");

    useEffect(() => {
        async function loadSongs() {
            const data = await fetchSongs(id);
            setImage(`/song-files/covers/${data.image}`);
            setText(data.text);
            setSubtext(data.subtext);
            setSongVal(`/song-files/songs/singles/${data.songVal}`);
            setLink(data.link);

            console.log(songVal);
        }

        async function loadLyrics() {
            const data = await fetchLyrics(id);
            setLyrics(data);
        }

        async function loadExplanation() {
            const data = await fetchExplanation(id);
            setExplanation(data);
        }

        loadSongs();
        loadLyrics();
        loadExplanation();
    }, [id]);

    return (
        <Player image={image} text={text} subtext={subtext} songVal={songVal} backgroundLore={explanation} linkToGenius={link} lyrics={lyrics} />
    )
}