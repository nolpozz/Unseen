import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

interface ArtistCardProps {
  artist: {
    id: string;
    displayName?: string;
    email: string;
    artistProfile?: {
      bio?: string;
      style?: string;
      region?: string;
      rating?: number;
      totalEvents?: number;
      gallery?: Array<{
        id: string;
        url: string;
        title?: string;
      }>;
      availability?: {
        available: boolean;
      };
    };
  };
  onPress: () => void;
}

export default function ArtistCard({ artist, onPress }: ArtistCardProps) {
  const profile = artist.artistProfile;
  const sampleImage = profile?.gallery?.[0]?.url;
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {sampleImage ? (
          <Image source={{ uri: sampleImage }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        {profile?.availability?.available && (
          <View style={styles.availableBadge}>
            <Text style={styles.availableText}>Available</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{artist.displayName || 'Artist'}</Text>
        
        {profile?.style && (
          <Text style={styles.style}>{profile.style}</Text>
        )}
        
        {profile?.region && (
          <Text style={styles.region}>{profile.region}</Text>
        )}
        
        {profile?.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {profile.bio}
          </Text>
        )}
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{profile?.totalEvents || 0}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{profile?.rating || 0}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{profile?.gallery?.length || 0}</Text>
            <Text style={styles.statLabel}>Works</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#181818',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  availableBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#1DB954',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  style: {
    fontSize: 14,
    color: '#1DB954',
    marginBottom: 4,
  },
  region: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#282828',
    paddingTop: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1DB954',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
}); 