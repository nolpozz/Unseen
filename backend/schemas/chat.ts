// Firestore Schema for Chats and Messages Collections

export interface ChatSchema {
  // Basic Info
  id: string; // Document ID
  participants: string[]; // User IDs of chat participants
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Date;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  eventId?: string; // Optional link to an event
  
  // Status
  isActive: boolean;
  lastActivity: Date;
}

export interface MessageSchema {
  // Basic Info
  id: string; // Document ID
  chatId: string; // Reference to chat document
  senderId: string; // User ID of message sender
  text: string; // Message content
  
  // Attachments
  attachments?: {
    id: string;
    url: string;
    filename: string;
    type: 'image' | 'document' | 'contract';
    size: number;
    uploadedAt: Date;
  }[];
  
  // Metadata
  timestamp: Date;
  read: boolean;
  readAt?: Date;
  
  // Status
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

// Firestore Security Rules Example:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write chats they participate in
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    // Users can only read/write messages in chats they participate in
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in get(/databases/$(database)/documents/chats/$(resource.data.chatId)).data.participants;
      
      // Users can only edit/delete their own messages
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.senderId;
    }
  }
}
*/

// Indexes needed for efficient queries:
/*
// For chats collection:
// - participants (array-contains) + updatedAt (desc)
// - eventId (==) + updatedAt (desc)

// For messages collection:
// - chatId (==) + timestamp (asc)
// - senderId (==) + timestamp (desc)
*/ 