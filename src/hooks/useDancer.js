import useStore from "store";
import useDatabase from "./useDatabase";

export const useDancer = () => {
    const { syncStateToDB } = useDatabase();

    const framesArray = useStore((state) => state.framesArray);
    const setFramesArray = useStore((state) => state.setFramesArray);

    const dancerArray = useStore((state) => state.dancerArray);
    const setDancerArray = useStore((state) => state.setDancerArray);

    const removeDancer = (videoId) => {
        const dancerIndex = dancerArray.findIndex(
            (item) => item.id === videoId
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
                (item) => item.id === videoId
            );
            if (index !== -1) {
                newDancerPositions.splice(index, 1);
            }

            frame.dancerPositions = newDancerPositions;

            newFramesArray[i] = frame;
        }

        setFramesArray(newFramesArray);

        syncStateToDB();
    };

    return {
        removeDancer,
    };
};

export default useDancer;
