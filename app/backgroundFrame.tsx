"use client";
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion';

import { useAppSelector } from './_redux/hooks';
import { selectTitle } from './_redux/slices/uiSlice';
import useLayout from '@/lib/hooks/useLayout';


const navigation = [
    { name: 'Web Portal', href: 'https://igvf.org/' },
    { name: 'Data Portal', href: 'https://data.igvf.org/' },
]

export default function BackgroundFrame({
    children,
}: {
    children: React.ReactNode
}) {
    const { headerHeight } = useLayout();
    const title = useAppSelector(selectTitle);

    return (
        <div className="bg-white">
            <header id="header" className="absolute inset-x-0 top-0 z-50 border-b border-slate-400">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1 flex-row items-center font-bold">
                        <Link href="/" className="-m-1.5 p-1.5">
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
                                    <h1 className='text-gray-500'>
                                        <span className='px-2'>/</span>
                                        <span>{title}</span>
                                    </h1>
                                ) : null}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="gap-x-12 hidden sm:flex">
                        {navigation.map((item) => (
                            <a key={item.name} href={item.href} target="_blank" className="text-sm font-semibold leading-6">
                                {item.name}
                            </a>
                        ))}
                    </div>
                </nav>
            </header>
            <div className="relative isolate" style={{ paddingTop: headerHeight }}>
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
                {children}
                <div
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-45rem)]"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
