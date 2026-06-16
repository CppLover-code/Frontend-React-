import Book from "./components/Book";
import { useState } from "react";

// Компонент — это обычная JavaScript-функция, которая возвращает JSX.
// App - это компонент.
function App() {

  // React создаёт count - Текущее значение.
  // И setCount - Функцию изменения значения. Начальное значение: 0
  const [count, setCount] = useState(0);

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

  function addBook() {

  const newBook = {
    id:books.length + 1,
    title: "New Book",
    author: "Unknown"
  };

  setBooks([...books, newBook]) // оператор spread

  }
}
 export default App;
