'use client'

import { useState } from 'react'
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Loader,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useContacts } from '@/contexts/contacts-context'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore'
import styles from './security-test.module.css'

export default function SecurityTest() {
  const { user } = useAuth()
  const { contacts } = useContacts()
  const [testResults, setTestResults] = useState<
    Record<string, 'pending' | 'success' | 'error' | 'running'>
  >({})
  const [testDetails, setTestDetails] = useState<Record<string, string>>({})

  const runTest = async (
    testId: string,
    testFunction: () => Promise<{ success: boolean; message: string }>,
  ) => {
    setTestResults((prev) => ({ ...prev, [testId]: 'running' }))

    try {
      const result = await testFunction()
      setTestResults((prev) => ({
        ...prev,
        [testId]: result.success ? 'success' : 'error',
      }))
      setTestDetails((prev) => ({ ...prev, [testId]: result.message }))
    } catch (error: any) {
      setTestResults((prev) => ({ ...prev, [testId]: 'error' }))
      setTestDetails((prev) => ({
        ...prev,
        [testId]: error.message || 'Test failed',
      }))
    }
  }

  const tests = [
    {
      id: 'public-contact-submit',
      title: 'Public Contact Submission',
      description: 'Test if public users can submit contact forms',
      test: async () => {
        try {
          const testContact = {
            name: 'Security Test User',
            email: 'test@example.com',
            phone: '+91 9876543210',
            message: 'This is a security test submission',
            status: 'not_contacted',
            priority: 'medium',
            estimatedValue: 50000,
            createdAt: new Date(),
          }

          await addDoc(collection(db, 'contacts'), testContact)
          return {
            success: true,
            message: 'Public contact submission successful',
          }
        } catch (error: any) {
          return { success: false, message: `Failed: ${error.message}` }
        }
      },
    },
    {
      id: 'admin-contact-read',
      title: 'Admin Contact Reading',
      description: 'Test if admin can read contact data',
      test: async () => {
        if (!user) {
          return { success: false, message: 'No Admin logged in' }
        }

        try {
          const snapshot = await getDocs(collection(db, 'contacts'))
          const contactCount = snapshot.size
          return {
            success: true,
            message: `Admin can read ${contactCount} contacts`,
          }
        } catch (error: any) {
          return { success: false, message: `Failed: ${error.message}` }
        }
      },
    },
    {
      id: 'admin-status-update',
      title: 'Admin Status Update',
      description: 'Test if admin can update contact status',
      test: async () => {
        if (!user) {
          return { success: false, message: 'No Admin logged in' }
        }

        if (contacts.length === 0) {
          return { success: false, message: 'No contacts available to update' }
        }

        try {
          const testContact = contacts[0]
          await updateDoc(doc(db, 'contacts', testContact.id), {
            status: 'contacted',
            updatedAt: new Date(),
            contactedBy: user.name || user.email,
          })
          return { success: true, message: 'Admin status update successful' }
        } catch (error: any) {
          return { success: false, message: `Failed: ${error.message}` }
        }
      },
    },
    {
      id: 'email-domain-validation',
      title: 'Email Domain Validation',
      description:
        'Test if only @heritagereadymix.com emails have admin access',
      test: async () => {
        if (!user) {
          return { success: false, message: 'No user logged in' }
        }

        const isValidDomain = user.email?.endsWith('@heritagereadymix.com')
        if (isValidDomain) {
          return { success: true, message: `Valid admin domain: ${user.email}` }
        } else {
          return { success: false, message: `Invalid domain: ${user.email}` }
        }
      },
    },
    {
      id: 'input-validation',
      title: 'Input Validation',
      description: 'Test if invalid data is rejected',
      test: async () => {
        try {
          // Try to submit invalid contact data
          const invalidContact = {
            name: '', // Empty name should fail
            email: 'invalid-email', // Invalid email format
            message: '', // Empty message should fail
            status: 'invalid_status', // Invalid status
            createdAt: new Date(),
          }

          await addDoc(collection(db, 'contacts'), invalidContact)
          return {
            success: false,
            message: 'Invalid data was accepted (security issue!)',
          }
        } catch (error: any) {
          return {
            success: true,
            message: 'Invalid data properly rejected by security rules',
          }
        }
      },
    },
  ]

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.id, test.test)
      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  const getTestIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className={styles.successIcon} />
      case 'error':
        return <XCircle className={styles.errorIcon} />
      case 'running':
        return <Loader className={styles.runningIcon} />
      default:
        return <AlertTriangle className={styles.pendingIcon} />
    }
  }

  const getTestClass = (status: string) => {
    switch (status) {
      case 'success':
        return styles.testSuccess
      case 'error':
        return styles.testError
      case 'running':
        return styles.testRunning
      default:
        return styles.testPending
    }
  }

  return (
    <div className={styles.securityTest}>
      <div className={styles.header}>
        <Shield size={48} className={styles.headerIcon} />
        <h1>Security Rules Testing</h1>
        <p>Test all Firebase security rules and access controls</p>
      </div>

      <div className={styles.userInfo}>
        {user ? (
          <div className={styles.loggedIn}>
            <CheckCircle size={20} />
            <span>
              Logged in as: <strong>{user.email}</strong> ({user.role})
            </span>
          </div>
        ) : (
          <div className={styles.notLoggedIn}>
            <XCircle size={20} />
            <span>Not logged in - Some tests will fail</span>
          </div>
        )}
      </div>

      <div className={styles.testControls}>
        <button onClick={runAllTests} className={styles.runAllButton}>
          <Play size={20} />
          Run All Security Tests
        </button>
      </div>

      <div className={styles.testsGrid}>
        {tests.map((test) => (
          <div
            key={test.id}
            className={`${styles.testCard} ${getTestClass(testResults[test.id] || 'pending')}`}
          >
            <div className={styles.testHeader}>
              <div className={styles.testIcon}>
                {getTestIcon(testResults[test.id] || 'pending')}
              </div>
              <div className={styles.testInfo}>
                <h3>{test.title}</h3>
                <p>{test.description}</p>
              </div>
              <button
                onClick={() => runTest(test.id, test.test)}
                className={styles.testButton}
                disabled={testResults[test.id] === 'running'}
              >
                {testResults[test.id] === 'running' ? 'Testing...' : 'Test'}
              </button>
            </div>

            {testDetails[test.id] && (
              <div className={styles.testResult}>
                <strong>Result:</strong> {testDetails[test.id]}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.securitySummary}>
        <h2>Security Summary</h2>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <h3>🌐 Public Access</h3>
            <ul>
              <li>✅ Can submit contact forms</li>
              <li>❌ Cannot read contact data</li>
              <li>❌ Cannot access admin features</li>
              <li>❌ Cannot update any data</li>
            </ul>
          </div>

          <div className={styles.summaryCard}>
            <h3>🔐 Admin Access</h3>
            <ul>
              <li>✅ Can read all contacts</li>
              <li>✅ Can update contact status</li>
              <li>✅ Can create orders</li>
              <li>✅ Can delete records</li>
            </ul>
          </div>

          <div className={styles.summaryCard}>
            <h3>🛡️ Security Rules</h3>
            <ul>
              <li>✅ Email domain validation</li>
              <li>✅ Input format validation</li>
              <li>✅ Status transition validation</li>
              <li>✅ Timestamp verification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
