import { Filter } from "@/app/_redux/slices/querySlice";
import { NodeTypes } from "@/lib/types/derived-types";


// export type FilterCondition = "eq" | "neq" | "gt" | "gte" | "lt" | "lte";

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
        onUpdate({
            nodeType: e.target.value as Filter["nodeType"],
            fieldPath,
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

    return (
        <div className="flex flex-row border border-black rounded-lg justify-between items-center p-3">
            <h3 className="text-lg font-bold">
                On type
                [<select value={nodeType} onChange={handleUpdateNodeType}>
                    {NodeTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>]
                where
                [<select value={condition} onChange={handleUpdateCondition}>
                    <option value="eq">Equals</option>
                    <option value="neq">Not Equals</option>
                    <option value="gt">Greater Than</option>
                    <option value="gte">Greater Than or Equal To</option>
                    <option value="lt">Less Than</option>
                    <option value="lte">Less Than or Equal To</option>
                </select>]
            </h3>
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
