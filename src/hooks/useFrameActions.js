import { PLAY_STATUS } from "../constants";
import { PIXEL2TIME } from "helper";
import { getCurrentFrameIndex } from "helper/data";
import { useEffect, useState } from "react";
import useStore from "store";

export const useFrameActions = () => {
    const indicatorPos = useStore((state) => state.indicatorPos);

    const currentFrameId = useStore((state) => state.currentFrameId);
    const setCurrentFrameId = useStore((state) => state.setCurrentFrameId);

    const framesArray = useStore((state) => state.framesArray);

    const playStatus = useStore((state) => state.playStatus);
    const setPlayStatus = useStore((state) => state.setPlayStatus);

    const defaultTransitionTime = useStore(
        (state) => state.defaultTransitionTime
    );

    const musicArray = useStore((state) => state.musicArray);

    const dancerArray = useStore((state) => state.dancerArray);

    const playFrameAnimation = () => {
        // if (framesArray.length === 1) return;

        setPlayStatus(PLAY_STATUS.PLAYING);

        let startTime = 0;

        const cIndex = getCurrentFrameIndex(currentFrameId, framesArray);
        if (cIndex === framesArray.length - 1) {
            setCurrentFrameId(framesArray[0].id);
            startTime = 0;
        } else {
            startTime = cIndex * defaultTransitionTime;
        }

        dancerArray.forEach((dancer) => {
            if (startTime <= dancer.video.duration) {
                dancer.video.currentTime = startTime;
                dancer.video.play();
            }
        });
    };

    const pauseFrameAnimation = () => {
        setPlayStatus(PLAY_STATUS.PAUSE);

        if (musicArray[0]) {
            musicArray[0].music.pause();
        }

        dancerArray.forEach((dancer) => {
            dancer.video.pause();
        });
    };

    const resumeFrameAnimation = () => {
        setPlayStatus(PLAY_STATUS.PLAYING);

        const curTime = PIXEL2TIME(indicatorPos, defaultTransitionTime);

        dancerArray.forEach((dancer) => {
            if (curTime <= dancer.video.duration) {
                dancer.video.currentTime = curTime;
                dancer.video.play();
            }
        });
    };

    useEffect(() => {
        const elapsedTime = PIXEL2TIME(indicatorPos);

        const musicInfo = musicArray[0];

        if (
            musicInfo &&
            playStatus === PLAY_STATUS.PLAYING &&
            musicInfo.music.paused &&
            elapsedTime > musicInfo.delayTime &&
            elapsedTime < musicInfo.delayTime + musicInfo.music.duration
        ) {
            musicInfo.music.currentTime = elapsedTime - musicInfo.delayTime;
            musicInfo.music.play();
        }
    }, [indicatorPos]);

    return {
        playFrameAnimation,
        pauseFrameAnimation,
        resumeFrameAnimation,
    };
};
