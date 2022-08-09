import SyntaxHighlighter from "react-syntax-highlighter";
import NavBar from "../components/NavBar";
import { ocean } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const Error = () => {
    return (
        <div className="text">
            <NavBar canSave={false} value={null} language={null} />
            <SyntaxHighlighter
                language="plaintext"
                style={ocean}
                showLineNumbers={true}
                showInlineLineNumbers={true}
            >
                Sorry, no post with that ID! :P
            </SyntaxHighlighter>
        </div>
    );
};

export default Error;
