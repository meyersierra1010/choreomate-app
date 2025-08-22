import React from "react";
import Meta from "components/Meta";
import MusicsSection from "components/MusicsSection";
import { requireAuth } from "util/auth";

function DashboardPage(props) {
    return (
        <>
            <Meta title="Your Musics" />

            <MusicsSection
                bg="white"
                textColor="dark"
                size="md"
                bgImage=""
                bgImageOpacity={1}
                title="Your Musics"
                subtitle=""
            />
        </>
    );
}

export default requireAuth(DashboardPage);
