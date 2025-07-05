import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getChatsForUser, Chat } from '../api/chat';
import { getUserData } from '../api/users';

export default function ChatListScreen({ navigation }: any) {
  const { userData } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [participantNames, setParticipantNames] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!userData?.id) return;

    const unsubscribe = getChatsForUser(userData.id, (chatList) => {
      setChats(chatList);
      setLoading(false);
      
      // Load participant names
      loadParticipantNames(chatList);
    });

    return unsubscribe;
  }, [userData?.id]);

  const loadParticipantNames = async (chatList: Chat[]) => {
    const names: {[key: string]: string} = {};
    
    for (const chat of chatList) {
      for (const participantId of chat.participants) {
        if (participantId !== userData?.id && !names[participantId]) {
          try {
            const participant = await getUserData(participantId);
            names[participantId] = participant?.displayName || participant?.email || 'Unknown User';
          } catch (error) {
            names[participantId] = 'Unknown User';
          }
        }
      }
    }
    
    setParticipantNames(names);
  };

  const getOtherParticipant = (chat: Chat) => {
    const otherId = chat.participants.find(id => id !== userData?.id);
    return otherId ? participantNames[otherId] || 'Loading...' : 'Unknown User';
  };

  const formatLastMessage = (chat: Chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const isOwnMessage = chat.lastMessage.senderId === userData?.id;
    const prefix = isOwnMessage ? 'You: ' : '';
    return prefix + chat.lastMessage.text;
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleChatPress = (chat: Chat) => {
    const otherParticipant = getOtherParticipant(chat);
    navigation.navigate('ChatDetail', { 
      chatId: chat.id, 
      participantName: otherParticipant,
      participantId: chat.participants.find(id => id !== userData?.id)
    });
  };

  const renderChatItem = ({ item: chat }: { item: Chat }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(chat)}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {getOtherParticipant(chat).charAt(0).toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.participantName}>{getOtherParticipant(chat)}</Text>
          {chat.lastMessage && (
            <Text style={styles.timestamp}>
              {formatTimestamp(chat.lastMessage.timestamp)}
            </Text>
          )}
        </View>
        
        <Text style={styles.lastMessage} numberOfLines={1}>
          {formatLastMessage(chat)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>
          {chats.length} conversation{chats.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptySubtitle}>
            Start a conversation by booking an artist or messaging someone
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  chatList: {
    paddingHorizontal: 20,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 