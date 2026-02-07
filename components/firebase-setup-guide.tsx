'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, ExternalLink } from 'lucide-react'
import styles from './firebase-setup-guide.module.css'

export default function FirebaseSetupGuide() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const sections = [
    {
      id: 'create-project',
      title: '1. Create Firebase Project',
      content: (
        <div>
          <p>
            Go to{' '}
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firebase Console <ExternalLink size={16} />
            </a>
          </p>
          <ol>
            <li>Click "Create a project"</li>
            <li>Enter project name: "heritage-readymix"</li>
            <li>Enable Google Analytics (optional)</li>
            <li>Click "Create project"</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'setup-auth',
      title: '2. Setup Authentication',
      content: (
        <div>
          <ol>
            <li>In Firebase Console, go to "Authentication"</li>
            <li>Click "Get started"</li>
            <li>Go to "Sign-in method" tab</li>
            <li>Enable "Email/Password" provider</li>
            <li>Go to "Users" tab</li>
            <li>Click "Add user" to create admin account</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'setup-firestore',
      title: '3. Setup Firestore Database',
      content: (
        <div>
          <ol>
            <li>Go to "Firestore Database"</li>
            <li>Click "Create database"</li>
            <li>Choose "Start in test mode"</li>
            <li>Select your preferred location</li>
            <li>Click "Done"</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'get-config',
      title: '4. Get Configuration',
      content: (
        <div>
          <ol>
            <li>Go to Project Settings (gear icon)</li>
            <li>Scroll down to "Your apps"</li>
            <li>Click "Web" icon (&lt;/&gt;)</li>
            <li>Register app with name "Heritage Readymix"</li>
            <li>Copy the config object</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'env-setup',
      title: '5. Environment Variables',
      content: (
        <div>
          <p>
            Create a <code>.env.local</code> file in your project root:
          </p>
          <div className={styles.codeBlock}>
            <button
              onClick={() =>
                copyToClipboard(`NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id`)
              }
              className={styles.copyButton}
            >
              <Copy size={16} />
            </button>
            <pre>{`NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id`}</pre>
          </div>
        </div>
      ),
    },
    {
      id: 'security-rules',
      title: '6. Firestore Security Rules',
      content: (
        <div>
          <p>Update Firestore rules for production:</p>
          <div className={styles.codeBlock}>
            <button
              onClick={() =>
                copyToClipboard(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders collection - authenticated users can read/write
    match /orders/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Users collection - users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`)
              }
              className={styles.copyButton}
            >
              <Copy size={16} />
            </button>
            <pre>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders collection - authenticated users can read/write
    match /orders/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Users collection - users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`}</pre>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className={styles.setupGuide}>
      <div className={styles.header}>
        <h2>🔥 Firebase Setup Guide</h2>
        <p>
          Follow these steps to configure Firebase for your Heritage Readymix
          website
        </p>
      </div>

      <div className={styles.sections}>
        {sections.map((section) => (
          <div key={section.id} className={styles.section}>
            <button
              onClick={() => toggleSection(section.id)}
              className={styles.sectionHeader}
            >
              {expandedSection === section.id ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
              <span>{section.title}</span>
            </button>

            {expandedSection === section.id && (
              <div className={styles.sectionContent}>{section.content}</div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.successMessage}>
          <h3>✅ After Setup Complete:</h3>
          <ul>
            <li>Contact form submissions will be saved to Firestore</li>
            <li>Real-time updates in admin dashboard</li>
            <li>Secure authentication for Admins</li>
            <li>All data stored in Google Cloud</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
