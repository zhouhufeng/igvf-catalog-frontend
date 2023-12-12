import Modal from "@/components/Modal";
import NodeEdgesTable from "@/components/node-edges-table/node-edges-table";
import { NodeType } from "@/lib/services/NodeService";


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
        <Modal title={node_id + ": " + dest_type + "s"}>
            <NodeEdgesTable baseType={graph_type} baseId={node_id} tableType={dest_type} />
        </Modal>
    );
}
