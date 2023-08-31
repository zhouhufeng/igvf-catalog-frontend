import SetNavigation from "@/components/SetNavigation";
import { RsVariant, getDatabase, getVariantByRsid, getGenesLinkedToRsidKey, getProteinsLinkedToRsidKey, getDrugsLinkedToRsidKey } from "@/utils/db";

export default async function RsidPage({
    params: { id },
}: {
    params: { id: string; };
}) {
    console.log(id)
    const db = getDatabase()
    const rsData: RsVariant[] = await getVariantByRsid(db, id);
    // console.log(rsData[0])
    const linkedProteins = {} //key, each rsidKey from rsData, values: proteins linked to each rsidKey
    const linkedDrugs = {}
    for (const r of rsData) {
        console.log(r._id);
        linkedProteins[r._id] = await getProteinsLinkedToRsidKey(db, r._id)
        linkedDrugs[r._id] = await getDrugsLinkedToRsidKey(db, r._id)
    }
    console.log(linkedProteins)
    console.log(linkedDrugs)
    return (
        <div>
            <SetNavigation title={id} />
            <h1 className="text-3xl font-medium">{id}</h1>
        </div>
    )
}
