import { useState } from "react";
import { useDrag } from "@use-gesture/react";
import { Edges, Plane } from "@react-three/drei";
import {
    ChromaKeyOptions,
    GRID_PROPS,
    PLAY_STATUS,
    VIDEO_HEIGHT,
    VIEW_MODES,
} from "../constants";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ChromaKeyVideoShaderMaterial } from "../materials/ChromaKeyVideoShaderMaterial/ChromaKeyVideoShaderMaterial";
import useStore from "../store";
import { getCurrentFrameIndex } from "helper/data";
import gsap from "gsap";
import useDatabase from "hooks/useDatabase";
import { useContextMenu } from "hooks/useContextMenu";

export const VideoPlane = (props) => {
    const { syncStateToDB } = useDatabase();
    const { open: openContextMenu } = useContextMenu();

    const planeRef = useRef();
    const materialRef = useRef();

    const dragInfo = useStore((state) => state.dragInfo);
    const setDragInfo = useStore((state) => state.setDragInfo);
    const framesArray = useStore((state) => state.framesArray);
    const setFramesArray = useStore((state) => state.setFramesArray);
    const currentFrameId = useStore((state) => state.currentFrameId);
    const setCurrentFrameId = useStore((state) => state.setCurrentFrameId);
    const playStatus = useStore((state) => state.playStatus);
    const setPlayStatus = useStore((state) => state.setPlayStatus);
    const viewMode = useStore((state) => state.viewMode);
    const selectedVideo = useStore((state) => state.selectedVideo);
    const setSelectedVideo = useStore((state) => state.setSelectedVideo);
    const dancerArray = useStore((state) => state.dancerArray);
    const musicArray = useStore((state) => state.musicArray);

    const isSelected = selectedVideo === props.id;

    const [hovered, setHovered] = useState(false);

    const aspectRatio = props.video.videoWidth / props.video.videoHeight;

    const timeLineRef = useRef();

    const dragOffsetRef = useRef();

    const updateMaterial = () => {
        if (materialRef.current) {
            materialRef.current.range = props.chromaKeyRange;
        }
    };

    useEffect(() => {
        if (planeRef.current && !materialRef.current) {
            const options = ChromaKeyOptions;

            if (options.chromaMult) options.mult = options.chromaMult;
            delete options.chromaMult;

            options.range = props.chromaKeyRange;
            options.initVideoScale = options.initVideoScale || 0.01;
            options.sillouetteShadowOpacity =
                options.sillouetteShadowOpacity || 0.4;

            const chromakeyMaterial = new ChromaKeyVideoShaderMaterial(
                props.video,
                options
            );
            chromakeyMaterial.side = THREE.DoubleSide;

            materialRef.current = chromakeyMaterial;

            planeRef.current.material = materialRef.current;
        }
    }, [planeRef]);

    useEffect(() => {
        if (materialRef.current) {
            const videoTexture = new THREE.VideoTexture(props.video);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;

            materialRef.current.map = videoTexture;
        }
    }, [props.video]);

    useEffect(() => {
        updateMaterial();
    }, [props.chromaKeyRange]);

    useEffect(() => {
        if (!planeRef.current) return;

        planeRef.current.position.x = props.position.x;
        planeRef.current.position.y = props.position.y;
        planeRef.current.position.z = props.position.z;
    }, [props.position]);

    useEffect(() => {
        if (playStatus === PLAY_STATUS.PLAYING) {
            const currentFrameIndex = getCurrentFrameIndex(
                currentFrameId,
                framesArray
            );

            if (framesArray.length === 1) {
                timeLineRef.current = null;
                return;
            }

            if (currentFrameIndex === framesArray.length - 1) {
                timeLineRef.current = null;
                setPlayStatus(PLAY_STATUS.NORMAL);

                dancerArray.forEach((dancer) => {
                    dancer.video.pause();
                });

                if (musicArray[0]) {
                    musicArray[0].music.pause();
                }

                return;
            }

            if (timeLineRef.current) {
                timeLineRef.current.play();
            } else {
                const newPosition = framesArray[
                    currentFrameIndex + 1
                ].dancerPositions.find((dancer) => dancer.id === props.id);
                const targetPosition = { ...newPosition.position };

                const duration =
                    framesArray[currentFrameIndex + 1].startTime -
                    framesArray[currentFrameIndex].startTime;

                const tl = new gsap.timeline();
                tl.to(planeRef.current.position, {
                    x: targetPosition.x,
                    y: targetPosition.y,
                    z: targetPosition.z,
                    ease: "none",
                    duration: duration,
                    onComplete: () => {
                        timeLineRef.current = null;
                        setCurrentFrameId(
                            framesArray[currentFrameIndex + 1].id
                        );
                    },
                });

                timeLineRef.current = tl;
            }
        } else if (playStatus === PLAY_STATUS.PAUSE && timeLineRef.current) {
            timeLineRef.current.pause();
        } else if (playStatus === PLAY_STATUS.NORMAL && timeLineRef.current) {
            timeLineRef.current.kill();
            timeLineRef.current = null;
        }
    }, [playStatus, currentFrameId]);

    const updateDancerPosition = (newPosition) => {
        const curFrame = {
            ...framesArray.find((item) => item.id === currentFrameId),
        };
        const curFrameIndex = framesArray.findIndex(
            (item) => item.id === currentFrameId
        );
        const newDancerPositions = [...curFrame.dancerPositions];
        const dancerIndex = newDancerPositions.findIndex(
            (item) => item.id === props.id
        );

        newDancerPositions[dancerIndex] = {
            ...newDancerPositions[dancerIndex],
        };
        newDancerPositions[dancerIndex].position = newPosition;
        curFrame.dancerPositions = newDancerPositions;
        const newFramesArray = [...framesArray];
        newFramesArray[curFrameIndex] = { ...curFrame };
        setFramesArray(newFramesArray);
    };

    let planeIntersectPoint = new THREE.Vector3();

    const bind = useDrag(
        ({ active, movement: [x, y], timeStamp, event }) => {
            event.stopPropagation();

            if (viewMode !== VIEW_MODES.SELECT) return;

            if (active) {
                if (!isSelected) {
                    /** Set selected video */
                    setSelectedVideo(props.id);
                    return;
                }

                const floorPlane = new THREE.Plane(
                    new THREE.Vector3(0, 0.001, 0),
                    0
                );
                floorPlane.translate(new THREE.Vector3(0, VIDEO_HEIGHT / 2, 0));

                event.ray.intersectPlane(floorPlane, planeIntersectPoint);

                const newPos = {
                    x: planeIntersectPoint.x,
                    y: props.position.y,
                    z: planeIntersectPoint.z,
                };

                if (!dragOffsetRef.current) {
                    dragOffsetRef.current = {
                        x: planeRef.current.position.x - newPos.x,
                        y: planeRef.current.position.y - newPos.y,
                        z: planeRef.current.position.z - newPos.z,
                    };
                }

                newPos.x += dragOffsetRef.current.x;
                newPos.y += dragOffsetRef.current.y;
                newPos.z += dragOffsetRef.current.z;

                if (newPos.x > GRID_PROPS.size / 2 - 0.5)
                    newPos.x = GRID_PROPS.size / 2 - 0.5;
                if (newPos.x < -GRID_PROPS.size / 2 + 0.5)
                    newPos.x = -GRID_PROPS.size / 2 + 0.5;

                if (newPos.z > GRID_PROPS.size / 2 - 0.5)
                    newPos.z = GRID_PROPS.size / 2 - 0.5;
                if (newPos.z < -GRID_PROPS.size / 2 + 0.5)
                    newPos.z = -GRID_PROPS.size / 2 + 0.5;

                updateDancerPosition(newPos);
            } else {
                syncStateToDB();

                dragOffsetRef.current = null;
            }

            setDragInfo({
                isDragging: active,
            });

            return timeStamp;
        },
        { delay: false }
    );

    const onPointerOverHandler = (ev) => {
        ev.stopPropagation();

        if (dragInfo.isDragging) return;

        setHovered(true);
    };

    const onPointerOutHandler = (ev) => {
        ev.stopPropagation();

        if (dragInfo.isDragging) return;

        setHovered(false);
    };

    const onContextMenuHandler = (ev) => {
        ev.stopPropagation();

        openContextMenu({
            x: ev.x,
            y: ev.y,
            videoId: props.id,
        });
    };

    return (
        <Plane
            rotation={[0, 0, 0]}
            args={[VIDEO_HEIGHT * aspectRatio, VIDEO_HEIGHT]}
            ref={planeRef}
            {...bind()}
            onPointerOver={onPointerOverHandler}
            onPointerOut={onPointerOutHandler}
            onContextMenu={onContextMenuHandler}
        >
            <meshStandardMaterial emissive={"white"} side={THREE.DoubleSide}>
                <videoTexture attach="map" args={[props.video]} />
                <videoTexture attach="emissiveMap" args={[props.video]} />
            </meshStandardMaterial>

            {(hovered || isSelected) && viewMode === VIEW_MODES.SELECT ? (
                <Edges
                    scale={1}
                    threshold={15}
                    color={`${isSelected ? "red" : hovered ? "#d9904b" : null}`}
                />
            ) : null}
        </Plane>
    );
};

export default VideoPlane;
