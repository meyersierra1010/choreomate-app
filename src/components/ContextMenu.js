import { useContextMenu } from "hooks/useContextMenu";
import useDancer from "hooks/useDancer";
import { useEffect } from "react";
import useStore from "store";

export const ContextMenu = () => {
    const { close: closeContextMenu } = useContextMenu();
    const { removeDancer } = useDancer();

    const contextMenuInfo = useStore((state) => state.contextMenuInfo);

    const detectTarget = (event) => {
        if (!event.target.matches(".contextMenu")) {
            closeContextMenu();
        }
    };

    useEffect(() => {
        window.addEventListener("click", detectTarget);

        return () => {
            window.removeEventListener("click", detectTarget);
        };
    }, []);

    const onClickDelete = () => {
        if (contextMenuInfo.videoId) {
            removeDancer(contextMenuInfo.videoId);
        }
    };

    return (
        <div
            className={`contextMenu ${
                contextMenuInfo.isOpen ? "open" : "close"
            }`}
            style={{
                transform: `translate3d(${contextMenuInfo.x}px, ${contextMenuInfo.y}px, 0)`,
            }}
        >
            <div className="menuItem" onClick={onClickDelete}>
                Delete
            </div>

            {/* <div className="menuItem">Delete</div>

            <div className="separator"></div>

            <div className="menuItem">Delete</div> */}
        </div>
    );
};

export default ContextMenu;
