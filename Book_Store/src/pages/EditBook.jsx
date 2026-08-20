import { useParams } from "react-router-dom";
import BookForm from "../components/BookForm";
import useBookDetail from "../hooks/useBookDetail";

function EditBook() {
    const { id } = useParams();

    const { book, loading, error } = useBookDetail(id);

    if (loading) return <p className="py-12 text-center text-gray-500 dark:text-gray-400">Loading...</p>;
    if (error) return <p className="py-12 text-center text-red-600">Book not found</p>;

    return (
        <BookForm
            mode="edit"
            book={book}
        />
    );
}

export default EditBook;