import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Box,
  useTheme
} from '@mui/material';
import { Image } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useCreateBannerMutation, useEditBannerMutation } from "state/api";

const AddBannerModal = ({ open, onClose, update, processHandle, severityHandle, messageHandle, showToastHandle }) => {
  const [formData, setFormData] = useState({
    id: update?._id ? update._id:'',
    title: update?.title ? update.title:'',
    imgUrl: update?.imgUrl ? update.imgUrl:null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const theme = useTheme();
  const { t } = useTranslation();
  const [createBanner] = useCreateBannerMutation();
  const [editBanner] = useEditBannerMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prevData) => ({ ...prevData, imgUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    processHandle(true);
    if(update?._id){
      if(formData.title !== '' && formData.imgUrl !== ''){
        try {
          const response = await editBanner(formData).unwrap();
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
      if(formData.title !== '' && formData.imgUrl !== ''){
        try {
          const response = await createBanner(formData).unwrap();
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
        imgUrl: update?.imgUrl ? update.imgUrl:null,
      });
      setImagePreview(update?.imgUrl ? update.imgUrl:null);
    }
  }, [update])
  return (
    <Dialog open={open} onClose={onClose}>
      {update?._id ? (<DialogTitle>{t("edit")} {t("bannerImage")}</DialogTitle>) : (<DialogTitle>{t("add")}</DialogTitle>)}
      <DialogContent>
          <form onSubmit={handleSubmit}>
          {imagePreview && (
            <Box display="flex" alignItems="center" justifyContent={"center"} marginTop={2}>
              <img
                src={imagePreview}
                alt="Profile Preview"
                style={{ width: '300px', height: 'auto', borderRadius: '20px' }}
              />
            </Box>
          )}
            <Box display="flex" alignItems="center" justifyContent={"center"} marginTop={2}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-pic-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="profile-pic-upload">
                <IconButton color="second" component="a"
                sx={{
                  fontSize: "34px",
                  fontWeight: "bold",
                  borderRadius: 50,
                  backgroundColor: theme.palette.secondary.main,
        
                  "&:hover": {
                    backgroundColor: theme.palette.background.alt,
                    color: theme.palette.secondary.light,
                  }}}>
                  <Image fontSize='40px' />
                </IconButton>
              </label>
            </Box>
            <TextField
              label={t("title")}
              name="title"
              fullWidth
              margin="normal"
              value={formData.title}
              onChange={handleChange}
            />
          </form>
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

export default AddBannerModal;