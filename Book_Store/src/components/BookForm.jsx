import { useState, useEffect } from "react"
import useBook from "../hooks/useBook";
import useNotification from "../hooks/useNotification";
import { ApiError } from "../api/client";

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

function BookForm( {mode = "create", book = null}) {

    // --------------------------------------------------
    // CONTEXT
    // --------------------------------------------------
    const { addBook, updateBook, authors, categories, addAuthor, addCategory } = useBook();
    const { showNotification } = useNotification();


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

    useEffect(() => {
        if (mode !== "edit" || !book) return;
    
        setFormData({
            title: book.title,
            authorIds: book.authors.map(author => author.id),
            categoryIds: book.categories.map(category => category.id),
            price: String(book.price),
            stock: String(book.stock),
            description: book.description,
            cover: book.cover ?? ""
        });
        setCoverFile(null);
    }, [mode, book]);


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
                    type: "success" });
            }
            else {
                await updateBook(book.id, payload);
                showNotification({
                    message: "Book updated!",
                    type: "success" });
            }
        } catch {
            showNotification({
                message: "Failed to save book",
                type: "error" });
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    function handleCoverChange(event) {
        const file = event.target.files?.[0];
        if(!file) return;
        setCoverFile(file);
    }

    // --------------------------------------------------
    // AUTHOR MANAGEMENT
    // --------------------------------------------------
    function toggleAuthor(authorId) {

        if (!formData.authorIds.includes(authorId)) {
            const updatedAuthorIds = [...formData.authorIds];
            updatedAuthorIds.push(authorId);
            setFormData({ ...formData, authorIds: updatedAuthorIds })
        }
        else {
            const updatedAuthorIds = [...formData.authorIds]
                .filter(currentAuthorId => currentAuthorId !== authorId)

            setFormData({ ...formData, authorIds: updatedAuthorIds })
        }
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
            toggleAuthor(author.id);
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
    function toggleCategory(categoryId) {

        if (!formData.categoryIds.includes(categoryId)) {
            const updatedCategoryIds = [...formData.categoryIds];
            updatedCategoryIds.push(categoryId);
            setFormData({ ...formData, categoryIds: updatedCategoryIds })
        }
        else {
            const updatedCategoryIds = [...formData.categoryIds]
                .filter(currentCategoryId => currentCategoryId !== categoryId)

            setFormData({ ...formData, categoryIds: updatedCategoryIds })
        }
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

            toggleCategory(category.id);
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
    // RENDER
    // --------------------------------------------------

    const coverPreview = coverFile
        ? URL.createObjectURL(coverFile)
        : formData.cover || null;
        
        return (
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
                <h2 className="text-lg font-semibold text-gray-900">
                    {mode === "create" ? "Add a book" : "Edit book"}
                </h2>
        
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    Title
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`rounded-md border bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-200 ${
                            errors.title
                                ? "border-red-500"
                                : "border-gray-300 focus:border-teal-500"
                        }`}
                    />
                    {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                </label>
        
                <fieldset>
                    <legend className="mb-2 text-sm font-medium text-gray-600">Authors</legend>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {authors.map((author) => (
                            <label key={author.id} className="flex items-center gap-2 text-sm text-gray-800">
                                <input
                                    type="checkbox"
                                    checked={formData.authorIds.includes(author.id)}
                                    onChange={() => toggleAuthor(author.id)}
                                    className="accent-teal-700"
                                />
                                {author.name}
                            </label>
                        ))}
                    </div>
                    {errors.authorIds && <p className="mt-1 text-sm text-red-600">{errors.authorIds}</p>}
        
                    <div className="mt-2 flex gap-2">
                        <input
                            type="text"
                            value={newAuthorName}
                            onChange={(event) => setNewAuthorName(event.target.value)}
                            placeholder="New author"
                            className={`flex-1 rounded-md border bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-200 ${
                                errors.newAuthorName
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-teal-500"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={handleAddAuthor}
                            className="cursor-pointer rounded-md border border-teal-700 px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50"
                        >
                            Add
                        </button>
                    </div>
                    {errors.newAuthorName && <p className="mt-1 text-sm text-red-600">{errors.newAuthorName}</p>}
                </fieldset>
        
                <fieldset>
                    <legend className="mb-2 text-sm font-medium text-gray-600">Categories</legend>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {categories.map((category) => (
                            <label key={category.id} className="flex items-center gap-2 text-sm text-gray-800">
                                <input
                                    type="checkbox"
                                    checked={formData.categoryIds.includes(category.id)}
                                    onChange={() => toggleCategory(category.id)}
                                    className="accent-teal-700"
                                />
                                {category.name}
                            </label>
                        ))}
                    </div>
                    {errors.categoryIds && <p className="mt-1 text-sm text-red-600">{errors.categoryIds}</p>}
        
                    <div className="mt-2 flex gap-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(event) => setNewCategoryName(event.target.value)}
                            placeholder="New category"
                            className={`flex-1 rounded-md border bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-200 ${
                                errors.newCategoryName
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-teal-500"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={handleAddCategory}
                            className="cursor-pointer rounded-md border border-teal-700 px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50"
                        >
                            Add
                        </button>
                    </div>
                    {errors.newCategoryName && <p className="mt-1 text-sm text-red-600">{errors.newCategoryName}</p>}
                </fieldset>
        
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                        Price
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className={`rounded-md border bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-200 ${
                                errors.price
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-teal-500"
                            }`}
                        />
                        {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                    </label>
        
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                        Stock
                        <input
                            type="text"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className={`rounded-md border bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-200 ${
                                errors.stock
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-teal-500"
                            }`}
                        />
                        {errors.stock && <p className="text-sm text-red-600">{errors.stock}</p>}
                    </label>
                </div>
        
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    Description
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    />
                </label>
        
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                    Cover
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="text-sm text-gray-600 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal-800"
                    />
                </label>
        
                {coverPreview && (
                    <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="h-40 w-auto rounded-md object-contain"
                    />
                )}
        
                <button
                    type="submit"
                    className="cursor-pointer rounded-md bg-teal-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800"
                >
                    {mode === "create" ? "Add Book" : "Save Changes"}
                </button>
            </form>
        );
}

export default BookForm;