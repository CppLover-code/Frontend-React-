import  { useState } from "react"
import useBook from "../hooks/useBook";
import "../styles/BookForm.css"

const initialFormData = {
    title: "",
    authors: "",
    category: "",
    price: ""
};
const initialErrors = {
    title: "",
    authors: "",
    category: "",
    price: ""
};

const [errors, setErrors] = useState(initialErrors);

const priceRegex = /^\d+(\.\d{1,2})?$/;

function validateForm()
{
    const newErrors = {
        ...initialErrors
    };

    if (!formData.title.trim()) {
        newErrors.title = "Title is required";
    }

    if (!formData.authors.trim()) {
        newErrors.authors = "Authors are required";
    }

    if (!formData.category.trim()) {
        newErrors.category = "Category is required";
    }

    if(!formData.price.trim()) {
        newErrors.price = "Price is required";
    }
    else if(!priceRegex.test(formData.price)) {
        newErrors.price = "Price must be a valid number";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error);
}

function BookForm() 
{
    const {addBook} = useBook();
    const [formData, setFormData] = useState(initialFormData);

    function handleSubmit(event) 
    {
        event.preventDefault();

        if(!validateForm()) {
            return;
        }

        addBook(formData);
        setFormData(initialFormData);
    }
    function handleChange(event)
    {
        const { name, value } = event.target;
        setFormData({...formData, [name]: value});
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Book title: </label>

            <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            />
            {errors.title && (
                <p classname="error-message">
                    {errors.title}
                </p>
            )}

            <br/>
            <br/>

            <label>Authors: </label>

            <input
            type="text"
            name="authors"
            value={formData.authors}
            onChange={handleChange}
            />
            {errors.title && (
                <p classname="error-message">
                    {errors.authors}
                </p>
            )}

            <br/>
            <br/>

            <label>Category: </label>

            <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            />
            {errors.title && (
                <p classname="error-message">
                    {errors.category}
                </p>
            )}

            <br/>
            <br/>

            <label>Price: </label>

            <input
            type="text"
            name="price"
            value={formData.category}
            onChange={handleChange}
            />
            {errors.title && (
                <p classname="error-message">
                    {errors.price}
                </p>
            )}

            <br/>
            <br/>

            <button type="submit">Add Book</button>
        </form>
    );
}

export default BookForm;