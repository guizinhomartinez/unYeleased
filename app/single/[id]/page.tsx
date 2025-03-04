"use client"

import { fetchSinglesExplanation, fetchSinglesInfo, fetchSinglesLyrics } from "@/components/fetching";
import { Player } from "@/components/player";
import { use, useEffect, useState } from "react";

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
            const data = await fetchSinglesInfo(id);
            setImage(`/song-files/covers/${data.image}`);
            setText(data.text);
            setSubtext(data.subtext);
            setSongVal(`/song-files/songs/singles/${data.songVal}`);
            setLink(data.link);
        }

        async function loadLyrics() {
            const data = await fetchSinglesLyrics(id);
            setLyrics(data);
        }

        async function loadExplanation() {
            const data = await fetchSinglesExplanation(id);
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