import { useState } from "react";
import { useEffect } from "react";

import Book from "./components/Book";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";

import { initialBooks } from "./data/books";

// Компонент — это обычная JavaScript-функция, которая возвращает JSX.
// App - это компонент.
function App() {
  // React создаёт count - Текущее значение.
  // И setCount - Функцию изменения значения. Начальное значение: 0
  const [count, setCount] = useState(0);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const [books, setBooks] = useState(() => {

    const savedBooks = localStorage.getItem("books");

    if(savedBooks)
      {
        return JSON.parse(savedBooks);
      }

    return initialBooks;
    
  });

  // каждый раз, когда меняется books, книги сохраняются
  useEffect(() => {

    localStorage.setItem(
      "books",
      JSON.stringify(books)
    );

  }, [books]);

  function addBook() {

    if(!title.trim()) {
      return;
    }
    
    const newBook = {
      id:books.length + 1,
      title: title,
      author: author || "Unknown"
    };

    setBooks([...books, newBook]) // оператор spread

    setTitle("");
    setAuthor("");
  }

  function deleteBook(id) {
    setBooks(
      // оставляем все книги, кроме той, что нужно удалить
      books.filter(book => book.id !==id)
    );
  }

  function updateBook(id) {
    setBooks(
      books.map(book => {

        if(book.id === id){

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
    <div>

      <h1>My Book Library</h1>

      <BookForm
        title={title}
        setTitle={setTitle}
        author={author}
        setAuthor={setAuthor}
        addBook={addBook}
      />

      <BookList
        books={books}
        deleteBook={deleteBook}
        updateBook={updateBook}
      />

    </div>
  );
}
 export default App;
