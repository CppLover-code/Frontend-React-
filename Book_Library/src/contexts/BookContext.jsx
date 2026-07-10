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
// ****************************************
    // Поиск
    const [searchQuery, setSearchQuery] = useState("");
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const searchedBooks = !normalizedSearch
    ? books
    : books.filter(book => {
        const normalizedTitle = book.title.trim().toLowerCase();
        return normalizedTitle.includes(normalizedSearch);
    });

    // Фильтрация
    const [selectedCategory, setSelectedCategory] = useState("All");
    const categoryBooks = selectedCategory === "All"
    ? searchedBooks
    : searchedBooks.filter(book => book.category === selectedCategory);

    const categories = books.map(book => book.category);
    const allCategories = ["All", ...new Set(categories)];

    // Сортировка
    const [selectedSort, setSelectedSort] = useState("default");
    const sortOptions = [
        { value: "default", label: "Default" },
        { value: "title-asc", label: "Title (A-Z)" },
        { value: "title-desc", label: "Title (Z-A)" },
        { value: "price-asc", label: "Price (Low → High)" },
        { value: "price-desc", label: "Price (High → Low)" }
    ];
    const sortedBooks = [...categoryBooks];

    switch(selectedSort)
    {
        case "title-asc":
            sortedBooks.sort((a, b) => 
                a.title.localeCompare(b.title));
            break;
        
        case "title-desc":
            sortedBooks.sort((a, b) => 
                b.title.localeCompare(a.title));
            break;

        case "price-asc":
            sortedBooks.sort((a,b) =>
                a.price - b.price);
            break;

        case "price-desc":
            sortedBooks.sort((a,b) =>
                b.price - a.price);
            break;      
            
        case "default":
            break;
    }

    const visibleBooks = sortedBooks;

// ****************************************

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

                    selectedCategory,
                    setSelectedCategory,
                    allCategories,

                    selectedSort,
                    setSelectedSort,
                    sortOptions,

                    visibleBooks
                }
            }>

            {children}

        </BookContext.Provider>
    );
}

export { BookContext, BookProvider }