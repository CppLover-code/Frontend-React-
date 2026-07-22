import { useParams } from "react-router-dom";
import BookForm from "../components/BookForm";
import useBook from "../hooks/useBook";

function EditBook() {
    const { id } = useParams();

    const { getBook } = useBook();

    const book = getBook(id);

    if (!book) {
        return <h2>Book not found</h2>;
    }

    return (
        <BookForm
            mode="edit"
            book={book}
        />
    );
}

export default EditBook;