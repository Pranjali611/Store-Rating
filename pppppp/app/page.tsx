import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Users, Store, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Rate Your Favorite Stores</h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover amazing stores, share your experiences, and help others make informed decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose StoreRating?</h2>
          <p className="text-lg text-gray-600">The most comprehensive platform for store ratings and reviews</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <CardTitle>Easy Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Rate stores from 1 to 5 stars with our intuitive rating system</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Community Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Join thousands of users sharing authentic store experiences</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Store className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Store Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Find new stores in your area and explore their ratings</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Store owners get detailed insights about their ratings</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Rating?</h2>
          <p className="text-lg mb-8 opacity-90">Join our community and make your voice heard</p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
