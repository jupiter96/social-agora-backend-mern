import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, CircularProgress, Dialog, DialogTitle, DialogContent, Tabs, Tab } from "@mui/material";
import {
  AddCircle,
  Edit,
  EmojiEvents,
  Delete
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

import { useGetAllTournamentsQuery, useDeleteTournamentMutation, useGetAllusersQuery } from "state/api";
import { Header, FlexMobile, ToastNotification } from "components";
import { useTranslation } from 'react-i18next';
import AddTournamentModal from './AddTournamentModal';
import badge1 from '../../assets/b1.png';
import badge2 from '../../assets/b2.png';
import badge3 from '../../assets/b3.png';
import badge4 from '../../assets/b4.png';
import badge5 from '../../assets/b5.png';
import badge6 from '../../assets/b6.png';

const Tournaments = () => {
  
  const theme = useTheme();
  
  const { data, isLoading, refetch } = useGetAllTournamentsQuery();
  const { data: getAllusers} = useGetAllusersQuery();
  const userdata = getAllusers ? [...getAllusers] : [];
  console.log("userdata", userdata);
  const [ deleteTournament ] = useDeleteTournamentMutation();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resultView, setResultView] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');
  const [update, setUpdate] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [liveList, setLiveList] = useState([]);
  const [upList, setUpList] = useState([]);
  const [comList, setComList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);

  const badges = [badge1, badge2, badge3, badge4, badge5, badge6];

  const handleClickOpen = () => {
    setUpdate(null);
    setOpen(true);
  };

  const handleView = (row) => {
    setUpdate(row);
    setResultView(true);
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
      flex: 0.05,
    },
    {
      field: "title",
      headerName: t("title"),
      flex: 0.1,
    },
    {
      field: 'imgUrl',
      headerName: t("media"),
      flex: 0.1,
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
      flex: 0.05,
    },
    {
      field: "type",
      headerName: t("type"),
      flex: 0.05,
    },
    {
      field: "fee",
      headerName: t("fee"),
      flex: 0.05,
    },
    {
      field: "reward",
      headerName: t("reward"),
      flex: 0.05,
    },
    
    {
      field: 'start_time',
      headerName: t("startTime"),
      flex: 0.1,
      renderCell: (params) => (
        <h4>{params.value?.split("T")[0]} {params.value?.split("T")[0].split(".")[0]}</h4>
      ),
    },
    
    {
      field: 'end_time',
      headerName: t("endTime"),
      flex: 0.1,
      renderCell: (params) => (
        <h4>{params.value?.split("T")[0]} {params.value?.split("T")[0].split(".")[0]}</h4>
      ),
    },
    {
      field: "status",
      headerName: t("status"),
      flex: 0.15,
      renderCell: (params) => {
        let badgeStyle = {
          borderRadius: '12px',
          padding: '5px 10px',
          color: 'white',
          display: 'inline-block',
          width: '90%',
          textAlign: 'center'
        };
  
        if (params.value === 'Live') {
          badgeStyle.backgroundColor = '#04af21';
        } else if (params.value === 'Upcoming') {
          badgeStyle.backgroundColor = '#999922';
        } else {
          badgeStyle.backgroundColor = 'gray'; // Default color for other statuses
        }
  
        return (
          <div style={badgeStyle}>
            {params.value}
          </div>
        );
      }
    },
    {
      field: "actions",
      headerName: t("action"),
      flex: 0.2,
      renderCell: (params) => (
        <Box sx={{
          flexDirection: 'row',
          gap: 10
        }}>
        {params.row.status === 'Completed' ? (<Button 
          onClick={() => handleView(params.row)}
          sx={{ color: theme.palette.secondary.light, width: '25%' }}
        >
          <EmojiEvents color={theme.palette.secondary.light} />
        </Button>):(
          <Button 
            onClick={() => handleEdit(params.row)}
            sx={{ color: theme.palette.secondary.light, width: '25%' }}
          >
            <Edit color={theme.palette.secondary.light} />
          </Button>
        )}
          <Button 
            onClick={() => handleDelete(params.row._id)}
            sx={{ marginLeft: '8px', color: theme.palette.action.delete, width: '25%' }}
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
    setLiveList(data?.filter((res) => res.status === 'Live'));
    setUpList(data?.filter((res) => res.status === 'Upcoming'));
    setComList(data?.filter((res) => res.status === 'Completed'));
  }, [status, refetch, data]);

  return (
    <Box m="1.5rem 0.5rem">
      <FlexMobile m="0.5rem 1.5rem">
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
      </FlexMobile>

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

      <Dialog
        open={resultView}
        onClose={() => setResultView(false)}
      >
        <DialogTitle>{update?.title} - {t("result")}</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flex: 1,
            gap: 4,
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '200px',
            backgroundImage: `url(${update?.imgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Box sx={{
            display: 'flex',
            flex: 1,
            gap: 2,
            flexDirection: 'row',
            alignItems: 'center',
            backdropFilter: 'blur(5px)',
          }}>
            <div
              style={{
                backgroundColor: theme.palette.background.default,
                height: '150px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                margin: '10px 0',
                flex: 0.24,
                flexDirection: 'column',
                textAlign: 'center',
                alignItems: 'center',
                padding: '10px',
                color: theme.palette.secondary.dark,
              }}
            >
              <h5>{t('type')}:</h5>
              <h4>{update?.type}</h4>
            </div>
            <div
              style={{
                backgroundColor: theme.palette.background.default,
                height: '150px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                margin: '10px 0',
                flex: 0.24,
                flexDirection: 'column',
                textAlign: 'center',
                alignItems: 'center',
                padding: '10px',
                color: theme.palette.secondary.dark,
              }}
            >
              <h5>{t('fee')}:</h5>
              <h4>${update?.fee}</h4>
            </div>
            <div
              style={{
                backgroundColor: theme.palette.background.default,
                height: '150px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                margin: '10px 0',
                flex: 0.24,
                flexDirection: 'column',
                textAlign: 'center',
                alignItems: 'center',
                padding: '10px',
                color: theme.palette.secondary.dark,
              }}
            >
              <h5>{t('reward')}:</h5>
              <h4>${update?.reward}</h4>
            </div>
            <div
              style={{
                backgroundColor: theme.palette.background.default,
                height: '150px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                margin: '10px 0',
                flex: 0.24,
                flexDirection: 'column',
                textAlign: 'center',
                alignItems: 'center',
                padding: '10px',
                color: theme.palette.secondary.dark,
              }}
            >
              <h5>{t("duration")}:</h5>
              <h5>{update?.start_time.split("T")[0]} {update?.start_time.split("T")[1].split(".")[0]} ~ {update?.end_time.split("T")[0]} {update?.end_time.split("T")[1].split(".")[0]}</h5>
            </div>
          </Box>
          <Box sx={{
            display: 'flex',
            flex: 1,
            gap: 2,
            flexDirection: 'row',
            alignItems: 'center',
            backdropFilter: 'blur(5px)',
          }}>
            {update?.members.map((item, index)=>(
            <div
              key={index}
              style={{
                backgroundColor: theme.palette.background.default,
                height: '250px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                flex: 0.3,
                flexDirection: 'column',
                textAlign: 'center',
                alignItems: 'center',
                padding: '10px',
                color: theme.palette.secondary.dark,
              }}
            >
              <img
                src={index < 6 ? badges[index] : badges[5]}
                alt="media"
                style={{ width: '80px', height: 'auto', padding: '10px' }}
              />
              <h3>${((update?.reward / ((update?.members?.length * (update?.members?.length + 1)/2))) * (update?.members?.length - index)).toFixed(2)}</h3>
              <h4>{userdata?.filter((user)=>user._id === item)[0]?.name}</h4>
            </div>
            ))}
          </Box>

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
      <Tab label={t('all')} />
      <Tab label={t('live')} />
      <Tab label={t('upcoming')} />
      <Tab label={t('completed')} />
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
      
      <DataGrid
        loading={isLoading || !liveList}
        getRowId={(row) => row._id}
        rows={liveList ? liveList : []}
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
      
      <DataGrid
        loading={isLoading || !upList}
        getRowId={(row) => row._id}
        rows={upList ? upList : []}
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
    )}
    {currentTab === 3 && (
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
        loading={isLoading || !comList}
        getRowId={(row) => row._id}
        rows={comList ? comList : []}
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
    )}
      <ToastNotification open={showToast} message={message} severity={severity} hideToast={hideToast} />
    </Box>
  );
};

export default Tournaments;
