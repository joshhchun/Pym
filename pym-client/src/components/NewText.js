import { useState } from "react";
import { languages } from "./../languages";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NavBar from "./NavBar";
import {
  TextField,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";

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

  return (
    <ThemeProvider theme={theme}>
      <NavBar canSave={true} value={value} language={language}/>
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
            style={{
              width: "20%",
              zIndex: 2,
            }}
            renderInput={(params) => (
              <TextField
              focused
                {...params}
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
                    transition: theme.transitions.create([
                      "border-color",
                      "box-shadow",
                    ]),
                    "&:focus": {
                      borderRadius: 2,
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
