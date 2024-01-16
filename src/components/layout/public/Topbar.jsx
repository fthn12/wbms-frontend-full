import { useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography, useTheme as useThemeMUI } from "@mui/material";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";

import { useTheme, useApp } from "../../../hooks";

const Topbar = () => {
  const navigate = useNavigate();

  const { toggleColorMode } = useApp();

  const theme = useThemeMUI();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={styles.appBar}>
        <Toolbar>
          <Box
            display="flex"
            component="img"
            sx={styles.appLogo}
            src={require("../../../assets/images/logo_small_white.png")}
            onClick={() => navigate("/")}
          />
          <Typography
            // variant="h3"
            component="a"
            href="/"
            fontWeight="bold"
            fontSize="clamp(1rem, 1.75rem, 2rem)"
            color="inherit"
            sx={{
              ml: 2,
              display: { xs: "none", md: "block" },
              letterSpacing: ".3rem",
              textDecoration: "none",
              "&:hover": {
                // color: neutralLight,
                cursor: "pointer",
              },
            }}
          >
            DSN WBMS
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* <IconButton size="small" onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === "light" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton> */}

          <Tooltip title="Sign in to DSN WBMS">
            <IconButton color="secondary" onClick={() => navigate("/signin")}>
              <LoginOutlinedIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

/** @type {import("@mui/material").SxProps} */
const styles = {
  appBar: {
    bgcolor: "primary.main",
  },
  appLogo: {
    display: "flex",
    mr: 1,
    borderRadius: 1,
    width: 36,
    height: 36,
    cursor: "pointer",
  },
};

export default Topbar;
