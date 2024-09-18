import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, CircularProgress, Dialog, DialogTitle, DialogContent, Tabs, Tab } from "@mui/material";
import {
  AddCircle,
  Edit,
  Visibility,
  Delete
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

import { useGetAllTournamentsQuery, useDeleteTournamentMutation } from "state/api";
import { Header, FlexBetween, ToastNotification } from "components";
import { useTranslation } from 'react-i18next';
import AddTournamentModal from './AddTournamentModal';

const Tournaments = () => {
  
  const theme = useTheme();
  
  const { data, isLoading, refetch } = useGetAllTournamentsQuery();
  const [ deleteTournament ] = useDeleteTournamentMutation();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');
  const [update, setUpdate] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
    setUpdate([]);
  };

  const handleView = () => {
    setOpen(true);
    setUpdate([]);
  };

  const handleClose = () => {
    setStatus(true);
    setOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
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
      field: "title",
      headerName: t("title"),
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
      field: "type",
      headerName: t("type"),
      flex: 0.5,
    },
    {
      field: "fee",
      headerName: t("fee"),
      flex: 0.5,
    },
    {
      field: "reward",
      headerName: t("reward"),
      flex: 0.5,
    },
    
    {
      field: 'start_time',
      headerName: t("startTime"),
      flex: 0.4,
      renderCell: (params) => (
        <h4>{params.value?.split("T")[0]} {params.value?.split("T")[0].split(".")[0]}</h4>
      ),
    },
    
    {
      field: 'end_time',
      headerName: t("endTime"),
      flex: 0.4,
      renderCell: (params) => (
        <h4>{params.value?.split("T")[0]} {params.value?.split("T")[0].split(".")[0]}</h4>
      ),
    },
    {
      field: "status",
      headerName: t("status"),
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: t("action"),
      flex: 0.5,
      renderCell: (params) => (
        <div>
        <Button 
          onClick={() => handleView(params.row)}
          sx={{ color: theme.palette.background.light }}
        >
          <Visibility color={theme.palette.background.light} />
        </Button>
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
          const response = await deleteTournament(id).unwrap();
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
        <Header title={`${t("tournament")}s`}/>
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
      </FlexBetween>

      <AddTournamentModal 
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
      
    <Tabs value={currentTab}
     onChange={handleTabChange}
     sx={{
      '& .MuiTab-root': {
        fontSize: '16px',
        color: theme.palette.secondary.light,
        backgroundColor: 'transparent',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px'
      },
      '& .Mui-selected': {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.background.alt,
      },
    }}>
      <Tab label={t('allTournaments')} />
      <Tab label={t('liveTournaments')} />
      <Tab label={t('upTournaments')} />
      <Tab label={t('comTournaments')} />
    </Tabs>

    {currentTab === 0 && (
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
        />
      </Box>
    )}
    {currentTab === 1 && (
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
      }}
    >
      
      <DataGrid
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
      />
    </Box>
    )}
    {currentTab === 2 && (
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
      />
    </Box>
    )}
    {currentTab === 3 && (
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
      />
    </Box>
    )}
      <ToastNotification open={showToast} message={message} severity={severity} hideToast={hideToast} />
    </Box>
  );
};

export default Tournaments;
