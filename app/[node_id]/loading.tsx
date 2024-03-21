import LoadingSpinner from "@/components/ui/LoadingSpinner";


export default function Loading() {


    // TODO: replace this with a loading skeleton
    return (
        <div className="h-5/6 flex flex-col justify-center">
            <LoadingSpinner />
        </div>
    );
}
