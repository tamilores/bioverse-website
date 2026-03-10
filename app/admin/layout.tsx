"use client";

import { Button, AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useUser } from "../context/UserContext";
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';

export default function AdminLayout({ children, }: { children: React.ReactNode }) {
    const { user, setUser } = useUser();
    const router = useRouter();
    const handleLogout = () => {
        setUser(null);
        setCookie("user", "", { maxAge: -1 });
        router.push("/login")
    }

    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <AppBar className="header" position="static">
              <Toolbar>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    b
                  </Typography>

                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Welcome {user ? user.username : "Guest"}
                    </Typography>

                  <Button
                    variant="contained"
                    className="login-button"
                    onClick={handleLogout} >
                      Logout
                  </Button>

                  <IconButton color="inherit">
                      <MenuIcon />
                  </IconButton>
              </Toolbar>
          </AppBar>

          <Box component="main" sx={{ flex: 1 }}>
              {children}
          </Box>

          <Box
            className="footer"
            sx={{
              backgroundColor: "#333",
              color: "white",
              padding: 2,
              width: "100%",
            }}
          >
            <Typography variant="h6">
              b
            </Typography>

            <Typography variant="body2">
              © 2026 Bioverse. All rights reserved.
            </Typography>
          </Box>
      </Box>
      )
}