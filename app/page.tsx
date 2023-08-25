"use client"

import Footer from "@/components/Footer"
import MainSearchBar from "@/components/MainSearchBar"

export default function Home() {

  return (
    <div className="mx-auto max-w-2xl py-24 sm:py-32 space-y-4">
      <h1 className="text-4xl font-semibold">Search by anything.</h1>
      <MainSearchBar />
      <Footer />
    </div>
  )
}
