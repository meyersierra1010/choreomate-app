import { ang2Rad } from "helper";
import * as THREE from "three";

export const GRID_PROPS = {
    size: 36,
};

export const ChromaKeyOptions = {
    sillouetteShadow: true,
    //This chroma key is for the green screen produced by Replicate
    chromaKey: "#78FF99",
    chromaRange: 0.5,
    feetOffset: new THREE.Vector2(-0.107, 0.054),
    sillouetteShadowOpacity: 0.143,
    sillouetteShadowHeight: -0.679,
    sillouetteShadowSkew: -0.464,
};

export const orbitControlProps = {
    minPolarAngle: 50,
    maxPolarAngle: 80,
    minAzimuthAngle: -10,
    maxAzimuthAngle: 10,
    maxDistance: 50,
    minDistance: 10,
};

export const PLAY_STATUS = {
    NORMAL: 0x01,
    PLAYING: 0x02,
    PAUSE: 0x03,
};

export const VIDEO_HEIGHT = 5;

export const VIEW_MODES = {
    SELECT: 0x01,
    MOVE: 0x02,
};

export const DIALOG_IDS = {
    ADD_VIDEO: 0x01,
    ADD_MUSIC: 0x02,
};

export const TIMELINE_UNIT = 15;

export const TIMELINE_LENGTH = 220;

export const TIME_PIXEL = TIMELINE_LENGTH / TIMELINE_UNIT;
