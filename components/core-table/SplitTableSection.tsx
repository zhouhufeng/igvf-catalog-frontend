import { HeaderGroup, Row, flexRender } from "@tanstack/react-table";
import { CoreTableStateData } from "./core-table-types";
import classNames from "classnames";
import TableRow from "./TableRow";

export default function SplitTableSection<T>({
    rows,
    headers,
    depth,
}: {
    rows: Row<CoreTableStateData<T>>[];
    headers: HeaderGroup<CoreTableStateData<T>>[];
    depth: number;
}) {

    return (
        <div className="border border-black rounded-lg w-fit">
            <table className="table-auto">
                <thead className="border-b border-black">
                    {headers.map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    style={{
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                    }}
                                    className="px-2 py-2 cursor-pointer"
                                >
                                    <div
                                        className={classNames(
                                            { 'cursor-pointer select-none': header.column.getCanSort() }
                                        )}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {{
                                            asc: '🔼 ',
                                            desc: '🔽 ',
                                        }[header.column.getIsSorted() as string] ?? null}
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}

                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row.id}>
                            <TableRow row={row} depth={depth} />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
