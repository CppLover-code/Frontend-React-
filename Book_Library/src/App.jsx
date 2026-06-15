import Book from "./components/Book";

// Компонент — это обычная JavaScript-функция, которая возвращает JSX.
// App - это компонент.
function App() {
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
    </div>
  );
}
 export default App;

