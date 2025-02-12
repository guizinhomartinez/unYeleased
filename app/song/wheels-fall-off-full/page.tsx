import { Player } from "@/components/player";

export default function WheelsFallOffFull() {
    let bgLoreText = `This is the original version of the song released on yeezy.com, where the Diddy intro was not is removed, the file is called “WFO-01.”
                    The shortened version was later on released on streaming services as the official version of the song, and its called “WFO-02” on yeezy.com.`
    return (
        <Player image={"/covers/wheels-fall-off.jpg"} text={"Wheels Fall Off"} subtext={"Full Version [WFO-O1]"} songVal={"/songs/wheels-fall-off-full.m4a"} backgroundLore={bgLoreText} linkToGenius="https://genius.com/Ty-dolla-sign-wheels-fall-off-extended-lyrics" />
    )
}