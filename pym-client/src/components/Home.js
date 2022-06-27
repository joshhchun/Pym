import SyntaxHighlighter from "react-syntax-highlighter";
import { ocean } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "../App.css";
import NavBar from "./NavBar";

const Home = (props) => {

  const message = 
`# Welcome to Pym!
# Pym is a syntax-higlighted text/image pastebin and URL shortener that allows you to share your code quickly.

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


# Interact with the "New" button on the top right to create a new post, and you will be redirected to your unique short URL`

  return (
    <div className="text">
      <NavBar />
      <SyntaxHighlighter
        language="python"
        style={ocean}
        showLineNumbers="true"
        showInlineLineNumbers="true"
      >
        {message}
      </SyntaxHighlighter>
    </div>
  );
};

export default Home;
