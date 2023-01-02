import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import SyntaxHighlighter from "react-syntax-highlighter";
import { ocean } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Container from "@mui/material/Container";
import "../App.css";
import { useQuery } from "@tanstack/react-query";

interface Model {
  group: string;
  value: string;
  language: any;
}

export async function getPost(id: string) {
  const response = await fetch(`http://127.0.0.1:8000/api/display/${id}`);
  const response_data: Model = await response.json();
  return response_data ?? null;
}

const postQuery = (id: string) => ({
  queryKey: ["post", id],
  queryFn: async () => {
    const post = await getPost(id);
    if (!post) {
      throw new Response("", {
        status: 404,
        statusText: "Not Found",
      });
    }
    return post;
  },
});

export const loader =
  (queryClient: any) =>
  //@ts-ignore
  async ({ params }) => {
    const query = postQuery(params.id);
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const Display = () => {
  let { id } = useParams();
  //@ts-ignore
  const { data: post } = useQuery(postQuery(id));

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
