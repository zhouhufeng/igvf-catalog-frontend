import Modal from "@/components/Modal";
import NodeEdgesTable from "@/components/node-edges-table/NodeEdgesTable";
import { NodeType } from "@/lib/types/derived-types";


export default function Page({
    params: {
        graph_type,
        node_id,
        dest_type
    }
}: {
    params: {
        graph_type: NodeType;
        node_id: string;
        dest_type: NodeType;
    }
}) {


    return (
        <div className="p-8 h-screen">
            <div className="bg-white rounded-md border border-gray-400">
                <h1 className="text-2xl font-bold p-4">{node_id + ": " + dest_type + "s"}</h1>
                {/* <NodeEdgesTable baseType={graph_type} baseId={node_id} tableType={dest_type} /> */}
            </div>
        </div>
    );
}
