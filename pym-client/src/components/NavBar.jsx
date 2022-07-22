"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var material_1 = require("@mui/material");
var Code_1 = __importDefault(require("@mui/icons-material/Code"));
var react_router_1 = require("react-router");
function NavBar(props) {
    var _this = this;
    var navigate = (0, react_router_1.useNavigate)();
    var _a = (0, react_1.useState)(false), open = _a[0], setOpen = _a[1];
    var anchorRef = (0, react_1.useRef)(null);
    var handleClick = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var request, response, data, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    request = {
                        group: "text",
                        language: props.language,
                        value: props.value,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("https://pym.jchun.me/api/save", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(request),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log("response " + data);
                    navigate("/".concat(data.shortId));
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.log(e_1.message);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleToggle = function () {
        setOpen(function (prevOpen) { return !prevOpen; });
    };
    var handleClose = function (event) {
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
    var prevOpen = (0, react_1.useRef)(open);
    (0, react_1.useEffect)(function () {
        if (prevOpen.current === true && open === false) {
            if (anchorRef.current)
                anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);
    return (<material_1.Box sx={{ flexGrow: 1 }}>
            <material_1.AppBar position="sticky" sx={{ backgroundColor: "#353b48" }}>
                <material_1.Toolbar>
                    <material_1.IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, color: "white" }}>
                        <Code_1.default />
                    </material_1.IconButton>
                    <material_1.Typography variant="h5" component="a" href="/" sx={{
            flexGrow: 1,
            textAlign: "justify",
            mt: "-4px",
            color: "white",
            textDecoration: "none",
            fontWeight: "700",
        }}>
                        pym
                    </material_1.Typography>
                    <material_1.Button ref={anchorRef} id="composition-button" aria-controls={open ? "composition-menu" : undefined} aria-expanded={open ? "true" : undefined} aria-haspopup="true" onClick={handleToggle} sx={{
            textTransform: "none",
            fontSize: "1.2rem",
            color: "white",
            textDecoration: "none",
            fontWeight: "700",
        }}>
                        new
                    </material_1.Button>
                    <material_1.Popper open={open} anchorEl={anchorRef.current} role={undefined} placement="bottom-start" transition disablePortal style={{
            zIndex: 4,
        }}>
                        {function (_a) {
            var TransitionProps = _a.TransitionProps, placement = _a.placement;
            return (<material_1.Grow {...TransitionProps} style={{
                    transformOrigin: placement === "bottom-start"
                        ? "left top"
                        : "left bottom",
                }}>
                                <material_1.Paper elevation={4}>
                                    <material_1.ClickAwayListener onClickAway={handleClose}>
                                        <material_1.MenuList autoFocusItem={open} id="composition-menu" aria-labelledby="composition-button" onKeyDown={handleListKeyDown} sx={{
                    backgroundColor: "#334756",
                    color: "white",
                }}>
                                            <material_1.MenuItem style={{
                    fontWeight: 700,
                }} component="a" href="/newtext" onClick={handleClose}>
                                                text
                                            </material_1.MenuItem>
                                            <material_1.MenuItem style={{
                    fontWeight: 700,
                }} component="a" href="/newfile" onClick={handleClose}>
                                                file
                                            </material_1.MenuItem>
                                            <material_1.MenuItem style={{
                    fontWeight: 700,
                }} component="a" href="/url" onClick={handleClose}>
                                                url
                                            </material_1.MenuItem>
                                        </material_1.MenuList>
                                    </material_1.ClickAwayListener>
                                </material_1.Paper>
                            </material_1.Grow>);
        }}
                    </material_1.Popper>
                    {props.canSave && (<material_1.Button color="inherit" component="a" onClick={handleClick} sx={{
                textTransform: "none",
                fontSize: "1.2rem",
                color: "white",
                textDecorations: "none",
                fontWeight: "700",
            }}>
                            save
                        </material_1.Button>)}
                </material_1.Toolbar>
            </material_1.AppBar>
        </material_1.Box>);
}
exports.default = NavBar;
