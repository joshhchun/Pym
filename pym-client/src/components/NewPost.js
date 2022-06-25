import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "../App.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import NavBar from "./NavBar"

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
// , FilePondPluginFileEncode
const NewPost = (props) => {
  const [file, setFile] = useState([]);
  const [link, setLink] = useState("Import an image for a link");
  const navigate = useNavigate();

  return (
    <div>
    <NavBar />
    <Container>
      <FilePond
        files={file}
        onupdatefiles={setFile}
        allowMultiple={false}
        maxFiles={1}
        server={{
          url: "http://localhost:3000/save/image",
          process: {
            onload: (response) => {
              console.log(response);
              setLink("http://localhost:4000/" + response);
              navigate(`/${response}`);
            },
          },
        }}
        name="files"
        labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
        className="fp"
      />
      <Button
        fullWidth
        variant="outlined"
        color="inherit"
        onClick={() => navigate("/newtext")}
        sx = {{
          marginTop: "2rem",
          height: "4.5rem",
          width: "93%",
          backgroundColor: "#4f555f",
          color: "rgb(218, 214, 214)",
        }}
      >
        New Text File
      </Button>
    </Container>
    </div>
  );
};

export default NewPost;
