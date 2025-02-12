import { Player } from "@/components/player";

export default function Bully() {
    const bgLoreText = `"BEAUTY AND THE BEAST" was first played during Ye’s second VULTURES 2 listening party in Haikou, China on September 28, 2024. With the reveal of the track, he also announced its placement on his eleventh studio album, BULLY. It is claimed by Mike Dean to be a "Donda leftover," though the reputability of this claim is questionable considering the relationship the two have had post-Donda. On October 15, 2024, Ye uploaded the track to his Instagram page alongside a visualizer.`
    return (
        <Player image={"/covers/bully.jpg"} text={"Bully"} subtext={"Beauty and the Beast [BB-O1]"} songVal={"/songs/beauty-and-the-beast.m4a"} backgroundLore={bgLoreText} linkToGenius="https://genius.com/Kanye-west-beauty-and-the-beast-lyrics" />
    )
}