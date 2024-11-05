import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, CircularProgress, Dialog, DialogTitle, DialogContent, } from "@mui/material";
import {
  AddCircle,
  Edit,
  Delete
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

import { useGetAllFeedsQuery, useDeleteFeedMutation, useGetAllusersQuery, useGetAllHashTagsQuery } from "state/api";
import { Header, FlexMobile, ToastNotification, DataGridCustomToolbar } from "components";
import { useTranslation } from 'react-i18next';
import AddFeedModal from './AddFeedModal';
import AddHashTagModal from './AddHashTagModal';

const Feeds = () => {
  
  const theme = useTheme();
  
  const { data, isLoading, refetch } = useGetAllFeedsQuery();
  const { data: getAllusers } = useGetAllusersQuery();
  const userData = getAllusers;
  const { data: getAllHashTags } = useGetAllHashTagsQuery();
  const hashTagData = getAllHashTags;
  const [ deleteFeed ] = useDeleteFeedMutation();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [openHashTag, setOpenHashTag] = useState(false);
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

  useEffect(() => {
    if (searchInput) {
      const filtered = data?.filter((row) =>
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


  const handleHashTagOpen = () => {
    setOpenHashTag(true);
  };

  const handleHashTagClose = () => {
    setOpenHashTag(false);
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
      flex: 0.1,
    },
    {
      field: "text",
      headerName: t("text"),
      flex: 0.1,
    },
    {
      field: 'img',
      headerName: t("media"),
      flex: 0.05,
      renderCell: (params) => (
        <Box>
          {params.value && (<img
            src={params.value}
            alt="media"
            style={{ width: '80px', height: 'auto', padding: '10px' }}
          />)}
        </Box>
      ),
    },
    {
      field: 'video',
      headerName: t("media"),
      flex: 0.15,
      renderCell: (params) => (
        <Box>
          {params.value && (<video width="200" controls>
              <source src={params.value} type="video/mp4" />
              Your browser does not support HTML video.
          </video>)}
        </Box>
      ),
    },
    {
      field: "postedBy",
      headerName: t("postedby"),
      flex: 0.1,
      renderCell: (params) => (
        <p>{userData?.filter((item)=>item._id === params.value)[0]?.username}</p>
      ),
    },
    
    {
      field: 'likes',
      headerName: t("likes"),
      flex: 0.05,
      renderCell: (params) => (
        <h4>{params.value?.length}</h4>
      ),
    },
    
    {
      field: 'replies',
      headerName: t("replies"),
      flex: 0.05,
      renderCell: (params) => (
        <h4>{params.value?.length}</h4>
      ),
    },
    {
      field: "hashtag",
      headerName: t("hashtag"),
      flex: 0.1,
      renderCell: (params) => (
        <p>
          {hashTagData
            ?.filter((hashtag) => params.value.includes(hashtag._id))
            .map((hashtag) => hashtag.hashtag_name)
            .join(", ")}
        </p>
      ),
    },
    
    {
      field: 'createdAt',
      headerName: t("createdAt"),
      flex: 0.15,
      renderCell: (params) => (
        <h4>{params.value?.split("T")[0]}</h4>
      ),
    },
    {
      field: "actions",
      headerName: t("action"),
      flex: 0.15,
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
      <FlexMobile m="0.5rem 1.5rem">
        <Header title={t("allfeeds")} subtitle={t("feeds")} />
        <Box>
          
          <Button
            onClick={handleHashTagOpen}
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: 50,
              marginRight: '20px',

              "&:hover": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary.light,
              },
            }}
          >
            # Hash Tag
          </Button>
          
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

      <AddFeedModal 
      open={open} 
      onClose={handleClose} 
      update={update} 
      processHandle={setProcessing}
      severityHandle={setSeverity}
      messageHandle={setMessage}
      showToastHandle={setShowToast} />

      <AddHashTagModal 
      open={openHashTag} 
      onClose={handleHashTagClose}
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
              minWidth: '1200px',
            },
          },
        }}
      >
        
        <DataGrid
          loading={isLoading || !filteredData}
          getRowId={(row) => row._id}
          rows={filteredData ? [...filteredData].reverse() : []}
          columns={columns}
          rowHeight={150}
          rowsPerPageOptions={[8, 16, 32, 64]}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          pagination
          page={page}
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

export default Feeds;
