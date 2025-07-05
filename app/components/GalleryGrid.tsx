import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { GalleryItem } from '../api/artists';

interface GalleryGridProps {
  items: GalleryItem[];
  onItemPress?: (item: GalleryItem) => void;
  onRemoveItem?: (itemId: string) => void;
  editable?: boolean;
}

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 2; // 2 columns with padding

export default function GalleryGrid({ 
  items, 
  onItemPress, 
  onRemoveItem, 
  editable = false 
}: GalleryGridProps) {
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No artwork uploaded yet</Text>
        <Text style={styles.emptySubtext}>Add your first piece to showcase your style</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => onItemPress?.(item)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.url }} style={styles.image} />
            {editable && onRemoveItem && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemoveItem(item.id)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          
          {item.title && (
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
          )}
          
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  itemContainer: {
    width: itemWidth,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: itemWidth,
    borderRadius: 8,
    backgroundColor: '#282828',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
}); 