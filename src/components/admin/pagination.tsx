"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  baseUrl: string
}

export function Pagination({ totalItems, itemsPerPage, currentPage, baseUrl }: PaginationProps) {
  const router = useRouter()
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (totalPages <= 1) return null

  const goToPage = (page: number) => {
    router.push(`${baseUrl}?page=${page}`)
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
      </span>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-lg h-10 font-bold border-slate-200"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className="rounded-lg h-10 w-10 p-0 font-bold"
            onClick={() => goToPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-lg h-10 font-bold border-slate-200"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

interface SearchFilterProps {
  placeholder?: string
  searchKey?: string
  filterKey?: string
  filterOptions?: { value: string; label: string }[]
  baseUrl: string
}

export function SearchFilter({ placeholder = "Search...", searchKey = "q", filterKey = "category", filterOptions, baseUrl }: SearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentSearch = searchParams.get(searchKey) || ""
  const currentFilter = searchParams.get(filterKey) || ""

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get("search") as string
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set(searchKey, search)
    } else {
      params.delete(searchKey)
    }
    params.delete("page")
    router.push(`${baseUrl}?${params.toString()}`)
  }

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(filterKey, value)
    } else {
      params.delete(filterKey)
    }
    params.delete("page")
    router.push(`${baseUrl}?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-[32px] p-4 border shadow-sm flex flex-col md:flex-row gap-4 items-center">
      <form onSubmit={handleSearch} className="relative flex-1 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input 
          name="search"
          type="text" 
          defaultValue={currentSearch}
          placeholder={placeholder} 
          className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-50 border-none font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </form>
      
      {filterOptions && filterOptions.length > 0 && (
        <div className="flex items-center gap-2">
          <select 
            value={currentFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="h-12 rounded-xl border border-slate-200 px-4 font-bold text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="">All Categories</option>
            {filterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}