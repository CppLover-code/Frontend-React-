import useBook from "../hooks/useBook";

function CategoryFilter() {
    const { selectedCategory, setSelectedCategory, allCategories } = useBook();

    return (
        <>
            <p>Category:</p>
            <select
                value={allCategories.map()}
                onChange={(event) =>
                    setSearchQuery(event.target.value)
                } />
        </>
    );


}

export default CategoryFilter;