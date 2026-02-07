'use client'

import type React from 'react'

import { useState } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle,
  Loader,
  AlertCircle,
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useContacts } from '@/contexts/contacts-context'
import styles from './contact-form.module.css'

export default function ContactForm() {
  const { t } = useLanguage()
  const { submitContact } = useContacts()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedContactId, setSubmittedContactId] = useState('')
  const [error, setError] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Submit contact to Firebase (public access)
      const contactId = await submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      })

      setSubmittedContactId(contactId)
      setIsSubmitted(true)
      setIsSubmitting(false)

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ name: '', email: '', phone: '', message: '' })
      }, 5000)
    } catch (error: any) {
      console.error('Error submitting contact:', error)
      setError(error.message || 'Failed to submit contact. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>
              <CheckCircle size={64} />
            </div>
            <h2>Thank You!</h2>
            <p>Your contact details have been submitted successfully.</p>
            <div className={styles.contactDetails}>
              <p>
                <strong>Contact ID:</strong> {submittedContactId}
              </p>
              <p>
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              {formData.phone && (
                <p>
                  <strong>Phone:</strong> {formData.phone}
                </p>
              )}
              <p>
                <strong>Status:</strong>{' '}
                <span className={styles.statusBadge}>Not Contacted</span>
              </p>
            </div>
            <p className={styles.followUp}>
              Our team will contact you within 24 hours. Your inquiry is now in
              our system and will be managed by our admin team.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false)
                setFormData({ name: '', email: '', phone: '', message: '' })
              }}
              className={styles.newMessageButton}
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.contactSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('contactUs')}</h1>
          <p className={styles.subtitle}>
            Get in touch with us for all your concrete needs. No login required
            - just submit your details!
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <div className={styles.iconContainer}>
                <Phone className={styles.icon} />
              </div>
              <div className={styles.infoContent}>
                <h3>{t('contactNumber')}</h3>
                <p>+91 75687 46566</p>
                <p>+91 63759 25113</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconContainer}>
                <Mail className={styles.icon} />
              </div>
              <div className={styles.infoContent}>
                <h3>{t('email')}</h3>
                <p>info@heritagereadymix.com</p>
                <p>sales@heritagereadymix.com</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconContainer}>
                <MapPin className={styles.icon} />
              </div>
              <div className={styles.infoContent}>
                <h3>Address</h3>
                <p>Near Bombay Hospital, Goner Road, Jagatpura</p>
                <p>Jaipur, Rajasthan 302001</p>
                <p>India</p>
              </div>
            </div>
          </div>

          <div className={styles.contactForm}>
            <div className={styles.formHeader}>
              <h2>Contact Details Submission</h2>
              <p>Submit your inquiry - our admin team will contact you soon!</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Full Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter your phone number"
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  Message / Requirements{' '}
                  <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className={styles.textarea}
                  placeholder="Tell us about your concrete requirements, project details, timeline, etc."
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className={styles.error}>
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={20} className={styles.spinner} />
                    Submitting to Firebase...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Submit Contact Details
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className={styles.mapSection}>
          <h2 className={styles.mapTitle}>Find Us Here</h2>
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1990.801604527801!2d75.88949054441984!3d26.783164941052693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc900343eec23%3A0x59b8864b60d33a0!2sHeritage%20ReadyMix%20Jaipur!5e1!3m2!1sen!2sin!4v1770441806463!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '15px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
