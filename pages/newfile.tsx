import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import Container from "@mui/material/Container";
import NavBar from "../components/NavBar";
import { useRouter } from "next/router";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

interface Response {
    shortId: string;
}
// , FilePondPluginFileEncode
const NewPost = (props: any) => {
    const router = useRouter();

    return (
        <div>
            <NavBar />
            <Container sx={{ my: "8rem" }}>
                <FilePond
                    className="fp"
                    allowMultiple={false}
                    maxFiles={1}
                    server={{
                        process: {
                            url: "https://pym.jchun.me/api/save/",
                            onload: (response: string): any => {
                                const data: Response = JSON.parse(response);
                                router.push(`/${data.shortId}`);
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
