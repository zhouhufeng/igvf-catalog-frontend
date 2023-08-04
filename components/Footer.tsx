
export default function Footer() {
    return (
        <footer className="p-6 absolute bottom-0 w-full">
            <div className="flex flex-row justify-between items-center">
                <a href="https://wang.wustl.edu/" target="_blank">
                    <img
                        src="https://wang.wustl.edu/image/logo/old_logo.png"
                        alt="Washington University in St. Louis"
                        className="h-8"
                    />
                </a>
                <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
}
