import { useState } from "react"
import useBook from "../hooks/useBook";
import "../styles/BookForm.css"

const initialFormData = {
    title: "",
    authors: [""],
    categories: "",
    price: "",
    stock: "",
    description: "",
    cover: ""
};
const initialErrors = {
    title: "",
    authors: "",
    categories: "",
    price: "",
    stock: "",
    description: ""
};


const priceRegex = /^\d+(\.\d{1,2})?$/;

function BookForm() {
    const { addBook } = useBook();
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState(initialErrors);

    function validateForm() {
        const newErrors = {
            ...initialErrors
        };

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (formData.authors.some(author => author.trim() === "")) {
            newErrors.authors = "All author fields must be filled";
        }
        const normalizedAuthors = formData.authors.map(author => 
            author.trim().toLowerCase());
        
        if (normalizedAuthors.length !== new Set(normalizedAuthors).size){
            newErrors.authors = "Duplicate authors are not allowed"
        }


        if (!formData.categories.trim()) {
            newErrors.categories = "Category is required";
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

    function handleAuthorChange(index, value) {
        const updatedAuthors = [...formData.authors];
        updatedAuthors[index] = value.replace(/\s+/g," ");
        setFormData({ ...formData, authors: updatedAuthors })
    }

    function addAuthor() {
        const updatedAuthors = [...formData.authors];
        updatedAuthors.push("");
        setFormData({ ...formData, authors: updatedAuthors })
    }

    function removeAuthor(index) {
        const updatedAuthors = [...formData.authors];
        updatedAuthors.splice(index, 1);
        setFormData({ ...formData, authors: updatedAuthors })
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

            {formData.authors.map((author, index) => (
                <div key={index}>
                    <input
                        type="text"
                        name="authors"
                        value={author}
                        onChange={(event) =>
                            handleAuthorChange(index, event.target.value)
                        }
                        className={errors.authors ? "error" : ""}
                    />
                    {formData.authors.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeAuthor(index)}
                        >
                            Remove
                        </button>
                    )}

                </div>
            ))}

            <button
                type="button"
                onClick={addAuthor}
            >
                + Add Author
            </button>

            {errors.authors && (
                <p className="error-message">
                    {errors.authors}
                </p>
            )}


            <br />
            <br />

            <label>Category: </label>

            <input
                type="text"
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                className={errors.categories ? "error" : ""}
            />
            {errors.categories && (
                <p className="error-message">
                    {errors.categories}
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