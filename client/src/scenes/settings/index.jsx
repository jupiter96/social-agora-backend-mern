import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, CircularProgress, Dialog, DialogTitle, DialogContent, } from "@mui/material";
import {
  AddCircle,
  Edit,
  Delete
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

import { useGetAllFeedsQuery, useDeleteFeedMutation } from "state/api";
import { Header, FlexBetween, ToastNotification } from "components";
import { useTranslation } from 'react-i18next';

const Settings = () => {
  
  const theme = useTheme();
  
  const { data, isLoading, refetch } = useGetAllFeedsQuery();
  const [ deleteFeed ] = useDeleteFeedMutation();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');
  const [update, setUpdate] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
    setUpdate([]);
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
      field: "text",
      headerName: t("text"),
      flex: 0.5,
    },
    {
      field: 'img',
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
      field: "postedBy",
      headerName: t("postedby"),
      flex: 0.5,
    },
    
    {
      field: 'likes',
      headerName: t("likes"),
      flex: 0.2,
      renderCell: (params) => (
        <h4>{params.value?.length}</h4>
      ),
    },
    
    {
      field: 'replies',
      headerName: t("replies"),
      flex: 0.2,
      renderCell: (params) => (
        <h4>{params.value?.length}</h4>
      ),
    },
    
    {
      field: 'createdAt',
      headerName: t("createdAt"),
      flex: 0.4,
      renderCell: (params) => (
        <h4>{params.value?.split("T")[0]}</h4>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <div>
          <Button 
            onClick={() => handleEdit(params.row)}
            sx={{ color: theme.palette.background.light }}
          >
            <Edit color={theme.palette.background.light} />
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
          const response = await deleteFeed(id).unwrap();
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
      <FlexBetween m="0.5rem 1.5rem">
        <Header title={`${t("setting")}s`} />
        <Box>
        </Box>
      </FlexBetween>
      
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
              minWidth: '960px',
            },
          },
        }}
      >
        
        {/* <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data ? data : []}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8, 16, 32, 64]}
          localeText={{
            footerTotalVisibleRows: (visibleCount, totalCount) => 
              `${visibleCount} de ${totalCount}`,
            footerRowSelected: (count) => 
              `${count} fila(s) seleccionada(s)`,
          }}
          autoHeight 
          disableSelectionOnClick 
        /> */}
      </Box>
      <ToastNotification open={showToast} message={message} severity={severity} hideToast={hideToast} />
    </Box>
  );
};

export default Settings;
