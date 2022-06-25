import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CodeIcon from "@mui/icons-material/Code";

export default function NavBar(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#434852" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <CodeIcon />
          </IconButton>
          <Typography
            variant="h5"
            component="a"
            href="/"
            sx={{
              flexGrow: 1,
              textAlign: "justify",
              mt: "-4px",
              color: "inherit",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            pym
          </Typography>
          <Button
              color="inherit"
              component="a"
              href = "/new"
              sx={{ textDecorations: "none", fontWeight: "700" }}
            >
              new
            </Button>
          {props.canSave && (
            <Button
              color="inherit"
              component="a"
              sx={{ textDecorations: "none", fontWeight: "700" }}
            >
              save
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
