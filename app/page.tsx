"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import WishlistCard from "@/components/wishlist-card"
import { Gift, Database } from "lucide-react"

interface WishlistItem {
  id: number
  name: string
  image: string | null
  description: string | null
  type: "checkable" | "contributable"
  checked: boolean
}

export default function Home() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tableExists, setTableExists] = useState(true)

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from("wishlist").select("*").order("created_at", { ascending: true })

      if (error) {
        if (
          error.message.includes("does not exist") ||
          error.message.includes("table") ||
          error.message.includes("schema cache")
        ) {
          setTableExists(false)
          setLoading(false)
          return
        }
        throw error
      }
      setItems(data || [])
      setTableExists(true)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      setTableExists(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Gift className="h-8 w-8 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verlanglijst aan het laden...</p>
        </div>
      </div>
    )
  }

  if (!tableExists) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Database className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Setup Required</h1>
            </div>
            <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Database Setup Needed</h2>
              <p className="text-muted-foreground mb-4">
                The wishlist table needs to be created in your database. Please run the setup script:
              </p>
              <div className="bg-muted p-4 rounded-md text-left">
                <p className="font-mono text-sm">scripts/create-wishlist-table.sql</p>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                After running the script, refresh this page to see your wishlist.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Onze verlanglijst</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hoi, wat leuk dat je ons een cadeau wil geven! We hebben een paar ideeën. Je kunt er één afstrepen, of bijdragen aan een groter cadeau. Heel erg bedankt en tot binnenkort!
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">No items yet</h2>
            <p className="text-muted-foreground">The wishlist is empty at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <WishlistCard key={item.id} item={item} onUpdate={fetchItems} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
