import { TIME_PIXEL } from "constants";

export const rad2Ang = (rad) => (rad * 180) / Math.PI;

export const ang2Rad = (ang) => (ang * Math.PI) / 180;

export const getRandomVal = (range) =>
    Math.ceil(Math.random() * 100000000) % range;

export const getFixedFloat = (val, len) => Number(val.toFixed(len));

export const loadVideo = (src) => {
    return new Promise((resolve, reject) => {
        const vid = document.createElement("video");
        vid.src = src;
        vid.crossOrigin = "Anonymous";
        vid.muted = true;
        vid.onloadeddata = () => resolve(vid);
    });
};

export const loadMusic = (src) => {
    return new Promise((resolve, reject) => {
        const audio = document.createElement("audio");
        audio.src = src;
        audio.crossOrigin = "Anonymous";
        audio.onloadeddata = () => resolve(audio);
    });
};

export const PIXEL2TIME = (value) => {
    return value / TIME_PIXEL;
};

export const TIME2PIXEL = (value) => {
    return value * TIME_PIXEL;
};

export const Number2Time = (value) => {
    const seconds = value % 60;
    const mins = Math.floor(value / 60);

    return `${mins >= 10 ? mins : "0" + mins}:${
        seconds >= 10 ? seconds : "0" + seconds
    }`;
};
