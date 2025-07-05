import { 
  doc, 
  setDoc, 
  addDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  updateDoc,
  serverTimestamp,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface Chat {
  id: string;
  participants: string[]; // User IDs
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  eventId?: string; // Optional link to an event
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  attachments?: Attachment[];
  timestamp: Date;
  read: boolean;
}

export interface Attachment {
  id: string;
  url: string;
  filename: string;
  type: 'image' | 'document' | 'contract';
  size: number;
}

export const createChat = async (participants: string[], eventId?: string): Promise<string> => {
  try {
    // Check if chat already exists
    const existingChat = await findExistingChat(participants);
    if (existingChat) {
      return existingChat.id;
    }

    // Create new chat
    const chatData: Omit<Chat, 'id'> = {
      participants,
      createdAt: new Date(),
      updatedAt: new Date(),
      eventId,
    };

    const chatRef = await addDoc(collection(db, 'chats'), chatData);
    return chatRef.id;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const findExistingChat = async (participants: string[]): Promise<Chat | null> => {
  try {
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', participants[0])
    );
    
    const snapshot = await getDocs(q);
    
    for (const doc of snapshot.docs) {
      const chat = doc.data() as Chat;
      const chatParticipants = chat.participants.sort();
      const searchParticipants = participants.sort();
      
      if (JSON.stringify(chatParticipants) === JSON.stringify(searchParticipants)) {
        return { id: doc.id, ...chat };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding existing chat:', error);
    throw error;
  }
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
  attachments?: File[]
): Promise<Message> => {
  try {
    const messageAttachments: Attachment[] = [];
    
    // Upload attachments if provided
    if (attachments && attachments.length > 0) {
      for (const file of attachments) {
        const attachmentId = `${chatId}_${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `chats/${chatId}/attachments/${attachmentId}`);
        
        // Convert file to blob (you'll need to implement this based on your file picker)
        const response = await fetch(file);
        const blob = await response.blob();
        
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        
        messageAttachments.push({
          id: attachmentId,
          url: downloadURL,
          filename: file.name,
          type: getFileType(file.name),
          size: file.size,
        });
      }
    }

    // Create message
    const messageData: Omit<Message, 'id'> = {
      chatId,
      senderId,
      text,
      attachments: messageAttachments,
      timestamp: new Date(),
      read: false,
    };

    const messageRef = await addDoc(collection(db, 'messages'), messageData);

    // Update chat with last message
    await updateDoc(doc(db, 'chats', chatId), {
      lastMessage: {
        text,
        senderId,
        timestamp: new Date(),
      },
      updatedAt: new Date(),
    });

    return { id: messageRef.id, ...messageData };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getFileType = (filename: string): 'image' | 'document' | 'contract' => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const contractExts = ['pdf', 'doc', 'docx'];
  
  if (imageExts.includes(ext || '')) return 'image';
  if (contractExts.includes(ext || '')) return 'contract';
  return 'document';
};

export const getChatsForUser = (userId: string, callback: (chats: Chat[]) => void) => {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats: Chat[] = [];
    snapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() } as Chat);
    });
    callback(chats);
  });
};

export const getMessagesForChat = (chatId: string, callback: (messages: Message[]) => void) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('chatId', '==', chatId),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as Message);
    });
    callback(messages);
  });
};

export const markMessageAsRead = async (messageId: string) => {
  try {
    await updateDoc(doc(db, 'messages', messageId), {
      read: true,
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

export const markChatAsRead = async (chatId: string, userId: string) => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatId', '==', chatId),
      where('senderId', '!=', userId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(q);
    const batch = db.batch();

    snapshot.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error marking chat as read:', error);
    throw error;
  }
}; 