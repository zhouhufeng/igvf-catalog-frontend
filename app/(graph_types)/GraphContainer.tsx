import { GraphNode } from "@/lib/services/GraphService";



export default function GraphContainer({
    edges
}: {
    edges: GraphNode[];
}) {


    return (
        <div className="p-6">
            <h1 className="text-3xl font-medium pb-6">Graph</h1>

        </div>
    );
}
