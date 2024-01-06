import { Filter } from "@/app/_redux/slices/querySlice";
import { propertyDictionary, styledPropertyDictionary } from "@/lib/catalog-interface/definitions/filter-properties";
import { NodeTypes } from "@/lib/types/derived-types";

export default function EditableFilter({
    filter: { nodeType, fieldPath, condition, value },
    onSave,
    onUpdate,
    onCancel
}: {
    filter: Filter;
    onSave?: () => void;
    onUpdate: (filter: Filter) => void;
    onCancel: () => void;
}) {

    const handleUpdateNodeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const typeValue = e.target.value as Filter["nodeType"];
        onUpdate({
            nodeType: typeValue as Filter["nodeType"],
            fieldPath: propertyDictionary[typeValue][0],
            condition,
            value,
        });
    }

    const handleUpdateFieldPath = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({
            nodeType,
            fieldPath: e.target.value as Filter["fieldPath"],
            condition,
            value,
        });
    }

    const handleUpdateCondition = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({
            nodeType,
            fieldPath,
            condition: e.target.value as Filter["condition"],
            value,
        });
    }

    const handleUpdateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({
            nodeType,
            fieldPath,
            condition,
            value: parseFloat(e.target.value),
        });
    }

    return (
        <div className="flex flex-row border border-black rounded-lg justify-between items-center p-3">
            <div className="text-lg font-bold space-x-1">
                <span>On type</span>
                <span className="whitespace-nowrap">
                    [<select value={nodeType} onChange={handleUpdateNodeType}>
                        {NodeTypes
                            .filter(t => propertyDictionary[t].length > 0)
                            .map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                    </select>]
                </span>
                <span>where</span>
                <span className="whitespace-nowrap">
                    [<select
                        value={fieldPath}
                        onChange={handleUpdateFieldPath}
                        className="max-w-xl whitespace-nowrap overflow-ellipsis"
                    >
                        {propertyDictionary[nodeType].map((property, idx) => (
                            <option key={property} value={property}>{styledPropertyDictionary[nodeType][idx]}</option>
                        ))}
                    </select>]
                </span>
                <span className="whitespace-nowrap">
                    [<select value={condition} onChange={handleUpdateCondition}>
                        <option value="eq">equals</option>
                        <option value="neq">not equals</option>
                        <option value="gt">greater than</option>
                        <option value="gte">greater than or equal to</option>
                        <option value="lt">less than</option>
                        <option value="lte">less than or equal to</option>
                    </select>]
                </span>
                <span className="whitespace-nowrap">
                    [<input
                        type="number"
                        step="0.0001"
                        value={value}
                        onChange={handleUpdateValue}
                        className="w-20"
                    />]
                </span>
            </div>
            <div className="flex flex-row space-x-4">
                {onSave ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer" onClick={onSave}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg> : null}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer" onClick={onCancel}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </div>
        </div>
    )
}
