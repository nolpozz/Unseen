import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getMessagesForChat, sendMessage, markChatAsRead, Message } from '../api/chat';
import MessageBubble from '../components/MessageBubble';

export default function ChatDetailScreen({ route, navigation }: any) {
  const { chatId, participantName, participantId } = route.params;
  const { userData } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = getMessagesForChat(chatId, (messageList) => {
      setMessages(messageList);
      
      // Mark messages as read
      if (userData?.id) {
        markChatAsRead(chatId, userData.id);
      }
    });

    return unsubscribe;
  }, [chatId, userData?.id]);

  useEffect(() => {
    // Set navigation title
    navigation.setOptions({
      title: participantName,
    });
  }, [participantName, navigation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userData?.id || sending) return;

    setSending(true);
    try {
      await sendMessage(chatId, userData.id, newMessage.trim());
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleAttachment = () => {
    // TODO: Implement file picker for attachments
    Alert.alert('Coming Soon', 'File attachments will be available soon!');
  };

  const renderMessage = ({ item: message }: { item: Message }) => (
    <MessageBubble
      message={message}
      isOwnMessage={message.senderId === userData?.id}
      senderName={message.senderId === userData?.id ? 'You' : participantName}
    />
  );

  const renderDateSeparator = ({ item, index }: { item: Message; index: number }) => {
    if (index === 0) return null;
    
    const currentDate = new Date(item.timestamp).toDateString();
    const previousDate = new Date(messages[index - 1].timestamp).toDateString();
    
    if (currentDate !== previousDate) {
      return (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateSeparatorText}>
            {new Date(item.timestamp).toLocaleDateString([], {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      );
    }
    
    return null;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachmentButton} onPress={handleAttachment}>
          <Text style={styles.attachmentButtonText}>+</Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={1000}
        />
        
        <TouchableOpacity
          style={[styles.sendButton, (!newMessage.trim() || sending) && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#444',
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#181818',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#282828',
    backgroundColor: '#181818',
  },
  attachmentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attachmentButtonText: {
    color: '#666',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#282828',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#1DB954',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#282828',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 