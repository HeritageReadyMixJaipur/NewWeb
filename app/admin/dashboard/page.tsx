import { LanguageProvider } from '@/contexts/language-context'
import { ContactsProvider } from '@/contexts/contacts-context'
import { OrdersProvider } from '@/contexts/orders-context'
import Navbar from '@/components/navbar'
import ContactsManagement from '@/components/admin/contacts-management'
import OrderManagement from '@/components/admin/order-management'
import DashboardAnalytics from '@/components/admin/dashboard-analytics'
import styles from './dashboard.module.css'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <LanguageProvider>
      <ContactsProvider>
        <OrdersProvider>
          <div className="min-h-screen page-transition">
            <Navbar />
            <main className={styles.dashboard}>
              <div className={styles.container}>
                <div className={styles.dashboardTabs}>
                  <div className={styles.tabsContainer}>
                    <input
                      type="radio"
                      id="analytics-tab"
                      name="dashboard-tabs"
                      defaultChecked
                    />
                    <label htmlFor="analytics-tab" className={styles.tabLabel}>
                      Dashboard Overview
                    </label>

                    <input
                      type="radio"
                      id="contacts-tab"
                      name="dashboard-tabs"
                    />
                    <label htmlFor="contacts-tab" className={styles.tabLabel}>
                      Contact Management
                    </label>

                    <input type="radio" id="orders-tab" name="dashboard-tabs" />
                    <label htmlFor="orders-tab" className={styles.tabLabel}>
                      Order Management
                    </label>
                    <label
                      htmlFor="https://bigrock.titan.email/mail/"
                      className={styles.tabLabel}
                    >
                      <a href="https://bigrock.titan.email/mail/">
                        {' '}
                        Admin Email
                      </a>
                    </label>

                    <div className={styles.tabContent}>
                      <div className={styles.tabPane}>
                        <DashboardAnalytics />
                      </div>
                      <div className={styles.tabPane}>
                        <ContactsManagement />
                      </div>
                      <div className={styles.tabPane}>
                        <OrderManagement />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </OrdersProvider>
      </ContactsProvider>
    </LanguageProvider>
  )
}
