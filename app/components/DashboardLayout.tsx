"use client";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
    setCookie("user", "", { maxAge: -1 });
    router.push("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar className="header" position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bioverse
          </Typography>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome {user?.username ?? "Guest"}
          </Typography>

          <Button variant="contained" className="login-button" onClick={handleLogout}>
            Logout
          </Button>
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
        <Typography variant="h6">Bioverse</Typography>
        <Typography variant="body2">© 2026 Bioverse. All rights reserved.</Typography>
      </Box>
    </Box>
  );
}