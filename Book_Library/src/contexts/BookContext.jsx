import { createContext, useState, useEffect } from "react";
import { initialBooks } from "../data/books";
import { initialAuthors } from "../data/authors";
import { initialCategories } from "../data/categories";

const BookContext = createContext();

function BookProvider({ children }) {
    // при первом взапуске приложения реакт проверяет состояния - состояния нет,
    // поэтому вызывает функцию и берет ее результат как начальное значение
    // при втором запуске - состояние уже есть, поэтому реакт будет игнорировать эту функцию
    // и просто возвращает сохраненное состояние

    // --------------------------------------------------
    // STATE
    // --------------------------------------------------
    const [books, setBooks] = useState(() => {

        const savedBooks = localStorage.getItem("books");

        if (savedBooks) return JSON.parse(savedBooks);

        return initialBooks;

    });
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const [selectedSort, setSelectedSort] = useState("default");

    const [authors, setAuthors] = useState(initialAuthors);
    const [categories, setCategories] = useState(initialCategories);

    // --------------------------------------------------
    // OPTIONS
    // --------------------------------------------------
    const categoryOptions = ["All", ...new Set(books.map(book => book.categories))];
    const sortOptions = [
        { value: "default", label: "Default" },
        { value: "title-asc", label: "Title (A-Z)" },
        { value: "title-desc", label: "Title (Z-A)" },
        { value: "price-asc", label: "Price (Low → High)" },
        { value: "price-desc", label: "Price (High → Low)" }
    ];

    // --------------------------------------------------
    // DERIVED STATE
    // --------------------------------------------------
    // Search
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const searchedBooks = !normalizedSearch
        ? books
        : books.filter(book => {
            const normalizedTitle = book.title.trim().toLowerCase();
            return normalizedTitle.includes(normalizedSearch);
        });
    // --------------------------------------------------

    // Filter  
    const categoryBooks = selectedCategory === "All"
        ? searchedBooks
        : searchedBooks.filter(book => book.categories === selectedCategory);
    // --------------------------------------------------

    // Sort 
    const sortedBooks = [...categoryBooks];

    switch (selectedSort) {
        case "title-asc":
            sortedBooks.sort((a, b) =>
                a.title.localeCompare(b.title));
            break;

        case "title-desc":
            sortedBooks.sort((a, b) =>
                b.title.localeCompare(a.title));
            break;

        case "price-asc":
            sortedBooks.sort((a, b) =>
                a.price - b.price);
            break;

        case "price-desc":
            sortedBooks.sort((a, b) =>
                b.price - a.price);
            break;

        case "default":
            break;
    }

    const visibleBooks = sortedBooks;
    // --------------------------------------------------

    
    // --------------------------------------------------
    // PERSISTENCE
    // --------------------------------------------------
    // каждый раз, когда меняется books, книги сохраняются
    useEffect(() => {

        localStorage.setItem(
            "books",
            JSON.stringify(books)
        );

    }, [books]);

    // --------------------------------------------------
    // CRUD
    // --------------------------------------------------
    function addBook(formData) {

        const {
            title,
            authorIds,
            categoryIds,
            price,
            stock,
            description,
            cover
        } = formData;

        const newBook =
        {
            id: books.length + 1,
            title,
            authorIds,
            categoryIds,
            price: Number(price),
            stock: Number(stock),
            description,
            cover
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

    // --------------------------------------------------
    // Provider
    // --------------------------------------------------

    return (
        <BookContext.Provider
            value={
                {
                    books,
                    visibleBooks,

                    authors,
                    setAuthors,

                    categories,
                    setCategories,

                    searchQuery,
                    setSearchQuery,

                    selectedCategory,
                    setSelectedCategory,
                    categoryOptions,

                    selectedSort,
                    setSelectedSort,
                    sortOptions,

                    addBook,
                    updateBook,
                    deleteBook
                }
            }>

            {children}

        </BookContext.Provider>
    );
}

export { BookContext, BookProvider }