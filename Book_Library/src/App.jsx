import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Books from "./pages/Books";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import BookPage from "./pages/BookPage";
import MainLayout from "./layouts/MainLayout";

// Компонент — это обычная JavaScript-функция, которая возвращает JSX.
// App - это компонент.
function App() {

  return (
    <Routes>

      <Route element={<MainLayout />}>

        <Route path="/" element={<HomePage />} />

        <Route path="/books" element={<Books />} />

        <Route path="/books/:id" element={<BookPage />} />

        <Route path="/about" element={<AboutPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/cart" element={<CartPage />} />

      </Route>

    </Routes>
  );
}

export default App;
