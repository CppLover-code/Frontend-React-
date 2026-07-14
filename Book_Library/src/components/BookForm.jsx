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

        if (!formData.authors.trim()) {
            newErrors.authors = "Authors are required";
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
        if(!formData.stock.trim()) {
            newErrors.stock = "Stock is required"
        }
        else if(Number.isNaN(stock)){
            newErrors.stock = "Stock must be a number"
        }
        else if (!Number.isInteger(stock)) {
            newErrors.stock = "Stock must be an integer"
        }
        else if(stock < 0) {
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
                <input
                key={index}
                    type="text"
                    name="authors"
                    value={author}
                    onChange={handleChange}
                    className={errors.authors ? "error" : ""}
                />
            ))}
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