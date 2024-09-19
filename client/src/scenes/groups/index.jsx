import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, CircularProgress, Dialog, DialogTitle, DialogContent, } from "@mui/material";
import {
  AddCircle,
  Edit,
  Delete
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

import { useGetAllGroupsQuery, useDeleteGroupMutation } from "state/api";
import { Header, FlexMobile, ToastNotification } from "components";
import { useTranslation } from 'react-i18next';
import AddGroupModal from './AddGroupModal';

const Groups = () => {
  
  const theme = useTheme();
  
  const { data, isLoading, refetch } = useGetAllGroupsQuery();
  const [ deleteGroup ] = useDeleteGroupMutation();
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
      flex: 0.5,
    },
    {
      field: "group_name",
      headerName: t("name"),
      flex: 0.5,
    },
    {
      field: 'imgUrl',
      headerName: t("media"),
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="media"
          style={{ width: '80px', height: 'auto', padding: '10px' }}
        />
      ),
    },
    {
      field: "adminUser",
      headerName: t("admin"),
      flex: 0.5,
    },
    {
      field: "game",
      headerName: t("game"),
      flex: 0.5,
    },
    {
      field: "description",
      headerName: t("description"),
      flex: 0.5,
    },
    {
      field: 'members',
      headerName: t("member"),
      flex: 0.2,
      renderCell: (params) => (
        <h4>{params.value?.length || 0}</h4>
      ),
    },
    {
      field: "actions",
      headerName: t("action"),
      flex: 0.5,
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
          const response = await deleteGroup(id).unwrap();
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
        <Header title={`${t("group")}s`} subtitle={t("allGroups")} />
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

      <AddGroupModal 
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
          justifyItems: 'center',
          alignItems: 'center',
          margin: 'auto',
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
              minWidth: '1260px',
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
      <ToastNotification open={showToast} message={message} severity={severity} hideToast={hideToast} />
    </Box>
  );
};

export default Groups;
