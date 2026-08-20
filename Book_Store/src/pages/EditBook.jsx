import { useParams } from "react-router-dom";
import BookForm from "../components/BookForm";
import useBookDetail from "../hooks/useBookDetail";

function EditBook() {
    const { id } = useParams();

    const { book, loading, error } = useBookDetail(id);

    if (loading) return <p className="status-message">Loading...</p>;
    if (error) return <p className="status-error">Book not found</p>;

    return (
        <BookForm
            mode="edit"
            book={book}
        />
    );
}

export default EditBook;