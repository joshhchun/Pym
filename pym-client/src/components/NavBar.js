import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { AppBar, Box, Toolbar, Typography, Button, IconButton, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList, } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import { useNavigate } from "react-router-dom";
export default function NavBar(props) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const navigate = useNavigate();
    const handleClick = async (e) => {
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
            const data = await response.json();
            navigate(`/${data.shortId}`);
        }
        catch (e) {
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
        }
        else if (event.key === "Escape") {
            setOpen(false);
        }
    }
    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            if (anchorRef.current)
                anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);
    return (_jsx(Box, { sx: { flexGrow: 1 }, children: _jsx(AppBar, { position: "sticky", sx: { backgroundColor: "#353b48" }, children: _jsxs(Toolbar, { children: [_jsx(IconButton, { size: "large", edge: "start", color: "inherit", "aria-label": "menu", sx: { mr: 2, color: "white" }, children: _jsx(CodeIcon, {}) }), _jsx(Typography, { variant: "h5", component: "a", href: "/", sx: {
                            flexGrow: 1,
                            textAlign: "justify",
                            mt: "-4px",
                            color: "white",
                            textDecoration: "none",
                            fontWeight: "700",
                        }, children: "pym" }), _jsx(Button, { ref: anchorRef, id: "composition-button", "aria-controls": open ? "composition-menu" : undefined, "aria-expanded": open ? "true" : undefined, "aria-haspopup": "true", onClick: handleToggle, sx: {
                            textTransform: "none",
                            fontSize: "1.2rem",
                            color: "white",
                            textDecoration: "none",
                            fontWeight: "700",
                        }, children: "new" }), _jsx(Popper, { open: open, anchorEl: anchorRef.current, role: undefined, placement: "bottom-start", transition: true, disablePortal: true, style: {
                            zIndex: 4,
                        }, children: ({ TransitionProps, placement }) => (_jsx(Grow, { ...TransitionProps, style: {
                                transformOrigin: placement === "bottom-start"
                                    ? "left top"
                                    : "left bottom",
                            }, children: _jsx(Paper, { elevation: 4, children: _jsx(ClickAwayListener, { onClickAway: handleClose, children: _jsxs(MenuList, { autoFocusItem: open, id: "composition-menu", "aria-labelledby": "composition-button", onKeyDown: handleListKeyDown, sx: {
                                            backgroundColor: "#334756",
                                            color: "white",
                                        }, children: [_jsx(MenuItem, { style: {
                                                    fontWeight: 700,
                                                }, component: "a", href: "/newtext", onClick: handleClose, children: "text" }), _jsx(MenuItem, { style: {
                                                    fontWeight: 700,
                                                }, component: "a", href: "/newfile", onClick: handleClose, children: "file" }), _jsx(MenuItem, { style: {
                                                    fontWeight: 700,
                                                }, component: "a", href: "/url", onClick: handleClose, children: "url" })] }) }) }) })) }), props.canSave && (_jsx(Button, { color: "inherit", component: "a", onClick: handleClick, sx: {
                            textTransform: "none",
                            fontSize: "1.2rem",
                            color: "white",
                            textDecorations: "none",
                            fontWeight: "700",
                        }, children: "save" }))] }) }) }));
}
