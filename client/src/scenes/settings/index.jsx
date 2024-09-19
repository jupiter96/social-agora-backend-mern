import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, CircularProgress, Dialog, DialogTitle, DialogContent, Tabs, Tab } from "@mui/material";
import {
  AddCircle,
  Edit,
  // Visibility,
  Delete
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

import { useGetAllBannersQuery, useDeleteBannerMutation } from "state/api";
import { Header, FlexMobile, ToastNotification } from "components";
import { useTranslation } from 'react-i18next';
import AddBannerModal from './AddBannerModal';

const Settings = () => {
  
  const theme = useTheme();
  
  const { data, isLoading, refetch } = useGetAllBannersQuery();
  const [ deleteBanner ] = useDeleteBannerMutation();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');
  const [update, setUpdate] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);

  const handleClickOpen = () => {
    setUpdate([]);
    setOpen(true);
  };

  // const handleView = () => {
  //   setOpen(true);
  //   setUpdate([]);
  // };

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
      flex: 0.2,
    },
    {
      field: "title",
      headerName: t("title"),
      flex: 0.2,
    },
    {
      field: 'imgUrl',
      headerName: t("media"),
      flex: 0.3,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="media"
          style={{ width: '180px', height: 'auto', padding: '4px' }}
        />
      ),
    },
    {
      field: "actions",
      headerName: t("action"),
      flex: 0.3,
      renderCell: (params) => (
        <Box sx={{
          flexDirection: 'row',
          gap: 10
        }}>
        {/* <Button 
          onClick={() => handleView(params.row)}
          sx={{ color: theme.palette.secondary.light, width: '25%' }}
        >
          <Visibility color={theme.palette.secondary.light} />
        </Button> */}
          <Button 
            onClick={() => handleEdit(params.row)}
            sx={{ color: theme.palette.secondary.light, width: '45%' }}
          >
            <Edit color={theme.palette.secondary.light} />
          </Button>
          <Button 
            onClick={() => handleDelete(params.row._id)}
            sx={{ marginLeft: '8px', color: theme.palette.action.delete, width: '45%' }}
          >
            <Delete color={theme.palette.action.delete} />
          </Button>
        </Box>
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
          const response = await deleteBanner(id).unwrap();
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
        <Header title={`${t("setting")}s`}/>
      </FlexMobile>

      <AddBannerModal 
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
      
    <Tabs
      value={currentTab}
      onChange={handleTabChange}
      sx={{
        overflowX: 'auto',
        display: 'flex',
        flexWrap: 'nowrap', // Prevent wrapping of tabs
        '& .MuiTab-root': {
          fontSize: { xs: '14px', sm: '16px' }, // Responsive font size
          color: theme.palette.secondary.light,
          backgroundColor: 'transparent',
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px',
          minWidth: '120px', // Ensure minimum width for touch targets
          padding: '10px', // Adjust padding for better touch area
        },
        '& .Mui-selected': {
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.background.alt,
        },
      }}
    >
      <Tab label={t('bannerImage')} />
      <Tab label={t('setting1')} />
      <Tab label={t('setting2')} />
    </Tabs>

    {currentTab === 0 && (
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
        
      <FlexMobile m="0.5rem 1.5rem">
        <Header subtitle={`${t("bannerImage")}s`}/>
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
          rowHeight={150}
        />
      </Box>
    )}
    {currentTab === 1 && (
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
      
    </Box>
    )}
    {currentTab === 2 && (
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
    </Box>
    )}
      <ToastNotification open={showToast} message={message} severity={severity} hideToast={hideToast} />
    </Box>
  );
};

export default Settings;
