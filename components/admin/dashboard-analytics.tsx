"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Users, Package, DollarSign, TrendingUp, Phone, Mail, Clock } from "lucide-react"
import { useContacts } from "@/contexts/contacts-context"
import { useOrders } from "@/contexts/orders-context"
import styles from "./dashboard-analytics.module.css"

export default function DashboardAnalytics() {
  const { contacts } = useContacts()
  const { orders, addOrder } = useOrders()
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showRecentContacts, setShowRecentContacts] = useState(false)
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    area: "",
    concreteType: "M20",
    quantity: 0,
    totalAmount: 0,
  })

  // Calculate analytics
  const totalContacts = contacts.length
  const totalOrders = orders.length
  const completedOrders = orders.filter((order) => order.status === "completed").length
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const totalRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  const pendingRevenue = orders
    .filter((order) => order.status !== "completed" && order.status !== "cancelled")
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0)

  const recentContacts = contacts.slice(0, 5)

  const handleQuickAddOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOrder.customerName || !newOrder.customerPhone || !newOrder.area) return

    try {
      await addOrder({
        ...newOrder,
        deliveryAddress: "",
        deliveryDate: "",
        specialRequirements: "",
        status: "pending" as const,
      })
      setNewOrder({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        area: "",
        concreteType: "M20",
        quantity: 0,
        totalAmount: 0,
      })
      setShowQuickAdd(false)
      alert("Order added successfully!")
    } catch (error) {
      console.error("Error adding order:", error)
      alert("Failed to add order")
    }
  }

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "N/A"
    try {
      let date: Date
      if (dateValue.toDate && typeof dateValue.toDate === "function") {
        date = dateValue.toDate()
      } else if (dateValue instanceof Date) {
        date = dateValue
      } else {
        date = new Date(dateValue)
      }
      return date.toLocaleDateString("en-IN")
    } catch (error) {
      return "N/A"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_contacted":
        return "#ed8936"
      case "contacted":
        return "#4299e1"
      case "in_progress":
        return "#38b2ac"
      case "completed":
        return "#48bb78"
      default:
        return "#718096"
    }
  }

  return (
    <div className={styles.dashboardAnalytics}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome to Heritage Readymix Admin Dashboard</p>
        </div>
        <div className={styles.quickActions}>
          <button onClick={() => setShowQuickAdd(!showQuickAdd)} className={styles.quickAddBtn}>
            <Plus size={20} />
            Quick Add Order
          </button>
          <button onClick={() => setShowRecentContacts(!showRecentContacts)} className={styles.contactsBtn}>
            <Users size={20} />
            Recent Contacts
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Total Contacts</h3>
            <p className={styles.statNumber}>{totalContacts}</p>
            <span className={styles.statChange}>+12% from last month</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
            <Package size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Total Orders</h3>
            <p className={styles.statNumber}>{totalOrders}</p>
            <span className={styles.statChange}>+8% from last month</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Completed Orders</h3>
            <p className={styles.statNumber}>{completedOrders}</p>
            <span className={styles.statChange}>+15% from last month</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Total Revenue</h3>
            <p className={styles.statNumber}>₹{totalRevenue.toLocaleString()}</p>
            <span className={styles.statChange}>+22% from last month</span>
          </div>
        </div>
      </div>

      {/* Quick Add Order Form */}
      {showQuickAdd && (
        <div className={styles.quickAddSection}>
          <div className={styles.sectionHeader}>
            <h2>Quick Add Order</h2>
            <button onClick={() => setShowQuickAdd(false)} className={styles.closeBtn}>
              ×
            </button>
          </div>
          <form onSubmit={handleQuickAddOrder} className={styles.quickForm}>
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="Customer Name *"
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={newOrder.customerPhone}
                onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                required
              />
            </div>
            <div className={styles.formRow}>
              <input
                type="email"
                placeholder="Email"
                value={newOrder.customerEmail}
                onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
              />
              <input
                type="text"
                placeholder="Area *"
                value={newOrder.area}
                onChange={(e) => setNewOrder({ ...newOrder, area: e.target.value })}
                required
              />
            </div>
            <div className={styles.formRow}>
              <select
                value={newOrder.concreteType}
                onChange={(e) => setNewOrder({ ...newOrder, concreteType: e.target.value })}
              >
                <option value="M15">M15</option>
                <option value="M20">M20</option>
                <option value="M25">M25</option>
                <option value="M30">M30</option>
                <option value="M35">M35</option>
              </select>
              <input
                type="number"
                placeholder="Quantity (m³)"
                value={newOrder.quantity}
                onChange={(e) => setNewOrder({ ...newOrder, quantity: Number(e.target.value) })}
                min="0"
                step="0.1"
              />
              <input
                type="number"
                placeholder="Amount (₹)"
                value={newOrder.totalAmount}
                onChange={(e) => setNewOrder({ ...newOrder, totalAmount: Number(e.target.value) })}
                min="0"
              />
            </div>
            <button type="submit" className={styles.submitBtn}>
              <Package size={16} />
              Add Order
            </button>
          </form>
        </div>
      )}

      {/* Recent Contacts */}
      {showRecentContacts && (
        <div className={styles.recentContactsSection}>
          <div className={styles.sectionHeader}>
            <h2>Recent Contacts</h2>
            <button onClick={() => setShowRecentContacts(false)} className={styles.closeBtn}>
              ×
            </button>
          </div>
          <div className={styles.contactsGrid}>
            {recentContacts.map((contact) => (
              <div key={contact.id} className={styles.contactCard}>
                <div className={styles.contactHeader}>
                  <div className={styles.contactAvatar}>
                    <Users size={16} />
                  </div>
                  <div className={styles.contactInfo}>
                    <h4>{contact.name}</h4>
                    <div className={styles.contactStatus} style={{ backgroundColor: getStatusColor(contact.status) }}>
                      {contact.status.replace("_", " ")}
                    </div>
                  </div>
                </div>
                <div className={styles.contactDetails}>
                  <div className={styles.contactItem}>
                    <Mail size={14} />
                    <span>{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className={styles.contactItem}>
                      <Phone size={14} />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  <div className={styles.contactItem}>
                    <Clock size={14} />
                    <span>{formatDate(contact.createdAt)}</span>
                  </div>
                </div>
                <div className={styles.contactMessage}>
                  {contact.message.length > 100 ? `${contact.message.substring(0, 100)}...` : contact.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Stats */}
      <div className={styles.additionalStats}>
        <div className={styles.statRow}>
          <div className={styles.miniStat}>
            <h4>Pending Orders</h4>
            <p>{pendingOrders}</p>
          </div>
          <div className={styles.miniStat}>
            <h4>Pending Revenue</h4>
            <p>₹{pendingRevenue.toLocaleString()}</p>
          </div>
          <div className={styles.miniStat}>
            <h4>Conversion Rate</h4>
            <p>{totalContacts > 0 ? ((totalOrders / totalContacts) * 100).toFixed(1) : 0}%</p>
          </div>
          <div className={styles.miniStat}>
            <h4>Avg Order Value</h4>
            <p>₹{totalOrders > 0 ? Math.round(totalRevenue / completedOrders || 0).toLocaleString() : 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
