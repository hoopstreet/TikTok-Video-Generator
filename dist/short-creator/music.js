"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicManager = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const shorts_1 = require("../types/shorts");
class MusicManager {
    config;
    static musicList = [
        {
            file: "Sly Sky - Telecasted.mp3",
            start: 0,
            end: 152,
            mood: shorts_1.MusicMoodEnum.melancholic,
        },
        {
            file: "No.2 Remembering Her - Esther Abrami.mp3",
            start: 2,
            end: 134,
            mood: shorts_1.MusicMoodEnum.melancholic,
        },
        {
            file: "Champion - Telecasted.mp3",
            start: 0,
            end: 142,
            mood: shorts_1.MusicMoodEnum.chill,
        },
        {
            file: "Oh Please - Telecasted.mp3",
            start: 0,
            end: 154,
            mood: shorts_1.MusicMoodEnum.chill,
        },
        {
            file: "Jetski - Telecasted.mp3",
            start: 0,
            end: 142,
            mood: shorts_1.MusicMoodEnum.uneasy,
        },
        {
            file: "Phantom - Density & Time.mp3",
            start: 0,
            end: 178,
            mood: shorts_1.MusicMoodEnum.uneasy,
        },
        {
            file: "On The Hunt - Andrew Langdon.mp3",
            start: 0,
            end: 95,
            mood: shorts_1.MusicMoodEnum.uneasy,
        },
        {
            file: "Name The Time And Place - Telecasted.mp3",
            start: 0,
            end: 142,
            mood: shorts_1.MusicMoodEnum.excited,
        },
        {
            file: "Delayed Baggage - Ryan Stasik.mp3",
            start: 3,
            end: 108,
            mood: shorts_1.MusicMoodEnum.euphoric,
        },
        {
            file: "Like It Loud - Dyalla.mp3",
            start: 4,
            end: 160,
            mood: shorts_1.MusicMoodEnum.euphoric,
        },
        {
            file: "Organic Guitar House - Dyalla.mp3",
            start: 2,
            end: 160,
            mood: shorts_1.MusicMoodEnum.euphoric,
        },
        {
            file: "Honey, I Dismembered The Kids - Ezra Lipp.mp3",
            start: 2,
            end: 144,
            mood: shorts_1.MusicMoodEnum.dark,
        },
        {
            file: "Night Hunt - Jimena Contreras.mp3",
            start: 0,
            end: 88,
            mood: shorts_1.MusicMoodEnum.dark,
        },
        {
            file: "Curse of the Witches - Jimena Contreras.mp3",
            start: 0,
            end: 102,
            mood: shorts_1.MusicMoodEnum.dark,
        },
        {
            file: "Restless Heart - Jimena Contreras.mp3",
            start: 0,
            end: 94,
            mood: shorts_1.MusicMoodEnum.sad,
        },
        {
            file: "Heartbeat Of The Wind - Asher Fulero.mp3",
            start: 0,
            end: 124,
            mood: shorts_1.MusicMoodEnum.sad,
        },
        {
            file: "Hopeless - Jimena Contreras.mp3",
            start: 0,
            end: 250,
            mood: shorts_1.MusicMoodEnum.sad,
        },
        {
            file: "Touch - Anno Domini Beats.mp3",
            start: 0,
            end: 165,
            mood: shorts_1.MusicMoodEnum.happy,
        },
        {
            file: "Cafecito por la Manana - Cumbia Deli.mp3",
            start: 0,
            end: 184,
            mood: shorts_1.MusicMoodEnum.happy,
        },
        {
            file: "Aurora on the Boulevard - National Sweetheart.mp3",
            start: 0,
            end: 130,
            mood: shorts_1.MusicMoodEnum.happy,
        },
        {
            file: "Buckle Up - Jeremy Korpas.mp3",
            start: 0,
            end: 128,
            mood: shorts_1.MusicMoodEnum.angry,
        },
        {
            file: "Twin Engines - Jeremy Korpas.mp3",
            start: 0,
            end: 120,
            mood: shorts_1.MusicMoodEnum.angry,
        },
        {
            file: "Hopeful - Nat Keefe.mp3",
            start: 0,
            end: 175,
            mood: shorts_1.MusicMoodEnum.hopeful,
        },
        {
            file: "Hopeful Freedom - Asher Fulero.mp3",
            start: 1,
            end: 172,
            mood: shorts_1.MusicMoodEnum.hopeful,
        },
        {
            file: "Crystaline - Quincas Moreira.mp3",
            start: 0,
            end: 140,
            mood: shorts_1.MusicMoodEnum.contemplative,
        },
        {
            file: "Final Soliloquy - Asher Fulero.mp3",
            start: 1,
            end: 178,
            mood: shorts_1.MusicMoodEnum.contemplative,
        },
        {
            file: "Seagull - Telecasted.mp3",
            start: 0,
            end: 123,
            mood: shorts_1.MusicMoodEnum.funny,
        },
        {
            file: "Banjo Doops - Joel Cummins.mp3",
            start: 0,
            end: 98,
            mood: shorts_1.MusicMoodEnum.funny,
        },
        {
            file: "Baby Animals Playing - Joel Cummins.mp3",
            start: 0,
            end: 124,
            mood: shorts_1.MusicMoodEnum.funny,
        },
        {
            file: "Sinister - Anno Domini Beats.mp3",
            start: 0,
            end: 215,
            mood: shorts_1.MusicMoodEnum.dark,
        },
        {
            file: "Traversing - Godmode.mp3",
            start: 0,
            end: 95,
            mood: shorts_1.MusicMoodEnum.dark,
        },
    ];
    constructor(config) {
        this.config = config;
    }
    musicList() {
        return MusicManager.musicList.map((music) => ({
            ...music,
            url: `http://localhost:${this.config.port}/api/music/${encodeURIComponent(music.file)}`,
        }));
    }
    musicFileExist(music) {
        return fs_extra_1.default.existsSync(path_1.default.join(this.config.musicDirPath, music.file));
    }
    ensureMusicFilesExist() {
        for (const music of this.musicList()) {
            if (!this.musicFileExist(music)) {
                throw new Error(`Music file not found: ${music.file}`);
            }
        }
    }
}
exports.MusicManager = MusicManager;
