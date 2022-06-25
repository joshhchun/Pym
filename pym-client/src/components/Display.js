import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import NavBar from "./NavBar";
import SyntaxHighlighter from "react-syntax-highlighter";
import { ocean } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Container from "@mui/material/Container";

const Display = () => {
  // The post ID from the URL
  let { id } = useParams();
  const [isImage, setIsImage] = useState(false);
  const [language, setLanguage] = useState("python");
  const [text, setText] = useState("");

  useEffect(() => {
    fetchData(id);
  }, []);

  const fetchData = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/${id}`);
      const data = await response.json();
      if (data.isImage) {
        setIsImage(true);
      } else {
        setIsImage(false);
        setLanguage(data.langauge);
      }
      setText(data.value);
    } catch (e) {
      console.log(e);
    }
  };

  if (isImage) {
    return (
      <div>
        <NavBar />
        <Container sx = {{
            width: "100%",
            my: "3rem",
        }}>
          <img
          style = {{
              maxWidth: "100%",
              maxHeight: "100%",
          }}
            src={require(`/usr/src/app/src/${text}`)}
            alt={"Oops! Image not here"}
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
          showLineNumbers="true"
          showInlineLineNumbers="true"
        >
          {text}
        </SyntaxHighlighter>
      </div>
    );
  }
};
export default Display;
