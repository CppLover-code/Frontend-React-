import useBook from "../hooks/useBook";

function CategoryFilter() {
    const { selectedCategory, setSelectedCategory, categoryOptions } = useBook();

    return (
        <>
            <p>Category:</p>
            <select
                value={selectedCategory}
                onChange={(event) =>
                    setSelectedCategory(event.target.value)
                }>

                {categoryOptions.map(categories => (
                    <option 
                        key={categories}
                        value={categories}
                        >
                            {categories}
                    </option>
                ))}
            </select>
        </>
    );


}

export default CategoryFilter;