import "./styles/base.css";
import "./Theme.css";
import "./App.css"
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/LocalThemeContext";
import { Provider } from "react-redux";
import { store } from "./Redux/Store.js";
import FeedbackProvider from "./components/ui/FeedbackProvider";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <Provider store={store}>
        <FeedbackProvider>
          <App />
        </FeedbackProvider>
      </Provider>
    </ThemeProvider>
  </BrowserRouter>
);