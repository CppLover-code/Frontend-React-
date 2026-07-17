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

    const [authors, setAuthors] = useState(() => {

        const savedAuthors = localStorage.getItem("authors");

        if (savedAuthors) return JSON.parse(savedAuthors);

        return initialAuthors;
    });

    const [categories, setCategories] = useState(() => {

        const savedCategories = localStorage.getItem("categories");

        if (savedCategories) return JSON.parse(savedCategories);

        return initialCategories;
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const [selectedSort, setSelectedSort] = useState("default");

    // --------------------------------------------------
    // OPTIONS
    // --------------------------------------------------
    const categoryOptions = [{id: 0, name: "All"}, ...categories];
    const sortOptions = [
        { value: "default", label: "Default" },
        { value: "title-asc", label: "Title (A-Z)" },
        { value: "title-desc", label: "Title (Z-A)" },
        { value: "price-asc", label: "Price (Low → High)" },
        { value: "price-desc", label: "Price (High → Low)" }
    ];

    // --------------------------------------------------

    //Преобразование книги, вместо id будут храниться объекты
    function resolveBook(book) {

        const resolvedAuthors = book.authorIds.map(authorId => 
            authors.find(author => author.id === authorId));

        const resolvedCategories = book.categoryIds.map(categoryId => 
            categories.find(category => category.id === categoryId));

        return {
            ...book,
            authors: resolvedAuthors,
            categories: resolvedCategories
        }
    }

    // функция поиска по id и отправка преобразованной книги
    function getBook(id) {

        const book = books.find(book => book.id === Number(id));

        if (!book) return null;

        return resolveBook(book);
    }
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
    const categoryBooks = selectedCategoryId === 0
        ? searchedBooks
        : searchedBooks.filter(book => book.categoryIds.includes(selectedCategoryId));
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

    const visibleBooks = sortedBooks.map(book => resolveBook(book));
    // --------------------------------------------------

    
    // --------------------------------------------------
    // PERSISTENCE
    // --------------------------------------------------
    // каждый раз, когда меняется books, authors, categories, данные сохраняются
    useEffect(() => {

        localStorage.setItem(
            "books",
            JSON.stringify(books)
        );

    }, [books]);

    useEffect(() => {

        localStorage.setItem(
            "authors",
            JSON.stringify(authors)
        );
    }, [authors]);

    useEffect(() => {

        localStorage.setItem(
            "categories",
            JSON.stringify(categories)
        );
    }, [categories]);

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

    function updateBook(id, formData) {
        setBooks(
            books.map(book => {

                if (book.id === id) {
                    return {
                        ...book,
                        ...FormData
                    };
                }

                return {
                    ...book,
                    ...formData
                };
            }));
    }

    function addAuthor(name) {

        const normalizedName = name.trim();

        const existingAuthor = authors.find(
            author => author.name.toLowerCase() === normalizedName.toLowerCase()
        );

        if (existingAuthor) return existingAuthor;
        else {
            const newAuthor = {
                id: authors.length + 1,
                name: normalizedName
            };

            setAuthors([...authors, newAuthor]);

            return newAuthor;
        }
    }

    function addCategory(name) {

        const normalizedName = name.trim();

        const existingCategory = categories.find(
            category => category.name.toLowerCase() === normalizedName.toLowerCase()
        );

        if (existingCategory) return existingCategory;
        else {
            const newCategory = {
                id: categories.length + 1,
                name: normalizedName
            };

            setCategories([...categories, newCategory]);

            return newCategory;
        }
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
                    getBook,

                    authors,
                    setAuthors,

                    categories,
                    setCategories,

                    searchQuery,
                    setSearchQuery,

                    selectedCategoryId,
                    setSelectedCategoryId,
                    categoryOptions,

                    selectedSort,
                    setSelectedSort,
                    sortOptions,

                    addBook,
                    updateBook,
                    deleteBook,

                    addAuthor,
                    addCategory
                }
            }>

            {children}

        </BookContext.Provider>
    );
}

export { BookContext, BookProvider }