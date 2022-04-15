import React,{useState} from 'react'
import {Box, TextField, Button} from '@material-ui/core';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { CryptoState } from '../../CryptoContext';

// handleClose is passed from AuthModal
const Login = ({handleClose}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const {setAlert} = CryptoState()

  const handleSubmit = async () => {
    if (!password || !password) {
        setAlert({
            open: true,
            message:"Please fill all the fields",
            type:'error'
        })
        return;
    }

    try {
        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        console.log(result);
        setAlert({
            open: true,
            message: `Login successful. Welcome ${result.user.email}`,
            type: "success",
        })
        handleClose();
    } catch (error) {
        setAlert({
            open: true,
            message: error.message,
            type:"error",
        });
        return;
    }
  } 

    return (
    <Box
    p={3}
    style={{
        display:"flex",
        flexDirection: "column",
        gap:"20px"
    }}
    >
        <TextField 
            variant = "outlined"
            type="email"
            label="Enter email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            fullWidth
        />
        <TextField 
            variant = "outlined"
            type="password"
            label="Enter password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            fullWidth
        />
        <Button
        variant="contained"
        size="large"
        style={{backgroundColor:"gold"}}
        onClick={handleSubmit}
        >
            Login
        </Button>    
</Box>)
}

export default Login