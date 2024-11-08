import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { Navbar, Sidebar } from "components";
import { isMobile, isTablet, isDesktop } from 'react-device-detect';

// Layout
const Layout = () => {
  // is desktop
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  // is sidebar open
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const data = useSelector((state) => state.global.userInfo);
  useEffect(()=>{
    if(isMobile || isTablet){
      setIsSidebarOpen(false);
    }else if(isDesktop){
      setIsSidebarOpen(true);
    }
  },[])
  
  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      {/* Sidebar */}
      <Sidebar
        user={data || {}}
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Navbar */}
      <Box flexGrow={1}>
        <Navbar
          user={data || {}}
          isNonMobile={isNonMobile}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
