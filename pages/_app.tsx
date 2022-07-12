import "../styles/globals.css";
import "../styles/App.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";

function MyApp({ Component, pageProps }) {
    return (
        <div className="App">
            <Component {...pageProps} />
        </div>
    );
}

export default MyApp;
