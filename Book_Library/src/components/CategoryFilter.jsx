import useBook from "../hooks/useBook";

function CategoryFilter() {
    const { selectedCategory, setSelectedCategory } = useBook();

    return (
        <>
            <p>Search:</p>
            <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                    setSearchQuery(event.target.value)
                } />
        </>
    );


}

export default CategoryFilter;