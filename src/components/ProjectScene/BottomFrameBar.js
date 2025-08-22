import {
    PLAY_STATUS,
    TIMELINE_LENGTH,
    TIMELINE_UNIT,
    TIME_PIXEL,
} from "../../constants";
import { getCurrentFrameIndex } from "helper/data";
import useStore from "../../store";
import useDatabase from "hooks/useDatabase";
import { useEffect, useRef } from "react";
import { Number2Time, TIME2PIXEL } from "helper";
import { useFrameActions } from "hooks/useFrameActions";
import { useDrag } from "@use-gesture/react";

export const BottomFrameBar = () => {
    const { syncStateToDB } = useDatabase();

    const { playFrameAnimation, pauseFrameAnimation, resumeFrameAnimation } =
        useFrameActions();

    const indicatorPos = useStore((state) => state.indicatorPos);
    const setIndicatorPos = useStore((state) => state.setIndicatorPos);
    const addIndicatorPos = useStore((state) => state.addIndicatorPos);

    const currentFrameId = useStore((state) => state.currentFrameId);
    const setCurrentFrameId = useStore((state) => state.setCurrentFrameId);

    const framesArray = useStore((state) => state.framesArray);
    const setFramesArray = useStore((state) => state.setFramesArray);

    const playStatus = useStore((state) => state.playStatus);
    const setPlayStatus = useStore((state) => state.setPlayStatus);

    const musicArray = useStore((state) => state.musicArray);

    const selectedMusic = useStore((state) => state.selectedMusic);
    const setSelectedMusic = useStore((state) => state.setSelectedMusic);
    const updateSingleMusic = useStore((state) => state.updateSingleMusic);

    const intervalRef = useRef();

    useEffect(() => {
        const curFrameIndex = getCurrentFrameIndex(currentFrameId, framesArray);
        const curFrameData = framesArray[curFrameIndex];

        const duration = curFrameData.startTime;
        const pos = TIME2PIXEL(duration);

        setIndicatorPos(pos);
    }, [currentFrameId]);

    useEffect(() => {
        if (playStatus === PLAY_STATUS["PLAYING"]) {
            intervalRef.current = setInterval(() => {
                addIndicatorPos(TIME2PIXEL(20 / 1000));
            }, 20);
        } else {
            clearInterval(intervalRef.current);
        }
    }, [playStatus]);

    const onClickFrame = (frame) => {
        setPlayStatus(PLAY_STATUS.NORMAL);

        setCurrentFrameId(frame.id);

        syncStateToDB();
    };

    const onClickMusicItem = (musicId) => {
        if (selectedMusic === musicId) {
            setSelectedMusic(null);
        } else {
            setSelectedMusic(musicId);
        }
    };

    const tempArray = new Array(50).fill(10);

    const bindDragMusic = useDrag(
        ({
            active,
            movement: [x, y],
            delta: [deltaX, deltaY],
            timeStamp,
            event,
            args,
        }) => {
            event.stopPropagation();

            const musicItem = { ...args[0] };

            if (active) {
                const time = deltaX / TIME_PIXEL;

                if (!musicItem.delayTime) musicItem.delayTime = 0;

                musicItem.delayTime = musicItem.delayTime + time;

                updateSingleMusic(musicItem);
            }

            return timeStamp;
        },
        { delay: false }
    );

    const bindDragKeyPoint = useDrag(
        ({
            active,
            movement: [x, y],
            delta: [deltaX, deltaY],
            timeStamp,
            event,
            args,
        }) => {
            event.stopPropagation();

            const keyItem = { ...args[0] };

            if (active) {
                const time = deltaX / TIME_PIXEL;

                const index = getCurrentFrameIndex(keyItem.id, framesArray);

                if (index === 0) return timeStamp;

                const keyPoint = { ...framesArray[index] };

                keyPoint.startTime += time;

                /**
                 * Should stay between the side keypoints.
                 */
                if (
                    framesArray[index - 1] &&
                    keyPoint.startTime < framesArray[index - 1].startTime
                ) {
                    keyPoint.startTime = framesArray[index - 1].startTime;
                }

                if (
                    framesArray[index + 1] &&
                    keyPoint.startTime > framesArray[index + 1].startTime
                ) {
                    keyPoint.startTime = framesArray[index + 1].startTime;
                }

                const newFramesArray = [...framesArray];
                newFramesArray[index] = keyPoint;
                setFramesArray(newFramesArray);

                /**
                 * Set Indicator Pos
                 */
                setPlayStatus(PLAY_STATUS.NORMAL);
                const curFrameIndex = getCurrentFrameIndex(
                    currentFrameId,
                    newFramesArray
                );
                const curFrameData = newFramesArray[curFrameIndex];

                const duration = curFrameData.startTime;
                const pos = TIME2PIXEL(duration);

                setIndicatorPos(pos);
            }

            return timeStamp;
        },
        { delay: false }
    );

    return (
        <div className="bottomFrameBar">
            <div className="bottomFrameBar__btnGroup">
                {playStatus === PLAY_STATUS.NORMAL ? (
                    <div
                        id="playBtn"
                        className="bottomFrameBar__btn"
                        onClick={playFrameAnimation}
                    >
                        <img alt="pic" src="/assets/icons/pause.svg" />
                    </div>
                ) : playStatus === PLAY_STATUS.PLAYING ? (
                    <div
                        id="playBtn"
                        className="bottomFrameBar__btn"
                        onClick={pauseFrameAnimation}
                    >
                        <img alt="pic" src="/assets/icons/play.svg" />
                    </div>
                ) : playStatus === PLAY_STATUS.PAUSE ? (
                    <div
                        id="playBtn"
                        className="bottomFrameBar__btn"
                        onClick={resumeFrameAnimation}
                    >
                        <img alt="pic" src="/assets/icons/pause.svg" />
                    </div>
                ) : null}
            </div>

            <div className="bottomFrameBar__inspector">
                <div className="bottomFrameBar__inspector__category">
                    <div className="description totalTime">00:00:35</div>

                    <div className="description">Keypoints</div>

                    <div className="description">music</div>
                </div>

                <div className="bottomFrameBar__inspector__rows">
                    <div className="scrollView">
                        <div className="bottomFrameBar__rowWrapper">
                            <div className="timeLineWrapper">
                                <div className="timeLineItem">0</div>

                                {tempArray.map((item, index) => (
                                    <div
                                        className="timeLineItem absolute"
                                        key={`timelineNumber ${index}`}
                                        style={{
                                            left: TIMELINE_LENGTH * (index + 1),
                                        }}
                                    >
                                        {Number2Time(
                                            TIMELINE_UNIT * (index + 1)
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            className="bottomFrameBar__rowWrapper"
                            style={{ width: 10000 }}
                        >
                            <div className="bottomFrameBar__frames">
                                {framesArray.map((item, index) => (
                                    <div
                                        key={`frame${index}`}
                                        className={`bottomFrameBar__frame ${
                                            item.id === currentFrameId
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() => onClickFrame(item)}
                                        style={{
                                            left: `${TIME2PIXEL(
                                                item.startTime
                                            )}px`,
                                        }}
                                        {...bindDragKeyPoint(item)}
                                    >
                                        {index + 1}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bottomFrameBar__rowWrapper">
                            <div className="bottomFrameBar__sounds">
                                <span
                                    className="indicator"
                                    style={{ left: indicatorPos + "px" }}
                                >
                                    <span className="topTriangle" />
                                </span>

                                {musicArray.map((item, index) => (
                                    <div
                                        className={`bottomFrameBar__sounds__item ${
                                            selectedMusic === item.id
                                                ? "active"
                                                : ""
                                        }`}
                                        style={{
                                            marginLeft: item.delayTime
                                                ? TIME2PIXEL(item.delayTime)
                                                : 0,
                                            width: TIME2PIXEL(item.duration),
                                        }}
                                        key={`sound${index}`}
                                        onClick={() =>
                                            onClickMusicItem(item.id)
                                        }
                                        {...bindDragMusic(item)}
                                    >
                                        {/* {item.name} */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BottomFrameBar;
