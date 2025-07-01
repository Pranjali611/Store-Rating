"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { Search, MapPin } from "lucide-react"

interface Store {
  id: string
  name: string
  address: string
  averageRating: number
  userRating: number | null
  totalRatings: number
}

export default function UserDashboard() {
  const [stores, setStores] = useState<Store[]>([])
  const [filteredStores, setFilteredStores] = useState<Store[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStores()
  }, [])

  useEffect(() => {
    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredStores(filtered)
  }, [stores, searchTerm])

  const fetchStores = async () => {
    try {
      const response = await fetch("/api/stores")
      if (response.ok) {
        const data = await response.json()
        setStores(data.stores)
        setFilteredStores(data.stores)
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRating = async (storeId: string, rating: number) => {
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storeId, rating }),
      })

      if (response.ok) {
        // Refresh stores to get updated ratings
        fetchStores()
      }
    } catch (error) {
      console.error("Failed to submit rating:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="h-10 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Discover Stores</h1>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search stores by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stores Grid */}
      <div className="grid gap-6">
        {filteredStores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{store.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {store.address}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{store.totalRatings} reviews</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Overall Rating</p>
                  <StarRating rating={store.averageRating} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-2">Your Rating</p>
                  <StarRating
                    rating={store.userRating || 0}
                    interactive={true}
                    onRatingChange={(rating) => handleRating(store.id, rating)}
                  />
                  {store.userRating && <p className="text-xs text-muted-foreground mt-1">Click to update</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStores.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No stores found matching your search.</p>
        </div>
      )}
    </div>
  )
}
