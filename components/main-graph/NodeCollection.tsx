import { useMemo, useState } from "react";

import { NodeTypeGroup } from "@/lib/catalog-interface/helpers/format-graph-nodes";
import { TableGraphNode } from "@/app/_redux/slices/graphSlice";
import InternalCollectionTable from "./InternalCollectionTable";
import { catalog } from "@/lib/catalog-interface/catalog";
import GraphContainer from "./GraphContainer";


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
                        path={parentPath.concat(nodeModel.parsed.id)}
                        nodes={curRun}
                        nodeType={group.node_type}
                    />
                )
                elements.push(
                    <GraphContainer
                        path={parentPath.concat(nodeModel.parsed.id)}
                        initialEdges={Object.values(node.children)}
                    />
                );

                curRun = [];
            }
        }

        if (curRun.length > 0) {
            elements.push(
                <InternalCollectionTable 
                    path={parentPath.concat(group.node_type)}
                    nodes={curRun}
                    nodeType={group.node_type}
                />
            )
        }

        return elements;
    }

    return (
        <div>
            <p><span className="capitalize">{group.node_type}s</span> linked to {parentPath[0]}</p>
            {renderContents()}
        </div>
    );
}
