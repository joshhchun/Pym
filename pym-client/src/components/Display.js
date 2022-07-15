import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";
import SyntaxHighlighter from "react-syntax-highlighter";
import { ocean } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Container from "@mui/material/Container";

const Display = () => {
  let { id } = useParams();
  // The post ID from the URL
  const [isImage, setIsImage] = useState(false);
  const [language, setLanguage] = useState("python");
  const [text, setText] = useState("");

  // Fetch the data from backend & database
  useEffect(() => {
    // Function to fetch the data from backend
    const fetchData = async (id) => {
      try {
        const response = await fetch(`https://pym.jchun.me/api/display/${id}`);
        const data = await response.json();
        // If there is no data response then there is no post with the inputed ID
        if (!data) {
          setIsImage(false);
          setLanguage("plaintext");
          setText("No post with that ID! Sorry :P");
        } else {
          if (data.group === "link") {
            if (data.value.startsWith("https://")) window.location.href = data.value;
            else window.location.href = "https://" + data.value;
            return;
          }
          else if (data.group === "image") {
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
            src={"https://pym.jchun.me/api/" + id}
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
          className={"syntax-highlighter"}
          language={language}
          style={ocean}
          showLineNumbers="true"
          showInlineLineNumbers="true"
        >
          {text}
        </SyntaxHighlighter>
      </div>
    );
  };
}
export default Display;