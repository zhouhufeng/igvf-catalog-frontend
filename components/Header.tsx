"use client";

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion';

import { useAppSelector } from '../app/_redux/hooks';
import { selectTitle } from '../app/_redux/slices/uiSlice';


const navigation = [
    { name: 'Web Portal', href: 'https://igvf.org/' },
    { name: 'Data Portal', href: 'https://data.igvf.org/' },
]

export default function Header() {
    const title = useAppSelector(selectTitle);

    return (
        <header id="header" className="inset-x-0 top-0 z-50 border-b border-slate-400">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1 flex-row items-center font-bold">
                    <Link href="/" className="-m-1.5 p-1.5 pl-0">
                        <h1 className='font-bold'>IGVF Catalog</h1>
                    </Link>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={title}
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 10, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {title ? (
                                <h1 className='text-gray-500 truncate max-w-[300px]'>
                                    <span className='px-2'>/</span>
                                    <span>{title}</span>
                                </h1>
                            ) : null}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="gap-x-12 hidden sm:flex">
                    <SettingsButton />
                    {navigation.map((item) => (
                        <a key={item.name} href={item.href} target="_blank" className="text-sm font-semibold leading-6">
                            {item.name}
                        </a>
                    ))}
                </div>
            </nav>
        </header>
    )
}

function SettingsButton() {
    return (
        <Link href={"/settings"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </Link>
    )
}
