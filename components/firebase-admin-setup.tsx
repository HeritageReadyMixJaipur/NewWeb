'use client'

import { useState } from 'react'
import {
  Copy,
  Check,
  ExternalLink,
  Shield,
  Database,
  Users,
  Settings,
} from 'lucide-react'
import styles from './firebase-admin-setup.module.css'

export default function FirebaseAdminSetup() {
  const [copiedSteps, setCopiedSteps] = useState<number[]>([])

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text)
    setCopiedSteps((prev) => [...prev, stepNumber])
    setTimeout(() => {
      setCopiedSteps((prev) => prev.filter((step) => step !== stepNumber))
    }, 2000)
  }

  const securityRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read/write access to contacts collection for form submissions
    match /contacts/{document} {
      allow create: if isValidContact(resource.data);
      allow read, update, delete: if isAdmin();
    }
    
    // Allow admin read/write access to orders collection
    match /orders/{document} {
      allow read, write: if isAdmin();
    }
    
    // Admin authorization document
    match /admins/authorized {
      allow read: if request.auth != null;
      allow write: if false; // Only allow manual updates
    }
    
    // Helper functions
    function isAdmin() {
      return request.auth != null && 
             (request.auth.token.email.matches('.*@heritagereadymix\\.com$') ||
              isAuthorizedUID());
    }
    
    function isAuthorizedUID() {
      return exists(/databases/$(database)/documents/admins/authorized) &&
             request.auth.uid in get(/databases/$(database)/documents/admins/authorized).data.uids;
    }
    
    function isValidContact(data) {
      return data.keys().hasAll(['name', 'email', 'message', 'status', 'priority', 'createdAt']) &&
             data.name is string && data.name.size() > 0 &&
             data.email is string && data.email.matches('.*@.*\\..*') &&
             data.message is string && data.message.size() > 0 &&
             data.status == 'not_contacted' &&
             data.priority in ['low', 'medium', 'high'] &&
             data.createdAt == request.time;
    }
  }
}`

  const adminDocument = `{
  "authorized": {
    "uids": ["your-admin-uid-here"],
    "emails": [
      "admin@heritagereadymix.com",
      "manager@heritagereadymix.com",
      "owner@heritagereadymix.com"
    ]
  }
}`

  const envExample = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456`

  const setupSteps = [
    {
      title: 'Create Firebase Project',
      description: 'Go to Firebase Console and create a new project',
      action: 'Visit Firebase Console',
      link: 'https://console.firebase.google.com/',
      icon: <ExternalLink size={16} />,
    },
    {
      title: 'Enable Authentication',
      description:
        'Enable Email/Password authentication in your Firebase project',
      steps: [
        'Go to Authentication > Sign-in method',
        'Enable Email/Password provider',
        'Save changes',
      ],
      icon: <Users size={16} />,
    },
    {
      title: 'Create Firestore Database',
      description: 'Set up Firestore database in production mode',
      steps: [
        'Go to Firestore Database',
        'Create database in production mode',
        'Choose your preferred location',
      ],
      icon: <Database size={16} />,
    },
    {
      title: 'Add Admins',
      description: 'Create Admins with @heritagereadymix.com emails',
      steps: [
        'Go to Authentication > Users',
        'Add user with email: admin@heritagereadymix.com',
        'Set password: HeritageAdmin@2025',
        'Repeat for other admin emails',
      ],
      icon: <Shield size={16} />,
    },
    {
      title: 'Get User UIDs',
      description: 'Copy the UID of each Admin you created',
      steps: [
        'In Authentication > Users, click on each Admin',
        'Copy their UID (User identifier)',
        'Save these UIDs for the next step',
      ],
      icon: <Copy size={16} />,
    },
    {
      title: 'Create Admin Authorization Document',
      description: 'Create the admin authorization document in Firestore',
      code: adminDocument,
      steps: [
        'Go to Firestore Database',
        "Create collection: 'admins'",
        "Create document with ID: 'authorized'",
        'Add the JSON data (replace UIDs with actual ones)',
      ],
      copyable: true,
      stepNumber: 6,
    },
    {
      title: 'Apply Security Rules',
      description: 'Update Firestore security rules',
      code: securityRules,
      steps: [
        'Go to Firestore Database > Rules',
        'Replace existing rules with the provided code',
        "Click 'Publish' to apply changes",
      ],
      copyable: true,
      stepNumber: 7,
    },
    {
      title: 'Configure Environment Variables',
      description: 'Add Firebase config to your environment',
      code: envExample,
      steps: [
        'Go to Project Settings > General',
        "Scroll to 'Your apps' section",
        'Copy the Firebase config values',
        'Add them to your .env.local file',
      ],
      copyable: true,
      stepNumber: 8,
    },
    {
      title: 'Test Your Setup',
      description: 'Verify everything works correctly',
      action: 'Run Security Tests',
      link: '/admin/security-test',
      steps: [
        'Visit the security test page',
        'Run all security tests',
        'Ensure all tests pass',
        'Test admin login functionality',
      ],
      icon: <Settings size={16} />,
    },
  ]

  return (
    <div className={styles.setupGuide}>
      <div className={styles.header}>
        <h1>🔥 Firebase Admin Setup Guide</h1>
        <p>
          Complete step-by-step guide to set up Firebase admin credentials and
          security rules
        </p>
      </div>

      <div className={styles.quickStart}>
        <h2>🚀 Quick Start Credentials</h2>
        <div className={styles.credentialsGrid}>
          <div className={styles.credentialCard}>
            <h3>Primary Admin</h3>
            <p>
              <strong>Email:</strong> admin@heritagereadymix.com
            </p>
            <p>
              <strong>Password:</strong> HeritageAdmin@2025
            </p>
          </div>
          <div className={styles.credentialCard}>
            <h3>Manager</h3>
            <p>
              <strong>Email:</strong> manager@heritagereadymix.com
            </p>
            <p>
              <strong>Password:</strong> HeritageManager@2025
            </p>
          </div>
          <div className={styles.credentialCard}>
            <h3>Owner</h3>
            <p>
              <strong>Email:</strong> owner@heritagereadymix.com
            </p>
            <p>
              <strong>Password:</strong> HeritageOwner@2025
            </p>
          </div>
        </div>
      </div>

      <div className={styles.stepsContainer}>
        <h2>📋 Setup Steps</h2>
        {setupSteps.map((step, index) => (
          <div key={index} className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepTitle}>
                {step.icon}
                <h3>{step.title}</h3>
              </div>
              {step.action && step.link && (
                <a
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionButton}
                >
                  {step.action}
                  <ExternalLink size={16} />
                </a>
              )}
            </div>

            <p className={styles.stepDescription}>{step.description}</p>

            {step.steps && (
              <ul className={styles.stepList}>
                {step.steps.map((substep, subIndex) => (
                  <li key={subIndex}>{substep}</li>
                ))}
              </ul>
            )}

            {step.code && (
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <span>Code to copy:</span>
                  {step.copyable && (
                    <button
                      onClick={() =>
                        copyToClipboard(step.code!, step.stepNumber!)
                      }
                      className={styles.copyButton}
                    >
                      {copiedSteps.includes(step.stepNumber!) ? (
                        <>
                          <Check size={16} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
                <pre className={styles.code}>{step.code}</pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.securityFeatures}>
        <h2>🛡️ Security Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <Shield size={24} />
            <h3>Domain Restriction</h3>
            <p>Only @heritagereadymix.com emails can access admin features</p>
          </div>
          <div className={styles.feature}>
            <Database size={24} />
            <h3>Data Protection</h3>
            <p>
              Public can only submit contacts, admins can read/update all data
            </p>
          </div>
          <div className={styles.feature}>
            <Users size={24} />
            <h3>UID Authorization</h3>
            <p>Backup authorization system using Firebase UIDs</p>
          </div>
          <div className={styles.feature}>
            <Settings size={24} />
            <h3>Input Validation</h3>
            <p>Server-side validation for all form submissions</p>
          </div>
        </div>
      </div>

      <div className={styles.testingSection}>
        <h2>🧪 Testing Your Setup</h2>
        <div className={styles.testButtons}>
          <a href="/admin/security-test" className={styles.testButton}>
            <Settings size={20} />
            Run Security Tests
          </a>
          <a href="/contact" className={styles.testButton}>
            <Users size={20} />
            Test Contact Form
          </a>
          <a href="/admin/dashboard" className={styles.testButton}>
            <Shield size={20} />
            Access Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
