import { useParams } from "react-router-dom";
import BookForm from "../components/BookForm";
import useBookDetail from "../hooks/useBookDetail";

function EditBook() {
    const { id } = useParams();

    const { book, loading, error } = useBookDetail(id);

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>Book not found</h2>;

    return (
        <BookForm
            mode="edit"
            book={book}
        />
    );
}

export default EditBook;