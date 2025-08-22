import Link from "next/link";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import useStore from "../../store";
import { useAuth } from "util/auth";
import { useVideosByOwner } from "util/db";
import { VIDEO_HEIGHT } from "../../constants";
import useDatabase from "hooks/useDatabase";
import { Number2Time, loadVideo } from "helper";

const VideoItem = ({ item, selectedVideo, onClickVideoItem }) => {
    const [duration, setDuration] = useState(0);
    const [videoLoading, setVideoLoading] = useState(true);

    const onLoadedData = (ev) => {
        setDuration(ev.target.duration);
        setVideoLoading(false);
    };

    return (
        <div
            className={`item ${selectedVideo?.id === item.id ? "active" : ""}`}
            onClick={() => onClickVideoItem(item)}
        >
            {videoLoading && (
                <div className="placeholder">
                    <div className="animatedBackground"></div>
                </div>
            )}

            <video muted loop onLoadedData={onLoadedData}>
                <source
                    src={item.unScreenUrl ? item.unScreenUrl : item.url}
                    type="video/mp4"
                />
            </video>

            <div className="flex justify-between items-center w-full px-2">
                <div>{item.name}</div>
                <div className="text-grey">
                    {Number2Time(Math.ceil(duration))}
                </div>
            </div>
        </div>
    );
};

export const AddVideoSection = ({ active }) => {
    const auth = useAuth();

    const { syncStateToDB } = useDatabase();

    const {
        data: items,
        status: itemsStatus,
        error: itemsError,
    } = useVideosByOwner(auth.user.uid);

    const setCurrentDialog = useStore((state) => state.setCurrentDialog);

    const dancerArray = useStore((state) => state.dancerArray);
    const setDancerArray = useStore((state) => state.setDancerArray);

    const framesArray = useStore((state) => state.framesArray);
    const setFramesArray = useStore((state) => state.setFramesArray);

    const setShowLoading = useStore((state) => state.setShowLoading);

    const [selectedVideo, setSelectedVideo] = useState();

    const onClickVideoItem = (item) => {
        setSelectedVideo(item);
    };

    const onClickAddVideoBtn = async () => {
        setShowLoading(true);

        const url = selectedVideo.unScreenUrl
            ? selectedVideo.unScreenUrl
            : selectedVideo.url;

        const vid = await loadVideo(url);

        const newDancer = {
            id: Date.now(),
            video: vid,
        };
        const newDancerArray = [...dancerArray];
        newDancerArray.push(newDancer);
        setDancerArray(newDancerArray);

        const newFramesArray = [...framesArray];

        for (let i = 0; i < newFramesArray.length; i++) {
            const frame = { ...newFramesArray[i] };

            const newDancerPositions = [...frame.dancerPositions];
            newDancerPositions.push({
                id: newDancer.id,
                position: {
                    x: 0,
                    y: VIDEO_HEIGHT / 2,
                    z: 0,
                },
            });

            frame.dancerPositions = newDancerPositions;

            newFramesArray[i] = frame;
        }

        setFramesArray(newFramesArray);

        syncStateToDB();

        setShowLoading(false);
        onClickClose();
    };

    const onClickClose = () => {
        setCurrentDialog(null);
    };

    return (
        <div className={`relative modalWrapper ${active ? "active" : ""}`}>
            <div className="dialog__overlay" onClick={onClickClose}></div>
            <div className="addVideoSection">
                <div className="myVideos__header">
                    <h1>My videos</h1>
                    <Link href="/videos" passHref={true}>
                        <button className="normalBtn">Upload</button>
                    </Link>
                </div>

                <div className="myVideos__container">
                    <div className="myVideos__wrapper">
                        {itemsStatus === "loading" ? (
                            <div className="w-full h-full flex justify-center items-center">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : itemsStatus === "success" && items ? (
                            items.map((item, index) => (
                                <VideoItem
                                    key={`videoitem${index}`}
                                    item={item}
                                    selectedVideo={selectedVideo}
                                    onClickVideoItem={onClickVideoItem}
                                />
                            ))
                        ) : null}
                    </div>
                </div>

                <div className="myVideos__btnGroup">
                    <button
                        className="addVideoBtn normalBtn"
                        onClick={onClickAddVideoBtn}
                        disabled={!selectedVideo}
                    >
                        Add video
                    </button>

                    <button
                        className="normalBtn closeBtn"
                        onClick={onClickClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddVideoSection;
