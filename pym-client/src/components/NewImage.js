import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "../App.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import NavBar from "./NavBar"

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
// , FilePondPluginFileEncode
const NewPost = (props) => {
    const [file, setFile] = useState([]);
    const navigate = useNavigate();

    return (
        <div>
            <NavBar />
            <Container sx={{ my: "8rem" }}>
                <FilePond
                    className="fp"
                    files={file}
                    onupdatefiles={setFile}
                    allowMultiple={false}
                    maxFiles={1}
                    server={{
                        url: "https://pym.jchun.me/api/save/",
                        process: {
                            onload: (response) => {
                                const data = JSON.parse(response)
                                navigate(`/${data.shortId}`);
                            },
                        },
                    }}
                    name="files"
                    labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
                />
            </Container>
        </div>
    );
};

export default NewPost;
