import { useParams, useLoaderData } from "react-router-dom";
import NavBar from "../components/NavBar";
import SyntaxHighlighter from "react-syntax-highlighter";
import { ocean } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Container from "@mui/material/Container";
import "../App.css";

interface Model {
  group: string;
  value: string;
  language: any;
}

export const loader =
  async ({ params }: any) => {
      const res = await fetch(`https://pym.jchun.me/api/display/${params.id}`);
      const data: Model = await res.json()
      return data
  };

const Display = () => {
  const { id } = useParams();
  const post = useLoaderData() as Model;

  if (post!.group === "link") {
    window.location.href = post!.value;
    return null
  }

  if (post!.group === "image") {
    return (
      <div>
        <NavBar canSave={false} value={null} language={null} />
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
        <NavBar canSave={false} value={null} language={null} />
        <SyntaxHighlighter
          language={post!.language}
          style={ocean}
          showLineNumbers={true}
          showInlineLineNumbers={true}
        >
          {post!.value}
        </SyntaxHighlighter>
      </div>
    );
  }
};
export default Display;

