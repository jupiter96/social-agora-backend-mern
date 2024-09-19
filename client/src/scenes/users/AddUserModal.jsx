import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  Box,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff, PhotoCamera  } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useCreateUserMutation, useEditUserMutation } from "state/api";

const AddUserModal = ({ open, onClose, update, processHandle, severityHandle, messageHandle, showToastHandle }) => {
  const [formData, setFormData] = useState({
    id: update?._id ? update._id:'',
    name: update?.name ? update.name:'',
    email: update?.email ? update.email:'',
    username: update?.username ? update.username:'',
    password: '',
    bio: update?.bio ? update.bio:'',
    profilePic: update?.profilePic ? update.profilePic:null,
    role: update?.role ? update.role:'User',
    member: update?.member ? update.member:'Free',
    expireDate: update?.expireDate ? dayjs(update.expireDate):null,
    level: update?.level ? update.level:1,
    coin: update?.coin ? update.coin:0,
    exp: update?.exp ? update.exp:0,
    group: update?.group ? update.group:0,
    tournament: update?.tournament ? update.tournament:0,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const theme = useTheme();
  const { t } = useTranslation();
  const [createUser] = useCreateUserMutation();
  const [editUser] = useEditUserMutation();
  

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({ ...prev, expireDate: dayjs(newValue).toISOString() }))
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
        setImagePreview(reader.result);
        setFormData((prevData) => ({ ...prevData, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    processHandle(true);
    if(update?._id){
      if(formData.username !== '' && formData.name !== '' && formData.email !== ''){
        console.log("aaaaaaaaaaaaaaaaa::::::::::", formData);
        try {
          const response = await editUser(formData).unwrap();
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
      if(formData.username !== '' && formData.name !== '' && formData.email !== ''){
        console.log("aaaaaaaaaaaaaaaaa::::::::::", formData);
        try {
          const response = await createUser(formData).unwrap();
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

  const handleMemberChange = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({ ...prevData, member: value, expireDate: value === 'Paid' ? dayjs(prevData.expireDate) : null }));
  };

  useEffect(()=>{
    if(update){
      setFormData({
        id: update?._id ? update._id:'',
        name: update?.name ? update.name:'',
        email: update?.email ? update.email:'',
        username: update?.username ? update.username:'',
        password: '',
        bio: update?.bio ? update.bio:'',
        profilePic: update?.profilePic ? update.profilePic:null,
        role: update?.role ? update.role:'User',
        member: update?.member ? update.member:'Free',
        expireDate: update?.expireDate ? dayjs(update.expireDate):null,
        level: update?.level ? update.level:1,
        coin: update?.coin ? update.coin:0,
        exp: update?.exp ? update.exp:0,
        group: update?.group ? update.group:0,
        tournament: update?.tournament ? update.tournament:0,
      });
      setImagePreview(update?.profilePic ? update.profilePic:null);
    }
  }, [update])

  return (
    <Dialog open={open} onClose={onClose}>
      {update?._id ? (<DialogTitle>{t('edit')} {t('user')}</DialogTitle>) : (<DialogTitle>{t('addUser')}</DialogTitle>)}
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <form onSubmit={handleSubmit}>
            
          {imagePreview && (
            <Box display="flex" alignItems="center" justifyContent={"center"} marginTop={2}>
              <img
                src={imagePreview}
                alt="Profile Preview"
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
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
                <PhotoCamera fontSize='40px' />
              </IconButton>
            </label>
          </Box>
            <TextField
              label={t("name")}
              name="name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              label={t("email")}
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              label={t("username")}
              name="username"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              label={t("password")}
              name="password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label={t("bio")}
              name="bio"
              fullWidth
              margin="normal"
              value={formData.bio}
              onChange={handleChange}
            />
            
            <TextField
              label={t("level")}
              name="level"
              fullWidth
              type='number'
              margin="normal"
              value={formData.level}
              onChange={handleChange}
            />
            
            <TextField
              label={t("exp")}
              name="exp"
              fullWidth
              type='number'
              margin="normal"
              value={formData.exp}
              onChange={handleChange}
            />
            
            <TextField
              label={t("coin")}
              name="coin"
              fullWidth
              type='number'
              margin="normal"
              value={formData.coin}
              onChange={handleChange}
            />
            
            <TextField
              label={t("group")}
              name="group"
              fullWidth
              type='number'
              margin="normal"
              value={formData.group}
              onChange={handleChange}
            />
            
            <TextField
              label={t("tournament")}
              name="tournament"
              fullWidth
              type='number'
              margin="normal"
              value={formData.tournament}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>{t("role")}</InputLabel>
              <Select
                name='role'
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value="Admin">{t("admin")}</MenuItem>
                <MenuItem value="User">{t("user")}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>{t("member")}</InputLabel>
              <Select
                name="member"
                value={formData.member}
                onChange={handleMemberChange}
              >
                <MenuItem value="Free">{t("free")}</MenuItem>
                <MenuItem value="Paid">{t("paid")}</MenuItem>
              </Select>
            </FormControl>
            {formData.member === 'Paid' && (
            <Box display="flex" alignItems="center" marginTop={2}>
              <DatePicker
                label={t("expireDate")}
                value={update.expireDate ? dayjs(update.expireDate) : null}
                onChange={(newValue) => handleDateChange(newValue)}
                slotProps={{
                  textField: {
                    variant: 'outlined', // Customize the TextField variant
                    fullWidth: true, // Make the TextField full width
                  },
                }}
              />
            </Box>
            )}
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
          }}}>
          {update?._id ? t('update') : t('addUser')}
          </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;