import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMode } from "state";
import {
  Box,
  Drawer,
  IconButton,
  Menu,
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Select,
  useTheme,
  MenuItem,
  Avatar
} from "@mui/material";
import {
  MenuOpen,
  ChevronRightOutlined,
  HomeOutlined,
  People,
  Wifi,
  LocalFireDepartment,
  // Chat,
  SportsEsports,
  Groups,
  Paid,
  AddAlert,
  Settings
} from "@mui/icons-material";
import {
  LightModeOutlined,
  DarkModeOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import { FlexBetween } from ".";
import logo from "assets/logo_h.png";
import { useTranslation } from 'react-i18next';
import enFlag from "assets/en.png";
import esFlag from "assets/es.png";
import { clearUser } from "state";


// Sidebar
const Sidebar = ({
  user,
  isNonMobile,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  // config
const dispatch = useDispatch();
const [anchorEl, setAnchorEl] = useState(null);
const isOpen = Boolean(anchorEl);

// handle
const handleClick = (event) => setAnchorEl(event.currentTarget);
const handleClose = () => setAnchorEl(null);
const { t, i18n } = useTranslation();
const handleLanguageChange = (event) => {
  i18n.changeLanguage(event.target.value);
};
// Nav items
const navItems = [
  {
    text: "Dashboard",
    title: t("dashboard"),
    icon: <HomeOutlined />,
  },
  {
    text: "Users",
    title: t("users"),
    icon: <People />,
  },
  {
    text: "Feeds",
    title: t("allfeeds"),
    icon: <Wifi />,
  },
  {
    text: "Tournaments",
    title: `${t("tournament")}s`,
    icon: <LocalFireDepartment />,
  },
  // {
  //   text: "Chats",
  //   title: t("chats"),
  //   icon: <Chat />,
  // },
  {
    text: "Games",
    title: t("games"),
    icon: <SportsEsports />,
  },
  {
    text: "Groups",
    title: t("groups"),
    icon: <Groups />,
  },
  {
    text: "Payments",
    title: t("payments"),
    icon: <Paid />,
  },
  {
    text: "Notifications",
    title: t("notification"),
    icon: <AddAlert />,
  },
  {
    text: "Settings",
    title: t("settings"),
    icon: <Settings />,
  },
];
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  // set active path
  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        // Sidebar
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
            "& .MuiDrawer-paper::-webkit-scrollbar": {
              width: 0,
            },
          }}
        >
          <Box width="100%">
            {/* Brand Info */}
            <Box m="1.5rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center"
                    onClick={() => {
                      navigate("/dashboard");
                      setActive("dashboard");
                    }}>
                  <img src={logo} alt="Logo" style={{ width: '100%', cursor: 'pointer' }} />
                </Box>
                {/* Mobile Sidebar Toggle Icon */}
                {!isNonMobile && (
                  <IconButton
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    title="Close Sidebar"
                  >
                    <MenuOpen />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>

            {/* Sidebar items */}
            <List>
              {navItems.map(({ text,title, icon }) => {
                // if (!icon) {
                //   return (
                //     <Typography key={text} sx={{ m: "2rem 0 1rem 2rem" }}>
                //       {title}
                //     </Typography>
                //   );
                // }

                // lowercase text
                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} title={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                        if(!isNonMobile){
                          setIsSidebarOpen(false);
                        }
                      }}
                      sx={{
                        borderRadius: 50,
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      {/* icon */}
                      <ListItemIcon
                        sx={{
                          ml: "1rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>

                      {/* text */}
                      <ListItemText primary={title} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          {!isNonMobile && (
            <>
            <FlexBetween>
              <Select
                value={i18n.language}
                onChange={handleLanguageChange}
                sx={{
                  marginLeft: '20px',
                  border: 'none', // Remove border
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none', // Remove the notched outline
                  },
                  '&:focus': {
                    border: 'none', // Remove border on focus
                    boxShadow: 'none', // Remove box shadow on focus
                  },
                }}
              >
                <MenuItem value="en" style={{flexDirection: 'row'}}><Avatar src={enFlag} sx={{width: 30, height: 30}} />
                </MenuItem>
                <MenuItem value="es" style={{flexDirection: 'row'}}><Avatar src={esFlag} sx={{width: 30, height: 30}} />
                </MenuItem>
              </Select>

              <IconButton 
              sx={{marginRight: '40px'}} 
              onClick={() => dispatch(setMode())} title="Dark Mode">
                {theme.palette.mode === "dark" ? (
                  <DarkModeOutlined sx={{ fontSize: "25px" }} />
                ) : (
                  <LightModeOutlined sx={{ fontSize: "25px" }} />
                )}
              </IconButton>
            </FlexBetween>

            <FlexBetween alignItems={'center'} justifyContent={'center'} width={'100%'} marginTop={'30px'}>
              <Button
                onClick={handleClick}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textTransform: "none",
                  width: '100%',
                  gap: "1rem",
                }}
                title={user.name}
              >
                <Box
                  component="img"
                  alt="profile"
                  src={user.profilePic}
                  height="32px"
                  width="32px"
                  borderRadius="50%"
                  sx={{ objectFit: "cover" }}
                />
                <Box textAlign="left">
                  <Typography
                    fontWeight="bold"
                    fontSize="0.85rem"
                    sx={{ color: theme.palette.secondary[100] }}
                  >
                    {user.name}
                  </Typography>
                  <Typography
                    fontSize="0.75rem"
                    sx={{ color: theme.palette.secondary[200] }}
                  >
                    {user.email}
                  </Typography>
                </Box>
                <ArrowDropDownOutlined
                  sx={{
                    color: theme.palette.secondary[300],
                    fontSize: "25px",
                  }}
                />
              </Button>

              {/* DropDown */}
              <Menu
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                {/* log out */}
                <MenuItem onClick={()=>{alert('sure?');dispatch(clearUser()); localStorage.clear(); window.location.assign('/login')}} title={t('logout')}>
                  {t('logout')}
                </MenuItem>
              </Menu>
            </FlexBetween>
            </>
          )}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
