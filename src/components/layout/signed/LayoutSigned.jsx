import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const LayoutSigned = () => {
  return (
    <Box>
      <Topbar />
      <Box sx={styles.container}>
        <Sidebar />
        <Box component="main" sx={styles.main}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

/** @type {import("@mui/material").SxProps} */
const styles = {
  container: {
    display: "flex",
    backgroundColor: "neutral.medium",
    // height: "calc(100% - 64px)",
    height: `calc(100vh - 64px)`,
  },
  main: {
    p: 2,
    width: "100%",
    height: "100%",
    overflow: "auto",
  },
};

export default LayoutSigned;
