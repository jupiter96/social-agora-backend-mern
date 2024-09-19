const { styled } = require("@mui/material");
const { Box } = require("@mui/system");

const FlexMobile = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexDirection: "row", // Default to row for desktop
  '@media (max-width: 600px)': {
    flexDirection: "column", // Change to column for mobile
    alignItems: "center", // Align items to the start for better spacing
    gap: 10
  },
}));

export default FlexMobile;
