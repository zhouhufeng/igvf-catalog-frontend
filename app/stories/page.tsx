import Link from "next/link";
import storyList from "./content";


export default function Page() {
    return (
        <div className="flex-1 flex flex-col items-center justify-start">
            <div className="p-3 w-full max-w-6xl">
                <h1 className="text-3xl font-bold mb-6">User Stories</h1>
                {storyList.map(story => (
                    <Link
                        key={story.slug}
                        href={`/stories/${story.slug}`}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        <div className="border border-black rounded-lg p-2 flex flex-row items-center justify-between">
                            <div>
                                <h2 className="text-xl">{story.title}</h2>
                                <p>{story.description}</p>
                            </div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
