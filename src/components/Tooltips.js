import { PLAY_STATUS } from "constants";
import { Tooltip } from "react-tooltip";
import useStore from "store";

export const Tooltips = () => {
    const playStatus = useStore((state) => state.playStatus);
    const playToolTip =
        playStatus === PLAY_STATUS.NORMAL
            ? "Play"
            : playStatus === PLAY_STATUS.PLAYING
            ? "Pause"
            : playStatus === PLAY_STATUS.PAUSE
            ? "Resume"
            : "";

    return (
        <>
            <Tooltip
                anchorId="selectModeToolBtn"
                place="right"
                variant="info"
                content="Select Mode"
                delayShow={1000}
                delayHide={5000}
            />

            <Tooltip
                anchorId="viewModeToolBtn"
                place="right"
                variant="info"
                content="View Mode"
                delayShow={1000}
                delayHide={5000}
            />

            <Tooltip
                anchorId="undoToolBtn"
                place="right"
                variant="info"
                content="Undo"
                delayShow={1000}
                delayHide={5000}
            />

            <Tooltip
                anchorId="redoToolBtn"
                place="right"
                variant="info"
                content="Redo"
                delayShow={1000}
                delayHide={5000}
            />

            <Tooltip
                anchorId="removeVideoBtn"
                place="right"
                variant="info"
                content="Remove selected video"
                delayShow={1000}
                delayHide={5000}
            />

            <Tooltip
                anchorId="playBtn"
                place="top"
                variant="info"
                content={playToolTip}
                delayShow={1000}
                delayHide={5000}
            />

            <Tooltip
                anchorId="addKeyPointBtn"
                place="top"
                variant="info"
                content={"Add KeyPoint"}
                delayShow={1000}
                delayHide={5000}
            />

            <Tooltip
                anchorId="removeKeyPointBtn"
                place="top"
                variant="info"
                content={"Remove KeyPoint"}
                delayShow={1000}
                delayHide={5000}
            />
        </>
    );
};

export default Tooltips;
