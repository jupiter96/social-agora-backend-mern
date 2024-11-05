import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Chip,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Delete
} from "@mui/icons-material";
import { useTranslation } from 'react-i18next';

import { 
  useGetAllHashTagsQuery, 
  useEditHashTagMutation, 
  useCreateHashTagMutation, 
  useDeleteHashTagMutation } from "state/api";

const AddHashTagModal = ({ open, onClose, processHandle, severityHandle, messageHandle, showToastHandle }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  
  const { data, refetch } = useGetAllHashTagsQuery();
  const [ deleteHashTag ] = useDeleteHashTagMutation();
  const [ createHashTag ] = useCreateHashTagMutation();
  const [ editHashTag ] = useEditHashTagMutation();

  const handleDelete = async(index) => {
    const response = await deleteHashTag(index).unwrap();
    if(response.error){
      alert(response.error);
    }else{
      console.log("response", response);
      refetch();
      severityHandle('success');
      messageHandle(t('success'));
      showToastHandle(true);

    }
  };

  const editStatus = async(hashtag) => {
    setName(hashtag.hashtag_name);
    setEditId(hashtag._id);
    setEdit(true);
  };

  const handleSubmit = async () => {
    processHandle(true);
    if(edit){
      if(name !== "" && editId !== ""){
        try {
          const response = await editHashTag({id: editId, hashtag_name: name}).unwrap();
          if(response.error){
            alert(response.error);
          }else{
            console.log("response", response);
            setEdit(false);
            setEditId("");
            setName("");
            refetch();
            processHandle(false);
            severityHandle('success');
            messageHandle(t('success'));
            showToastHandle(true);
          }
        } catch (error) {
          console.log("error", error);
          processHandle(false);
          severityHandle('error');
          messageHandle(t('failed'));
          showToastHandle(true);
        }
      }else{
        processHandle(false);
        severityHandle('error');
        messageHandle(t('failed'));
        showToastHandle(true);
      }
    }else{
      if(name !== ""){
        try {
          const response = await createHashTag({hashtag_name: name}).unwrap();
          if(response.error){
            alert(response.error);
          }else{
            console.log("response", response);
            setName("");
            refetch();
            processHandle(false);
            severityHandle('success');
            messageHandle(t('success'));
            showToastHandle(true);
          }
        } catch (error) {
          console.log("error", error);
          processHandle(false);
          severityHandle('error');
          messageHandle(t('failed'));
          showToastHandle(true);
        }

      }else{
        processHandle(false);
        severityHandle('error');
        messageHandle(t('failed'));
        showToastHandle(true);
      }
    }
  };

  useEffect(()=>{
    if(name === ""){
      setEdit(false);
      setEditId("");
    }
  },[name])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("Hash Tag")}</DialogTitle>
      <DialogContent>
        <Box sx={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {data?.map((item, index) => (
            <Chip
              variant="filled"
              label={item.hashtag_name}
              onClick={()=>editStatus(item)}
              key={index}
              style={{ backgroundColor: `#${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}`, margin: '4px' }}
              deleteIcon={
                <IconButton onClick={() => handleDelete(index)} size="small">
                  <Delete fontSize="small" />
                </IconButton>
              }
              onDelete={() => handleDelete(item._id)}
            />
          ))}
        </Box>
        <TextField
          label={t("name")}
          name="hashtag_name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{borderRadius: 50}} variant="contained">{t('cancel')}</Button>
        <Button type="button" onClick={handleSubmit} variant="contained" 
        sx={{
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.background.alt,
          fontSize: "14px",
          fontWeight: "bold",
          borderRadius: 50,

          "&:hover": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary.light,
          }}}>{edit ? t('update') : t('add')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddHashTagModal;