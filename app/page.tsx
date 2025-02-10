"use client"

import { useState } from "react";
import { HandleTransition } from "@/components/handleTransition";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const content = [
    {
      image: "/covers/bully-jpeg_e2156cfd-ed36-47e1-aed8-3bd289a59b0a.jpg",
      text: "Bully",
      subtext: "Beauty and the Beast",
      duration: "1:45",
      link: "/song/beauty-and-the-beast"
    },
    {
      image: "/covers/chrome-wheel.jpg",
      text: "Wheels Fall Off",
      subtext: "Full Version",
      duration: "4:50",
      link: "/song/wheels-fall-off-full"
    },
    {
      image: "/covers/chrome-wheel.jpg",
      text: "Wheels Fall Off",
      subtext: "Released Version",
      duration: "2:01",
      link: "/song/wheels-fall-off-released"
    },
  ];

  const filteredContent = content.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtext.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.duration.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col gap-4 m-auto justify-center">
          {/* <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search songs here" className="p-2 border outline-none focus:border-primary/50 -translate-y-6" /> */}
          <div className="flex gap-4">
            {filteredContent.map((thing, index) => (
              <div className="flex flex-col" key={index}>
                <HandleTransition href={thing.link}>
                  <Image src={thing.image} alt={thing.subtext} width={325} height={325} />
                  <div className="text-center text-xl">{thing.text}</div>
                  <div className="text-center opacity-80 text-md">{thing.subtext}</div>
                  <div className="text-md opacity-60 text-center">{thing.duration}</div>
                </HandleTransition>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}