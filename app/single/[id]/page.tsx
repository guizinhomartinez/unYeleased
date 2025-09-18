import {
    fetchSinglesExplanation,
    fetchSinglesInfo,
    fetchSinglesLyrics,
} from "@/lib/server-fetching";
import { Player } from "@/components/player";

export default async function SinglesPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const data = await fetchSinglesInfo(id);
    const songValStr: string = data.songVal.split(".m4a").pop();

    const lyrics = await fetchSinglesLyrics(id);
    const explanation = await fetchSinglesExplanation(id);

    return (
        <Player
            image={`/song-files/covers/${data.image}`}
            text={data.text}
            subtext={data.subtext}
            songVal={`/song-files/songs/singles/${songValStr}.m4a`}
            backgroundLore={explanation}
            linkToGenius={data.link}
            lyrics={lyrics}
            id={id}
        />
    );
}
