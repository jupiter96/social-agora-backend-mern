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
  useGetAllCategoriesQuery, 
  useEditCategoryMutation, 
  useCreateCategoryMutation, 
  useDeleteCategoryMutation } from "state/api";

const AddCategoryModal = ({ open, onClose, processHandle, severityHandle, messageHandle, showToastHandle }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  
  const { data, refetch } = useGetAllCategoriesQuery();
  const [ deleteCategory ] = useDeleteCategoryMutation();
  const [createCategory] = useCreateCategoryMutation();
  const [editCategory] = useEditCategoryMutation();

  const handleDelete = async(index) => {
    const response = await deleteCategory(index).unwrap();
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

  const editStatus = async(category) => {
    setName(category.category_name);
    setEditId(category._id);
    setEdit(true);
  };

  const handleSubmit = async () => {
    processHandle(true);
    if(edit){
      if(name !== "" && editId !== ""){
        try {
          const response = await editCategory({id: editId, category_name: name}).unwrap();
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
          const response = await createCategory({category_name: name}).unwrap();
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
      <DialogTitle>{t("category")}</DialogTitle>
      <DialogContent>
        <Box sx={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {data?.map((item, index) => (
            <Chip
              variant="filled"
              label={item.category_name}
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
          name="category_name"
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

export default AddCategoryModal;