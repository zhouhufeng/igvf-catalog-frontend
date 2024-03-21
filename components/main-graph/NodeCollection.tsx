import { TableGraphNode } from "@/app/_redux/slices/graphSlice";
import { catalog } from "@/lib/catalog-interface/catalog";
import { NodeTypeGroup } from "@/lib/catalog-interface/helpers/format-graph-nodes";

import GraphContainer from "./GraphContainer";
import InternalCollectionTable from "./InternalCollectionTable";
import { checkFiltersOnNode } from "@/lib/catalog-interface/helpers/apply-filter";
import { useAppSelector } from "@/app/_redux/hooks";
import { selectFilters } from "@/app/_redux/slices/querySlice";
import { MainGraphLocation } from "./main-graph-types";

export default function NodeCollection({
    group,
    parentPath,
    location,
}: {
    group: NodeTypeGroup;
    parentPath: string[];
    location?: MainGraphLocation;
}) {
    const filters = useAppSelector(selectFilters);

    const renderContents = () => {
        const elements: React.ReactNode[] = [];
        let curRun: TableGraphNode[] = [];
        let count = 0;

        for (const node of group.nodes) {
            if (!checkFiltersOnNode(node, filters)) continue;
            count++;

            const nodeModel = catalog.deserialize(node);
            curRun.push(node);

            if (node.isExpanded) {
                elements.push(
                    <InternalCollectionTable
                        key={"table-" + nodeModel.parsed.id}
                        path={parentPath}
                        nodes={curRun}
                        nodeType={group.node_type}
                    />
                )
                elements.push(
                    <Indent
                        key={"graph-" + nodeModel.parsed.id}
                        show={parentPath.length > 0}
                    >
                        <GraphContainer
                            path={parentPath.concat(nodeModel.parsed.id)}
                            initialEdges={[]}
                        />
                    </Indent>
                );

                curRun = [];
            }
        }

        if (curRun.length > 0) {
            elements.push(
                <InternalCollectionTable
                    key={"table-collection-end"}
                    path={parentPath}
                    nodes={curRun}
                    nodeType={group.node_type}
                />
            )
        }

        if (elements.length === 0) {
            return {
                count: 0,
                elements: <p className="pl-1">No {group.node_type}s match your filters.</p>
            }
        }

        return { count, elements };
    }

    const { count, elements } = renderContents();

    return (
        <div className="pl-1">
            <p><span className="capitalize">{group.node_type}s</span> {location === "region" ? " within region " : " linked to "} {parentPath[parentPath.length - 1]} ({`${count}` + (filters.some(f => f.nodeType === group.node_type) ? " after filter" : "")})</p>
            {elements}
        </div>
    );
}

function Indent({
    children,
    show
}: {
    children: React.ReactNode;
    show: boolean;
}) {
    return (
        <div className={show ? "ml-4 pl-6 border-l border-black" : ""}>
            {children}
        </div>
    )
}
