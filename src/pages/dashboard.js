import React from "react";
import Meta from "components/Meta";
import DashboardSection from "components/DashboardSection";
import { requireAuth } from "util/auth";

function DashboardPage(props) {
  return (
    <>
      <Meta title="Your Projects" />
      <DashboardSection
        bg="white"
        textColor="dark"
        size="md"
        bgImage=""
        bgImageOpacity={1}
        title="Your Projects"
        subtitle=""
      />
    </>
  );
}

export default requireAuth(DashboardPage);
