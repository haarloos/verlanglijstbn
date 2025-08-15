"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Heart, Mail } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface WishlistItem {
  id: number
  name: string
  image: string | null
  description: string | null
  type: "checkable" | "contributable"
  checked: boolean
}

interface WishlistCardProps {
  item: WishlistItem
  onUpdate: () => void
}

export default function WishlistCard({ item, onUpdate }: WishlistCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckOff = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("wishlist").update({ checked: true }).eq("id", item.id)

      if (error) throw error

      // Simple email notification (in a real app, you'd use a proper email service)
      const subject = `Cadeau afgestreept: ${item.name}`
      const body = `Beste ceremoniemeesters, ik heb "${item.name}" van de verlanglijst van Niek en Beatrix afgestreept!`
      window.open(`mailto:niekenbeatrixgaantrouwen@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)

      onUpdate()
    } catch (error) {
      console.error("Error checking off item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContribute = () => {
    if (item.betaallink) {
      window.open(item.betaallink, '_blank'); // opens the link in a new tab
    } else {
      alert('No payment link available for this item.');
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 flex-1">
        <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
          <img
            src={item.image || "/placeholder.svg?height=200&width=200&query=gift"}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
            <Badge variant={item.type === "checkable" ? "default" : "secondary"}>
              {item.type === "checkable" ? "Afstreepbaar" : "Bijdrage"}
            </Badge>
          </div>

          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
          )}

          {/* Show contribution info only for contributable gifts */}
          {item.type !== "checkable" && typeof item.amount_contributed === "number" && (
            <p className="text-sm text-foreground">
              Reeds bijgedragen: <strong>€{item.amount_contributed.toFixed(2)}</strong>
            </p>
          )}
        </div>

      </CardContent>

      <CardFooter className="p-4 pt-0">
        {item.checked ? (
          <div className="w-full flex items-center justify-center gap-2 text-green-600">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Deze is al afgestreept!</span>
          </div>
        ) : (
          <Button
            onClick={item.type === "checkable" ? handleCheckOff : handleContribute}
            disabled={isLoading}
            className="w-full"
            variant={item.type === "checkable" ? "default" : "outline"}
          >
            {isLoading ? (
              "Loading..."
            ) : item.type === "checkable" ? (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Dit cadeau afstrepen (mail)
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 mr-2" />
                Bijdragen aan dit cadeau
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
