
export default function Footer() {
    return (
        <footer className="p-6 absolute bottom-0 w-full">
            <div className="flex flex-row justify-between items-center">
                <p>IGVF DACC</p>
                <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
}
