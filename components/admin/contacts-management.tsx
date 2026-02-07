"use client"

import { useState } from "react"
import { useContacts } from "@/contexts/contacts-context"
import { Search, Filter, Eye, Trash2, Phone, Mail } from "lucide-react"
import styles from "./contacts-management.module.css"

export default function ContactsManagement() {
  const { contacts, updateContact, deleteContact, loading } = useContacts()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedContact, setSelectedContact] = useState<any>(null)

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || contact.status === statusFilter
    const matchesPriority = priorityFilter === "all" || contact.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleStatusUpdate = async (contactId: string, newStatus: string) => {
    try {
      await updateContact(contactId, { status: newStatus as any })
    } catch (error) {
      console.error("Error updating contact status:", error)
    }
  }

  const handlePriorityUpdate = async (contactId: string, newPriority: string) => {
    try {
      await updateContact(contactId, { priority: newPriority as any })
    } catch (error) {
      console.error("Error updating contact priority:", error)
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteContact(contactId)
      } catch (error) {
        console.error("Error deleting contact:", error)
      }
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
      case "new":
        return "#4299e1"
      case "contacted":
        return "#ed8936"
      case "qualified":
        return "#38b2ac"
      case "converted":
        return "#48bb78"
      default:
        return "#718096"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#f56565"
      case "medium":
        return "#ed8936"
      case "low":
        return "#48bb78"
      default:
        return "#718096"
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading contacts...</div>
  }

  return (
    <div className={styles.contactsManagement}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Contact Management</h2>
          <p>Manage and track customer inquiries and leads</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{contacts.length}</span>
            <span className={styles.statLabel}>Total Contacts</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{contacts.filter((c) => c.status === "new").length}</span>
            <span className={styles.statLabel}>New</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{contacts.filter((c) => c.priority === "high").length}</span>
            <span className={styles.statLabel}>High Priority</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search contacts by name, email, phone, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <Filter size={20} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Contacts Table */}
      <div className={styles.tableContainer}>
        <table className={styles.contactsTable}>
          <thead>
            <tr>
              <th>Contact Info</th>
              <th>Company</th>
              <th>Requirements</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact) => (
              <tr key={contact.id}>
                <td>
                  <div className={styles.contactInfo}>
                    <div className={styles.contactName}>{contact.name}</div>
                    <div className={styles.contactDetails}>
                      <span>
                        <Mail size={14} /> {contact.email}
                      </span>
                      <span>
                        <Phone size={14} /> {contact.phone}
                      </span>
                    </div>
                  </div>
                </td>
                <td>{contact.company || "N/A"}</td>
                <td>
                  <div className={styles.requirements}>
                    {contact.concreteType && <span>Type: {contact.concreteType}</span>}
                    {contact.quantity && <span>Qty: {contact.quantity}m³</span>}
                    {contact.deliveryLocation && <span>Location: {contact.deliveryLocation}</span>}
                  </div>
                </td>
                <td>
                  <select
                    value={contact.priority}
                    onChange={(e) => handlePriorityUpdate(contact.id, e.target.value)}
                    className={styles.prioritySelect}
                    style={{ borderColor: getPriorityColor(contact.priority) }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </td>
                <td>
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusUpdate(contact.id, e.target.value)}
                    className={styles.statusSelect}
                    style={{ borderColor: getStatusColor(contact.status) }}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                  </select>
                </td>
                <td>{formatDate(contact.createdAt)}</td>
                <td>
                  <div className={styles.actions}>
                    <button onClick={() => setSelectedContact(contact)} className={styles.viewBtn} title="View Details">
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className={styles.deleteBtn}
                      title="Delete Contact"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredContacts.length === 0 && (
          <div className={styles.emptyState}>
            <p>No contacts found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Contact Details</h3>
              <button onClick={() => setSelectedContact(null)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.contactDetail}>
                <h4>{selectedContact.name}</h4>
                <p>
                  <strong>Email:</strong> {selectedContact.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedContact.phone}
                </p>
                {selectedContact.company && (
                  <p>
                    <strong>Company:</strong> {selectedContact.company}
                  </p>
                )}
                <p>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: getStatusColor(selectedContact.status) }}>{selectedContact.status}</span>
                </p>
                <p>
                  <strong>Priority:</strong>{" "}
                  <span style={{ color: getPriorityColor(selectedContact.priority) }}>{selectedContact.priority}</span>
                </p>
                <p>
                  <strong>Created:</strong> {formatDate(selectedContact.createdAt)}
                </p>

                <div className={styles.messageSection}>
                  <h5>Message:</h5>
                  <p>{selectedContact.message}</p>
                </div>

                {selectedContact.notes && (
                  <div className={styles.notesSection}>
                    <h5>Notes:</h5>
                    <p>{selectedContact.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
