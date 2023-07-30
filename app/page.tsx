import { api } from '@/utils/trpc'

export default async function Home() {
  const resp = await api.proteins.query({ name: "1433B_HUMAN"});

  return (
    <div>
      <h1>IGVF Catalog Home</h1>
      <p>Protein: {JSON.stringify(resp)}</p>
    </div>
  )
}
