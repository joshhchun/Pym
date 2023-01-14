import { Prism } from "@mantine/prism";
import { Container } from "@mantine/core";
import { useLoaderData, useParams } from "react-router-dom";
import "../App.css";

interface Model {
    group: string;
    value: string;
    language: any;
}

export const loader = async ({ params }: any) => {
    const res = await fetch(`https://pym.jchun.me/api/display/${params.id}`);
    const data: Model = await res.json();
    return data;
};

const Display = () => {
    const { id } = useParams();
    const post = useLoaderData() as Model;
    if (!post) return null;

    if (post.group === "link") {
        window.location.href = post.value;
        return null;
    }

    return (
        <Container>
            {post.group === "image" ? (
                <img
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                    }}
                    src={"https://pym.jchun.me/api/" + id}
                    alt={"Not loading properly!"}
                />
            ) : (
                <Prism
                    sx={{ textAlign: "left" }}
                    withLineNumbers
                    language={post.language}
                >
                    {post.value}
                </Prism>
            )}
        </Container>
    );
};
export default Display;
