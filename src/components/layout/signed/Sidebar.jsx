import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { Sidebar as SidebarPS, Menu, SubMenu, MenuItem, menuClasses } from "react-pro-sidebar";

import { colorTokens, useAuth, useApp, useConfig } from "../../../hooks";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlinedIcon from "@mui/icons-material/PieChartOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import TopicOutlinedIcon from "@mui/icons-material/TopicOutlined";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import DragHandleOutlinedIcon from "@mui/icons-material/DragHandleOutlined";
import DisplaySettingsOutlinedIcon from "@mui/icons-material/DisplaySettingsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined';

// hex to rgba converter
// pakai rgba agar bisa set transparansi
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem active={selected === title} onClick={() => setSelected(title)} icon={icon} component={<Link to={to} />}>
      {title}
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();

  const { user } = useAuth();
  const colors = colorTokens;

  const { sidebar, setSidebar } = useApp();
  const { WBMS } = useConfig();

  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);

  const themes = {
    light: {
      sidebar: {
        backgroundColor: theme.palette.neutral.light,
        color: theme.palette.neutral.main,
      },
      menu: {
        menuContent: {
          backgroundColor: "transparent",
          color: theme.palette.neutral.main,
        },
        submenuContent: {
          backgroundColor: theme.palette.neutral[900],
          color: theme.palette.neutral.main,
        },
        icon: {
          backgroundColor: "transparent",
          color: theme.palette.neutral.main,
        },
        active: {
          backgroundColor: theme.palette.secondary[300],
          color: theme.palette.neutral.main,
          iconColor: theme.palette.neutral.main,
        },
        hover: {
          backgroundColor: theme.palette.secondary[700],
          color: theme.palette.secondary[200],
          iconColor: theme.palette.secondary[200],
        },
        disabled: {
          color: "#9fb6cf",
          iconColor: theme.palette.secondary[900],
        },
      },
    },
    dark: {
      sidebar: {
        backgroundColor: theme.palette.neutral.light,
        color: theme.palette.neutral.main,
      },
      menu: {
        menuContent: {
          backgroundColor: "transparent",
          color: theme.palette.neutral.main,
        },
        submenuContent: {
          backgroundColor: theme.palette.neutral[900],
          color: theme.palette.neutral.main,
        },
        icon: {
          backgroundColor: "transparent",
          color: theme.palette.neutral.main,
        },
        active: {
          backgroundColor: theme.palette.secondary[300],
          color: theme.palette.neutral.main,
          iconColor: theme.palette.neutral.main,
        },
        hover: {
          backgroundColor: theme.palette.secondary[700],
          color: theme.palette.secondary[200],
          iconColor: theme.palette.secondary[200],
        },
        disabled: {
          color: "#3e5e7e",
          iconColor: theme.palette.secondary[900],
        },
      },
    },
  };

  const menuItemStyles = {
    root: {
      fontSize: "13px",
      fontWeight: 600,
      backgroundColor: themes[theme.palette.mode].menu.menuContent.backgroundColor,
      color: themes[theme.palette.mode].menu.menuContent.color,
      // padding: "5px 35px 5px 20px",
    },
    icon: {
      color: themes[theme.palette.mode].menu.icon.color,
      [`&.${menuClasses.active}`]: {
        color: themes[theme.palette.mode].menu.active.iconColor,
      },
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme.palette.mode].menu.disabled.iconColor,
      },
    },
    SubMenuExpandIcon: {
      color: themes[theme.palette.mode].menu.menuContent.color,
    },
    subMenuContent: ({ level }) => ({
      backgroundColor: themes[theme.palette.mode].menu.submenuContent.backgroundColor,
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme.palette.mode].menu.disabled.color,
      },
      [`&.${menuClasses.active}`]: {
        backgroundColor: themes[theme.palette.mode].menu.active.backgroundColor,
        color: themes[theme.palette.mode].menu.active.color,
        fontWeight: 600,
      },
      "&:hover": {
        backgroundColor: hexToRgba(themes[theme.palette.mode].menu.hover.backgroundColor, 1),
        color: themes[theme.palette.mode].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  const setSelected = (title) => {
    setSidebar({ selected: title });
  };

  return (
    <Box display="flex" height="calc(100vh - 64px)">
      <SidebarPS
        collapsed={sidebar.isCollapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        breakPoint="md"
        backgroundColor={hexToRgba(themes[theme.palette.mode].sidebar.backgroundColor, 1)}
        // backgroundColor={theme.palette.neutral.light}
        rootStyles={{
          color: themes[theme.palette.mode].sidebar.color,
        }}
        style={{
          height: "100%",
          top: "auto",
        }}
      >
        {/* <div style={{ display: "flex", flexDirection: "column", height: "100%" }}> */}
        <Menu iconShape="square" menuItemStyles={menuItemStyles}>
          {/* LOGO AND MENU ICON */}
          {/* <MenuItem icon={sidebar.isCollapsed ? <MenuOutlinedIcon /> : undefined} onClick={setIsCollapsed}>
            {!sidebar.isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                <Typography variant="h3" fontWeight={700} color={colors.grey[100]}>
                  WBMS
                </Typography>
                <IconButton sx={{ color: colors.grey[100] }} onClick={setIsCollapsed}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem> */}

          <Box sx={styles.avatarContainer}>
            {/* <Box display="flex" justifyContent="center" alignItems="center"> */}
            <Avatar src={require("../../../assets/images/photo/profile.png")} sx={styles.avatar}>
              SN
            </Avatar>
            {/* </Box> */}
            {!sidebar.isCollapsed && (
              <Box textAlign="center">
                <Typography variant="h3" color={colors.grey[400]} fontWeight="bold" sx={{ m: "10px 0 0 0" }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color={colors.grey[500]} fontWeight={600} letterSpacing="0.5px">
                  {`${user.position} - ${user.division}`}
                </Typography>
              </Box>
            )}
          </Box>

          {/* MENU ITEMS */}
          <Box paddingLeft={sidebar.isCollapsed ? undefined : "0%"}>
            <Item
              title="Dashboard"
              to="/wb"
              icon={<HomeOutlinedIcon />}
              selected={sidebar.selected}
              setSelected={setSelected}
            />
            {WBMS.SITE_TYPE === 1 && (
              <Item
                title="Transaksi WB PKS"
                to="/wb/transactions"
                icon={<LocalShippingOutlinedIcon />}
                selected={sidebar.selected}
                setSelected={setSelected}
              />
            )}
            {WBMS.SITE_TYPE === 2 && (
              <Item
                title="Transaksi WB T30"
                to="/wb/transactions"
                icon={<LocalShippingOutlinedIcon />}
                selected={sidebar.selected}
                setSelected={setSelected}
              />
            )}
            {WBMS.SITE_TYPE === 3 && (
              <Item
                title="Transaksi WB Bulking"
                to="/wb/transactions"
                icon={<LocalShippingOutlinedIcon />}
                selected={sidebar.selected}
                setSelected={setSelected}
              />
            )}

            {/* <Item
              title="Approval Request"
              to="#"
              icon={<ContactsOutlinedIcon />}
              selected={sidebar.selected}
              setSelected={setSelected}
            /> */}
            <SubMenu label="Laporan" icon={<BarChartOutlinedIcon />}>
              <Item
                title="Transaksi Harian"
                to="reports/transactions-daily"
                icon={<ArrowRightOutlinedIcon />}
                selected={sidebar.selected}
                setSelected={setSelected}
              />
            </SubMenu>
            {(user.role === 5 || user.role === 6) && (
              <SubMenu label="Master Data" icon={<TopicOutlinedIcon />}>
                {/* <Item
                  title="Countries"
                  to="md/countries"
                  icon={<ArrowRightOutlinedIcon />}
                  selected={sidebar.selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Provices"
                  to="md/provinces"
                  icon={<ArrowRightOutlinedIcon />}
                  selected={sidebar.selected}
                  setSelected={setSelected}
                />
                <Item
                  title="City"
                  to="md/cities"
                  icon={<ArrowRightOutlinedIcon />}
                  selected={sidebar.selected}
                  setSelected={setSelected}
                /> */}
                <Item
                  title="Products"
                  to="md/products"
                  icon={<ArrowRightOutlinedIcon />}
                  selected={sidebar.selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Sites"
                  to="md/sites"
                  icon={<ArrowRightOutlinedIcon />}
                  selected={sidebar.selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Storage Tanks"
                  to="md/storage-tanks"
                  icon={<ArrowRightOutlinedIcon />}
                  selected={sidebar.selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Transport Vehicles"
                  to="md/transport-vehicles"
                  icon={<ArrowRightOutlinedIcon />}
                  selected={sidebar.selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Companies"
                  to="md/companies"
                  icon={<ArrowRightOutlinedIcon />}
                  selected={sidebar.selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Drivers"
                  to="md/drivers"
                  icon={<ArrowRightOutlinedIcon />}
                  selected={sidebar.selected}
                  setSelected={setSelected}
                />
              </SubMenu>
            )}
            {(user.role === 5 || user.role === 6) && (
              <SubMenu label="Kualitas" icon={<DvrOutlinedIcon />}>
                <Item
                  title="CPO"
                  to="kualitas/cpo"
                  icon={<ArrowRightOutlinedIcon />}
                  selected={sidebar.selected}
                  setSelected={setSelected}
                />
              </SubMenu>
            )}

            {(user.role === 5 || user.role === 6) && (
              <SubMenu label="Administrasi" icon={<DisplaySettingsOutlinedIcon />}>
                <Item
                  title="Config"
                  to="/wb/administration/configs/1"
                  icon={<SettingsOutlinedIcon />}
                  selected={sidebar.selected}
                  setSelected={setSelected}
                />
                <SubMenu label="User Management" icon={<PeopleOutlinedIcon />}>
                  <Item
                    title="User List"
                    to="administration/users"
                    icon={<ArrowRightOutlinedIcon />}
                    selected={sidebar.selected}
                    setSelected={setSelected}
                  />
                </SubMenu>
              </SubMenu>
            )}
          </Box>
        </Menu>
        {/* </div> */}
      </SidebarPS>
    </Box>
  );
};

/** @type {import("@mui/material").SxProps} */
const styles = {
  avatarContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    mt: 2,
    mb: 2,
  },
  avatar: {
    width: "50%",
    height: "auto",
  },
};

export default Sidebar;
