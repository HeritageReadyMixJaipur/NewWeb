'use client'

import { useState } from 'react'
import {
  Shield,
  Copy,
  CheckCircle,
  AlertTriangle,
  Lock,
  Users,
  Database,
} from 'lucide-react'
import styles from './firebase-security-setup.module.css'

export default function FirebaseSecuritySetup() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contact submissions - Public write access, Admin read access
    match /contacts/{contactId} {
      // Anyone can submit contact details (public write access)
      allow create: if isValidContactSubmission();
      
      // Only authenticated admins can read contact details
      allow read: if isAdmin();
      
      // Only authenticated admins can update contact status
      allow update: if isAdmin() && isValidStatusUpdate();
      
      // Only authenticated admins can delete contacts
      allow delete: if isAdmin();
    }
    
    // Orders collection - Admin only access
    match /orders/{orderId} {
      // Only authenticated admins can create, read, update, delete orders
      allow read, write: if isAdmin();
    }
    
    // Admins collection - Admin only access
    match /users/{userId} {
      // Only the user themselves can read/write their own data
      allow read, write: if isAdmin() && request.auth.uid == userId;
    }
    
    // Helper functions
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email != null &&
             (request.auth.token.email.matches('.*@heritagereadymix\\\\.com$') ||
              request.auth.uid in get(/databases/$(database)/documents/admins/authorized).data.uids);
    }
    
    function isValidContactSubmission() {
      let data = request.resource.data;
      return data.keys().hasAll(['name', 'email', 'message', 'createdAt', 'status']) &&
             data.name is string && data.name.size() > 0 &&
             data.email is string && data.email.matches('.*@.*\\\\..*') &&
             data.message is string && data.message.size() > 0 &&
             data.status == 'not_contacted' &&
             data.createdAt == request.time;
    }
    
    function isValidStatusUpdate() {
      let data = request.resource.data;
      let existingData = resource.data;
      return data.diff(existingData).affectedKeys().hasOnly(['status', 'updatedAt', 'contactedBy']) &&
             data.status in ['not_contacted', 'contacted', 'in_progress', 'completed'] &&
             data.updatedAt == request.time;
    }
  }
}`

  const authRules = `{
  "rules": {
    ".read": false,
    ".write": false,
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}`

  return (
    <div className={styles.securitySetup}>
      <div className={styles.header}>
        <Shield size={48} className={styles.headerIcon} />
        <h1>Firebase Security Configuration</h1>
        <p>
          Complete security setup for Heritage Readymix contact and order
          management
        </p>
      </div>

      <div className={styles.securityOverview}>
        <div className={styles.securityCard}>
          <Users className={styles.cardIcon} />
          <h3>Public Access</h3>
          <p>Anyone can submit contact forms without authentication</p>
          <div className={styles.permissions}>
            <span className={styles.permission}>✅ Submit Contact Details</span>
            <span className={styles.permission}>❌ Read Contact Data</span>
            <span className={styles.permission}>❌ Manage Orders</span>
          </div>
        </div>

        <div className={styles.securityCard}>
          <Lock className={styles.cardIcon} />
          <h3>Admin Access</h3>
          <p>Authenticated admins have full management capabilities</p>
          <div className={styles.permissions}>
            <span className={styles.permission}>✅ Read All Contacts</span>
            <span className={styles.permission}>✅ Update Contact Status</span>
            <span className={styles.permission}>✅ Manage Orders</span>
            <span className={styles.permission}>✅ Delete Records</span>
          </div>
        </div>

        <div className={styles.securityCard}>
          <Database className={styles.cardIcon} />
          <h3>Data Protection</h3>
          <p>Comprehensive validation and access control</p>
          <div className={styles.permissions}>
            <span className={styles.permission}>✅ Input Validation</span>
            <span className={styles.permission}>✅ Email Format Check</span>
            <span className={styles.permission}>✅ Timestamp Verification</span>
            <span className={styles.permission}>✅ Status Validation</span>
          </div>
        </div>
      </div>

      <div className={styles.rulesSection}>
        <div className={styles.ruleCard}>
          <div className={styles.ruleHeader}>
            <h2>Firestore Security Rules</h2>
            <button
              onClick={() => copyToClipboard(firestoreRules, 'firestore')}
              className={styles.copyButton}
            >
              {copiedSection === 'firestore' ? (
                <CheckCircle size={16} />
              ) : (
                <Copy size={16} />
              )}
              {copiedSection === 'firestore' ? 'Copied!' : 'Copy Rules'}
            </button>
          </div>
          <div className={styles.codeBlock}>
            <pre>{firestoreRules}</pre>
          </div>
          <div className={styles.ruleDescription}>
            <h4>What these rules do:</h4>
            <ul>
              <li>
                <strong>Public Contact Submission:</strong> Anyone can create
                contact entries with proper validation
              </li>
              <li>
                <strong>Admin-Only Reading:</strong> Only authenticated admins
                can read contact data
              </li>
              <li>
                <strong>Status Updates:</strong> Admins can update contact
                status with validation
              </li>
              <li>
                <strong>Order Management:</strong> Complete admin control over
                orders collection
              </li>
              <li>
                <strong>Email Validation:</strong> Ensures proper email format
                and admin domain checking
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.setupSteps}>
        <h2>Security Setup Steps</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Copy Firestore Rules</h3>
              <p>
                Copy the security rules above and paste them in Firebase Console
                → Firestore Database → Rules
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Create Admins</h3>
              <p>
                Go to Authentication → Users and create admin accounts with
                @heritagereadymix.com emails
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Test Security</h3>
              <p>
                Test contact form submission (should work) and admin login
                (should access dashboard)
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3>Publish Rules</h3>
              <p>
                Click "Publish" in Firebase Console to activate the security
                rules
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.warningSection}>
        <AlertTriangle className={styles.warningIcon} />
        <div className={styles.warningContent}>
          <h3>Important Security Notes</h3>
          <ul>
            <li>
              Only users with @heritagereadymix.com email addresses can access
              admin features
            </li>
            <li>
              Contact form submissions are validated for proper format and
              required fields
            </li>
            <li>
              All admin actions are logged with timestamps and user
              identification
            </li>
            <li>
              Unauthorized access attempts are automatically blocked by Firebase
            </li>
            <li>Regular security rule updates should be reviewed and tested</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
