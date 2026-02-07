"use client"

import { Clock, User, Phone, Mail, Loader } from "lucide-react"
import { useOrders } from "@/contexts/orders-context"
import { Timestamp } from "firebase/firestore"
import styles from "./recent-orders.module.css"

export default function RecentOrders() {
  const { getRecentOrders, isLoading } = useOrders()
  const recentOrders = getRecentOrders()

  const formatDate = (date: Timestamp | Date) => {
    const now = new Date()
    const orderDate = date instanceof Timestamp ? date.toDate() : date
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange"
      case "processing":
        return "blue"
      case "completed":
        return "green"
      case "cancelled":
        return "red"
      default:
        return "gray"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red"
      case "medium":
        return "orange"
      case "low":
        return "green"
      default:
        return "gray"
    }
  }

  if (isLoading) {
    return (
      <div className={styles.recentOrders}>
        <div className={styles.header}>
          <h3>Recent Orders</h3>
          <Clock size={20} />
        </div>
        <div className={styles.loadingContainer}>
          <Loader size={32} className={styles.spinner} />
          <p>Loading from Firebase...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.recentOrders}>
      <div className={styles.header}>
        <h3>Recent Orders</h3>
        <div className={styles.headerIcons}>
          <span className={styles.firebaseIcon}>🔥</span>
          <Clock size={20} />
        </div>
      </div>

      <div className={styles.ordersList}>
        {recentOrders.map((order) => (
          <div key={order.id} className={styles.orderItem}>
            <div className={styles.orderHeader}>
              <div className={styles.customerInfo}>
                <div className={styles.avatar}>
                  <User size={16} />
                </div>
                <div className={styles.customerDetails}>
                  <h4>{order.name}</h4>
                  <p>{order.orderId}</p>
                </div>
              </div>
              <div className={styles.orderMeta}>
                <span className={`${styles.status} ${styles[getStatusColor(order.status)]}`}>{order.status}</span>
                <span className={`${styles.priority} ${styles[getPriorityColor(order.priority)]}`}>
                  {order.priority}
                </span>
              </div>
            </div>

            <div className={styles.orderContent}>
              <p className={styles.message}>
                {order.message.length > 80 ? `${order.message.substring(0, 80)}...` : order.message}
              </p>

              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <Mail size={14} />
                  <span>{order.email}</span>
                </div>
                {order.phone && (
                  <div className={styles.contactItem}>
                    <Phone size={14} />
                    <span>{order.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.orderFooter}>
              <span className={styles.time}>{formatDate(order.createdAt)}</span>
              {order.estimatedValue && (
                <span className={styles.value}>₹{(order.estimatedValue / 1000).toFixed(0)}K</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {recentOrders.length === 0 && !isLoading && (
        <div className={styles.emptyState}>
          <p>No recent orders found.</p>
        </div>
      )}
    </div>
  )
}
