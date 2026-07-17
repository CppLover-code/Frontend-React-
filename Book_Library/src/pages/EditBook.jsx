import BookForm from "../components/BookForm";

function EditBook() {
    const { id } = useParams();

    const { getBook } = useBook();

    const book = getBook(id);

    return (
        <BookForm
            mode="edit"
            book={book}
        />
    );
}

export default EditBook;