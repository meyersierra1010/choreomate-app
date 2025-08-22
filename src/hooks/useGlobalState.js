import { loadMusic, loadVideo } from "helper";
import useStore from "../store";

export const useGlobalState = () => {
    const setShowLoading = useStore((state) => state.setShowLoading);

    const setDefaultTransitionTime = useStore(
        (state) => state.setDefaultTransitionTime
    );
    const setFramesArray = useStore((state) => state.setFramesArray);
    const setCurrentFrameId = useStore((state) => state.setCurrentFrameId);
    const oldDancerArray = useStore((state) => state.dancerArray);
    const setDancerArray = useStore((state) => state.setDancerArray);
    const setPlayStatus = useStore((state) => state.setPlayStatus);
    const setMusicArray = useStore((state) => state.setMusicArray);

    const enableLoading = () => {
        setShowLoading(true);
    };

    const disableLoading = () => {
        setShowLoading(false);
    };

    const setStateFromDB = async (state) => {
        oldDancerArray.forEach((dancer) => {
            dancer.video.pause();
            dancer.video.remove();
        });

        const {
            defaultTransitionTime,
            framesArray,
            currentFrameId,
            dancerArray,
            playStatus,
            musicArray,
        } = state;

        if (!musicArray) {
            musicArray = [];
        }

        const newDancerArray = [];
        for (let i = 0; i < dancerArray.length; i++) {
            const url = dancerArray[i].video.url;

            const dancer = {
                ...dancerArray[i],
                video: await loadVideo(url),
                // video: await loadVideo("/assets/test.mp4"),
            };

            newDancerArray.push(dancer);
        }

        const newMusicArray = [];

        if (musicArray) {
            for (let i = 0; i < musicArray.length; i++) {
                const music = {
                    ...musicArray[i],
                    music: await loadMusic(musicArray[i].url),
                    // music: await loadMusic("/assets/test.mp3"),
                };

                newMusicArray.push(music);
            }
        }

        setDefaultTransitionTime(defaultTransitionTime);
        setFramesArray(framesArray);
        setCurrentFrameId(currentFrameId);
        setDancerArray(newDancerArray);
        setPlayStatus(playStatus);
        setMusicArray(newMusicArray);

        disableLoading();
    };

    return { enableLoading, disableLoading, setStateFromDB };
};

export default useGlobalState;
