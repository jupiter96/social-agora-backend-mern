import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Avatar, Button, TextField, useTheme, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import logo from "assets/adaptive-icon.png";
import { useNavigate } from "react-router-dom";
import { useGetLoginMutation } from "state/api";
import { useDispatch } from 'react-redux';
import { setUser } from "state";
import { ToastNotification } from "components";
import { useTranslation } from 'react-i18next';

const Login = () => {

    const theme = useTheme();
    const paperStyle={padding: 20, height:'80%', width: 400, margin:"19px auto" ,backgroundColor: theme.palette.background.alt, borderRadius: '12px', boxShadow: '0px 0px 8px rgba(0, 0, 0, 25)'}
    const avatarStyle={backgroundColor:theme.palette.background.alt}
    const btnstyle={backgroundColor:'#22c274',margin:'12px 0', borderRadius: 50}
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [getLogin] = useGetLoginMutation();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const dispatch = useDispatch();
    const [showToast, setShowToast] = React.useState(false);
    const [severity, setSeverity] = React.useState('success');
    const [message, setMessage] = React.useState('');

    const login = async () => {
        if(username !== '' && password !== ''){
            try {
              const response = await getLogin({ username, password }).unwrap();
              if(response.error){
                setMessage(response.error);
                setSeverity('error');
                setShowToast(true);
              }else{
                if(response.role === "Admin"){
                    localStorage.setItem("token", response.token);
                    dispatch(setUser(response));
                    setMessage(t('success'));
                    setSeverity('success');
                    setShowToast(true);
                    navigate('/dashboard');
                }else{
                    setMessage(t('accessError'));
                    setSeverity('error');
                    setShowToast(true);
                }
              }
            } catch (error) {
                setMessage(t('failed'));
                setSeverity('error');
                setShowToast(true);
            }
        }else{
            setMessage(t('loginError'));
            setSeverity('error');
            setShowToast(true);
        }
      };

      
    const hideToast = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setShowToast(false);
      };

    return(
        
        <Grid>
                <Grid align='center'>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                        <img src={logo} alt="Logo" style={{ height: '150px' }} />
                    </Box>
                </Grid>  
             
            
            <Paper elavation={12} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle} sx={{width: 60, height: 60}}><LockOutlinedIcon style={{ color: '#22c274', fontSize: 30 }} /></Avatar>
                    <h2 style={{ color: '#22c274' }}>Login</h2>
                </Grid>
                <TextField 
                sx={{backgroundColor: theme.palette.background.alt, marginBottom: 2}}
                onChange={(e)=>setUsername(e.target.value)}
                label="Username" variant="outlined" placeholder='Enter Your Username' fullWidth required/>
                <TextField 
                sx={{backgroundColor: theme.palette.background.alt}}
                onChange={(e)=>setPassword(e.target.value)}
                label="Password" variant="outlined" placeholder='Enter Your Password' type='password' fullWidth required/>
                <FormControlLabel control={<Checkbox defaultChecked sx={{'&.Mui-checked': {
                    color: '#22c274',
                }}} />} label="Remember Me" />

                <Button style={btnstyle} type='button' color='primary' variant="contained" onClick={()=>login()} fullWidth>Login</Button>
            </Paper>
            <ToastNotification open={showToast} message={message} severity={severity} hideToast={hideToast} />
        </Grid>
        
    )
}

export default Login