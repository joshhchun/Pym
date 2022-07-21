import { useState } from "react";
import { languages } from "../languages";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NavBar from "../components/NavBar";
import {
    TextField,
    InputLabel,
    FormControl,
    Autocomplete,
} from "@mui/material";
import React from "react";

const theme = createTheme({
    palette: {
        primary: {
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
            <NavBar canSave={true} value={value} language={language} />
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
                                            boxShadow:
                                                "0 0 0 0.2rem rgba(255, 255, 255, .5)",
                                        },
                                    },
                                }}
                                variant="standard"
                                InputProps={{
                                    ...params.InputProps,
                                    disableUnderline: true,
                                }}
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
                        color="primary"
                        id="outlined-multiline-static"
                        multiline
                        fullWidth
                        minRows={30}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => {
                            const target = e.target as HTMLInputElement;
                            const { value } = target as HTMLInputElement;
                            if (e.key === "Tab") {
                                e.preventDefault();
                                const cursorPosition = target.selectionStart;
                                const cursorEndPosition = target.selectionEnd;
                                const tab = "\t";

                                target.value =
                                    value.substring(
                                        0,
                                        cursorPosition as number
                                    ) +
                                    tab +
                                    value.substring(
                                        cursorEndPosition as number
                                    );

                                target.selectionStart =
                                    (cursorPosition as number) + 1;
                                target.selectionEnd =
                                    (cursorPosition as number) + 1;
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
