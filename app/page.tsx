"use client"

import { useState } from "react";
import { HandleTransition } from "@/components/handleTransition";
import Image from "next/image";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const content = [
    {
      image: "/covers/bully.jpg",
      text: "Bully",
      subtext: "Beauty and the Beast",
      duration: "1:45",
      link: "/song/beauty-and-the-beast",
      row: "1"
    },
    {
      image: "/covers/wheels-fall-off.jpg",
      text: "Wheels Fall Off",
      subtext: "Full Version",
      duration: "4:50",
      link: "/song/wheels-fall-off-full",
      row: "1"
    },
    {
      image: "/covers/wheels-fall-off.jpg",
      text: "Wheels Fall Off",
      subtext: "Released Version (Clean)",
      duration: "2:01",
      link: "/song/wheels-fall-off-released",
      row: "1"
    },

    {
      image: "/covers/yandhi.jpg",
      text: "Yandhi",
      subtext: "Album",
      duration: "1:45",
      link: "/album/yandhi",
      row: "2"
    },
    {
      image: "/covers/wheels-fall-off.jpg",
      text: "Wheels Fall Off",
      subtext: "Full Version",
      duration: "4:50",
      link: "/song/wheels-fall-off-full",
      row: "2"
    },
    {
      image: "/covers/wheels-fall-off.jpg",
      text: "Wheels Fall Off",
      subtext: "Released Version (Clean)",
      duration: "2:01",
      link: "/song/wheels-fall-off-released",
      row: "2"
    }
  ];

  const year = [
    {
      year: "2025"
    },
    {
      year: "2019"
    }
  ]

  const filteredContent = content.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtext.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.duration.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex min-h-screen w-screen m-12">
        <div className="flex flex-col gap-4 w-[94vw]">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search songs here" className="p-2 border outline-none focus:border-primary/50 -translate-y-6" />
          {year.map((thing2, index) => (
            <div className="flex flex-col border-2 border-black" key={index}>
              <div className="mx-auto text-2xl mt-4">{thing2.year}</div>
              <div className="flex gap-4 justify-center items-center">
                {filteredContent
                  .filter(item => item.row === (index + 1).toString())
                  .map((thing, index) => (
                    <div className="flex flex-col items-center justify-center pb-8" key={index}>
                      <HandleTransition href={thing.link}>
                        <Image
                          src={thing.image}
                          alt={thing.subtext}
                          width={325}
                          height={325}
                        />
                        <div className="text-center text-xl">{thing.text}</div>
                        <div className="text-center opacity-80 text-md">{thing.subtext}</div>
                        <div className="text-md opacity-60 text-center">{thing.duration}</div>
                      </HandleTransition>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}