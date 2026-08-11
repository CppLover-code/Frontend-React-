import { createContext, useState, useEffect } from "react";
import * as booksApi from "../api/books";

const BookContext = createContext();

function BookProvider({ children }) {

    // --------------------------------------------------
    // Data from the server
    // --------------------------------------------------
    const [books, setBooks] = useState([]);
    const [count, setCount] = useState(0);
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);

    // Current request state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --------------------------------------------------
    // Selection parameters: modified by the UI, executed by the server
    // --------------------------------------------------
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const [selectedSort, setSelectedSort] = useState("default");
    const [page, setPage] = useState(1);

   // Reload counter: CRUD operations increment it
    // so that the load effect triggers again
    const [refreshKey, setRefreshKey] = useState(0);

    // the values ​​match DRF's `ordering` parameter
    const sortOptions = [
        { value: "default", label: "Default" },
        { value: "title", label: "Title (A-Z)" },
        { value: "-title", label: "Title (Z-A)" },
        { value: "price", label: "Price (Low → High)" },
        { value: "-price", label: "Price (High → Low)" },
    ];

    const categoryOptions = [{ id: 0, name: "All" }, ...categories];

    // --------------------------------------------------
    // Loading reference data (once at startup)
    // --------------------------------------------------
    useEffect(() => {

        async function loadRefs() {
            try {
                const [authorsData, categoriesData] = await Promise.all([
                    booksApi.getAuthors(),
                    booksApi.getCategories(),
                ]);

                setAuthors(authorsData);
                setCategories(categoriesData);
            } catch (err) {
                setError(err);
            }
        }

        loadRefs();
    }, []);

    // --------------------------------------------------
    // Loading books (whenever settings are changed)
    // --------------------------------------------------
    useEffect(() => {

        let ignore = false;

        async function loadBooks() {
            setLoading(true);
            setError(null);

            const params = { page };

            if (searchQuery.trim()) params.search = searchQuery.trim();
            if (selectedCategoryId !== 0) params.categories = selectedCategoryId;
            if (selectedSort !== "default") params.ordering = selectedSort;

            try {
                const data = await booksApi.getBooks(params);

                if (!ignore) {
                    setBooks(data.results);
                    setCount(data.count);
                }
            } catch (err) {
                if (!ignore) setError(err);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadBooks();

        // cleanup: if the parameters changed before the response arrived,
        // the outdated response is ignored
        return () => {
            ignore = true;
        };
    }, [searchQuery, selectedCategoryId, selectedSort, page, refreshKey]);

    // --------------------------------------------------
    // Wrappers around setters: new search/filter — always starts from page 1.
    // --------------------------------------------------
    function updateSearchQuery(value) {
        setSearchQuery(value);
        setPage(1);
    }

    function updateSelectedCategoryId(id) {
        setSelectedCategoryId(id);
        setPage(1);
    }

    function updateSelectedSort(value) {
        setSelectedSort(value);
        setPage(1);
    }

    // --------------------------------------------------
    // CRUD
    // --------------------------------------------------
    async function addBook(formData) {
        await booksApi.createBook({
            title: formData.title,
            description: formData.description,
            price: formData.price,
            stock: formData.stock,
            author_ids: formData.authorIds,
            category_ids: formData.categoryIds,
        });

        setRefreshKey(key => key + 1);
    }

    async function updateBook(id, formData) {
        await booksApi.updateBook(id, {
            title: formData.title,
            description: formData.description,
            price: formData.price,
            stock: formData.stock,
            author_ids: formData.authorIds,
            category_ids: formData.categoryIds,
        });

        setRefreshKey(key => key + 1);
    }

    async function deleteBook(id) {
        await booksApi.deleteBook(id);
        setRefreshKey(key => key + 1);
    }

    async function addAuthor(name) {
        const normalizedName = name.trim();

        const existingAuthor = authors.find(
            author => author.name.toLowerCase() === normalizedName.toLowerCase()
        );

        if (existingAuthor) return existingAuthor;

        const newAuthor = await booksApi.createAuthor(normalizedName);
        setAuthors([...authors, newAuthor]);

        return newAuthor;
    }

    async function addCategory(name) {
        const normalizedName = name.trim();

        const existingCategory = categories.find(
            category => category.name.toLowerCase() === normalizedName.toLowerCase()
        );

        if (existingCategory) return existingCategory;

        const newCategory = await booksApi.createCategory(normalizedName);
        setCategories([...categories, newCategory]);

        return newCategory;
    }

    // --------------------------------------------------
    // Provider
    // --------------------------------------------------
    return (
        <BookContext.Provider
            value={{
                visibleBooks: books,
                count,
                loading,
                error,

                authors,
                categories,

                searchQuery,
                setSearchQuery: updateSearchQuery,

                selectedCategoryId,
                setSelectedCategoryId: updateSelectedCategoryId,
                categoryOptions,

                selectedSort,
                setSelectedSort: updateSelectedSort,
                sortOptions,

                page,
                setPage,

                addBook,
                updateBook,
                deleteBook,

                addAuthor,
                addCategory,
            }}>

            {children}

        </BookContext.Provider>
    );
}

export { BookContext, BookProvider };