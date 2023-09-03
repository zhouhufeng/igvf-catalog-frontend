import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='container flex flex-row items-center justify-center' style={{ height: "80vh" }}>
      <div className='flex flex-col items-center gap-y-2'>
        <h2 className='text-2xl'>404 | Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/">Return Home</Link>
      </div>
    </div>
  )
}
