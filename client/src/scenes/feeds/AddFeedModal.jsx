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
  Autocomplete,
  Chip,
  useTheme
} from '@mui/material';
import { PhotoCamera  } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useCreateFeedMutation, useEditFeedMutation, useGetAllusersQuery, useGetAllHashTagsQuery } from "state/api";

const AddFeedModal = ({ open, onClose, update, processHandle, severityHandle, messageHandle, showToastHandle }) => {
  const [formData, setFormData] = useState({
    id: update?._id ? update._id:'',
    text: update?.text ? update.text:'',
    hashtag: update?.hashtag ? update.hashtag:[],
    postedBy: update?.postedBy ? update.postedBy:'',
    img: update?.img ? update.img:null,
    video: update?.video ? update.video:null,
    createdAt: update?.createdAt ? dayjs(update.createdAt):dayjs(),
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const theme = useTheme();
  const { t } = useTranslation();
  const [createFeed] = useCreateFeedMutation();
  const [editFeed] = useEditFeedMutation();
  const { data, refetch } = useGetAllusersQuery();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedHashTag, setSelectedHashTag] = useState(null);
  const { data: getAllHashTags } = useGetAllHashTagsQuery();
  const hashtagData = getAllHashTags;

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({ ...prev, createdAt: dayjs(newValue).toISOString() }))
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (file.type.startsWith('video/')) {
                setImagePreview(null);
                setVideoPreview(reader.result);
                setFormData((prevData) => ({ ...prevData, video: reader.result }));
                setFormData((prevData) => ({ ...prevData, img: '' }));
            } else if (file.type.startsWith('image/')) {
                setVideoPreview(null);
                setImagePreview(reader.result);
                setFormData((prevData) => ({ ...prevData, img: reader.result }));
                setFormData((prevData) => ({ ...prevData, video: '' }));
            }
        };
        reader.readAsDataURL(file);
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    processHandle(true);
    console.log("asdasd", formData)
    if(update?._id){
      if(formData.postedBy !== '' && formData.text !== ''){
        try {
          const response = await editFeed(formData).unwrap();
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
      if(formData.text !== '' && formData.postedBy !== ''){
        try {
          const response = await createFeed(formData).unwrap();
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
        text: update?.text ? update.text:'',
        hashtag: update?.hashtag ? update.hashtag:'',
        postedBy: update?.postedBy ? update.postedBy:'',
        img: update?.img ? update.img:null,
        video: update?.video ? update.video:null,
        createdAt: update?.createdAt ? dayjs(update.createdAt):dayjs(),
      });

      setSelectedHashTag(hashtagData?.filter((hash)=> update?.hashtag?.includes(hash._id)));
      if(!videoPreview){
      setImagePreview(update?.img ? update.img:null);}
      if(!imagePreview){
      setVideoPreview(update?.video ? update.video:null);}
    }
    refetch();
  }, [update, refetch, hashtagData, imagePreview, videoPreview])
  return (
    <Dialog open={open} onClose={onClose}>
      {update?._id ? (<DialogTitle>{t("edit")} Feed</DialogTitle>) : (<DialogTitle>{t("addFeed")}</DialogTitle>)}
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          {videoPreview && (
              <video width="400" controls>
                  <source src={videoPreview} type="video/mp4" />
                  Your browser does not support HTML video.
              </video>
          )}
            <Box display="flex" alignItems="center" justifyContent={"center"} marginTop={2}>
            <input
              accept="image/*,video/*"
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
                <PhotoCamera fontSize='40px' />
              </IconButton>
            </label>
          </Box>
            <TextField
              label={t("text")}
              name="text"
              fullWidth
              margin="normal"
              value={formData.text}
              onChange={handleChange}
              multiline
              rows={4}
            />
            {update?._id ? (<TextField
              label={t("postedBy")}
              name="postedBy"
              type="text"
              fullWidth
              margin="normal"
              value={data.find(user => user._id === formData.postedBy) ? data.find(user => user._id === formData.postedBy).name + " ( " + formData.postedBy + " )" : ""}
              onChange={handleChange}
              disabled
            />):(
              <Autocomplete
                options={data? data: []}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setSelectedUser(newValue);
                  setFormData((prevData) => ({ ...prevData, postedBy: newValue._id }));

                }}
                renderInput={(params) => (
                  <TextField {...params} label={t("selectUser")} variant="outlined" />
                )}
                
                filterOptions={(options, { inputValue }) => {
                  return options?.filter((option) =>
                    option.name?.toLowerCase().includes(inputValue.toLowerCase())
                  );
                }}
                
                value={selectedUser}
                isOptionEqualToValue={(option, value) => 
                  option.id === value.id}
              />
            )}

            <Box marginTop={2}>
              <Autocomplete
                multiple
                options={hashtagData? hashtagData: []}
                getOptionLabel={(option) => option.hashtag_name}
                onChange={(event, newValue) => {
                  setSelectedHashTag(newValue);
                  setFormData((prevData) => ({ ...prevData,
                    hashtag: newValue.map(hashtag => hashtag._id),}));

                }}
                renderInput={(params) => (
                  <TextField {...params} label={t("Hash Tag")} variant="outlined" />
                )}
                
                filterOptions={(options, { inputValue }) => {
                  return options?.filter((option) =>
                    option?.hashtag_name?.toLowerCase().includes(inputValue.toLowerCase())
                  );
                }}
                
                value={selectedHashTag || []}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option.hashtag_name} {...getTagProps({ index })} />
                  ))
                }
              />
            </Box>

            <Box display="flex" alignItems="center" marginTop={2}>
              <DatePicker
                label={t("createdAt")}
                value={dayjs(formData.createdAt) || dayjs()}
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
          }}}>{ update?._id ? t('update') : t('addFeed')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFeedModal;