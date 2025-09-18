import { RefObject } from "react";

const skipTimeFunc = (
    back: boolean,
    songRef: RefObject<HTMLAudioElement | null>
) => {
    if (back) {
        const song = songRef.current;
        if (!song) return;
        song.currentTime -= 10;
    } else {
        const song = songRef.current;
        if (!song) return;
        song.currentTime += 10;
    }
};

export default skipTimeFunc;
