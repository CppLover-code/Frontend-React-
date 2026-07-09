import useBook from "../hooks/useBook";

function CategoryFilter() {
    const { selectedCategory, setSelectedCategory, allCategories } = useBook();

    return (
        <>
            <p>Category:</p>
            <select
                value={selectedCategory}
                onChange={(event) =>
                    setSelectedCategory(event.target.value)
                }>

                {allCategories.map(category => (
                    <option 
                        key={category}
                        value={category}
                        >
                            {category}
                    </option>
                ))}
            </select>
        </>
    );


}

export default CategoryFilter;