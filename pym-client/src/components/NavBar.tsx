import { useState, useRef, useEffect } from "react";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    ClickAwayListener,
    Grow,
    Paper,
    Popper,
    MenuItem,
    MenuList,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import { useNavigate } from "react-router";

interface Data {
    shortId: string;
}

interface Props {
  canSave: boolean;
  value: string | null;
  language: string | null;
}

export default function NavBar(props: Props) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<any>(null);

    const handleClick = async (e: any) => {
        e.preventDefault();
        const request = {
            group: "text",
            language: props.language,
            value: props.value,
        };
        try {
            const response = await fetch("https://pym.jchun.me/api/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request),
            });
            const data: Data = await response.json();
            console.log("response " + data);
            navigate(`/${data.shortId}`);
        } catch (e: any) {
            console.log(e.message);
        }
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: { target: any }) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event: any) {
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
            if (anchorRef.current) anchorRef.current.focus();
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
                                        placement === "bottom-start"
                                            ? "left top"
                                            : "left bottom",
                                }}
                            >
                                <Paper elevation={4}>
                                    <ClickAwayListener
                                        onClickAway={handleClose}
                                    >
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
                                                href="/newfile"
                                                onClick={handleClose}
                                            >
                                                file
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
