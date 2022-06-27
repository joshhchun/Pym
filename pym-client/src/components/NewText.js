import { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { languages } from "./../languages";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CodeIcon from "@mui/icons-material/Code";
import { useNavigate } from "react-router-dom";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";

const theme = createTheme({
  palette: {
    neutral: {
      main: "#a1a1aa",
      contrastText: "#fff",
    },
  },
});

const NewText = () => {
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("python");
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    const request = { language, value };
    try {
      const response = await fetch("http://localhost:3000/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = await response.json();
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
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
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
    <ThemeProvider theme={theme}>
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
              ref={anchorRef}
              id="composition-button"
              aria-controls={open ? "composition-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              sx={{
                color: "white",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              New
            </Button>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              style = {{
                  zIndex: 4
              }}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom-start" ? "left top" : "left bottom",
                      zIndex: 3
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                        sx={{
                          backgroundColor: "#4f555f",
                          color: "white",
                        }}
                        style = {{
                            zIndex: 3
                        }}
                      >
                        <MenuItem
                          component="a"
                          href="/newtext"
                          onClick={handleClose}
                        >
                          Text
                        </MenuItem>
                        <MenuItem component = "a" href = "/newimage" onClick={handleClose}>Image</MenuItem>
                        <MenuItem onClick={handleClose}>URL</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <Button
              color="inherit"
              component="a"
              onClick={handleClick}
              sx={{ textDecorations: "none", fontWeight: "700" }}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <div>
        <FormControl
          sx={{
            mt: "3rem",
            mb: "2rem",
            width: "90%",
          }}
          focused
        >
          <InputLabel
            id="demo-customized-select-label"
            style={{ color: "#a1a1aa" }}
          >
            Language
          </InputLabel>
          <Autocomplete
            id="combo-box"
            options={languages}
            iconcomponent={undefined}
            disableClearable
            forcePopupIcon={false}
            onChange={(e, v) => {
              setLanguage(v);
            }}
            value={language}
            style = {{
                width: "20%",
                zIndex: 2
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  mt: "1rem",
                  "& .MuiInputBase-input": {
                    borderRadius: 2,
                    height: "2.5rem",
                    position: "relative",
                    textAlign: "center",
                    backgroundColor: "#2b303b",
                    border: "1px solid #a1a1aa",
                    fontSize: "1rem",
                    color: "white",
                    transition: theme.transitions.create([
                      "border-color",
                      "box-shadow",
                    ]),
                    fontFamily: [
                      "-apple-system",
                      "BlinkMacSystemFont",
                      '"Segoe UI"',
                      "Roboto",
                      '"Helvetica Neue"',
                      "Arial",
                      "sans-serif",
                      '"Apple Color Emoji"',
                      '"Segoe UI Emoji"',
                      '"Segoe UI Symbol"',
                    ].join(","),
                    "&:focus": {
                      borderRadius: 2,
                      backgroundColor: "#434852",
                      borderColor: "#e8f3ff",
                      boxShadow: "0 0 0 0.2rem rgba(255, 255, 255, .5)",
                    },
                  },
                }}
                variant="standard"
                InputProps={{ ...params.InputProps, disableUnderline: true }}
              />
            )}
          />
        </FormControl>
        <FormControl
          sx={{
            width: "90%",
          }}
        >
          <TextField
            variant="standard"
            placeholder="write text here..."
            focused
            color="neutral"
            id="outlined-multiline-static"
            multiline
            fullWidth
            minRows={30}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              const { value } = e.target;
              if (e.key === "Tab") {
                e.preventDefault();
                const cursorPosition = e.target.selectionStart;
                const cursorEndPosition = e.target.selectionEnd;
                const tab = "\t";

                e.target.value =
                  value.substring(0, cursorPosition) +
                  tab +
                  value.substring(cursorEndPosition);

                e.target.selectionStart = cursorPosition + 1;
                e.target.selectionEnd = cursorPosition + 1;
              }
            }}
            InputProps={{
              disableUnderline: true,
              style: {
                fontFamily:
                  "source-code-pro, Menlo, Monaco, Consolas, 'Courier New'",
                color: "white",
              },
            }}
          />
        </FormControl>
      </div>
    </ThemeProvider>
  );
};

export default NewText;
