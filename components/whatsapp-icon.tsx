'use client'

import { useState } from 'react'
import { MessageCircle, X, Phone, User } from 'lucide-react'
import styles from './whatsapp-icon.module.css'

const whatsappNumbers = [
  {
    id: 1,
    name: 'Sales & Enquiry',
    number: '+917568746566',
    message:
      'Hello! I am interested in your concrete services and would like to get a quote.',
    icon: <User size={16} />,
  },
  {
    id: 2,
    name: 'Customer Support',
    number: '+916375925113',
    message: 'Hi! I need support regarding my concrete order/delivery.',
    icon: <Phone size={16} />,
  },
]

export default function WhatsAppIcon() {
  const [isOpen, setIsOpen] = useState(false)

  const handleWhatsAppClick = (number: string, message: string) => {
    const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(
      message
    )}`
    window.open(whatsappUrl, '_blank')
    setIsOpen(false)
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={styles.whatsappContainer}>
      {/* Options Menu */}
      {isOpen && (
        <div className={styles.optionsMenu}>
          <div className={styles.menuHeader}>
            <span>Contact us on WhatsApp</span>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
            >
              <X size={16} />
            </button>
          </div>

          {whatsappNumbers.map((contact) => (
            <button
              key={contact.id}
              onClick={() =>
                handleWhatsAppClick(contact.number, contact.message)
              }
              className={styles.optionButton}
            >
              <div className={styles.optionIcon}>{contact.icon}</div>
              <div className={styles.optionContent}>
                <span className={styles.optionName}>{contact.name}</span>
                <span className={styles.optionNumber}>{contact.number}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main WhatsApp Button */}
      <button
        className={`${styles.whatsappButton} ${isOpen ? styles.active : ''}`}
        onClick={toggleMenu}
        aria-label="Contact us on WhatsApp"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  )
}
