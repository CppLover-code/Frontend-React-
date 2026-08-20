import useBook from "../hooks/useBook";

function CategoryFilter() {
    const {
        selectedCategoryId,
        setSelectedCategoryId,
        categoryOptions
    } = useBook();

    return (
        <label className="field-label">
            Category
            <select
                className="input-field"
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
        </label>
    );
}

export default CategoryFilter;