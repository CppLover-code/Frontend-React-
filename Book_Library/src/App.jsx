import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Books from "./pages/Books";
import About from "./pages/About";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import BookDetails from "./pages/BookDetails";
import MainLayout from "./layouts/MainLayout";

// Компонент — это обычная JavaScript-функция, которая возвращает JSX.
// App - это компонент.
function App() {
  console.log("App");
  return (
    <Routes>

      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/books" element={<Books />} />

        <Route path="/books/:id" element={<BookDetails />} />

        <Route path="/about" element={<About />} />

        <Route path="/login" element={<Login />} />

        <Route path="/cart" element={<Cart />} />

      </Route>

    </Routes>
  );
}

export default App;
