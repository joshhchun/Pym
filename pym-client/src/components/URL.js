import TextField from "@mui/material/TextField";
import { useState } from "react";
import NavBar from "./NavBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { InputLabel } from "@mui/material";
import { FormControl } from "@mui/material";
import { IconButton } from "@mui/material";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import "../App.css";

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
  const [url, setUrl] = useState("");

  const handleClick = async (e) => {
    e.preventDefault();
    const request = { value, group: "link" }
    try {
      const response = await fetch("https://api.pym.jchun.me/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = await response.json();
      console.log("SHORTURL RESPONSE " + data);
      setUrl(`https://pym.jchun.me/${data.shortId}`);
      setSuccess(true);
    } catch (e) {
      console.log(e.message);
    }
  };


  return (
    <div>
      <ThemeProvider theme={theme}>
        <NavBar />
        <FormControl
          sx={{
            mt: "8rem",
            mb: "2rem",
            width: "80%",
          }}
          focused
        >
          <InputLabel
            id="demo-customized-select-label"
            style={{ color: "#a1a1aa" }}
          >
            Input URL
          </InputLabel>
          <div className="copy">
            <TextField
              placeholder="paste url here..."
              variant="standard"
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
              sx={{
                mt: "1rem",
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
                },
              }}
              color="neutral"
              id="standard-basic"
              InputProps={{ disableUnderline: true }}
            />
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleClick}
              sx={{ mt: "7rem", position: "relative", left: "1rem", bottom: "6rem" }}
            >
              <UploadFileIcon sx={{ fontSize: "2rem", color: "white" }} />
            </IconButton>
          </div>
          <div className="copy">
            <TextField
              sx={{
                mt: "5rem",
                "& .MuiInputBase-input": {
                  backgroundColor: success ? "rgba(119, 221, 119, .2)" : null,
                  borderRadius: 2,
                  height: "2.5rem",
                  position: "relative",
                  textAlign: "center",
                  fontSize: "1rem",
                  color: "white",
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
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => {
                navigator.clipboard.writeText(url);
              }}
              sx={{ mt: "7rem", position: "relative", left: "1rem", bottom: "0.5rem" }}
            >
              <ContentPasteGoIcon sx={{ fontSize: "1.8rem", color: "white" }} />
            </IconButton>
          </div>
        </FormControl>
      </ThemeProvider>
    </div>
  );
};

export default URL;
