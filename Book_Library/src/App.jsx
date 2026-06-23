import { useState } from "react";

import Book from "./components/Book";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";

// Компонент — это обычная JavaScript-функция, которая возвращает JSX.
// App - это компонент.
function App() {

  // React создаёт count - Текущее значение.
  // И setCount - Функцию изменения значения. Начальное значение: 0
  const [count, setCount] = useState(0);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const [books, setBooks] = useState ([
    {
      id: 1,
      title: "Python",
      author: "Will Smith"
    },
    {
      id: 2,
      title: "Java Script",
      author: "Michael Jackson"
    },
    {
      id: 3,
      title: "C++",
      author: "Jennifer Lopez"
    }

  ]);

  /*
  return (
    <div>
      <h1>My Book Library</h1>

      {books.map(book => (
        <Book
        key={book.id}
        title={book.title}
        author={book.author}
        />
      ))}

      <button onClick={addBook}>
        Add book
      </button>

      <h1>Counter</h1>

      <p>{count}</p>

      <button onClick={() => setCount(count + 1)}>
        +
      </button>
    </div>

  );
  */
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
      />

    </div>
  );
}
 export default App;
