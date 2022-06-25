import SyntaxHighlighter from "react-syntax-highlighter";
import { ocean } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "../App.css";
import NavBar from "./NavBar";

const Home = (props) => {
  const codeString = `
#!/usr/bin/env python

"""Django's command-line utility for administrative tasks."""
import sys
import os


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_api.settings.development")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
`;
  return (
    <div className="text">
      <NavBar />
      <SyntaxHighlighter
        language="python"
        style={ocean}
        showLineNumbers="true"
        showInlineLineNumbers="true"
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export default Home;
