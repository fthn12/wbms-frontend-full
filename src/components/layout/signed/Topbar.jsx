import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { alpha } from "@mui/material/styles";
import { AppBar, Avatar, Box, Divider, IconButton } from "@mui/material";
import { InputBase, Toolbar, Tooltip, Typography, useTheme } from "@mui/material";
import { Menu, MenuItem, Badge } from "@mui/material";

import { AuthAPI } from "../../../apis";
import { useApp, useAuth } from "../../../hooks";

import MenuIcon from "@mui/icons-material/Menu";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MoreIcon from "@mui/icons-material/MoreVert";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";

const Topbar = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  // const neutralLight = theme.palette.neutral.light;
  // const dark = theme.palette.neutral.dark;
  // const background = theme.palette.background.default;
  // const primaryLight = theme.palette.primary.light;
  // const alt = theme.palette.background.alt;

  const authAPI = AuthAPI();

  const { themeMode, sidebar, setSidebar, toggleColorMode } = useApp();
  const { clearCredentials } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isAccountMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const setIsCollapsed = () => {
    setSidebar({ isCollapsed: !sidebar.isCollapsed });
  };

  const handleAccountMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleSignOut = async (e) => {
    try {
      await authAPI.Signout();
    } catch (err) {
      // toast.error(err?.message || "Error in processing signout..!!");
    }

    clearCredentials();
    navigate("/", { replace: true });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={styles.appBar}>
        <Toolbar>
          <IconButton edge="start" onClick={setIsCollapsed} color="secondary">
            <MenuIcon sx={{ fontSize: "20px" }} />
          </IconButton>
          <Box
            display="flex"
            component="img"
            sx={styles.appLogo}
            src={require("../../../assets/images/logo_small_white.png")}
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

          {/* <Box sx={styles.searchWrapper}>
            <Box sx={styles.searchIcon}>
              <SearchOutlinedIcon />
            </Box>
            <InputBase placeholder="Search…" fullWidth sx={styles.searchInput} />
          </Box> */}

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {/* <IconButton onClick={toggleColorMode}>
              {themeMode === "light" ? (
                <LightModeIcon sx={{ fontSize: "20px", color: primaryLight }} />
              ) : (
                <DarkModeIcon sx={{ fontSize: "20px" }} />
              )}
            </IconButton> */}
            {/* <IconButton size="small" color="secondary">
              <Badge badgeContent={4} color="error">
                <MailOutlineOutlinedIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" color="secondary">
              <Badge badgeContent={17} color="error">
                <NotificationsNoneOutlinedIcon />
              </Badge>
            </IconButton>*/}
            <IconButton color="secondary">
              <SettingsOutlinedIcon sx={{ fontSize: "20px" }} />
            </IconButton>
            <Tooltip title="Account Settings">
              <IconButton
                size="small"
                color="secondary"
                onClick={handleAccountMenuOpen}
                aria-controls={isAccountMenuOpen ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={isAccountMenuOpen ? "true" : undefined}
              >
                <Avatar sx={{ width: 36, height: 36 }} src={require("../../../assets/images/photo/profile.png")}>
                  SN
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="small"
              color="secondary"
              onClick={handleMobileMenuOpen}
              aria-label="show more"
              aria-controls={isMobileMenuOpen ? "mobile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={isMobileMenuOpen ? "true" : undefined}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={isAccountMenuOpen}
        onClose={handleAccountMenuClose}
        onClick={handleAccountMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleAccountMenuClose}>
          <Avatar /> My Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleAccountMenuClose}>
          <ListItemIcon>
            <SettingsOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSignOut();
            handleAccountMenuClose();
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Signout
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={mobileMoreAnchorEl}
        id="mobile-menu"
        open={isMobileMenuOpen}
        onClick={handleMobileMenuClose}
        onClose={handleMobileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleMobileMenuClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleMobileMenuClose}>
          <ListItemIcon>
            <SettingsOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMobileMenuClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Signout
        </MenuItem>
      </Menu>
    </Box>
  );
};

/** @type {import("@mui/material").SxProps} */
const styles = {
  appBar: {
    bgcolor: "primary",
    position: "sticky",
    boxShadow: "none",
  },
  appLogo: {
    display: "flex",
    ml: 1,
    borderRadius: 1,
    width: 36,
    height: 36,
    cursor: "pointer",
  },
  searchWrapper: {
    position: "relative",
    mr: 2,
    borderRadius: 1,
    backgroundColor: alpha("#ffffff", 0.15),
    "&:hover": {
      backgroundColor: alpha("#ffffff", 0.25),
    },

    width: "100%",
  },
  searchIcon: {
    pl: 2,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    color: "inherit",
    "& .MuiInputBase-input": {
      p: 1,
      pl: 6,
      width: "100%",
    },
  },
};

export default Topbar;
