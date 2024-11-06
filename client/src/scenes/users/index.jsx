import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, CircularProgress, Dialog, DialogTitle, DialogContent, } from "@mui/material";
import {
  AddCircle,
  Edit,
  Delete
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

import { useGetAllusersQuery, useDeleteUserMutation } from "state/api";
import { Header, FlexMobile, ToastNotification, DataGridCustomToolbar } from "components";
import { useTranslation } from 'react-i18next';
import AddUserModal from './AddUserModal';
import { useSelector } from "react-redux";

const Users = () => {
  
  const theme = useTheme();
  
  const { data, isLoading, refetch } = useGetAllusersQuery();
  const [ deleteUser ] = useDeleteUserMutation();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');
  const [update, setUpdate] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const currentUser = useSelector((state) => state.global.userInfo);

  
  useEffect(() => {
    if (searchInput) {
      const filtered = data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchInput.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchInput, data]);


  const handleClickOpen = () => {
    setUpdate([]);
    setOpen(true);
  };

  const handleClose = () => {
    setStatus(true);
    setOpen(false);
  };
  const hideToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToast(false);
  };
  
  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 0.2,
    },
    {
      field: 'profilePic',
      headerName: t("Avatar"),
      flex: 0.05,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="media"
          style={{ width: '100%', height: 'auto' }}
        />
      ),
    },
    {
      field: "name",
      headerName: t("name"),
      flex: 0.1,
    },
    {
      field: "email",
      headerName: t("email"),
      flex: 0.15,
    },
    {
      field: "level",
      headerName: t("level"),
      flex: 0.05,
    },
    {
      field: "coin",
      headerName: t("coin"),
      flex: 0.05,
    },
    {
      field: "group",
      headerName: t("group"),
      flex: 0.05,
    },
    {
      field: "tournament",
      headerName: t("tournament"),
      flex: 0.05,
    },
    {
      field: "username",
      headerName: t("username"),
      flex: 0.1,
    },
    {
      field: "actions",
      headerName: t("action"),
      flex: 0.2,
      renderCell: (params) => (
        <div>
          <Button 
            onClick={() => handleEdit(params.row)}
            sx={{ color: theme.palette.secondary.light }}
          >
            <Edit color={theme.palette.secondary.light} />
          </Button>
          <Button 
            onClick={() => handleDelete(params.row._id)}
            sx={{ marginLeft: '8px', color: theme.palette.action.delete }}
          >
            <Delete color={theme.palette.action.delete} />
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (row) => {
    setUpdate(row);
    setOpen(true);
  };

  const handleDelete = async(id) => {
    const userConfirmed = window.confirm(t("sure"));

    if (userConfirmed) {
      setProcessing(true);
    try {
      const response = await deleteUser(id).unwrap();
      if(response.error){
        alert(response.error);
      }else{
        console.log("response", response);
        setMessage(t('success'));
        setSeverity('success');
        setShowToast(true);
        refetch();
        setProcessing(false);
      }
    } catch (error) {
      console.log("error", error);
      setProcessing(false);
      setMessage(t('failed'));
      setSeverity('error');
      setShowToast(true);
    }
  }
  };


  useEffect(() => {
    if (status) {
      refetch();
      setStatus(false);
    }
  }, [status, refetch]);

  return (
    <Box m="1.5rem 0.5rem">
      <FlexMobile m="0.5rem 1.5rem">
        <Header title={t("users")} subtitle={t("allusers")} />
        <Box>
        
          <Button
            onClick={handleClickOpen}
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: 50,

              "&:hover": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary.light,
              },
            }}
          >
            <AddCircle sx={{ mr: "10px" }} />
            {t('add')}
          </Button>
        </Box>
      </FlexMobile>
      
      <AddUserModal 
      open={open} 
      onClose={handleClose} 
      update={update} 
      processHandle={setProcessing}
      severityHandle={setSeverity}
      messageHandle={setMessage}
      showToastHandle={setShowToast} />
      
      <Dialog
      open={processing}
      onClose={() => setProcessing(false)}
      sx={{
        backdropFilter: 'blur(5px)',
      }}
    >
      <DialogTitle>{t("processing")}</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100px',
        }}
      >
        <CircularProgress />
      </DialogContent>
    </Dialog>

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
              width: '1200px',
            },
          },
        }}
      >
      
      <DataGrid
          loading={isLoading || !filteredData}
          getRowId={(row) => row._id}
          rows={filteredData ? [...filteredData].reverse() : []}
          columns={columns}
          rowsPerPageOptions={[8, 16, 32, 64]}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          pagination
          page={page}
          rowHeight={80}
          pageSize={pageSize}
          localeText={{
            footerTotalVisibleRows: (visibleCount, totalCount) => 
              `${visibleCount} de ${totalCount}`,
            footerRowSelected: (count) => 
              `${count} fila(s) seleccionada(s)`,
          }}
          autoHeight 
          disableSelectionOnClick
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>
      <ToastNotification open={showToast} message={message} severity={severity} hideToast={hideToast} />
    </Box>
  );
};

export default Users;

    // {
    //   field: "phoneNumber",
    //   headerName: "Phone Number",
    //   flex: 0.5,
    //   renderCell: (params) => {
    //     return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"); // format phone number (123) 456-7890
    //   },
    // },