

export default function Page({
    params: {
        slug
    }
}: {
    params: {
        slug: string;
    }
}) {

    return (
        <h1>Story slug: {slug}</h1>
    )
}
