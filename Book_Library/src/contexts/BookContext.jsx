import { createContext, useState, useEffect } from "react";
import { initialBooks } from "../data/books";

const BookContext = createContext();

function BookProvider({ children }) {
    // при первом взапуске приложения реакт проверяет состояния - состояния нет,
    // поэтому вызывает функцию и берет ее результат как начальное значение
    // при втором запуске - состояние уже есть, поэтому реакт будет игнорировать эту функцию
    // и просто возвращает сохраненное состояние
    const [books, setBooks] = useState(() => {

        const savedBooks = localStorage.getItem("books");

        if (savedBooks) return JSON.parse(savedBooks);

        return initialBooks;

    });

    // каждый раз, когда меняется books, книги сохраняются
    useEffect(() => {

        localStorage.setItem(
            "books",
            JSON.stringify(books)
        );

    }, [books]);

    function addBook(title, authors, category, price) {
        if (!title.trim()) return;

        const newBook =
        {
            id: books.length + 1,
            title: title,
            authors: authors || "Unknown",
            category: category || "Unknown",
            price: price || 0.00
        };

        setBooks([...books, newBook]) // оператор spread
    }

    function deleteBook(id) {
        setBooks(
            // оставляем все книги, кроме той, что нужно удалить
            books.filter(book => book.id !== id)
        );
    }

    function updateBook(id) {
        setBooks(
            books.map(book => {

                if (book.id === id) {
                    return {
                        ...book,
                        title: `${book.title} (Updated)`
                    }
                }

                return book;

            })
        );
    }

    const [searchQuery, setSearchQuery] = useState("");

    const normalizedSearch = searchQuery.trim().toLowerCase();

    const visibleBooks = !normalizedSearch
    ? books
    : books.filter(book => {
        const normalizedTitle = book.title.trim().toLowerCase();
        return normalizedTitle.includes(normalizedSearch);
    });

    return (
        <BookContext.Provider
            value={
                {
                    books,
                    addBook,
                    updateBook,
                    deleteBook,
                    searchQuery,
                    setSearchQuery,
                    visibleBooks
                }
            }>

            {children}

        </BookContext.Provider>
    );
}

export { BookContext, BookProvider }