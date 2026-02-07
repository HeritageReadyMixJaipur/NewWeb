'use client'

import type React from 'react'
import { useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Save,
  X,
  Loader,
  Package,
  DollarSign,
  Calendar,
  User,
  MapPin,
} from 'lucide-react'
import { useOrders } from '@/contexts/orders-context'
import styles from './order-management.module.css'

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string
  concreteType: string
  quantity: number
  deliveryAddress: string
  area: string
  deliveryDate: string
  specialRequirements?: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  totalAmount: number
  createdAt: any
  updatedAt: any
}

export default function OrderManagement() {
  const { orders, addOrder, updateOrder, deleteOrder, loading } = useOrders()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    concreteType: '',
    quantity: 0,
    deliveryAddress: '',
    area: '',
    deliveryDate: '',
    specialRequirements: '',
    totalAmount: 0,
  })

  const formatDate = (dateValue: any) => {
    if (!dateValue) return 'N/A'

    try {
      let date: Date
      if (dateValue.toDate && typeof dateValue.toDate === 'function') {
        date = dateValue.toDate()
      } else if (dateValue instanceof Date) {
        date = dateValue
      } else {
        date = new Date(dateValue)
      }
      return date.toLocaleDateString('en-IN')
    } catch (error) {
      return 'N/A'
    }
  }

  // Safe filtering with null checks
  const filteredOrders = (orders || []).filter((order) => {
    if (!order) return false

    const customerName = order.customerName || ''
    const customerPhone = order.customerPhone || ''
    const area = order.area || ''
    const concreteType = order.concreteType || ''
    const status = order.status || ''

    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerPhone.includes(searchTerm) ||
      area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concreteType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOrder.customerName || !newOrder.customerPhone || !newOrder.area)
      return

    setIsSubmitting(true)
    try {
      await addOrder({
        ...newOrder,
        status: 'pending' as const,
      })
      setNewOrder({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        concreteType: '',
        quantity: 0,
        deliveryAddress: '',
        area: '',
        deliveryDate: '',
        specialRequirements: '',
        totalAmount: 0,
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding order:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: Order['status']
  ) => {
    try {
      await updateOrder(orderId, { status: newStatus })
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleFieldEdit = (
    orderId: string,
    field: string,
    currentValue: string
  ) => {
    setEditingOrder(orderId)
    setEditingField(field)
    setEditValue(currentValue || '')
  }

  const handleFieldSave = async () => {
    if (!editingOrder || !editingField) return

    try {
      await updateOrder(editingOrder, { [editingField]: editValue })
      setEditingOrder(null)
      setEditingField(null)
      setEditValue('')
    } catch (error) {
      console.error('Error updating field:', error)
    }
  }

  const handleFieldCancel = () => {
    setEditingOrder(null)
    setEditingField(null)
    setEditValue('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#ed8936'
      case 'confirmed':
        return '#4299e1'
      case 'in-progress':
        return '#38b2ac'
      case 'completed':
        return '#48bb78'
      case 'cancelled':
        return '#f56565'
      default:
        return '#718096'
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={40} className={styles.spinner} />
        <p>Loading orders...</p>
      </div>
    )
  }

  return (
    <div className={styles.orderManagement}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Order Management</h2>
          <p>Manage customer orders and track delivery status</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className={styles.addButton}
        >
          <Plus size={20} />
          Add New Order
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by customer, phone, area, or concrete type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <Filter size={20} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div className={styles.ordersGrid}>
        {filteredOrders.map((order) => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div className={styles.customerInfo}>
                <div className={styles.customerAvatar}>
                  <User size={16} />
                </div>
                <div className={styles.customerDetails}>
                  <h4>{order.customerName || 'N/A'}</h4>
                  <p>{order.customerEmail || 'N/A'}</p>
                </div>
              </div>
              <div className={styles.statusContainer}>
                <select
                  value={order.status || 'pending'}
                  onChange={(e) =>
                    handleStatusUpdate(
                      order.id,
                      e.target.value as Order['status']
                    )
                  }
                  className={styles.statusSelect}
                  style={{
                    borderColor: getStatusColor(order.status || 'pending'),
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className={styles.orderContent}>
              <div className={styles.orderInfo}>
                <div className={styles.infoItem}>
                  <DollarSign size={16} />
                  <span>₹{(order.totalAmount || 0).toLocaleString()}</span>
                </div>
                <div className={styles.infoItem}>
                  <Calendar size={16} />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className={styles.infoItem}>
                  <MapPin size={16} />
                  {editingOrder === order.id && editingField === 'area' ? (
                    <div className={styles.editField}>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleFieldSave()
                        }
                        autoFocus
                      />
                      <button
                        onClick={handleFieldSave}
                        className={styles.saveBtn}
                      >
                        <Save size={14} />
                      </button>
                      <button
                        onClick={handleFieldCancel}
                        className={styles.cancelBtn}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={styles.editableField}
                      onClick={() =>
                        handleFieldEdit(order.id, 'area', order.area || '')
                      }
                    >
                      {order.area || 'Click to add area'}
                      <Edit2 size={14} className={styles.editIcon} />
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.orderDetails}>
                <p>
                  <strong>Phone:</strong> {order.customerPhone || 'N/A'}
                </p>
                <p>
                  <strong>Concrete:</strong> {order.concreteType || 'N/A'}
                </p>
                <p>
                  <strong>Quantity:</strong> {order.quantity || 0} m³
                </p>
                {order.deliveryDate && (
                  <p>
                    <strong>Delivery:</strong> {order.deliveryDate}
                  </p>
                )}
              </div>

              {order.specialRequirements && (
                <div className={styles.requirements}>
                  <strong>Requirements:</strong> {order.specialRequirements}
                </div>
              )}
            </div>

            <div className={styles.orderActions}>
              <button
                onClick={() => deleteOrder(order.id)}
                className={styles.deleteBtn}
                title="Delete Order"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className={styles.emptyState}>
          <Package size={48} />
          <p>No orders found matching your criteria.</p>
        </div>
      )}

      {/* Add Order Modal */}
      {showAddForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Add New Order</h3>
              <button onClick={() => setShowAddForm(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddOrder} className={styles.orderForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Customer Name *</label>
                  <input
                    type="text"
                    value={newOrder.customerName}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, customerName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={newOrder.customerPhone}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        customerPhone: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={newOrder.customerEmail}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        customerEmail: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Area *</label>
                  <input
                    type="text"
                    value={newOrder.area}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, area: e.target.value })
                    }
                    placeholder="e.g., Malviya Nagar, Vaishali Nagar"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Concrete Type</label>
                  <select
                    value={newOrder.concreteType}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, concreteType: e.target.value })
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="M15">M15</option>
                    <option value="M20">M20</option>
                    <option value="M25">M25</option>
                    <option value="M30">M30</option>
                    <option value="M35">M35</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Quantity (m³)</label>
                  <input
                    type="number"
                    value={newOrder.quantity}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        quantity: Number(e.target.value),
                      })
                    }
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Delivery Date</label>
                  <input
                    type="date"
                    value={newOrder.deliveryDate}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, deliveryDate: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Total Amount (₹)</label>
                  <input
                    type="number"
                    value={newOrder.totalAmount}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        totalAmount: Number(e.target.value),
                      })
                    }
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Delivery Address</label>
                <textarea
                  value={newOrder.deliveryAddress}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      deliveryAddress: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Special Requirements</label>
                <textarea
                  value={newOrder.specialRequirements}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      specialRequirements: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={16} className={styles.spinner} />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Package size={16} />
                      Add Order
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
