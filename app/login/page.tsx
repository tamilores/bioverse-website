'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import "./page.css";
import { Box, Tab, Tabs, Paper, Button, TextField, Typography, 
    FormControlLabel, Checkbox, Divider } from "@mui/material";


function Login(){
    const router = useRouter();
    const [role, setRole] = useState("user");
    const page = (role === "admin" ? "/admin" : "/user");

    return(
        <>
        <Box className= "login-container">
            <Tabs 
            className= "tabs"
            value={role}
            onChange={(_, newValue) => setRole(newValue)}>
                <Tab
                label="User"
                value="user" 
                className= "tab"/>

                <Tab
                label="Admin"
                value="admin"
                className= "tab" />
            </Tabs>

            <Paper className={`${role === "admin" ? "admin-form" : "user-form"}-container`}>
                <Typography variant="h3">log in</Typography>
                <TextField label="Email" type="email"/>
                <TextField label="Password" type="password" />
                <div>
                    <FormControlLabel control={<Checkbox />} label={<Typography variant="body2">Remember me</Typography>}/>
                    <Typography variant="body2">Forgot password?</Typography>
                </div>              
                <Button
                variant="contained"
                className="login-button"
                onClick={() => router.push(page)} 
                >
                    Login
                </Button>
                <Divider>
                    <Typography variant="body2" color="text.secondary">OR</Typography>
                </Divider>
                <Typography variant="body2" color="text.secondary">Sign Up</Typography>
            </Paper>
        </Box>
        </>
    )   
}

export default Login;