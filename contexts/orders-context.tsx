'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from './auth-context'

export interface Order {
  totalAmount: number
  specialRequirements: any
  quantity: number
  concreteType: string
  deliveryDate: any
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  projectType: string
  area: string
  location: string
  requirements: string
  estimatedValue?: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
  notes?: string
  assignedTo?: string
}

interface OrdersContextType {
  orders: Order[]
  loading: boolean
  error: string | null
  addOrder: (
    orderData: Omit<
      Order,
      'id' | 'status' | 'priority' | 'createdAt' | 'updatedAt'
    >
  ) => Promise<string>
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>
  deleteOrder: (id: string) => Promise<void>
  refreshOrders: () => Promise<void>
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Real-time listener for orders (admin only)
  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const ordersData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Order[]
          setOrders(ordersData)
          setLoading(false)
          setError(null)
        },
        (error) => {
          console.error('Error fetching orders:', error)
          setError('Failed to fetch orders')
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } else {
      setOrders([])
      setLoading(false)
    }
  }, [user])

  // Add order (admin only)
  const addOrder = async (
    orderData: Omit<
      Order,
      'id' | 'status' | 'priority' | 'createdAt' | 'updatedAt'
    >
  ): Promise<string> => {
    if (!user) {
      throw new Error('Authentication required')
    }

    try {
      setError(null)

      // Validate required fields
      if (
        !orderData.customerName ||
        !orderData.customerEmail ||
        !orderData.projectType ||
        !orderData.area ||
        !orderData.location ||
        !orderData.requirements
      ) {
        throw new Error('All required fields must be filled')
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(orderData.customerEmail)) {
        throw new Error('Please enter a valid email address')
      }

      const now = Timestamp.now()
      const newOrder = {
        ...orderData,
        status: 'pending' as const,
        priority: 'medium' as const,
        createdAt: now,
        updatedAt: now,
      }

      const docRef = await addDoc(collection(db, 'orders'), newOrder)
      console.log('Order added successfully with ID:', docRef.id)
      return docRef.id
    } catch (error: any) {
      console.error('Error adding order:', error)
      setError(error.message || 'Failed to add order')
      throw error
    }
  }

  // Update order (admin only)
  const updateOrder = async (id: string, updates: Partial<Order>) => {
    if (!user) {
      throw new Error('Authentication required')
    }

    try {
      setError(null)
      const orderRef = doc(db, 'orders', id)
      await updateDoc(orderRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      })
    } catch (error: any) {
      console.error('Error updating order:', error)
      setError(error.message || 'Failed to update order')
      throw error
    }
  }

  // Delete order (admin only)
  const deleteOrder = async (id: string) => {
    if (!user) {
      throw new Error('Authentication required')
    }

    try {
      setError(null)
      await deleteDoc(doc(db, 'orders', id))
    } catch (error: any) {
      console.error('Error deleting order:', error)
      setError(error.message || 'Failed to delete order')
      throw error
    }
  }

  // Refresh orders manually
  const refreshOrders = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[]
      setOrders(ordersData)
    } catch (error: any) {
      console.error('Error refreshing orders:', error)
      setError(error.message || 'Failed to refresh orders')
    } finally {
      setLoading(false)
    }
  }

  const value: OrdersContextType = {
    orders,
    loading,
    error,
    addOrder,
    updateOrder,
    deleteOrder,
    refreshOrders,
  }

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}
