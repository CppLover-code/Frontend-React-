import { createContext, useState, useEffect } from "react";
import * as booksApi from "../api/books";
import { ApiError } from "../api/client";

const BookContext = createContext();

function BookProvider({ children }) {

    // --------------------------------------------------
    // Data from the server
    // --------------------------------------------------
    const [books, setBooks] = useState([]);
    const [count, setCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
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
                    setHasNext(Boolean(data.next));
                    setHasPrev(Boolean(data.previous));
                    setCount(data.count);
                }
            } catch (err) {
                if (ignore) return;
                
                if (err instanceof ApiError && err.status === 404 && page > 1) {
                    setPage(page - 1);
                } else {
                    setError(err);
                }
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
    // Collector
    // --------------------------------------------------

    function toBookFormData(formData) {
        const data = new FormData();
    
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
    
        formData.authorIds.forEach((id) => data.append("author_ids", id));
        formData.categoryIds.forEach((id) => data.append("category_ids", id));
    
        if (formData.coverFile) {
            data.append("cover", formData.coverFile);
        }
    
        return data;
    }

    // --------------------------------------------------
    // CRUD
    // --------------------------------------------------
    async function addBook(formData) {
        await booksApi.createBook(toBookFormData(formData));
        setRefreshKey(key => key + 1);
    }
    
    async function updateBook(id, formData) {
        await booksApi.updateBook(id, toBookFormData(formData));
        setRefreshKey(key => key + 1);
    }

    async function deleteBook(id) {
        await booksApi.deleteBook(id);

        if (books.length === 1 && page > 1) {
            setPage(page - 1);
        } else {
            setRefreshKey(key => key + 1);
        }
    }
    function refreshBooks() {
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
                hasNext,
                hasPrev,

                addBook,
                updateBook,
                deleteBook,

                refreshBooks,
                refreshKey,

                addAuthor,
                addCategory,
            }}>

            {children}

        </BookContext.Provider>
    );
}

export { BookContext, BookProvider };