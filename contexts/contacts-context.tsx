"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
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
  type Timestamp,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "./auth-context"

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  status: "not_contacted" | "contacted" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
  notes?: string
}

interface ContactsContextType {
  contacts: Contact[]
  loading: boolean
  error: string | null
  submitContact: (
    contactData: Omit<Contact, "id" | "status" | "priority" | "createdAt" | "updatedAt">,
  ) => Promise<string>
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>
  deleteContact: (id: string) => Promise<void>
  refreshContacts: () => Promise<void>
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined)

export function ContactsProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Real-time listener for contacts (admin only)
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"))
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const contactsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Contact[]
          setContacts(contactsData)
          setLoading(false)
          setError(null)
        },
        (error) => {
          console.error("Error fetching contacts:", error)
          setError("Failed to fetch contacts")
          setLoading(false)
        },
      )

      return () => unsubscribe()
    } else {
      setContacts([])
      setLoading(false)
    }
  }, [user])

  // Submit contact (public access)
  const submitContact = async (
    contactData: Omit<Contact, "id" | "status" | "priority" | "createdAt" | "updatedAt">,
  ): Promise<string> => {
    try {
      setError(null)

      // Validate required fields
      if (!contactData.name || !contactData.email || !contactData.message) {
        throw new Error("Name, email, and message are required")
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(contactData.email)) {
        throw new Error("Please enter a valid email address")
      }

      const newContact = {
        ...contactData,
        status: "not_contacted" as const,
        priority: "medium" as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "contacts"), newContact)
      console.log("Contact submitted successfully with ID:", docRef.id)
      return docRef.id
    } catch (error: any) {
      console.error("Error submitting contact:", error)
      setError(error.message || "Failed to submit contact")
      throw error
    }
  }

  // Update contact (admin only)
  const updateContact = async (id: string, updates: Partial<Contact>) => {
    if (!user) {
      throw new Error("Authentication required")
    }

    try {
      setError(null)
      const contactRef = doc(db, "contacts", id)
      await updateDoc(contactRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })
    } catch (error: any) {
      console.error("Error updating contact:", error)
      setError(error.message || "Failed to update contact")
      throw error
    }
  }

  // Delete contact (admin only)
  const deleteContact = async (id: string) => {
    if (!user) {
      throw new Error("Authentication required")
    }

    try {
      setError(null)
      await deleteDoc(doc(db, "contacts", id))
    } catch (error: any) {
      console.error("Error deleting contact:", error)
      setError(error.message || "Failed to delete contact")
      throw error
    }
  }

  // Refresh contacts manually
  const refreshContacts = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      const contactsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contact[]
      setContacts(contactsData)
    } catch (error: any) {
      console.error("Error refreshing contacts:", error)
      setError(error.message || "Failed to refresh contacts")
    } finally {
      setLoading(false)
    }
  }

  const value: ContactsContextType = {
    contacts,
    loading,
    error,
    submitContact,
    updateContact,
    deleteContact,
    refreshContacts,
  }

  return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>
}

export function useContacts() {
  const context = useContext(ContactsContext)
  if (context === undefined) {
    throw new Error("useContacts must be used within a ContactsProvider")
  }
  return context
}
