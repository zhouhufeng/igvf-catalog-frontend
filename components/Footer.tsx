
export default function Footer() {
    return (
        <footer id="footer" className="p-8 fixed bottom-0 left-0 w-full">
            <div className="flex flex-row justify-between items-center">
                <p>IGVF DACC</p>
                <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
}
