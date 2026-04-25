import AppRoutes from "./Routes/AppRoutes";

// Global perf helpers (side-effect imports)
import "./utils/patchEventListeners";
import "./utils/lazyImages";

function App() {
  return <AppRoutes />;
}

export default App;
