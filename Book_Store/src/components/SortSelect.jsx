import useBook from "../hooks/useBook";
import SelectField from "./SelectField";

function SortSelect()
{
    const { selectedSort, setSelectedSort, sortOptions } = useBook();

    return (
        <div className="field-label">
            Sorting:
            <SelectField
                value={selectedSort}
                onChange={setSelectedSort}
                options={sortOptions.map((option) => ({
                    value: option.value,
                    label: option.label,
                }))}
            />
        </div>
    );
}

export default SortSelect;