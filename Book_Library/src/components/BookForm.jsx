import { useState } from "react"
import useBook from "../hooks/useBook";
import "../styles/BookForm.css"

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
    description: ""
};


const priceRegex = /^\d+(\.\d{1,2})?$/;

function BookForm() {
    const { addBook, authors, categories } = useBook();
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState(initialErrors);

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

    function handleSubmit(event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        addBook(formData);
        setFormData(initialFormData);
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

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


            <button type="submit">Add Book</button>
        </form>
    );
}

export default BookForm;