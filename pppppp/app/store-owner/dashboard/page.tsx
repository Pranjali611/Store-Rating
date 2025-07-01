"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { Star, Users } from "lucide-react"

interface StoreData {
  id: string
  name: string
  averageRating: number
  totalRatings: number
}

interface Rating {
  id: string
  rating: number
  createdAt: string
  user: {
    name: string
    email: string
  }
}

interface DashboardData {
  store: StoreData
  ratings: Rating[]
}

export default function StoreOwnerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/store-owner/dashboard")
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No store data found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Store Dashboard</h1>

      {/* Store Overview */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{data.store.averageRating.toFixed(1)}</div>
            <StarRating rating={data.store.averageRating} size="lg" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.store.totalRatings}</div>
            <p className="text-xs text-muted-foreground">Reviews from customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Customer Ratings</CardTitle>
          <CardDescription>Latest ratings and reviews from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          {data.ratings.length > 0 ? (
            <div className="space-y-4">
              {data.ratings.map((rating) => (
                <div key={rating.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{rating.user.name}</p>
                    <p className="text-sm text-muted-foreground">{rating.user.email}</p>
                    <p className="text-xs text-muted-foreground">{new Date(rating.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <StarRating rating={rating.rating} />
                    <Badge variant={rating.rating >= 4 ? "default" : rating.rating >= 3 ? "secondary" : "destructive"}>
                      {rating.rating} stars
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No ratings yet. Encourage customers to rate your store!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
