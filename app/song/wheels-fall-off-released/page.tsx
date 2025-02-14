import { Player } from "@/components/player";

export default function WheelsFallOffReleased() {
    let bgLoreText = `The wheels are definitely falling off with this one, since this song was released after a career degrading rampage on Ye’s X
                            (formerly Twitter) account, which was eventually called off as a social experiment by Ye himself in a now deleted post,
                            so it’s quite a fitting name for what took place less than 2 days before this drop, but the rants have continued so far
                            and the wheels are getting unstable.
                            This is the only version available on streaming services, removing the Diddy mentions and initial sample.`;
    return (
        <Player image={"/covers/wheels-fall-off.jpg"} text={"Wheels Fall Off"} subtext={"Released Version (Clean) [WFO-O2]"} songVal={"/songs/wheels-fall-off-released.m4a"} backgroundLore={bgLoreText} linkToGenius="https://genius.com/Ty-dolla-sign-wheels-fall-off-lyrics" lyrics="wip" />
    )
}