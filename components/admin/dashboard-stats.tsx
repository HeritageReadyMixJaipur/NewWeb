"use client"

import { TrendingUp, ShoppingCart, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useOrders } from "@/contexts/orders-context"
import styles from "./dashboard-stats.module.css"

export default function DashboardStats() {
  const { orders, getOrderStats } = useOrders()
  const stats = getOrderStats()

  const totalRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + (order.estimatedValue || 0), 0)

  const pendingRevenue = orders
    .filter((order) => order.status === "pending" || order.status === "processing")
    .reduce((sum, order) => sum + (order.estimatedValue || 0), 0)

  const statCards = [
    {
      title: "Total Orders",
      value: stats.total,
      icon: <ShoppingCart size={24} />,
      color: "blue",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Pending Orders",
      value: stats.pending,
      icon: <Clock size={24} />,
      color: "orange",
      change: "+5%",
      changeType: "neutral",
    },
    {
      title: "Completed Orders",
      value: stats.completed,
      icon: <CheckCircle size={24} />,
      color: "green",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Total Revenue",
      value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
      icon: <DollarSign size={24} />,
      color: "purple",
      change: "+15%",
      changeType: "positive",
    },
  ]

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <div key={index} className={`${styles.statCard} ${styles[stat.color]}`}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={`${styles.statChange} ${styles[stat.changeType]}`}>
                <TrendingUp size={16} />
                {stat.change}
              </div>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stat.value}</h3>
              <p className={styles.statTitle}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.additionalStats}>
        <div className={styles.revenueCard}>
          <h4>Revenue Overview</h4>
          <div className={styles.revenueStats}>
            <div className={styles.revenueStat}>
              <span className={styles.revenueLabel}>Completed</span>
              <span className={styles.revenueValue}>₹{(totalRevenue / 100000).toFixed(1)}L</span>
            </div>
            <div className={styles.revenueStat}>
              <span className={styles.revenueLabel}>Pending</span>
              <span className={styles.revenueValue}>₹{(pendingRevenue / 100000).toFixed(1)}L</span>
            </div>
          </div>
        </div>

        <div className={styles.statusCard}>
          <h4>Order Status</h4>
          <div className={styles.statusList}>
            <div className={styles.statusItem}>
              <AlertCircle size={16} className={styles.pendingIcon} />
              <span>Pending: {stats.pending}</span>
            </div>
            <div className={styles.statusItem}>
              <Clock size={16} className={styles.processingIcon} />
              <span>Processing: {stats.processing}</span>
            </div>
            <div className={styles.statusItem}>
              <CheckCircle size={16} className={styles.completedIcon} />
              <span>Completed: {stats.completed}</span>
            </div>
            <div className={styles.statusItem}>
              <XCircle size={16} className={styles.cancelledIcon} />
              <span>Cancelled: {stats.cancelled}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
