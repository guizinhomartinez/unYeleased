// 'use client'

// import Image from 'next/image'
// import * as React from 'react'
// import { useEffect, useState, useRef, use } from 'react';
// import { ChevronDown, ChevronLeft, Dot, Pause, Play } from "lucide-react";
// import { Label } from "@/components/ui/label";
// import { Slider } from '@radix-ui/react-slider';
// import { cn } from '@/lib/utils';
// import { HandleTransition } from '@/components/handleTransition';

// interface Song {
//   title: string;
//   artist: string;
//   // Add other properties if necessary
// }

// async function fetchSongs(id: string) {
//   const response = await fetch(`../songLists/${id.toLowerCase()}.json`);
//   return response.json(); // Return the parsed JSON data
// }

// export default function Page({ params }: { params: Promise<{ id: string }> }) {
//   const [songs, setSongs] = useState<Song[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [year, setYear] = useState(0);
//   const [color, setColor] = useState("purple-400");
//   const [showExplanation, setShowExplanation] = useState(false);
//   const { id } = use(params);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const songRef = useRef<HTMLAudioElement | null>(null);
//   const [volumeVal, setVolumeVal] = useState(30);
//   const [currentTimeVal, setCurrentTimeVal] = useState(0);
//   const [songTime, setSongtime] = useState(0);
//   const [songVal, setSongVal] = useState("");
//   const [appearBar, setAppearBar] = useState(false);
//   const [queue, setQueue] = useState<string[]>([]);
//   const [currentSongIndex, setCurrentSongIndex] = useState(0);

//   useEffect(() => {
//     async function loadSongs() {
//       const data = await fetchSongs(id);
//       setSongs(data.tracks);
//       setYear(data.config[0].year);
//       setColor(data.config[0].color);
//       setLoading(false);
//     }
//     loadSongs();
//   }, [id]);

//   useEffect(() => {
//     if (!songRef.current) {
//       songRef.current = new Audio();
//     }
//     const song = songRef.current;
//     song.src = songVal;

//     if (isPlaying) {
//       song.play();
//     } else {
//       song.pause();
//     }

//     return () => {
//       song.pause();
//     };
//   }, [isPlaying, songVal]);

//   useEffect(() => {
//     if (songRef.current) {
//       songRef.current.volume = volumeVal / 100;
//     }
//   }, [volumeVal]);

//   useEffect(() => {
//     const song = songRef.current;
//     if (!song) return;

//     const updateTime = () => {
//       setCurrentTimeVal(song.currentTime);
//     };

//     song.addEventListener("timeupdate", updateTime);

//     return () => {
//       song.removeEventListener("timeupdate", updateTime);
//     };
//   }, []);

//   useEffect(() => {
//     const song = songRef.current;
//     if (!song) return;

//     song.onloadedmetadata = () => {
//       setSongtime(song.duration);
//     };

//     return () => {
//       song.onloadedmetadata = null;
//     };
//   }, []);

//   useEffect(() => {
//     if (!songRef.current) return;

//     const handleSongEnd = () => {
//       if (currentSongIndex < queue.length - 1) {
//         setCurrentSongIndex((prev) => prev + 1);
//         setSongVal(queue[currentSongIndex + 1]);
//       } else {
//         setIsPlaying(false);
//       }
//     };

//     songRef.current.addEventListener("ended", handleSongEnd);
//     return () => {
//       songRef.current?.removeEventListener("ended", handleSongEnd);
//     };
//   }, [currentSongIndex, queue]);

//   function handleTogglePlayback() {
//     if (!songRef.current) return;
//     if (songRef.current.paused) {
//       songRef.current.play();
//       setIsPlaying(true);
//     } else {
//       songRef.current.pause();
//       setIsPlaying(false);
//     }
//   }

//   function hideControls() {
//     setAppearBar(prev => !prev);
//   }

//   const SongControls = () => {
//     return (
//       <div>
//         <button className='fixed bottom-20 right-20 z-50 bg-white border-black border-2 p-2 rounded-full' onClick={hideControls}>
//           <ChevronDown />
//         </button>
//         <div className={`fixed bottom-0 w-screen p-12 bg-white border-2 border-t-black flex flex-col items-center transition-transform duration-300 ${appearBar ? "translate-y-0" : "translate-y-full"}`}>
//           <button onClick={handleTogglePlayback} className='mb-4'>{isPlaying ? <Pause /> : <Play />}</button>
//           <VolumeSlider onValueChange={(e) => setVolumeVal(e[0])} className={undefined} />
//           <Label>Volume: {volumeVal}%</Label>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='absolute left-2 top-2'>
//         <HandleTransition href="/">
//           <div className="bg-transparent shadow-none text-foreground group-hover:bg-none group-hover:text-foreground flex gap-2 p-2 bg-white"><ChevronLeft /> Go back</div>
//         </HandleTransition>
//       </div>
//       <div className={`flex gap-4 items-center p-6 md:p-12`} style={{ backgroundColor: color }}>
//         <Image src={`/covers/${id.toLowerCase()}.jpg`} alt={id} width={250} height={250} className='' />
//         <div className='flex flex-col'>
//           <div className='flex flex-col gap-2 md:translate-y-6'>
//             <div className='text-4xl font-bold'>{id}</div>
//             <div className='inline-flex items-center'>
//               <div className='text-xl text-primary/75'>Kanye West</div>
//               <Dot />
//               <div className='text-xl text-primary/75'>{year}</div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className='m-6 md:m-12 border-2 border-black'>
//         <div>
//           {songs.map((element, index) => (
//             <div key={index}
//               className='flex gap-2 border-2 border-b-black last-of-type:border-b-transparent p-2 cursor-pointer hover:bg-gray-200'>
//               <Image src={`/covers/${id.toLowerCase()}.jpg`} alt="" width={50} height={50} className='' />
//               <div>
//                 <div className='text-sm'>{element.title}</div>
//                 <div className='text-sm'>{element.artist}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* <SongControls /> */}
//     </div>
//   );
// }

// type SliderProps = React.ComponentProps<typeof Slider>

// function VolumeSlider({ className, ...props }: SliderProps) {
//   return (
//     <Slider
//       defaultValue={[30]}
//       max={100}
//       step={1}
//       className={cn("w-48 z-50", className)}
//       {...props}
//     />
//   )
// }

export default function Page() {
  return <h1>nah</h1>
}