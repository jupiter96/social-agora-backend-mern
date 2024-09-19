import React from "react";
import { Search } from "@mui/icons-material";
import { IconButton, TextField, InputAdornment } from "@mui/material";
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";

import FlexBetween from "./FlexBetween";
import { useTranslation } from 'react-i18next';


// Data Grid toolbar
const DataGridCustomToolbar = ({ searchInput, setSearchInput, setSearch }) => {
  const { t } = useTranslation();
  return (
    <GridToolbarContainer>
      <FlexBetween width="100%">
        {/* Left Side */}
        <FlexBetween>
          <GridToolbarColumnsButton title={t("columns")} />
          <GridToolbarDensitySelector title={t("density")} />
          <GridToolbarExport />
        </FlexBetween>

        {/* Right Side (search) */}
        <TextField
          label={t("search")}
          sx={{ mb: "0.5rem", width: "15rem" }}
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          variant="standard"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setSearch(searchInput);
                    setSearchInput("");
                  }}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FlexBetween>
    </GridToolbarContainer>
  );
};

export default DataGridCustomToolbar;
