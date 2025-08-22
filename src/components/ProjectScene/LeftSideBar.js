import { DIALOG_IDS } from "constants";
import { VIEW_MODES } from "constants";
import { PIXEL2TIME } from "helper";
import { getCurrentFrameData, getCurrentFrameIndex } from "helper/data";
import useDatabase from "hooks/useDatabase";
import { useFrameActions } from "hooks/useFrameActions";
import useGlobalState from "hooks/useGlobalState";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useStore from "store";
import { useAuth } from "util/auth";
import { getRecentProjectHistory } from "util/db";

export const LeftSideBar = () => {
    const { syncStateToDB } = useDatabase();

    const indicatorPos = useStore((state) => state.indicatorPos);

    const auth = useAuth();

    const router = useRouter();
    const { projectId } = router.query;

    const viewMode = useStore((state) => state.viewMode);
    const setViewMode = useStore((state) => state.setViewMode);

    const curHistory = useStore((state) => state.curHistory);
    const setCurHistory = useStore((state) => state.setCurHistory);

    const selectedVideo = useStore((state) => state.selectedVideo);
    const setSelectedVideo = useStore((state) => state.setSelectedVideo);

    const dancerArray = useStore((state) => state.dancerArray);
    const setDancerArray = useStore((state) => state.setDancerArray);

    const framesArray = useStore((state) => state.framesArray);
    const setFramesArray = useStore((state) => state.setFramesArray);

    const setCurrentDialog = useStore((state) => state.setCurrentDialog);

    const currentFrameId = useStore((state) => state.currentFrameId);
    const setCurrentFrameId = useStore((state) => state.setCurrentFrameId);

    const defaultTransitionTime = useStore(
        (state) => state.defaultTransitionTime
    );
    const setDefaultTransitionTime = useStore(
        (state) => state.setDefaultTransitionTime
    );

    const { enableLoading, disableLoading, setStateFromDB } = useGlobalState();

    useEffect(() => {
        if (viewMode === VIEW_MODES.SELECT) {
            document.getElementsByTagName("canvas")[0].style.cursor = "auto";
        } else if (viewMode === VIEW_MODES.MOVE) {
            document.getElementsByTagName("canvas")[0].style.cursor = "grab";
        }
    }, [viewMode]);

    const undoAction = async () => {
        enableLoading();
        const recentHistory = await getRecentProjectHistory(
            auth.user.uid,
            projectId
        );

        if (!recentHistory || !recentHistory.length || !curHistory) {
            disableLoading();
            return;
        }

        const index = recentHistory.findIndex(
            (item) => item.id === curHistory.id
        );

        if (index === -1 || !recentHistory[index + 1]) {
            disableLoading();
            return;
        }

        const newState = JSON.parse(recentHistory[index + 1].JSON_data);
        setStateFromDB(newState);
        setCurHistory({
            id: recentHistory[index + 1].id,
        });
    };

    const redoAction = async () => {
        enableLoading();
        const recentHistory = await getRecentProjectHistory(
            auth.user.uid,
            projectId
        );

        if (!recentHistory || !recentHistory.length || !curHistory) {
            disableLoading();
            return;
        }

        const index = recentHistory.findIndex(
            (item) => item.id === curHistory.id
        );

        if (index === -1 || !recentHistory[index - 1]) {
            disableLoading();
            return;
        }

        const newState = JSON.parse(recentHistory[index - 1].JSON_data);
        setStateFromDB(newState);
        setCurHistory({
            id: recentHistory[index - 1].id,
        });
    };

    const removeAction = () => {
        if (!selectedVideo) return;

        const dancerIndex = dancerArray.findIndex(
            (item) => item.id === selectedVideo
        );

        const newDancerArray = [...dancerArray];
        if (dancerIndex !== -1) {
            newDancerArray.splice(dancerIndex, 1);
        }
        setDancerArray(newDancerArray);

        const newFramesArray = [...framesArray];
        for (let i = 0; i < newFramesArray.length; i++) {
            const frame = { ...newFramesArray[i] };
            const newDancerPositions = [...frame.dancerPositions];
            const index = newDancerPositions.findIndex(
                (item) => item.id === selectedVideo
            );
            if (index !== -1) {
                newDancerPositions.splice(index, 1);
            }

            frame.dancerPositions = newDancerPositions;

            newFramesArray[i] = frame;
        }

        setFramesArray(newFramesArray);

        setSelectedVideo(null);
    };

    const toggleVideoSection = () => {
        setCurrentDialog(DIALOG_IDS["ADD_VIDEO"]);
    };

    const toggleMusicSection = () => {
        setCurrentDialog(DIALOG_IDS["ADD_MUSIC"]);
    };

    const addNewFrame = () => {
        const curFrame = getCurrentFrameData(currentFrameId, framesArray);
        const curFrameIndex = getCurrentFrameIndex(currentFrameId, framesArray);

        const newFramesArray = [...framesArray];

        const newFrame = {
            id: Date.now(),
            timestamp: new Date(),
            dancerPositions: [...curFrame.dancerPositions],
            startTime: PIXEL2TIME(indicatorPos) + Number(defaultTransitionTime),
        };

        newFramesArray.splice(curFrameIndex + 1, 0, newFrame);

        for (let i = curFrameIndex + 2; i <= newFramesArray.length; i++) {
            if (newFramesArray[i]) {
                const frame = { ...newFramesArray[i] };
                frame.startTime += Number(defaultTransitionTime);
                newFramesArray[i] = frame;
            }
        }

        setFramesArray(newFramesArray);
        setCurrentFrameId(newFrame.id);

        syncStateToDB();
    };

    const removeFrame = () => {
        if (framesArray.length === 1) return;

        const curFrameIndex = framesArray.findIndex(
            (frame) => frame.id === currentFrameId
        );

        // Cannot delete first keypoint;
        if (curFrameIndex === 0) return;

        const newFramesArray = [...framesArray];
        newFramesArray.splice(curFrameIndex, 1);

        let newFrameIndex;
        if (newFramesArray[curFrameIndex - 1]) {
            newFrameIndex = curFrameIndex - 1;
        } else {
            newFrameIndex = 0;
        }

        setFramesArray(newFramesArray);
        setCurrentFrameId(newFramesArray[newFrameIndex].id);

        syncStateToDB();
    };

    const onChangeAction = (ev) => {
        const value = ev.target.value;

        if (value !== 0 && !value) return;

        setDefaultTransitionTime(Number(value));
    };

    return (
        <div className="leftSideBar">
            <div className="leftSideBar__section">
                <div className="leftSideBar__logo">
                    <img
                        alt="leftsidebarlogo"
                        src="/assets/icons/ChoreoMate-logo.svg"
                    />
                </div>

                <div className="leftSideBar__menu">
                    <div className="menuItem">
                        <img
                            alt="menuLogo"
                            src="/assets/icons/ChoreoMate-icon-my-account.svg"
                        />
                        My account
                    </div>

                    <div className="menuItem" onClick={toggleVideoSection}>
                        <img
                            alt="menuLogo"
                            src="/assets/icons/ChoreoMate-icon-add-video.svg"
                        />
                        Add video
                    </div>

                    <div className="menuItem" onClick={toggleMusicSection}>
                        <img
                            alt="menuLogo"
                            src="/assets/icons/ChoreoMate-icon-add-music.svg"
                        />
                        Add music
                    </div>
                </div>
            </div>

            <div className="leftSideBar__separator"></div>

            <div className="flex flex-col justify-between bottomWrapper">
                <div className="leftSideBar__section">
                    <div className="leftSideBar__tools">
                        <div className="row_tools">
                            <div
                                className={`item ${
                                    viewMode === VIEW_MODES["SELECT"]
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => setViewMode(VIEW_MODES.SELECT)}
                            >
                                <span className="iconCursor"></span>
                            </div>

                            <div
                                className={`item ${
                                    viewMode === VIEW_MODES["MOVE"]
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => setViewMode(VIEW_MODES.MOVE)}
                            >
                                <span className="iconHand"></span>
                            </div>
                        </div>

                        <div className="row_tools">
                            <div className="item" onClick={undoAction}>
                                <span className="iconUndo"></span>
                            </div>

                            <div className="item" onClick={redoAction}>
                                <span className="iconRedo"></span>
                            </div>
                        </div>

                        <button
                            style={{ display: "none" }}
                            id="removeVideoBtn"
                            onClick={removeAction}
                        ></button>
                    </div>
                </div>

                <div className="leftSideBar__separator"></div>

                <div className="leftSideBar__section">
                    <div className="leftSideBar__bottomBtns">
                        <div className="btnItem" onClick={addNewFrame}>
                            <img
                                alt="pic"
                                src="/assets/icons/ChoreoMate-icon-keypoints-add.svg"
                            />
                            Add keypoints
                        </div>

                        <div className="btnItem" onClick={removeFrame}>
                            <img
                                alt="pic"
                                src="/assets/icons/ChoreoMate-icon-keypoints-delete.svg"
                            />
                            Delete keypoints
                        </div>

                        <div className="btnItem transTime">
                            <input
                                type="number"
                                value={defaultTransitionTime}
                                onChange={onChangeAction}
                            />
                            <span className="sec">s</span>
                            Transition duration
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftSideBar;
