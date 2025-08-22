import { useRouter } from "next/router";
import useStore from "store";
import { useAuth } from "util/auth";
import { createHistory } from "util/db";

export const useDatabase = () => {
    const auth = useAuth();
    const router = useRouter();
    const { projectId } = router.query;

    const defaultTransitionTime = useStore(
        (state) => state.defaultTransitionTime
    );
    const framesArray = useStore((state) => state.framesArray);
    const currentFrameId = useStore((state) => state.currentFrameId);
    const dancerArray = useStore((state) => state.dancerArray);
    const playStatus = useStore((state) => state.playStatus);
    const musicArray = useStore((state) => state.musicArray);

    const setCurHistory = useStore((state) => state.setCurHistory);
    const setShowSaving = useStore((state) => state.setShowSaving);

    const syncStateToDB = async () => {
        setShowSaving(true);

        const userId = auth.user.uid;

        const newDancerArray = dancerArray.map((item) => {
            const newItem = { ...item };
            newItem.video = {
                url: item.video.src,
            };

            return newItem;
        });

        const json_data = {
            defaultTransitionTime,
            framesArray,
            currentFrameId,
            dancerArray: newDancerArray,
            playStatus,
            musicArray,
        };

        const data = {
            project_id: projectId,
            user_id: userId,
            JSON_data: JSON.stringify(json_data),
        };

        const newHistory = await createHistory(data);
        setCurHistory({
            id: newHistory.id,
        });

        setShowSaving(false);
    };

    return { syncStateToDB };
};

export default useDatabase;
