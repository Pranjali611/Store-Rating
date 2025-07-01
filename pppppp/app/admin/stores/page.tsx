"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Search, ArrowUpDown } from "lucide-react"

interface Store {
  id: string
  name: string
  email: string
  address: string
  averageRating: number
  ratings: any[]
  owner: {
    name: string
    email: string
    address: string
  }
}

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [filteredStores, setFilteredStores] = useState<Store[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerName: "",
    ownerPassword: "",
  })

  useEffect(() => {
    fetchStores()
  }, [])

  useEffect(() => {
    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.owner.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Store]
      let bValue = b[sortBy as keyof Store]

      if (sortBy === "averageRating") {
        aValue = a.averageRating
        bValue = b.averageRating
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    setFilteredStores(filtered)
  }, [stores, searchTerm, sortBy, sortOrder])

  const fetchStores = async () => {
    try {
      const response = await fetch(`/api/admin/stores?sortBy=${sortBy}&sortOrder=${sortOrder}`)
      if (response.ok) {
        const data = await response.json()
        setStores(data.stores)
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create store")
      }

      setSuccess("Store and owner created successfully!")
      setFormData({
        name: "",
        email: "",
        address: "",
        ownerName: "",
        ownerPassword: "",
      })
      setIsDialogOpen(false)
      fetchStores()
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    }
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Stores</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Store</DialogTitle>
              <DialogDescription>Create a new store and store owner account</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Store Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Store Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="20-60 characters"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerPassword">Owner Password</Label>
                  <Input
                    id="ownerPassword"
                    type="password"
                    value={formData.ownerPassword}
                    onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })}
                    placeholder="8-16 chars, 1 uppercase, 1 special"
                    required
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Store</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {success && (
        <Alert className="mb-6">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search stores by name, email, address, or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stores Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Stores</CardTitle>
          <CardDescription>Manage all stores registered on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("name")}>
                      Store Name <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("email")}>
                      Email <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("averageRating")}>
                      Rating <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell>{store.email}</TableCell>
                    <TableCell className="max-w-xs truncate">{store.address}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{store.owner.name}</p>
                        <p className="text-sm text-muted-foreground">{store.owner.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={store.averageRating} size="sm" />
                        <Badge variant="secondary">{store.ratings.length} reviews</Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredStores.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No stores found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
