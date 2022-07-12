import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import SyntaxHighlighter from "react-syntax-highlighter";
import { ocean } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";

const Display = () => {
    const router = useRouter();
    let { id } = router.query;
    // The post ID from the URL
    const [isImage, setIsImage] = useState(false);
    const [language, setLanguage] = useState("python");
    const [text, setText] = useState("");

    interface Model {
        group: string;
        value: string;
        language: any;
    }

    // Fetch the data from backend & database
    useEffect(() => {
        // Function to fetch the data from backend
        const fetchData = async (id: string | string[] | undefined) => {
            try {
                const response = await fetch(`http://localhost:3000/api/${id}`);
                const data: Model = await response.json();
                console.log(data);
                // If there is no data response then there is no post with the inputed ID
                if (!data) {
                    setIsImage(false);
                    setLanguage("plaintext");
                    setText("No post with that ID! Sorry :P");
                } else {
                    if (data.group === "link") {
                        window.location.href = data.value;
                    } else if (data.group === "image") {
                        setIsImage(true);
                    } else if (data.group === "text") {
                        setIsImage(false);
                        setLanguage(data.language);
                        setText(data.value);
                    }
                }
            } catch (e) {
                console.log(e.message);
            }
        };
        fetchData(id);
    }, []);
    if (isImage) {
        return (
            <div>
                <NavBar />
                <Container
                    sx={{
                        width: "100%",
                        my: "3rem",
                    }}
                >
                    <img
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                        }}
                        src={"https://pym.jchun.me/api/image/" + id}
                        alt={"Not loading properly!"}
                    />
                </Container>
            </div>
        );
    } else {
        return (
            <div className="text">
                <NavBar />
                <SyntaxHighlighter
                    language={language}
                    style={ocean}
                    showLineNumbers={true}
                    showInlineLineNumbers={true}
                >
                    {text}
                </SyntaxHighlighter>
            </div>
        );
    }
};
export default Display;
