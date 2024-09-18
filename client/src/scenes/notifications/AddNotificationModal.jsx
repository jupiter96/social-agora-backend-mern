import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  useTheme
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useCreateNotificationMutation, useEditNotificationMutation } from "state/api";

const AddNotificationModal = ({ open, onClose, update, processHandle, severityHandle, messageHandle, showToastHandle }) => {
  const [formData, setFormData] = useState({
    id: update?._id ? update._id:'',
    title: update?.title ? update.title:'',
    description: update?.description ? update.description:'',
    duration: update?.duration ? dayjs(update.duration):dayjs(),
    status: update?.status ? update.status:'',
  });
  
  const theme = useTheme();
  const { t } = useTranslation();
  const [createNotification] = useCreateNotificationMutation();
  const [editNotification] = useEditNotificationMutation();

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({ ...prev, createdAt: dayjs(newValue).toISOString() }))
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    processHandle(true);
    if(update?._id){
      if(formData.title !== '' && formData.description !== ''){
        try {
          const response = await editNotification(formData).unwrap();
          if(response.error){
            alert(response.error);
          }else{
            console.log("response", response);
            processHandle(false);
            severityHandle('success');
            messageHandle(t('success'));
            showToastHandle(true);
            onClose();
          }
        } catch (error) {
          console.log("error", error);
          processHandle(false);
          severityHandle('error');
          messageHandle(t('failed'));
          showToastHandle(true);
        }
      }else{
          alert("fill out all!")
      }
    }else{
      if(formData.title !== '' && formData.description !== ''){
        try {
          const response = await createNotification(formData).unwrap();
          if(response.error){
            alert(response.error);
          }else{
            console.log("response::::::::::", response);
            processHandle(false);
            severityHandle('success');
            messageHandle(t('success'));
            showToastHandle(true);
            onClose();
          }
        } catch (error) {
          console.log("error", error);
          processHandle(false);
          severityHandle('error');
          messageHandle(t('failed'));
          showToastHandle(true);
        }
      }else{
          alert("fill out all!")
      }
    }
  };

  useEffect(()=>{
    if(update){
      setFormData({
        id: update?._id ? update._id:'',
        title: update?.title ? update.title:'',
        description: update?.description ? update.description:'',
        duration: update?.duration ? dayjs(update.duration):dayjs(),
        status: update?.status ? update.status:'',
      });
    }
  }, [update])
  return (
    <Dialog open={open} onClose={onClose}>
      {update?._id ? (<DialogTitle>{t("edit")} {t("notification")}</DialogTitle>) : (<DialogTitle>{t("addNotification")}</DialogTitle>)}
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <form onSubmit={handleSubmit}>
            
            <TextField
              label={t("title")}
              name="title"
              fullWidth
              margin="normal"
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              label={t("description")}
              name="description"
              fullWidth
              margin="normal"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>{t("status")}</InputLabel>
              <Select
                name='status'
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="Active">{t("active")}</MenuItem>
                <MenuItem value="InActive">{t("inactive")}</MenuItem>
              </Select>
            </FormControl>
            <Box display="flex" alignItems="center" marginTop={2}>
              <DatePicker
                label={t("duration")}
                value={dayjs(formData.duration) || dayjs()}
                onChange={(newValue) => handleDateChange(newValue)}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    fullWidth: true,
                  },
                }}
              />
            </Box>
          </form>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{borderRadius: 50}} variant="contained">{t('cancel')}</Button>
        <Button type="submit" onClick={handleSubmit} variant="contained" 
        sx={{
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.background.alt,
          fontSize: "14px",
          fontWeight: "bold",
          borderRadius: 50,

          "&:hover": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary.light,
          }}}>{ update?._id ? t('update') : t('add')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNotificationModal;