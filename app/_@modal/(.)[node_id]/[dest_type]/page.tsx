import Modal from "@/components/ui/Modal";
import NodeEdgesTable from "@/components/node-edges-table/NodeEdgesTable";
import { NodeType } from "@/lib/types/derived-types";


export default function Page({
    params: {
        node_id,
        dest_type
    }
}: {
    params: {
        node_id: string;
        dest_type: NodeType;
    }
}) {


    return (
        <Modal title={node_id + ": " + dest_type + "s"}>
            <NodeEdgesTable baseId={node_id} tableType={dest_type} />
        </Modal>
    );
}
