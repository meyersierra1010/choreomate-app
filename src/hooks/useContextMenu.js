import { useRef } from "react";
import useStore from "store";

export const useContextMenu = () => {
    const contextMenuInfo = useStore((state) => state.contextMenuInfo);
    const setContextMenuInfo = useStore((state) => state.setContextMenuInfo);

    const ref = useRef(null);
    ref.current = contextMenuInfo;

    const open = ({ x, y, videoId }) => {
        setContextMenuInfo({
            isOpen: true,
            x: x,
            y: y,
            videoId: videoId,
        });
    };

    const close = () => {
        setContextMenuInfo({
            ...ref.current,
            isOpen: false,
        });
    };

    return { open, close };
};
