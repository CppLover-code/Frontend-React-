import { useState, useEffect } from "react";

import { initialBooks } from "./data/books";

import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Books from "./pages/Books";
import About from "./pages/About";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import MainLayout from "./layouts/MainLayout";

// Компонент — это обычная JavaScript-функция, которая возвращает JSX.
// App - это компонент.
function App() 
{
  // при первом взапуске приложения реакт проверяет состояния - состояния нет,
  // поэтому вызывает функцию и берет ее результат как начальное значение
  // при втором запуске - состояние уже есть, поэтому реакт будет игнорировать эту функцию
  // и просто возвращает сохраненное состояние
  const [books, setBooks] = useState(() => {

    const savedBooks = localStorage.getItem("books");

    if(savedBooks) return JSON.parse(savedBooks);

    return initialBooks;

  });

  // каждый раз, когда меняется books, книги сохраняются
  useEffect(() => {

    localStorage.setItem(
      "books",
      JSON.stringify(books)
    );

  }, [books]);

  function addBook(title, authors, category, price) 
  {
    if(!title.trim()) return;
    
    const newBook = 
    {
      id:books.length + 1,
      title: title,
      authors: authors || "Unknown",
      category: category || "Unknown",
      price: price || 0.00
    };

    setBooks([...books, newBook]) // оператор spread
  }

  function deleteBook(id) 
    {
        setBooks(
        // оставляем все книги, кроме той, что нужно удалить
        books.filter(book => book.id !==id)
        );
    }

  function updateBook(id) 
  {
    setBooks(
      books.map(book => {

        if(book.id === id)
          {
            return {
              ...book,
              title: `${book.title} (Updated)`
            }
          }

        return book;

      })
   );
  }

  return (
    <Routes>

      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />}/>

        <Route path="/books" element={<Books
                                            books={books}
                                            deleteBook={deleteBook}
                                            updateBook={updateBook}
                                            />}
         />

        <Route path="/about" element={<About />}/>

        <Route path="/login" element={<Login />}/>

        <Route path="/cart" element={<Cart />}/>
      
      </Route>

    </Routes>
  );
}

export default App;
