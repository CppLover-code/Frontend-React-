import  { useState } from "react"
import useBook from "../hooks/useBook";

const initialFormData = {
    title: "",
    authors: "",
    category: "",
    price: ""
};

function BookForm() 
{
    const {addBook} = useBook();
    const [formData, setFormData] = useState(initialFormData);

    function handleSubmit(event) 
    {
        event.preventDefault();
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

            <br/>
            <br/>

            <label>Authors: </label>

            <input
            type="text"
            name="authors"
            value={formData.authors}
            onChange={handleChange}
            />

            <br/>
            <br/>

            <label>Category: </label>

            <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            />

            <br/>
            <br/>

            <label>Price: </label>

            <input
            type="text"
            name="price"
            value={formData.category}
            onChange={handleChange}
            />

            <br/>
            <br/>

            <button type="submit">Add Book</button>
        </form>
    );
}

export default BookForm;