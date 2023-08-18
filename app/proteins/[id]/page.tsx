import { api } from "@/utils/trpc";

export default async function Page({
    params: { id },
}: {
    params: { id: string; };
}) {
    const proteinData = await api.proteinID.query({ id });

    return (
        <div>
            <h1>Proteins</h1>
            <p>Protein ID: {JSON.stringify(proteinData)}</p>
            
        </div>
    )
}