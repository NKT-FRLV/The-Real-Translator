import { languages } from "../constants/languages";

export type LanguageShort = keyof typeof languages;

export type Tone = 'natural' | 'intellectual' | 'street';