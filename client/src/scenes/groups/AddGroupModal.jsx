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
import { useTranslation } from 'react-i18next';
import { useCreateGroupMutation, useEditGroupMutation, useGetAllusersQuery, useGetAllGamesQuery } from "state/api";

const AddGroupModal = ({ open, onClose, update, processHandle, severityHandle, messageHandle, showToastHandle }) => {
  const [formData, setFormData] = useState({
    id: update?._id ? update._id:'',
    group_name: update?.group_name ? update.group_name:'',
    game: update?.game ? update.game:'',
    imgUrl: update?.imgUrl ? update.imgUrl:null,
    description: update?.description ? update.description:'',
    adminUser: update?.adminUser ? update.adminUser:'',
    members: update?.members ? update.members:[],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const theme = useTheme();
  const { t } = useTranslation();
  const [createGroup] = useCreateGroupMutation();
  const [editGroup] = useEditGroupMutation();
  const { data: getAllusers, refetch } = useGetAllusersQuery();
  const { data: getAllGames } = useGetAllGamesQuery();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  const userdata = getAllusers;
  const gamedata = getAllGames;
  const [selectedMember, setSelectedMember] = useState([]);

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
      if(formData.group_name !== '' && formData.game !== '' && formData.adminUser !== ''){
        try {
          const response = await editGroup(formData).unwrap();
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
      if(formData.group_name !== '' && formData.game !== '' && formData.adminUser !== ''){
        try {
          const response = await createGroup(formData).unwrap();
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
        group_name: update?.group_name ? update.group_name:'',
        game: update?.game ? update.game:'',
        imgUrl: update?.imgUrl ? update.imgUrl:null,
        description: update?.description ? update.description:'',
        adminUser: update?.adminUser ? update.adminUser:'',
        members: update?.members ? update.members:[],
      });
      setImagePreview(update?.imgUrl ? update.imgUrl:null);
      setSelectedMember(userdata?.filter(user => update?.members?.includes(user._id)));
    }
    refetch();
  }, [update, refetch, userdata])
  return (
    <Dialog open={open} onClose={onClose}>
      {update?._id ? (<DialogTitle>{t("edit")} {t("group")}</DialogTitle>) : (<DialogTitle>{t("addGroup")}</DialogTitle>)}
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
                <PhotoCamera fontSize='40px' />
              </IconButton>
            </label>
          </Box>
            <TextField
              label={t("name")}
              name="group_name"
              fullWidth
              margin="normal"
              value={formData.group_name}
              onChange={handleChange}
              multiline
              rows={2}
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
            {update?._id ? (<TextField
              label={t("admin")}
              name="adminUser"
              type="text"
              fullWidth
              margin="normal"
              value={userdata.find(user => user._id === formData.adminUser) ? userdata.find(user => user._id === formData.adminUser).name + " ( " + formData.adminUser + " )" : ""}
              onChange={handleChange}
              disabled
            />):(
              <Box marginTop={2}>
                <Autocomplete
                  options={userdata? userdata: []}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setSelectedUser(newValue);
                    setFormData((prevData) => ({ ...prevData, adminUser: newValue._id }));

                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("selectUser")} variant="outlined" />
                  )}
                  
                  filterOptions={(options, { inputValue }) => {
                    return options?.filter((option) =>
                      option?.name.toLowerCase().includes(inputValue.toLowerCase())
                    );
                  }}
                  
                  value={selectedUser}
                  isOptionEqualToValue={(option, value) => 
                    option.id === value.id}
                />
              </Box>
            )}

          {update?._id ? (<TextField
              label={t("game")}
              name="game"
              type="text"
              fullWidth
              margin="normal"
              value={gamedata.find(game => game._id === formData.game) ? gamedata.find(game => game._id === formData.game).game_name + " ( " + formData.game + " )" : ""}
              onChange={handleChange}
              disabled
            />):(
              <Box marginTop={2}>
              <Autocomplete
                options={gamedata? gamedata: []}
                getOptionLabel={(option) => option.game_name}
                onChange={(event, newValue) => {
                  setSelectedGame(newValue);
                  setFormData((prevData) => ({ ...prevData, game: newValue._id }));

                }}
                renderInput={(params) => (
                  <TextField {...params} label={t("selectGame")} variant="outlined" />
                )}
                
                filterOptions={(options, { inputValue }) => {
                  return options?.filter((option) =>
                    option?.game_name.toLowerCase().includes(inputValue.toLowerCase())
                  );
                }}
                
                value={selectedGame}
                isOptionEqualToValue={(option, value) => 
                  option.id === value.id}
              />
              </Box>
            )}
              <Box marginTop={2}>
                <Autocomplete
                  multiple
                  options={userdata? userdata: []}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setSelectedMember(newValue);
                    setFormData((prevData) => ({ ...prevData,
                      members: newValue.map(user => user._id),}));

                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("selectUser")} variant="outlined" />
                  )}
                  
                  filterOptions={(options, { inputValue }) => {
                    return options?.filter((option) =>
                      option?.name.toLowerCase().includes(inputValue.toLowerCase())
                    );
                  }}
                  
                  value={selectedMember || []}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />
                    ))
                  }
                />
              </Box>
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

export default AddGroupModal;