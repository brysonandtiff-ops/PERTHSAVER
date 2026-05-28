import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initCacheManager } from "./lib/cacheManager";

initCacheManager();

createRoot(document.getElementById("root")!).render(<App />);
