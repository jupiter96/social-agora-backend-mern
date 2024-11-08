import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

import { FlexBetween } from ".";

// Stat Box
const StatBox = ({ title, value, increase, icon, description }) => {
  // theme
  const theme = useTheme();
  return (
    <Box
      gridColumn="span 2"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
    >
      <FlexBetween>
        {/* title */}
        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
          {title}
        </Typography>

        {/* icon */}
        {icon}
      </FlexBetween>

      {/* value */}
      <Typography
        variant="h2"
        fontWeight="600"
        sx={{ color: theme.palette.secondary[200] }}
      >
        {value}
      </Typography>

      <FlexBetween gap="1rem">
        {/* increase % */}
        <Typography
          variant="h4"
          fontStyle="italic"
          sx={increase !== 0 ? { color: "green" } : { color: "red" }}
        >
          {increase !== 0 ? "+ ":""}{increase}
        </Typography>

        {/* description */}
        <Typography>{description}</Typography>
      </FlexBetween>
    </Box>
  );
};

export default StatBox;
