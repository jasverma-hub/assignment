"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Customer {
  items: number
  id: number
}

interface Checkout {
  id: number
  customers: Customer[]
  totalItems: number
}

export default function Home() {
  const [itemCount, setItemCount] = useState<string>("")
  const [checkouts, setCheckouts] = useState<Checkout[]>([
    { id: 1, customers: [], totalItems: 0 },
    { id: 2, customers: [], totalItems: 0 },
    { id: 3, customers: [], totalItems: 0 },
  ])
  const [customerIdCounter, setCustomerIdCounter] = useState(1)
  const [lastAssigned, setLastAssigned] = useState<number | null>(null)

  const assignCustomer = () => {
    const items = Number.parseInt(itemCount)

    if (isNaN(items) || items <= 0) {
      alert("Please enter a valid number of items")
      return
    }

    // Find the checkout with the minimum total items
    let minItemsCheckout = checkouts[0]
    for (const checkout of checkouts) {
      if (checkout.totalItems < minItemsCheckout.totalItems) {
        minItemsCheckout = checkout
      }
    }

    // Create a new customer
    const newCustomer: Customer = {
      items,
      id: customerIdCounter,
    }

    // Update the checkouts array
    const updatedCheckouts = checkouts.map((checkout) => {
      if (checkout.id === minItemsCheckout.id) {
        return {
          ...checkout,
          customers: [...checkout.customers, newCustomer],
          totalItems: checkout.totalItems + items,
        }
      }
      return checkout
    })

    setCheckouts(updatedCheckouts)
    setCustomerIdCounter(customerIdCounter + 1)
    setItemCount("")
    setLastAssigned(minItemsCheckout.id)

    // Reset the highlight after 2 seconds
    setTimeout(() => {
      setLastAssigned(null)
    }, 2000)
  }

  const resetCheckouts = () => {
    setCheckouts([
      { id: 1, customers: [], totalItems: 0 },
      { id: 2, customers: [], totalItems: 0 },
      { id: 3, customers: [], totalItems: 0 },
    ])
    setCustomerIdCounter(1)
    setLastAssigned(null)
  }

  return (
    <main className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Hypermart Checkout System</h1>
          <p className="text-lg text-gray-600">Real-time queue management system</p>
        </div>

        <div className="flex justify-center mb-8 gap-4">
          <div className="flex w-full max-w-md">
            <Input
              type="number"
              placeholder="Enter number of items"
              value={itemCount}
              onChange={(e) => setItemCount(e.target.value)}
              className=""
              min="1"
            />
            <Button onClick={assignCustomer} className="ml-4 cursor-pointer bg-indigo-600 hover:bg-indigo-700">
              Checkout Items
            </Button>
          </div>
          <Button variant="outline" onClick={resetCheckouts} className="border-red-300 text-red-600 hover:bg-red-50 cursor-pointer">
            Reset All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {checkouts.map((checkout) => (
            <Card
              key={checkout.id}
              className={`${
                lastAssigned === checkout.id ? "border-green-500 shadow-lg shadow-green-100" : ""
              } transition-all duration-300`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Counter {checkout.id}</CardTitle>
                  <div className="flex items-center text-gray-500 text-sm">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    <span>{checkout.customers.length} customers</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {checkout.customers.length === 0 ? (
                  <div className="py-8 text-center text-gray-400">No customers in queue</div>
                ) : (
                  <div className="space-y-2">
                    {checkout.customers.map((customer) => (
                      <div key={customer.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                        <ShoppingCart className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{customer.items} items</span>
                      </div>
                    ))}
                    <div className="pt-2 text-right text-sm text-gray-600">Total Items: {checkout.totalItems}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-bold mb-2">How it works?</h2>
          <p className="text-md text-gray-600">
            When a new customer arrives, they are assigned to the checkout with the fewest total items. If multiple
            checkouts have the same number of items, the customer is assigned to the leftmost checkout (lowest counter
            number).
          </p>
        </div>
      </div>
    </main>
  )
}
