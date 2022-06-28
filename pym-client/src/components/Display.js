import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

  // Fetch the data from backend & database
  useEffect(() => {
    fetchData(id);
  }, []);

  // Function to fetch the data from backend
  const fetchData = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/${id}`);
      const data = await response.json();
      console.log(data.value);
      // If there is no data response then there is no post with the inputed ID
      if (!data) {
        setIsImage(false);
        setLanguage("plaintext");
        setText("No post with that ID! Sorry :P");
      } else {
        if (data.group === "image") {
          setIsImage(true);
          setText(data.value);
        } else if (data.group === "text") {
          setIsImage(false);
          setLanguage(data.langauge);
          console.log(data.language);
          setText(data.value);
        } else if (data.group === "link") {
          window.location.href = data.value;
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  };

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
