import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Topbar from "./Topbar";

const LayoutPublic = () => {
  return (
    <Box>
      <Topbar />
      <Box sx={styles.container}>
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
    bgcolor: "neutral.light",
    // height: "calc(100% - 64px)",
    // height: "93.1vh",
    height: `calc(100vh - 64px)`,
  },
  main: {
    p: 1,
    width: "100%",
    height: "100%",
    overflow: "auto",
  },
};

export default LayoutPublic;
