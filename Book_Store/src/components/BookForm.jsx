import { useState } from "react"
import useBook from "../hooks/useBook";
import useNotification from "../hooks/useNotification";
import { ApiError } from "../api/client";
import { useNavigate } from "react-router-dom";

function getServerNameError(err) {
    if (err instanceof ApiError && err.status === 400 && err.data?.name) {
        return Array.isArray(err.data.name) ? err.data.name[0] : String(err.data.name);
    }
    return null;
}


const initialFormData = {
    title: "",
    authorIds: [],
    categoryIds: [],
    price: "",
    stock: "",
    description: "",
    cover: ""
};
const initialErrors = {
    title: "",
    authorIds: "",
    categoryIds: "",
    price: "",
    stock: "",
    newAuthorName: "",
    newCategoryName: ""
};


const priceRegex = /^\d+(\.\d{1,2})?$/;

function findByName(list, name) {
    const normalized = name.trim().toLowerCase();
    if (!normalized) return null;
    return list.find(item => item.name.toLowerCase() === normalized) ?? null;
}

function BookForm({ mode = "create", book = null }) {

    // --------------------------------------------------
    // CONTEXT
    // --------------------------------------------------
    const { addBook, updateBook, authors, categories, addAuthor, addCategory } = useBook();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    // --------------------------------------------------
    // STATE
    // --------------------------------------------------
    const [formData, setFormData] = useState(() => {
        if (mode === "edit" && book) {
            return {
                title: book.title,
                authorIds: book.authors.map(author => author.id),
                categoryIds: book.categories.map(category => category.id),
                price: String(book.price),
                stock: String(book.stock),
                description: book.description,
                cover: book.cover ?? ""
            };
        }

        return initialFormData;
    });

    const [errors, setErrors] = useState(initialErrors);
    const [newAuthorName, setNewAuthorName] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");
    const [coverFile, setCoverFile] = useState(null);

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------
    function validateForm() {
        const newErrors = {
            ...initialErrors
        };

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (formData.authorIds.length === 0) {
            newErrors.authorIds = "Select at least one author";
        }

        if (formData.categoryIds.length === 0) {
            newErrors.categoryIds = "Select at least one category";
        }

        if (!formData.price.trim()) {
            newErrors.price = "Price is required";
        }
        else if (!priceRegex.test(formData.price)) {
            newErrors.price = "Price must be a valid number";
        }

        const stock = Number(formData.stock);
        if (!formData.stock.trim()) {
            newErrors.stock = "Stock is required"
        }
        else if (Number.isNaN(stock)) {
            newErrors.stock = "Stock must be a number"
        }
        else if (!Number.isInteger(stock)) {
            newErrors.stock = "Stock must be an integer"
        }
        else if (stock < 0) {
            newErrors.stock = "Stock cannot be negative"
        }

        setErrors(newErrors);

        return !Object.values(newErrors).some(error => error);
    }


    // --------------------------------------------------
    // FORM HANDLERS
    // --------------------------------------------------
    async function handleSubmit(event) {
        event.preventDefault();

        if (!validateForm()) return;

        const payload = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            coverFile,
        };

        try {
            if (mode === "create") {
                await addBook(payload);
                setFormData(initialFormData);
                setCoverFile(null);
                setNewAuthorName("");
                setNewCategoryName("");
                showNotification({
                    message: "Book created!",
                    type: "success"
                });
            }
            else {
                await updateBook(book.id, payload);
                showNotification({
                    message: "Book updated!",
                    type: "success"
                });
                navigate("/books");
            }
        } catch {
            showNotification({
                message: "Failed to save book",
                type: "error"
            });
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    function handleCoverChange(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        setCoverFile(file);
    }

    // --------------------------------------------------
    // AUTHOR MANAGEMENT
    // --------------------------------------------------
    function addAuthorId(authorId) {
        if (formData.authorIds.includes(authorId)) return;
        setFormData({
            ...formData,
            authorIds: [...formData.authorIds, authorId],
        });
    }

    function removeAuthorId(authorId) {
        setFormData({
            ...formData,
            authorIds: formData.authorIds.filter(id => id !== authorId),
        });
    }

    async function handleAddAuthor() {

        if (!newAuthorName.trim()) {
            setErrors({
                ...errors,
                newAuthorName: "New author name is required"
            })
            return;
        }

        try {
            const author = await addAuthor(newAuthorName);
            addAuthorId(author.id);
            setNewAuthorName("");
            setErrors({ ...errors, newAuthorName: "" });
        } catch (err) {
            setErrors({
                ...errors,
                newAuthorName: getServerNameError(err) ?? "Failed to add author"
            });
        }
    }


    // --------------------------------------------------
    // CATEGORY MANAGEMENT
    // --------------------------------------------------
    function addCategoryId(categoryId) {
        if (formData.categoryIds.includes(categoryId)) return;
        setFormData({
            ...formData,
            categoryIds: [...formData.categoryIds, categoryId],
        });
    }
    function removeCategoryId(categoryId) {
        setFormData({
            ...formData,
            categoryIds: formData.categoryIds.filter(id => id !== categoryId),
        });
    }

    async function handleAddCategory() {

        if (!newCategoryName.trim()) {
            setErrors({
                ...errors,
                newCategoryName: "New category name is required"
            })
            return;
        }

        try {
            const category = await addCategory(newCategoryName);

            addCategoryId(category.id);
            setNewCategoryName("");
            setErrors({ ...errors, newCategoryName: "" });
        } catch (err) {
            setErrors({
                ...errors,
                newCategoryName: getServerNameError(err) ?? "Failed to add category"
            });
        }
    }

    // --------------------------------------------------
    // 
    // --------------------------------------------------

    const coverPreview = coverFile
        ? URL.createObjectURL(coverFile)
        : formData.cover || null;

    const matchedAuthor = findByName(authors, newAuthorName);
    const authorAlreadySelected = Boolean(
        matchedAuthor && formData.authorIds.includes(matchedAuthor.id)
    );

    const matchedCategory = findByName(categories, newCategoryName);
    const categoryAlreadySelected = Boolean(
        matchedCategory && formData.categoryIds.includes(matchedCategory.id)
    );

    const authorSuggestions = authors.filter(author => {
        const q = newAuthorName.trim().toLowerCase();
        if (!q) return false;
        return (
            author.name.toLowerCase().includes(q)
            && !formData.authorIds.includes(author.id)
        );
    }).slice(0, 5);

    const categorySuggestions = categories.filter(category => {
        const q = newCategoryName.trim().toLowerCase();
        if (!q) return false;
        return (
            category.name.toLowerCase().includes(q)
            && !formData.categoryIds.includes(category.id)
        );
    }).slice(0, 5);

    function handleAuthorButton() {
        if (matchedAuthor) {
            if (!authorAlreadySelected) addAuthorId(matchedAuthor.id);
            setNewAuthorName("");
            setErrors({ ...errors, newAuthorName: "" });
            return;
        }
        handleAddAuthor();
    }

    function handleCategoryButton() {
        if (matchedCategory) {
            if (!categoryAlreadySelected) addCategoryId(matchedCategory.id);
            setNewCategoryName("");
            setErrors({ ...errors, newCategoryName: "" });
            return;
        }
        handleAddCategory();
    }

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------
    return (
        <form
            onSubmit={handleSubmit}
            className="card-surface space-y-4 p-6"
        >
            <h2 className="font-heading text-[1.5em] text-ink dark:text-paper">
                {mode === "create" ? "Add a book" : "Edit book"}
            </h2>

            <label className="field-label">
                Title
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input-field ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && <p className="text-sm text-red-700">{errors.title}</p>}
            </label>

            <fieldset>
                <legend className="mb-2 text-sm font-medium text-muted dark:text-faint">Authors</legend>

                {formData.authorIds.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                        {formData.authorIds.map(id => {
                            const author = authors.find(item => item.id === id);
                            if (!author) return null;
                            return (
                                <span
                                    key={id}
                                    className="chip"
                                >
                                    {author.name}
                                    <button
                                        type="button"
                                        onClick={() => removeAuthorId(id)}
                                        className="cursor-pointer text-sm leading-none hover:text-red-600"
                                    >
                                        ×
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                )}
                {errors.authorIds && <p className="mb-2 text-sm text-red-700">{errors.authorIds}</p>}

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newAuthorName}
                        onChange={(event) => setNewAuthorName(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                handleAuthorButton();
                            }
                        }}
                        placeholder="Type an author name"
                        className={`input-field flex-1 ${errors.newAuthorName ? "border-red-500" : ""}`}
                    />
                    <button
                        type="button"
                        onClick={handleAuthorButton}
                        disabled={!newAuthorName.trim() || authorAlreadySelected}
                        className="btn-outline btn-sm"
                    >
                        {matchedAuthor ? (authorAlreadySelected ? "Added" : "Select") : "Add"}
                    </button>
                </div>
                {errors.newAuthorName && <p className="mt-1 text-sm text-red-700">{errors.newAuthorName}</p>}

                {authorSuggestions.length > 0 && (
                    <ul className="mt-1 divide-y divide-line border border-line bg-white text-sm dark:divide-night-border dark:border-night-border dark:bg-night-card">
                        {authorSuggestions.map(author => (
                            <li key={author.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addAuthorId(author.id);
                                        setNewAuthorName("");
                                    }}
                                    className="w-full cursor-pointer px-3 py-2 text-left hover:bg-paper-muted dark:text-paper dark:hover:bg-night"
                                >
                                    {author.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </fieldset>

            <fieldset>
                <legend className="mb-2 text-sm font-medium text-muted dark:text-faint">Categories</legend>

                {formData.categoryIds.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                        {formData.categoryIds.map(id => {
                            const category = categories.find(item => item.id === id);
                            if (!category) return null;
                            return (
                                <span
                                    key={id}
                                    className="chip"
                                >
                                    {category.name}
                                    <button
                                        type="button"
                                        onClick={() => removeCategoryId(id)}
                                        className="cursor-pointer text-sm leading-none hover:text-red-600"
                                    >
                                        ×
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                )}
                {errors.categoryIds && <p className="mb-2 text-sm text-red-700">{errors.categoryIds}</p>}

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(event) => setNewCategoryName(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                handleCategoryButton();
                            }
                        }}
                        placeholder="Type a category name"
                        className={`input-field flex-1 ${errors.newCategoryName ? "border-red-500" : ""}`}
                    />
                    <button
                        type="button"
                        onClick={handleCategoryButton}
                        disabled={!newCategoryName.trim() || categoryAlreadySelected}
                        className="btn-outline btn-sm"
                    >
                        {matchedCategory ? (categoryAlreadySelected ? "Added" : "Select") : "Add"}
                    </button>
                </div>
                {errors.newCategoryName && <p className="mt-1 text-sm text-red-700">{errors.newCategoryName}</p>}

                {categorySuggestions.length > 0 && (
                    <ul className="mt-1 divide-y divide-line border border-line bg-white text-sm dark:divide-night-border dark:border-night-border dark:bg-night-card">
                        {categorySuggestions.map(category => (
                            <li key={category.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addCategoryId(category.id);
                                        setNewCategoryName("");
                                    }}
                                    className="w-full cursor-pointer px-3 py-2 text-left hover:bg-paper-muted dark:text-paper dark:hover:bg-night"
                                >
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="field-label">
                    Price
                    <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`input-field ${errors.price ? "border-red-500" : ""}`}
                    />
                    {errors.price && <p className="text-sm text-red-700">{errors.price}</p>}
                </label>

                <label className="field-label">
                    Stock
                    <input
                        type="text"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className={`input-field ${errors.stock ? "border-red-500" : ""}`}
                    />
                    {errors.stock && <p className="text-sm text-red-700">{errors.stock}</p>}
                </label>
            </div>

            <label className="field-label">
                Description
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="input-field"
                />
            </label>

            <label className="field-label">
                Cover
                <span className="flex flex-wrap items-center gap-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="sr-only"
                    />
                    <span className="btn-primary btn-sm cursor-pointer">
                        Choose file
                    </span>
                    <span className="text-sm font-normal text-muted dark:text-faint">
                        {coverFile ? coverFile.name : "No file selected"}
                    </span>
                </span>
            </label>

            {coverPreview && (
                <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="h-40 w-auto border border-cover-border bg-shelf object-contain p-3 dark:border-night-border dark:bg-night-shelf"
                />
            )}

            <button
                type="submit"
                className="btn-primary"
            >
                {mode === "create" ? "Add Book" : "Save Changes"}
            </button>
        </form>
    );
}

export default BookForm;