import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { GridRenderer } from "components/GridHelper";
import VideoPlane from "components/VideoPlane";
import {
    ChromaKeyOptions,
    orbitControlProps,
    VIEW_MODES,
} from "../../constants";
import { ang2Rad } from "helper";
import useStore from "store";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { getCurrentVideoData } from "helper/data";
import { useState } from "react";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";

export const CanvasScene = () => {
    const router = useRouter();

    const viewMode = useStore((state) => state.viewMode);
    const dragInfo = useStore((state) => state.dragInfo);
    const dancerArray = useStore((state) => state.dancerArray);
    const framesArray = useStore((state) => state.framesArray);
    const currentFrameId = useStore((state) => state.currentFrameId);
    const showSaving = useStore((state) => state.showSaving);

    const [chromaKeyRange, setChromaKeyRange] = useState(
        ChromaKeyOptions.chromaRange
    );

    const [orbitProps, setOrbitProps] = useState({ ...orbitControlProps });

    const videoData = getCurrentVideoData(
        currentFrameId,
        framesArray,
        dancerArray
    );

    const onContextMenuHandler = (ev) => {
        ev.preventDefault();
        return false;
    };

    const onCreatedScene = ({ gl, scene }) => {
        if (router.query.debug === "true") {
            const gui = new GUI({ width: 200 });
            const params = {
                chromaRange: ChromaKeyOptions.chromaRange,
                minAzimuthAngle: orbitControlProps.minAzimuthAngle,
                maxAzimuthAngle: orbitControlProps.maxAzimuthAngle,
                minPolarAngle: orbitControlProps.minPolarAngle,
                maxPolarAngle: orbitControlProps.maxPolarAngle,
            };
            gui.add(params, "chromaRange", 0, 1).onChange(function (value) {
                setChromaKeyRange(value);
            });
            gui.add(params, "minAzimuthAngle", -360, 360).onChange(function (
                value
            ) {
                setOrbitProps((prev) => ({
                    ...prev,
                    minAzimuthAngle: value,
                }));
            });
            gui.add(params, "maxAzimuthAngle", -360, 360).onChange(function (
                value
            ) {
                setOrbitProps((prev) => ({
                    ...prev,
                    maxAzimuthAngle: value,
                }));
            });
            gui.add(params, "minPolarAngle", 0, 360).onChange(function (value) {
                setOrbitProps((prev) => ({
                    ...prev,
                    minPolarAngle: value,
                }));
            });
            gui.add(params, "maxPolarAngle", 0, 360).onChange(function (value) {
                setOrbitProps((prev) => ({
                    ...prev,
                    maxPolarAngle: value,
                }));
            });
        }
    };

    return (
        <div onContextMenu={onContextMenuHandler} className="canvasScene">
            <div className={`sceneStatus ${!showSaving ? "disable" : ""}`}>
                {showSaving ? (
                    <>
                        Saving...
                        <Spinner animation="border" variant="primary">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </>
                ) : (
                    <>Saved</>
                )}
            </div>

            <Canvas onCreated={onCreatedScene}>
                {/* <color attach="background" args={["#242440"]} /> */}
                <OrbitControls
                    enabled={
                        !dragInfo.isDragging && viewMode === VIEW_MODES.MOVE
                    }
                    maxAzimuthAngle={ang2Rad(orbitProps.maxAzimuthAngle)}
                    minAzimuthAngle={ang2Rad(orbitProps.minAzimuthAngle)}
                    maxPolarAngle={ang2Rad(orbitProps.maxPolarAngle)}
                    minPolarAngle={ang2Rad(orbitProps.minPolarAngle)}
                    enablePan={false}
                />
                <PerspectiveCamera makeDefault fov={60} position={[0, 8, 15]} />
                <ambientLight intensity={0.1} />
                <pointLight position={[10, 10, 10]} />
                <directionalLight color="red" position={[0, 0, 5]} />

                <GridRenderer />

                {videoData.map((item, index) => (
                    <VideoPlane
                        key={`videoPlane-${index}`}
                        id={item.id}
                        position={item.position}
                        video={item.video}
                        chromaKeyRange={chromaKeyRange}
                    />
                ))}
            </Canvas>
        </div>
    );
};

export default CanvasScene;
