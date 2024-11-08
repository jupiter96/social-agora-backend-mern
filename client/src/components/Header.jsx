import React from "react";
import { Typography, Box, useTheme } from "@mui/material";

// Header
const Header = ({ title, subtitle }) => {
  // theme
  const theme = useTheme();
  return (
    <Box sx={{
      '@media (max-width: 600px)': {
        textAlign: "center", // Align items to the start for better spacing
      },
    }}>
      {/* Title */}
      <Typography
        variant="h2"
        color={theme.palette.secondary[100]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>

      {/* Subtitle */}
      <Typography variant="h5" color={theme.palette.secondary[300]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
