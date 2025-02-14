import { Player } from "@/components/player";

export default function WheelsFallOffFull() {
    let bgLoreText = `This is the original version of the song released on yeezy.com, where the Diddy intro was not is removed, the file is called “WFO-01.”
                    The shortened version was later on released on streaming services as the official version of the song, and its called “WFO-02” on yeezy.com.`
    return (
        <Player image={"/covers/wheels-fall-off-big.jpg"} text={"Wheels Fall Off"} subtext={"Full Version [WFO-O1]"} songVal={"/songs/wheels-fall-off-full.m4a"} backgroundLore={bgLoreText} linkToGenius="https://genius.com/Ty-dolla-sign-wheels-fall-off-extended-lyrics" lyrics={lyrics()} />
    )
}

function lyrics() {
    let lyrics = `(We love you)
        Yo, the sun don't shine forever (You can turn the track up a little bit for me)
        But as long as it's here, then we might as well shine together (All up in my ears)
        Better now than never, business before pleasure (The mic is loud, but the beats isn't loud)
        P. Diddy and the fam', who you know do it better?
        Yeah right, no matter what, we airtight (Yeah)
        So when you hear somethin', make surе you hear it right
        Don't make a ass outta yourself (Yеah), by assumin' (Now the mic is lower, turn the mics up)
        Our music keeps you movin', what are you doin'? (Turn that shit all the way up, yeah)
        You know that I'm two levels above you, baby (Music's gettin' louder)
        Hug me, baby, I'ma make you love me, baby (I want this shit is hot)
        Talkin' crazy ain't gonna get you nuthin' but choked (Uh-huh)
        And that jealousy is only gonna leave you broke (Uh-huh, uh-huh)
        So the only thing left now is God for these cats
        And B.I.G. you know you too hard for these cats
        I'ma win 'cause I'm too smart for these cats
        While they makin' up facts (Uh) you rakin' up plaques

        Wheels fall off (Wheels fall off)
        Don't act like I ain't sorry (Sorry)
        Don't act like we ain't locked in
        When did you get so different, my darling? Woah-oh (Oh)
        You must be out with them rappers
        You must be out with the hoopers
        We both outside with the shooters

        I don't wanna fight no more, tonight let's make love
        I've been outside all day, I'm chasin' paper
        Go tell them niggas that I'm here to stay, yeah
        Why can't we ride this thing out until the

        Wheels fall off (Wheels fall off)
        Don't act like I ain't sorry (Sorry)
        Don't act like we ain't locked in
        When did you get so different, my darling? Woah-oh-oh (Oh)
        You must be out with them rappers
        You must be out with the hoopers
        We both outside with the shooters

        Don't act like it ain't Yeezy
        I'm way too rich for you to leave me now
        They screamin' out "Ye, the nerve of you"
        Yeah, my wife outside in her birthday suit
        You actin' like it's your birthday too
        You can't stay out late on work days
        I'm pickin' you up on Thursday
        We startin' the weekend early

        Wheels fall off (Yeah, yeah)
        We together 'til the wheels fall off (Mm-mm)
        Wheels fall off
        I'ma love you 'til the wheels fall off

        I don't wanna just fight no more, tonight, let's make love
        I've been outside all day, I'm chasin' paper
        Go tell them niggas that I'm here to stay, girl
        Girl, we been datin', but tonight, let's make love

        'Til the wheels fall off, 'til the wheels fall off
        'Til the wheels fall off, 'til the wheels fall off (No way y'all know this)
        'Til the wheels fall off, 'til the wheels fall off
        'Til the wheels fall off
        Let's make love, let's make love
        Let's make love, let's make love, yeah
        Let's make love, let's make love (I want y'all to put your hands together for a minute)
        Let's make love, let's make love (Yeah-yeah)

        Oh-oh-oh-oh
        Oh, la-la-la-la-la-la
        Oh, la-la-la-la-la-la
        We wanna dedicate the rest of this shit
        To someone that we all lost (This for Puff Daddy)
        This is for Puff Daddy
        Ya-ya-ya-ya-ya-ya-ya
        Ya-ya-ya-ya-ya-ya-ya (Oh, oh)
        'Til the wheels fall off
        That's pretty fuckin' good
        Y'all like to have a good time, don't ya?
        'Til the wheels fall off, we got you pops
        They can't stop us, they won't stop us
        It's Bad Boy for life, Bad Boy forever
        Ty and Ye said it first, these niggas is pussy
        They don't spin no blocks, we here (We love you)
        We see what y'all was doin', we was just watchin' y'all
        But now it's up, us, never them, Bad Boy
        Two words, shit serious
        Oh, la-la-la-la-la-la
        Oh, la-la-la-la-la-la
        We love you`

    return lyrics;
}