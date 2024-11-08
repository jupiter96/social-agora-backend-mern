import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  InputBase,
  Typography, 
  Card, 
  CardActionArea, 
  CardContent,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme, 
  Tabs, 
  Tab
} from '@mui/material';
import { PhotoCamera, Search  } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useCreateGameMutation, useEditGameMutation, useGetAllCategoriesQuery } from "state/api";

import { FlexBetween } from "../../components/";
import axios from 'axios';

const AddGameModal = ({ open, onClose, update, processHandle, severityHandle, messageHandle, showToastHandle }) => {
  const [formData, setFormData] = useState({
    id: update?._id ? update._id:'',
    game_name: update?.game_name ? update.game_name:'',
    category: update?.category ? update.category:'',
    imgUrl: update?.imgUrl ? update.imgUrl:null,
    description: update?.description ? update.description:'',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const theme = useTheme();
  const { t } = useTranslation();
  const [createGame] = useCreateGameMutation();
  const [editGame] = useEditGameMutation();
  const { data: getAllCategories } = useGetAllCategoriesQuery();
  const categoryData = getAllCategories;
  const [rawgGame, setRawgGame] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [rawgCategory, setRawgCategory] = useState('');

  const handleSelectGame = (gameId) => {
    setSelectedGameId(gameId);
  };

  const fetchGames = async (query) => {
    try {
      const response = await axios.get(`https://api.rawg.io/api/games?key=1c66752ad16445ce8dc58a490a5f639a&search=${query}`);
      setGames(response?.data?.results);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const GameCard = ({ game, isSelected, onSelect }) => {
    return (
      <Card
        sx={{
          position: 'relative',
          width: 110,
          height: 130,
          margin: 1,
          border: isSelected ? '5px solid #22c274' : 'none',
          borderRadius: 5,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.05)', // Scale effect on hover
          },
        }}
        onClick={onSelect}
      >
        <CardActionArea sx={{ position: 'relative', height: '100%' }}>
          <Box
            component="img"
            src={game.background_image? game.background_image:'https://rawg.io/assets/en/apple-icon-180x180.png?v=4'}
            alt={game.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          />
          <CardContent
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6">{game.name}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  // Effect to call fetchGames when searchTerm changes
  useEffect(() => {
    if (searchTerm) {
      fetchGames(searchTerm);
    } else {
      setGames([]); // Clear the list if the search term is empty
    }
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTabChange = (event, newValue) => {
    setRawgGame(newValue);
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
      if(formData.game_name !== '' && formData.imgUrl !== '' && formData.category !== ''){
        try {
          const response = await editGame(formData).unwrap();
          if(response.error){
            alert(response.error);
          }else{
            console.log("response", response);
            processHandle(false);
            severityHandle('success');
            messageHandle(t('success'));
            showToastHandle(true);
            setFormData(null);
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
      if(formData.game_name !== '' && formData.imgUrl !== '' && formData.category !== ''){
        try {
          const response = await createGame(formData).unwrap();
          if(response.error){
            alert(response.error);
          }else{
            console.log("response::::::::::", response);
            processHandle(false);
            severityHandle('success');
            messageHandle(t('success'));
            showToastHandle(true);
            setFormData(null);
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

  const rawghandleSubmit = async (e) => {
    e.preventDefault();
    processHandle(true);
      if(selectedGameId){
        const selectGame = games.filter((item)=>item.id === selectedGameId)[0];
        try {
          const response = await createGame({
            game_name: selectGame.name,
            category: rawgCategory,
            imgUrl: selectGame.background_image,
            description: `rawg-game: ${selectGame.id}`,
          }).unwrap();
          if(response.error){
            alert(response.error);
          }else{
            console.log("response::::::::::", response);
            processHandle(false);
            severityHandle('success');
            messageHandle(t('success'));
            showToastHandle(true);
            setFormData(null);
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
  };

  useEffect(()=>{
    if(update?._id){
      setFormData({
        id: update?._id ? update._id:'',
        game_name: update?.game_name ? update.game_name:'',
        category: update?.category ? update.category:'',
        imgUrl: update?.imgUrl ? update.imgUrl:null,
        description: update?.description ? update.description:'',
      });
      setImagePreview(update?.imgUrl ? update.imgUrl:null);
      setRawgGame(1);
    }
  }, [update])
  return (
    <Dialog open={open} onClose={onClose}>
      {update?._id ? (<DialogTitle>{t("edit")} {t("game")}</DialogTitle>) : (<DialogTitle>{t("addGame")}</DialogTitle>)}
      <DialogContent>

      <Tabs
        value={rawgGame}
        onChange={handleTabChange}
        sx={{
          overflowX: 'auto',
          display: 'flex',
          flexWrap: 'nowrap', // Prevent wrapping of tabs
          '& .MuiTab-root': {
            fontSize: { xs: '14px', sm: '16px' }, // Responsive font size
            color: theme.palette.secondary.light,
            backgroundColor: 'transparent',
            borderRadius: '15px',
            minWidth: '120px', // Ensure minimum width for touch targets
            padding: '10px', // Adjust padding for better touch area
          },
          '& .Mui-selected': {
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.background.alt,
          },
        }}
      >
        {!update?._id &&(<Tab label={t('Rawg.io')} />)}
        {!update?._id &&(<Tab label={t('manual')} />)}
      </Tabs>
      {rawgGame === 0 && (
        <Box sx={{marginTop: 5}}>
          <Box sx={{marginBottom: 2, minWidth: 240, flexDirection: 'row'}}>
            <InputLabel>{t("category")}</InputLabel>
            <Select
              sx={{width: '100%', marginTop: 1}}
              value={rawgCategory}
              onChange={(e)=>setRawgCategory(e.target.value)}
            >
              {categoryData?.map((item, index)=>(<MenuItem value={item._id} key={index}>{item.category_name}</MenuItem>))}
            </Select>
          </Box>
          <FlexBetween
            backgroundColor={theme.palette.background.alt}
            borderRadius="59px"
            gap="1rem"
            p="0.1rem 1.5rem"
            title="Search"
          >
            <InputBase placeholder={`${t('search')}`} onChange={(e) => setSearchTerm(e.target.value)} />
            <IconButton onClick={() => fetchGames(searchTerm)}>
              <Search />
            </IconButton>
          </FlexBetween>

          <Box sx={{ marginTop: 2, justifyContent: 'center', display: 'flex', flexWrap: 'wrap' }}>
            {games?.length > 0 ? (
              games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isSelected={selectedGameId === game.id}
                  onSelect={() => handleSelectGame(game.id)}
                />
              ))
            ) : (
              <Typography>{t("notfound")}</Typography>
            )}
          </Box>
        </Box>
      )}
      {rawgGame === 1 && (
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
            label={t("title")}
            name="game_name"
            fullWidth
            margin="normal"
            value={formData.game_name}
            onChange={handleChange}
            multiline
            rows={2}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>{t("category")}</InputLabel>
            <Select
              name='category'
              value={formData.category}
              onChange={handleChange}
            >
              {categoryData?.map((item, index)=>(<MenuItem value={item._id} key={index}>{item.category_name}</MenuItem>))}
            </Select>
          </FormControl>
          <TextField
            label={t("description")}
            name="description"
            fullWidth
            margin="normal"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </form>
      )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{borderRadius: 50}} variant="contained">{t('cancel')}</Button>
        <Button type="submit" onClick={rawgGame === 1 ? handleSubmit:rawghandleSubmit} variant="contained" 
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

export default AddGameModal;