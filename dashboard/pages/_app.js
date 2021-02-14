import "tailwindcss/tailwind.css";
import "../styles/styles.css";
// import "../styles/texteditor.css";
// import "../styles/quiz.css";
import { ToastProvider } from "react-toast-notifications";

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  );
}

export default MyApp;
