import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Message } from '../api/chat';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  senderName: string;
}

export default function MessageBubble({ message, isOwnMessage, senderName }: MessageBubbleProps) {
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderAttachment = (attachment: any) => {
    if (attachment.type === 'image') {
      return (
        <TouchableOpacity style={styles.imageAttachment}>
          <Image source={{ uri: attachment.url }} style={styles.attachmentImage} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.documentAttachment}>
          <Text style={styles.documentIcon}>📄</Text>
          <Text style={styles.documentName}>{attachment.filename}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={[
      styles.container,
      isOwnMessage ? styles.ownMessage : styles.otherMessage
    ]}>
      {!isOwnMessage && (
        <Text style={styles.senderName}>{senderName}</Text>
      )}
      
      <View style={[
        styles.bubble,
        isOwnMessage ? styles.ownBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          isOwnMessage ? styles.ownMessageText : styles.otherMessageText
        ]}>
          {message.text}
        </Text>
        
        {message.attachments && message.attachments.length > 0 && (
          <View style={styles.attachmentsContainer}>
            {message.attachments.map((attachment) => (
              <View key={attachment.id} style={styles.attachmentWrapper}>
                {renderAttachment(attachment)}
              </View>
            ))}
          </View>
        )}
        
        <Text style={[
          styles.timestamp,
          isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp
        ]}>
          {formatTime(message.timestamp)}
          {message.read && isOwnMessage && (
            <Text style={styles.readIndicator}> ✓</Text>
          )}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    marginLeft: 8,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 60,
  },
  ownBubble: {
    backgroundColor: '#1DB954',
  },
  otherBubble: {
    backgroundColor: '#282828',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#fff',
  },
  attachmentsContainer: {
    marginTop: 8,
  },
  attachmentWrapper: {
    marginBottom: 8,
  },
  imageAttachment: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  attachmentImage: {
    width: 200,
    height: 150,
    resizeMode: 'cover',
  },
  documentAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  documentIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  documentName: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: '#666',
  },
  readIndicator: {
    color: '#fff',
  },
}); 