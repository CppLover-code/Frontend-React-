import { useState, useEffect } from "react";
import { getBook } from "../api/books";
import useBook from "./useBook";

function useBookDetail(id) {
    const { refreshKey } = useBook();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const data = await getBook(id);
                if (!ignore) setBook(data);
            } catch (err) {
                if (!ignore) setError(err);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        load();

        return () => {
            ignore = true;
        };
    }, [id, refreshKey]);

    return { book, loading, error };
}

export default useBookDetail;