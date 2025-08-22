import React from "react";
import Meta from "components/Meta";
import VideosSection from "components/VideosSection";
import { requireAuth } from "util/auth";

function DashboardPage(props) {
    return (
        <>
            <Meta title="Your Videos" />
            <VideosSection
                bg="white"
                textColor="dark"
                size="md"
                bgImage=""
                bgImageOpacity={1}
                title="Your Videos"
                subtitle=""
            />
        </>
    );
}

export default requireAuth(DashboardPage);
