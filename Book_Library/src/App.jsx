import Book from "./components/Book";
import { useState } from "react";

// Компонент — это обычная JavaScript-функция, которая возвращает JSX.
// App - это компонент.
function App() {

  // React создаёт count - Текущее значение.
  // И setCount - Функцию изменения значения. Начальное значение: 0
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>My Book Library</h1>

      <Book
        title="Python"
        author="Will Smith"
      />
      <Book
        title="C++"
        author="Jennifer Lopez"
      />
      <Book
        title="Java Script"
        author="Michael Jackson"
      />

      <h1>Counter</h1>

      <p>{count}</p>

      <button onClick={() => setCount(count + 1)}>
        +
      </button>
    </div>

  );
}
 export default App;

