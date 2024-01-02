import { TableGraphNode } from "@/app/_redux/slices/graphSlice";
import { catalog } from "@/lib/catalog-interface/catalog";
import { NodeTypeGroup } from "@/lib/catalog-interface/helpers/format-graph-nodes";

import GraphContainer from "./GraphContainer";
import InternalCollectionTable from "./InternalCollectionTable";

export default function NodeCollection({
    group,
    parentPath
}: {
    group: NodeTypeGroup;
    parentPath: string[]
}) {

    const renderContents = () => {
        const elements: React.ReactNode[] = [];
        let curRun: TableGraphNode[] = [];

        for (const node of group.nodes) {
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

        return elements;
    }

    return (
        <div className="pl-1">
            <p><span className="capitalize">{group.node_type}s</span> linked to {parentPath[parentPath.length - 1]} ({group.nodes.length})</p>
            {renderContents()}
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
