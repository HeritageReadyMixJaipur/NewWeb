// Firestore Security Rules
// Copy this to your Firebase Console > Firestore Database > Rules

const firestoreRules = `
rules_version = '2';
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
             (request.auth.token.email.matches('.*@heritagereadymix\\.com$') ||
              request.auth.uid in get(/databases/$(database)/documents/admins/authorized).data.uids);
    }
    
    function isValidContactSubmission() {
      let data = request.resource.data;
      return data.keys().hasAll(['name', 'email', 'message', 'createdAt', 'status']) &&
             data.name is string && data.name.size() > 0 &&
             data.email is string && data.email.matches('.*@.*\\..*') &&
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

export default firestoreRules
