import useBook from "../hooks/useBook";

function CategoryFilter() {
    const {
        selectedCategoryId,
        setSelectedCategoryId,
        categoryOptions
    } = useBook();

    return (
        <>
            <p>Category:</p>
            <select
                value={selectedCategoryId}
                onChange={(event) =>
                    setSelectedCategoryId(
                        Number(event.target.value)
                    )}>

                {categoryOptions.map(category => (
                    <option
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>
        </>
    );


}

export default CategoryFilter;