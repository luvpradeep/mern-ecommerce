import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AppContent from "./AppContent";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <AppContent />
    </BrowserRouter>
  );
}

export default App;
