import React, { useEffect, useState } from "react";
import { requireAuth } from "util/auth";
import Meta from "components/Meta";
import { getLatestProjectHistory, useItem } from "util/db";
import { useAuth } from "util/auth";
import { useRouter } from "next/router";
import { DIALOG_IDS } from "../../constants";
import useStore from "../../store";
import AddVideoSection from "components/ProjectScene/AddVideoSection";
import { Button } from "react-bootstrap";
import BottomFrameBar from "components/ProjectScene/BottomFrameBar";
import useGlobalState from "hooks/useGlobalState";
import AddMusicSection from "components/ProjectScene/AddMusicSection";
import KeyEventsHandler from "components/KeyEventsHandler";
import Tooltips from "components/Tooltips";
import ContextMenu from "components/ContextMenu";
import Loading from "components/ProjectScene/Loading";
import LeftSideBar from "components/ProjectScene/LeftSideBar";
import CanvasScene from "components/ProjectScene/CanvasScene";

//get project data from supabase

function ProjectEditor(props) {
    const auth = useAuth();
    const router = useRouter();
    const { projectId } = router.query;

    const { enableLoading, disableLoading, setStateFromDB } = useGlobalState();

    const { data } = useItem(projectId);

    const showLoading = useStore((state) => state.showLoading);
    const currentDialog = useStore((state) => state.currentDialog);

    const setCurHistory = useStore((state) => state.setCurHistory);

    useEffect(() => {
        const getLatestState = async () => {
            enableLoading();
            const response = await getLatestProjectHistory(
                auth.user.uid,
                projectId
            );

            if (response && response.JSON_data) {
                setCurHistory(response.id);
                const state = JSON.parse(response.JSON_data);
                setStateFromDB(state);
            } else {
                disableLoading();
            }
        };

        getLatestState();
    }, []);

    return (
        <>
            <Meta title="Editor" />

            {showLoading && <Loading />}

            <div className="sceneWrapper">
                <LeftSideBar />

                <div className="sceneWrapper__rightSide flex flex-col justify-center items-center">
                    <CanvasScene />

                    <BottomFrameBar />
                </div>
            </div>

            {/* <div className="container projects-header">
                <h1>{data?.name}</h1>

                <div className="header__btn__wrapper">
                    <Button
                        className="addVideoBtn"
                        variant="primary"
                        size="md"
                        onClick={toggleVideoSection}
                    >
                        Add Video
                    </Button>
                    <Button
                        className="addMusicBtn"
                        variant="primary"
                        size="md"
                        onClick={toggleMusicSection}
                    >
                        Add Music
                    </Button>
                </div>
            </div> */}

            <AddVideoSection
                active={currentDialog === DIALOG_IDS["ADD_VIDEO"]}
            />

            <AddMusicSection
                active={currentDialog === DIALOG_IDS["ADD_MUSIC"]}
            />

            <Tooltips />

            <ContextMenu />

            <KeyEventsHandler />
        </>
    );
}

export default requireAuth(ProjectEditor);
