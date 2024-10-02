import React, {useState} from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { useGetAllPaymentsQuery, useGetAllusersQuery } from "state/api";
import { Header, FlexMobile } from "components";
import { useTranslation } from 'react-i18next';

const Payments = () => {
  
  const theme = useTheme();
  
  const { data, isLoading } = useGetAllPaymentsQuery();
  const { data: getAllusers } = useGetAllusersQuery();
  const userData = getAllusers;
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "user",
      headerName: t("user"),
      flex: 0.5,
      renderCell: (params) => (
        <p>{userData?.filter((item)=>item._id === params.value)[0]?.username}</p>
      ),
    },
    {
      field: "amount",
      headerName: t("amount"),
      flex: 0.5,
    },
    {
      field: "plan",
      headerName: t("plan"),
      flex: 0.5,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.3,
      renderCell: (params) => {
        let badgeStyle = {
          borderRadius: '12px',
          padding: '5px 10px',
          color: 'white',
          display: 'inline-block',
          width: '80%',
          textAlign: 'center'
        };
  
        if (params.value === 'Completed') {
          badgeStyle.backgroundColor = '#04af21';
        } else if (params.value === 'Failed') {
          badgeStyle.backgroundColor = '#ee2222';
        } else {
          badgeStyle.backgroundColor = 'gray'; // Default color for other statuses
        }
  
        return (
          <div style={badgeStyle}>
            {params.value}
          </div>
        );
      },
    },
  ];
  return (
    <Box m="1.5rem 0.5rem">
      <FlexMobile m="0.5rem 1.5rem">
        <Header title={`${t("payment")}s`} subtitle={t("allPayment")} />
        <Box>
        </Box>
      </FlexMobile>
      
      <Box
        mt="40px"
        mb="50px"
        sx={{
          overflowX: 'auto',
          width: '100%',
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
          '@media (max-width: 600px)': {
            '& .MuiDataGrid-root': {
              minWidth: '960px',
            },
          },
        }}
      >
        
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data ? [...data].reverse() : []}
          columns={columns}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          pagination
          page={page}
          pageSize={pageSize}
          rowsPerPageOptions={[8, 16, 32, 64]}
          localeText={{
            footerTotalVisibleRows: (visibleCount, totalCount) => 
              `${visibleCount} de ${totalCount}`,
            footerRowSelected: (count) => 
              `${count} fila(s) seleccionada(s)`,
          }}
          autoHeight 
          disableSelectionOnClick 
        />
      </Box>
    </Box>
  );
};

export default Payments;
