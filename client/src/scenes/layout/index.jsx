import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { Navbar, Sidebar } from "components";

// Layout
const Layout = () => {
  // is desktop
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  // is sidebar open
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const data = useSelector((state) => state.global.userInfo);
  
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
