import useBook from "../hooks/useBook";
import SelectField from "./SelectField";

function CategoryFilter() {
    const {
        selectedCategoryId,
        setSelectedCategoryId,
        categoryOptions
    } = useBook();

    return (
        <div className="field-label">
            Category
            <SelectField
                value={selectedCategoryId}
                onChange={(value) => setSelectedCategoryId(Number(value))}
                options={categoryOptions.map((category) => ({
                    value: category.id,
                    label: category.name,
                }))}
            />
        </div>
    );
}

export default CategoryFilter;