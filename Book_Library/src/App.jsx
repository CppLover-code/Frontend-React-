import Book from "./components/Book";
import { useState } from "react";

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

      <label>Book title </label>
      <input 
      type="text"
      value={title}
      onChange={(event) => setTitle(event.target.value)}
      />
      <p>{title}</p>

      <label>Book author </label>
      <input 
      type="text"
      value={author}
      onChange={(event) => setAuthor(event.target.value)}
      />
      <p>{author}</p>

      <button onClick={addBook}>
        Add book
      </button>

    </div>
  );
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
}
 export default App;
