import { useState } from "react"
import useBook from "../hooks/useBook";
import "../styles/BookForm.css"
import useNotification from "../hooks/useNotification";


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
    description: "",
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
            stock: Number(formData.stock)
        };

        try {
            if (mode === "create") {
                await addBook(payload);
                setFormData(initialFormData);
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
        } catch {
            setErrors({
                ...errors,
                newAuthorName: "Failed to add author"
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
        } catch {
            setErrors({
                ...errors,
                newCategoryName: "Failed to add category"
            });
        }
    }

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------
    return (
        <form onSubmit={handleSubmit}>
            <label>Book title: </label>

            <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? "error" : ""}
            />
            {errors.title && (
                <p className="error-message">
                    {errors.title}
                </p>
            )}

            <br />
            <br />

            <label>Authors: </label>

            {authors.map((author) => (
                <div key={author.id}>
                    <input
                        id={`author-${author.id}`}
                        type="checkbox"
                        checked={formData.authorIds.includes(author.id)}
                        onChange={() => toggleAuthor(author.id)}
                    />
                    <label htmlFor={`author-${author.id}`}>
                        {author.name}
                    </label>

                </div>
            ))}
            {errors.authorIds && (
                <p className="error-message">
                    {errors.authorIds}
                </p>
            )}

            <input
                type="text"
                value={newAuthorName}
                onChange={(event) => setNewAuthorName(event.target.value)}
            />
            <button
                type="button"
                onClick={handleAddAuthor}
            >
                Add author
            </button>

            <br />
            <br />

            <label>Category: </label>

            {categories.map((category) => (
                <div key={category.id}>
                    <input
                        id={`category-${category.id}`}
                        type="checkbox"
                        checked={formData.categoryIds.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                    />
                    <label htmlFor={`category-${category.id}`}>
                        {category.name}
                    </label>

                </div>
            ))}
            {errors.categoryIds && (
                <p className="error-message">
                    {errors.categoryIds}
                </p>
            )}

            <input
                type="text"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
            />
            <button
                type="button"
                onClick={handleAddCategory}
            >
                Add category
            </button>

            <br />
            <br />

            <label>Price: </label>

            <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? "error" : ""}
            />
            {errors.price && (
                <p className="error-message">
                    {errors.price}
                </p>
            )}

            <br />
            <br />

            <label>Stock: </label>

            <input
                type="text"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={errors.stock ? "error" : ""}
            />
            {errors.stock && (
                <p className="error-message">
                    {errors.stock}
                </p>
            )}

            <br />
            <br />

            <label>Description: </label>

            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? "error" : ""}
            />
            {errors.description && (
                <p className="error-message">
                    {errors.description}
                </p>
            )}

            <br />
            <br />


            <button type="submit">
                {mode === "create"
                ? "Add Book"
                : "Save Changes"}
                </button>
        </form>
    );
}

export default BookForm;