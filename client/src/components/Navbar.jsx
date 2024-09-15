import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setMode } from "state";
import {
  AppBar,
  useTheme,
  Toolbar,
  Menu,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Select,
  MenuItem,
  Avatar
} from "@mui/material";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  ArrowDropDownOutlined,
} from "@mui/icons-material";

import { FlexBetween } from ".";
import enFlag from "assets/en.png";
import esFlag from "assets/es.png";
import { useTranslation } from 'react-i18next';
import { clearUser } from "state";

// Navbar
const Navbar = ({ user, isNonMobile, isSidebarOpen, setIsSidebarOpen }) => {
  // redux dispatch items
  const dispatch = useDispatch();
  // theme
  const theme = useTheme();

  // nav state
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  // handle
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const { t, i18n } = useTranslation();

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left Side */}
        <FlexBetween>
          {/* Sidebar Menu */}
          <IconButton
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title="Toggle Sidebar"
          >
            <MenuIcon />
          </IconButton>

          {/* Search */}
          <FlexBetween
            backgroundColor={theme.palette.background.alt}
            borderRadius="59px"
            gap="1rem"
            p="0.1rem 1.5rem"
            title="Search"
          >
            <InputBase placeholder={`${t('search')}...`} />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        {/* Right Side */}
        {isNonMobile && (<FlexBetween gap="1.5rem">
          {/* Source Code */}
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            sx={{
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

          {/* Dark/Light Mode */}
          <IconButton onClick={() => dispatch(setMode())} title="Dark Mode">
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>

          {/* User */}
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
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
              <MenuItem onClick={()=>{dispatch(clearUser()); localStorage.clear(); window.location.assign('/login')}} title={t('logout')}>
                {t('logout')}
              </MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>)}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
