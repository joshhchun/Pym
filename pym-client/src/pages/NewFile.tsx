import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import { Container } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import "../App.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

interface Response {
    shortId: string;
}
const NewPost = (props: any) => {
    const navigate = useNavigate();
    return (
            <Container>
                <FilePond
                    className="fp"
                    allowMultiple={false}
                    maxFiles={1}
                    server={{
                        process: {
                            url: "https://pym.jchun.me/api/save/",
                            onload: (response: string): any => {
                                const data: Response = JSON.parse(response);
                                navigate(`/${data.shortId}`);
                            },
                        },
                    }}
                    name="files"
                    labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
                />
            </Container>
    );
};

export default NewPost;
