import SyntaxHighlighter from "react-syntax-highlighter";
import NavBar from "../components/NavBar";
import { ocean } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import "../App.css";

export default function Home() {
    const message = `# Welcome to Pym!
# Pym is a syntax-higlighted text/image pastebin and URL shortener that allows you to share your code quickly.
# Interact with the "New" button on the top right to create a new post, and you will be redirected to your unique short URL

def permutations(length, alphabet=ALPHABET):
    ''' Recursively yield all permutations of alphabet up to given length. '''

    if length <= 0:
        yield ""
    elif length == 1:
        for letter in alphabet:
            yield letter
    else:
        for letter in alphabet:
            for ele in permutations(length - 1, alphabet):
                yield letter + ele


# Created by Josh Chun with Typescript, Express, React, Node, MongoDB, Docker, Nginx, & Caddy
# Source code @ github.com/joshhchun/Pym`;

    return (
        <div className="text">
            <NavBar canSave={false} value={null} language={null} />
            <SyntaxHighlighter
                language="python"
                style={ocean}
                showLineNumbers={true}
                showInlineLineNumbers={true}
            >
                {message}
            </SyntaxHighlighter>
        </div>
    );
}
