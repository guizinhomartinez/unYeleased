'use client'

import { createContext } from "react"

export const SliderValue = createContext<number | any>(0);
export const KeyboardHandler = createContext(() => { });
export const WheelEventHandler = createContext(() => { });
export const LyricsOpened = createContext<boolean | any>(false);