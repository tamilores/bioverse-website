import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function UserLayout({ children, }: { children: React.ReactNode }) {
    return (
    <>
        <AppBar className="header" position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  b
                </Typography>
            
                <IconButton color="inherit">
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>

        <main>{children}</main>

            <Box
                  className="footer"
                  sx={{
                    backgroundColor: "#333",
                    color: "white",
                    padding: 2,
                    bottom: 0,
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
    </>
    )
}