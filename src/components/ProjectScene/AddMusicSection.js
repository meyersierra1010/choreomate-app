import Link from "next/link";
import { useRef, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import useStore from "../../store";
import { useAuth } from "util/auth";
import { useMusicsByOwner } from "util/db";
import { Number2Time, loadMusic } from "helper";

const MusicItem = ({ item, index, selectedMusic, onClickMusicItem }) => {
    const PLAY_STATUS = {
        playing: 0,
        paused: 1,
    };

    const ref = useRef(null);

    const [duration, setDuration] = useState(0);
    const [musicLoading, setMusicLoading] = useState(true);
    const [playStatus, setPlayStatus] = useState(PLAY_STATUS["paused"]);

    const selected = selectedMusic?.id === item.id;

    const onLoadedData = (ev) => {
        setDuration(ev.target.duration);
        setMusicLoading(false);
    };

    const onEnded = () => {
        setPlayStatus(PLAY_STATUS["paused"]);
    };

    const onClickPlayBtn = () => {
        if (playStatus === PLAY_STATUS["paused"]) {
            ref.current.play();
            setPlayStatus(PLAY_STATUS["playing"]);
        } else {
            ref.current.pause();
            setPlayStatus(PLAY_STATUS["paused"]);
        }
    };

    return (
        <div
            className={`item ${selected ? "active" : ""}`}
            onClick={() => onClickMusicItem(item)}
        >
            {musicLoading && (
                <div className="placeholder">
                    <div className="animatedBackground"></div>
                </div>
            )}

            <div className="flex items-center gap-8">
                {selected ? (
                    <div onClick={onClickPlayBtn}>
                        <img
                            alt="pic"
                            src={`/assets/icons/${
                                playStatus === PLAY_STATUS["paused"]
                                    ? "pause"
                                    : "play"
                            }.svg`}
                            height={25}
                        />
                    </div>
                ) : (
                    <div>{index + 1}</div>
                )}

                <div className="name">{item.name}</div>
            </div>

            <div className="flex items-center">
                {Number2Time(Math.ceil(duration))}
            </div>

            <audio onLoadedData={onLoadedData} onEnded={onEnded} ref={ref}>
                <source src={item.url} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};

export const AddMusicSection = ({ active }) => {
    const auth = useAuth();

    const {
        data: items,
        status: itemsStatus,
        error: itemsError,
    } = useMusicsByOwner(auth.user.uid);

    const setCurrentDialog = useStore((state) => state.setCurrentDialog);

    const musicArray = useStore((state) => state.musicArray);
    const setMusicArray = useStore((state) => state.setMusicArray);

    const [selectedMusic, setSelectedMusic] = useState();

    const [isAdding, setIsAdding] = useState(false);

    const onClickMusicItem = (item) => {
        setSelectedMusic(item);
    };

    const onClickAddMusicBtn = async () => {
        setIsAdding(true);

        // const newMusicArray = [ ...musicArray ];
        const newMusicArray = [];

        const audio = await loadMusic(selectedMusic.url);

        newMusicArray.push({
            id: Date.now(),
            url: selectedMusic.url,
            music: audio,
            duration: audio.duration,
            name: selectedMusic.name,
            delayTime: 0,
        });

        setMusicArray(newMusicArray);

        setIsAdding(false);
        onClickClose();
    };

    const onClickClose = () => {
        setCurrentDialog(null);
    };

    return (
        <div className={`relative modalWrapper ${active ? "active" : ""}`}>
            <div className="dialog__overlay" onClick={onClickClose}></div>

            <div className="addMusicSection">
                <div className="myMusics__header">
                    <h1>My music</h1>
                    <Link href="/musics" passHref={true}>
                        <Button variant="primary" size="md">
                            Upload
                        </Button>
                    </Link>
                </div>

                <div className="myMusics__container">
                    <div className="myMusics__wrapper">
                        {itemsStatus === "loading" || isAdding ? (
                            <div className="w-full h-full flex justify-center items-center">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : itemsStatus === "success" && items ? (
                            items.map((item, index) => (
                                <MusicItem
                                    key={`musicitem${index}`}
                                    item={item}
                                    index={index}
                                    selectedMusic={selectedMusic}
                                    onClickMusicItem={onClickMusicItem}
                                />
                            ))
                        ) : null}
                    </div>
                </div>

                <div className="myMusics__btnGroup">
                    <button
                        className="addMusicBtn normalBtn"
                        onClick={onClickAddMusicBtn}
                        disabled={!selectedMusic || isAdding}
                    >
                        {isAdding ? "Adding..." : "Add music"}
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

export default AddMusicSection;
