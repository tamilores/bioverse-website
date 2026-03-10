"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import "./page.css";
import { Box, Tab, Tabs, Paper, Button, TextField, Typography, 
    FormControlLabel, Checkbox, Divider } from "@mui/material";
import { setCookie } from 'cookies-next';


const HARDCODED_USERS = [
    {id: 1, username: "tami", password: "usertami", isAdmin: false},
    {id: 2, username: "semi", password: "usersemi", isAdmin: false},
    {id: 3, username: "carla", password: "admincarla", isAdmin: true},
    {id: 4, username: "femi", password: "adminfemi", isAdmin: true}
]


export default function Login() {
    const router = useRouter();
    const { setUser } = useUser();
    const [role, setRole] = useState("user");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const handleLogin = () => {
        const normalizedUsername = username.trim();

        if (!normalizedUsername || !password) {
            alert("Please fill in all fields");
            return;
        }

        const matchedUser = HARDCODED_USERS.find(
            (u) => u.username === normalizedUsername && u.password === password
        );

        if (!matchedUser) {
            alert("Invalid username/password");
            return;
        }

        if (role === "admin" && !matchedUser.isAdmin) {
        alert("This is not an admin account.");
            return;
        }

        if (role === "user" && matchedUser.isAdmin) {
        alert("This is not a user account.");
            return;
        }

        setUser({
            id: matchedUser.id,
            username: matchedUser.username,
            isAdmin: matchedUser.isAdmin,
        });

        setCookie("user", JSON.stringify({
            id: matchedUser.id,
            username: matchedUser.username,
            isAdmin: matchedUser.isAdmin,
        }), { sameSite: "lax" });

        router.push(matchedUser.isAdmin ? "/admin" : "/user");
    };
    
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
                <TextField required label="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextField required label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div>
                    <FormControlLabel control={<Checkbox />} label={<Typography variant="body2">Remember me</Typography>}/>
                    <Typography variant="body2">Forgot password?</Typography>
                </div>              
                <Button
                variant="contained"
                className="login-button"
                onClick={handleLogin} >
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

