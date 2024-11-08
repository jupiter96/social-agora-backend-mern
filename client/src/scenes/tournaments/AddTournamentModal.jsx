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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Typography,
  useTheme
} from '@mui/material';
import { Image } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useCreateTournamentMutation, useEditTournamentMutation, useGetAllusersQuery, useGetAllGamesQuery } from "state/api";

const AddTournamentModal = ({ open, onClose, update, processHandle, severityHandle, messageHandle, showToastHandle }) => {
  const [formData, setFormData] = useState({
    id: update?._id ? update._id:'',
    title: update?.title ? update.title:'',
    adminUser: update?.adminUser ? update.adminUser:'',
    game: update?.game ? update.game:'',
    imgUrl: update?.imgUrl ? update.imgUrl:null,
    type: update?.type ? update.type:'',
    description: update?.description ? update.description:'',
    start_time: update?.start_time ? dayjs(update.start_time):dayjs(),
    end_time: update?.end_time ? dayjs(update.end_time):dayjs(),
    fee: update?.fee ? update.fee:'',
    reward: update?.reward ? update.reward:'',
    limit: update?.limit ? update.limit:'',
    members: update?.members ? update.members:[],
    status: update?.status ? update.status:'',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const theme = useTheme();
  const { t } = useTranslation();
  const [createTournament] = useCreateTournamentMutation();
  const [editTournament] = useEditTournamentMutation();
  const { data, refetch } = useGetAllusersQuery();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMember, setSelectedMember] = useState([]);
  const { data: getAllGames } = useGetAllGamesQuery();
  const gamedata = getAllGames;
  const [selectedGame, setSelectedGame] = useState(null);

  const handleStartDateChange = (newValue) => {
    if (newValue && newValue.isValid()) {
      setFormData((prev) => ({ ...prev, start_time: dayjs(newValue).toISOString() }))
    } else {
      console.error("Invalid date selected");
    }
  };
  const handleEndDateChange = (newValue) => {
    setFormData((prev) => ({ ...prev, end_time: dayjs(newValue).toISOString() }))
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
        setFormData((prevData) => ({ ...prevData, imgUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    processHandle(true);
    if(update?._id){
      if(formData.title !== '' && formData.adminUser !== '' && formData.fee !== '' && formData.reward !== ''){
        try {
          const response = await editTournament(formData).unwrap();
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
      if(formData.title !== '' && formData.adminUser !== '' && formData.fee !== '' && formData.reward !== ''){
        try {
          const response = await createTournament(formData).unwrap();
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
        adminUser: update?.adminUser ? update.adminUser:'',
        game: update?.game ? update.game:'',
        imgUrl: update?.imgUrl ? update.imgUrl:null,
        type: update?.type ? update.type:'',
        description: update?.description ? update.description:'',
        start_time: update?.start_time ? dayjs(update.start_time):dayjs(),
        end_time: update?.end_time ? dayjs(update.end_time):dayjs(),
        fee: update?.fee ? update.fee:'',
        reward: update?.reward ? update.reward:'',
        limit: update?.limit ? update.limit:'',
        members: update?.members ? update.members:[],
        status: update?.status ? update.status:'',
      });
      setImagePreview(update?.imgUrl ? update.imgUrl:null);
      setSelectedMember(data?.filter(user => update?.members?.includes(user._id)));
    }
    refetch();
  }, [update, refetch, data])
  return (
    <Dialog open={open} onClose={onClose}>
      {update?._id ? (<DialogTitle>{t("edit")} {t("tournament")}</DialogTitle>) : (<DialogTitle>{t("addTournament")}</DialogTitle>)}
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <form onSubmit={handleSubmit}>
          <Typography variant="h6">
            {t('bannerImage')} ({t('optional')})
          </Typography>
          {imagePreview && (
            <Box display="flex" alignItems="center" justifyContent={"center"} marginTop={2}>
              <img
                src={imagePreview}
                alt="Profile Preview"
                style={{ width: '300px', height: 'auto', borderRadius: '20px' }}
              />
            </Box>
          )}
            {((update && update.status === 'Upcoming') || update === null) && (
              <Box display="flex" alignItems="center" justifyContent={"center"} marginTop={2}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-pic-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="profile-pic-upload">                
                  <IconButton 
                  color="second" 
                  component="a"
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
            <TextField
              label={t("title")}
              name="title"
              fullWidth
              margin="normal"
              value={formData.title}
              onChange={handleChange}
              disabled={!((update && update.status === 'Upcoming') || update === null)}
            />
            {update?._id ? (<TextField
              label={t("admin")}
              name="adminUser"
              type="text"
              fullWidth
              margin="normal"
              value={data.find(user => user._id === formData.adminUser) ? data.find(user => user._id === formData.adminUser).name + " ( " + formData.adminUser + " )" : ""}
              onChange={handleChange}
              disabled
            />):(
              <Autocomplete
                options={data? data: []}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setSelectedUser(newValue);
                  setFormData((prevData) => ({ ...prevData, adminUser: newValue._id }));

                }}
                renderInput={(params) => (
                  <TextField {...params} label={t("selectUser")} variant="outlined" />
                )}
                
                filterOptions={(options, { inputValue }) => {
                  return options.filter((option) =>
                    option.name.toLowerCase().includes(inputValue.toLowerCase())
                  );
                }}
                
                value={selectedUser}
                isOptionEqualToValue={(option, value) => 
                  option.id === value.id}
              />
            )}
            <TextField
              label={t("description")}
              name="description"
              fullWidth
              margin="normal"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              disabled={!((update && update.status === 'Upcoming') || update === null)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>{t("type")}</InputLabel>
              <Select
                name='type'
                value={formData.type}
                onChange={handleChange}
                disabled={!((update && update.status === 'Upcoming') || update === null)}
              >
                <MenuItem value="Individual">{t("individual")}</MenuItem>
                <MenuItem value="Team">{t("team")}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={t("fee")}
              name="fee"
              type='number'
              fullWidth
              margin="normal"
              value={formData.fee}
              onChange={handleChange}
              disabled={!((update && update.status === 'Upcoming') || update === null)}
            />
            <TextField
              label={t("reward")}
              name="reward"
              type='number'
              fullWidth
              margin="normal"
              value={formData.reward}
              onChange={handleChange}
              disabled={!((update && update.status === 'Upcoming') || update === null)}
            />
            <Box display="flex" alignItems="center" marginTop={2}>
              <DatePicker
                label={t("startTime")}
                value={dayjs(formData.start_time) || dayjs()}
                onChange={(newValue) => handleStartDateChange(newValue)}
                disabled={!((update && update.status === 'Upcoming') || update === null)}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    fullWidth: true,
                  },
                }}
              />
            </Box>
            <Box display="flex" alignItems="center" marginTop={2}>
              <DatePicker
                label={t("endTime")}
                value={dayjs(formData.end_time) || dayjs()}
                onChange={(newValue) => handleEndDateChange(newValue)}
                disabled={!((update && update.status === 'Upcoming') || update === null)}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    fullWidth: true,
                  },
                }}
              />
            </Box>
            <TextField
              label={t("limit")}
              name="limit"
              type='number'
              fullWidth
              margin="normal"
              value={formData.limit}
              onChange={handleChange}
              disabled={!((update && update.status === 'Upcoming') || update === null)}
            />

            
              <Box marginTop={2}>
                <Autocomplete
                  multiple
                  options={data? data: []}
                  getOptionLabel={(option) => option.name}
                  disabled={!((update && update.status === 'Upcoming') || update === null)}
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
            <FormControl fullWidth margin="normal">
              <InputLabel>{t("status")}</InputLabel>
              <Select
                name='status'
                value={formData.status}
                onChange={handleChange}
                disabled={!((update && update.status === 'Upcoming') || update === null)}
              >
                <MenuItem value="Upcoming">{t("upcoming")}</MenuItem>
                <MenuItem value="Live">{t("live")}</MenuItem>
                <MenuItem value="Completed">{t("completed")}</MenuItem>
              </Select>
            </FormControl>
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

export default AddTournamentModal;