import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { InputLabel } from "@mui/material";
import { FormControl } from "@mui/material";
import { IconButton } from "@mui/material";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import Grid from "@mui/material/Grid";

const theme = createTheme({
  palette: {
    neutral: {
      main: "#747d8e",
      contrastText: "#fff",
    },
    valid: {
      main: "#029d02",
      contrastText: "white",
    },
  },
});

const URL = (props) => {
  const [value, setValue] = useState("");
  const [success, setSuccess] = useState(false);
  const [url, setUrl] = useState("https://pym.jchun.me/yeah");
  return (
    <div>
      <ThemeProvider theme={theme}>
        <NavBar />
        <FormControl
          sx={{
            mt: "5rem",
            mb: "2rem",
            width: "90%",
          }}
          focused
        >
          <InputLabel
            id="demo-customized-select-label"
            style={{ color: "#a1a1aa" }}
          >
            Input URL
          </InputLabel>
          <TextField
            placeholder="paste url here..."
            // fullWidth
            variant="standard"
            sx={{
              my: "1rem",
              "& .MuiInputBase-input": {
                borderRadius: 2,
                height: "2.5rem",
                position: "relative",
                textAlign: "center",
                backgroundColor: "#434852",
                border: "1px solid #a1a1aa",
                fontSize: "1rem",
                color: "white",
                boxShadow: "0 0 0 0.1rem rgba(255, 255, 255, .5)",
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
              },
            }}
            color="neutral"
            id="standard-basic"
            InputProps={{ disableUnderline: true }}
          />
          <Grid container spacing={1}>
            <Grid item xs={11}>
              <TextField
                sx={{
                  mt: "5rem",
                  "& .MuiInputBase-input": {
                    height: "2.5rem",
                    position: "relative",
                    textAlign: "center",
                    fontSize: "1rem",
                    color: "white",
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
                  },
                }}
                focused
                fullWidth
                placeholder="Generated Short URL will appear here..."
                id="outlined-read-only-input"
                variant="standard"
                color={success ? "valid" : "neutral"}
                label="Generated Short URL"
                value={url}
                InputProps={{
                  readOnly: true,
                }}
              />
              </Grid>
              <Grid item xs={1}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => {
                  navigator.clipboard.writeText(url);
                }}
                sx={{ mt: "7rem"}}
              >
                <ContentPasteGoIcon />
              </IconButton>
            </Grid>
          </Grid>
        </FormControl>
      </ThemeProvider>
    </div>
  );
};

export default URL;
