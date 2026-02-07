"use client"

import { useState } from "react"
import { Eye, Trash2, Filter, Search, Phone, Mail, Loader } from "lucide-react"
import { useOrders, type Order } from "@/contexts/orders-context"
import { Timestamp } from "firebase/firestore"
import styles from "./orders-table.module.css"

export default function OrdersTable() {
  const { orders, updateOrderStatus, deleteOrder, isLoading } = useOrders()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Order["status"]) => {
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

  const getPriorityColor = (priority: Order["priority"]) => {
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

  const formatDate = (date: Timestamp | Date) => {
    const dateObj = date instanceof Timestamp ? date.toDate() : date
    return dateObj.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      setUpdating(orderId)
      await updateOrderStatus(orderId, newStatus)
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status. Please try again.")
    } finally {
      setUpdating(null)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(orderId)
      } catch (error) {
        console.error("Error deleting order:", error)
        alert("Failed to delete order. Please try again.")
      }
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={40} className={styles.spinner} />
        <p>Loading orders from Firebase...</p>
      </div>
    )
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h2>Orders Management (Firebase)</h2>
        <div className={styles.tableControls}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filterBox}>
            <Filter size={18} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Message</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Value</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <div className={styles.customerInfo}>
                    <div className={styles.customerAvatar}>{order.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className={styles.customerName}>{order.name}</div>
                      <div className={styles.customerEmail}>{order.email}</div>
                      {order.orderId && <div className={styles.orderId}>{order.orderId}</div>}
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.contactInfo}>
                    <div className={styles.contactItem}>
                      <Phone size={14} />
                      {order.phone}
                    </div>
                    <div className={styles.contactItem}>
                      <Mail size={14} />
                      {order.email}
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.message}>
                    {order.message.length > 50 ? `${order.message.substring(0, 50)}...` : order.message}
                  </div>
                </td>
                <td>
                  <div className={styles.statusContainer}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                      className={`${styles.statusSelect} ${styles[getStatusColor(order.status)]}`}
                      disabled={updating === order.id}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updating === order.id && <Loader size={16} className={styles.updateSpinner} />}
                  </div>
                </td>
                <td>
                  <span className={`${styles.priority} ${styles[getPriorityColor(order.priority)]}`}>
                    {order.priority}
                  </span>
                </td>
                <td>
                  <div className={styles.value}>
                    {order.estimatedValue ? formatCurrency(order.estimatedValue) : "N/A"}
                  </div>
                </td>
                <td>
                  <div className={styles.date}>{formatDate(order.createdAt)}</div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button onClick={() => handleViewOrder(order)} className={styles.actionButton} title="View Details">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleDeleteOrder(order.id)} className={styles.deleteButton} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && !isLoading && (
        <div className={styles.emptyState}>
          <p>No orders found matching your criteria.</p>
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Order Details (Firebase)</h3>
              <button onClick={() => setShowModal(false)} className={styles.closeButton}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.orderDetail}>
                <strong>Order ID:</strong> {selectedOrder.orderId}
              </div>
              <div className={styles.orderDetail}>
                <strong>Customer:</strong> {selectedOrder.name}
              </div>
              <div className={styles.orderDetail}>
                <strong>Email:</strong> {selectedOrder.email}
              </div>
              <div className={styles.orderDetail}>
                <strong>Phone:</strong> {selectedOrder.phone}
              </div>
              <div className={styles.orderDetail}>
                <strong>Status:</strong>{" "}
                <span className={`${styles.status} ${styles[getStatusColor(selectedOrder.status)]}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className={styles.orderDetail}>
                <strong>Priority:</strong>{" "}
                <span className={`${styles.priority} ${styles[getPriorityColor(selectedOrder.priority)]}`}>
                  {selectedOrder.priority}
                </span>
              </div>
              <div className={styles.orderDetail}>
                <strong>Estimated Value:</strong>{" "}
                {selectedOrder.estimatedValue ? formatCurrency(selectedOrder.estimatedValue) : "N/A"}
              </div>
              <div className={styles.orderDetail}>
                <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
              </div>
              <div className={styles.orderDetail}>
                <strong>Message:</strong>
                <p className={styles.fullMessage}>{selectedOrder.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
