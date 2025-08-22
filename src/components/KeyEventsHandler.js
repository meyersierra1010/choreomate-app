import { useEffect } from "react";

export const KeyEventsHandler = () => {
    const onKeyDown = (event) => {
        // event.preventDefault();

        if (event.code === "Space") {
            document.getElementById("playBtn").click();
        } else if (event.code === "Delete") {
            document.getElementById("removeVideoBtn").click();
        }
    };

    useEffect(() => {
        document.body.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    return null;
};

export default KeyEventsHandler;
