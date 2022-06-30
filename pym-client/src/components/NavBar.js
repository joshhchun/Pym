import { useState, useRef, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CodeIcon from "@mui/icons-material/Code";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { useNavigate } from "react-router";

export default function NavBar(props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleClick = async (e) => {
    e.preventDefault();
    const request = { group: "text", language: props.language, value: props.value };
    try {
      const response = await fetch("https://api.pym.jchun.me/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = await response.json();
      console.log("response " + data);
      navigate(`/${data.shortId}`);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ backgroundColor: "#353b48" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, color: "white" }}
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
              color: "white",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            pym
          </Typography>
          <Button
            ref={anchorRef}
            id="composition-button"
            aria-controls={open ? "composition-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            sx={{
              textTransform: "none",
              fontSize: "1.2rem",
              color: "white",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            new
          </Button>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
            style={{
              zIndex: 4,
            }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom-start" ? "left top" : "left bottom",
                }}
              >
                <Paper elevation={4}>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                      onKeyDown={handleListKeyDown}
                      sx={{
                        backgroundColor: "#334756",
                        color: "white",
                      }}
                    >
                      <MenuItem
                        style={{
                          fontWeight: 700,
                        }}
                        component="a"
                        href="/newtext"
                        onClick={handleClose}
                      >
                        text
                      </MenuItem>
                      <MenuItem
                        style={{
                          fontWeight: 700,
                        }}
                        component="a"
                        href="/newimage"
                        onClick={handleClose}
                      >
                        image
                      </MenuItem>
                      <MenuItem
                        style={{
                          fontWeight: 700,
                        }}
                        component="a"
                        href="/url"
                        onClick={handleClose}
                      >
                        url
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          {props.canSave && (
            <Button
              color="inherit"
              component="a"
              onClick={handleClick}
              sx={{
                textTransform: "none",
                fontSize: "1.2rem",
                color: "white",
                textDecorations: "none",
                fontWeight: "700",
              }}
            >
              save
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
