import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useUserRole } from '../hooks/useUserRole';
import { searchArtists } from '../api/artists';
import ArtistCard from '../components/ArtistCard';

export default function ArtistSearchScreen({ navigation }: any) {
  const { isEventPlanner } = useUserRole();
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    region: '',
    style: '',
    available: false,
  });

  const [selectedFilters, setSelectedFilters] = useState({
    region: false,
    style: false,
    available: false,
  });

  useEffect(() => {
    loadArtists();
  }, [filters]);

  const loadArtists = async () => {
    setLoading(true);
    try {
      const results = await searchArtists({
        query: searchQuery,
        region: filters.region,
        style: filters.style,
        available: filters.available,
      });
      setArtists(results);
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadArtists();
  };

  const toggleFilter = (filterName: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const applyFilter = (filterName: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleArtistPress = (artist: any) => {
    navigation.navigate('ArtistDetail', { artist });
  };

  if (!isEventPlanner) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Access denied. Event planner only.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <Text style={styles.title}>Find Artists</Text>
        <Text style={styles.subtitle}>Discover talented artists for your events</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, style, or keywords..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilters.region && styles.filterButtonActive]}
          onPress={() => toggleFilter('region')}
        >
          <Text style={[styles.filterButtonText, selectedFilters.region && styles.filterButtonTextActive]}>
            Region
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, selectedFilters.style && styles.filterButtonActive]}
          onPress={() => toggleFilter('style')}
        >
          <Text style={[styles.filterButtonText, selectedFilters.style && styles.filterButtonTextActive]}>
            Style
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, selectedFilters.available && styles.filterButtonActive]}
          onPress={() => toggleFilter('available')}
        >
          <Text style={[styles.filterButtonText, selectedFilters.available && styles.filterButtonTextActive]}>
            Available
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Filter Options */}
      {selectedFilters.region && (
        <View style={styles.filterOptions}>
          <Text style={styles.filterOptionsTitle}>Select Region</Text>
          <View style={styles.filterOptionsGrid}>
            {['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco'].map((region) => (
              <TouchableOpacity
                key={region}
                style={[styles.filterOption, filters.region === region && styles.filterOptionActive]}
                onPress={() => applyFilter('region', filters.region === region ? '' : region)}
              >
                <Text style={[styles.filterOptionText, filters.region === region && styles.filterOptionTextActive]}>
                  {region}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {selectedFilters.style && (
        <View style={styles.filterOptions}>
          <Text style={styles.filterOptionsTitle}>Select Style</Text>
          <View style={styles.filterOptionsGrid}>
            {['Abstract', 'Digital Art', 'Mixed Media', 'Photography', 'Sculpture', 'Painting'].map((style) => (
              <TouchableOpacity
                key={style}
                style={[styles.filterOption, filters.style === style && styles.filterOptionActive]}
                onPress={() => applyFilter('style', filters.style === style ? '' : style)}
              >
                <Text style={[styles.filterOptionText, filters.style === style && styles.filterOptionTextActive]}>
                  {style}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {selectedFilters.available && (
        <View style={styles.filterOptions}>
          <Text style={styles.filterOptionsTitle}>Availability</Text>
          <TouchableOpacity
            style={[styles.filterOption, filters.available && styles.filterOptionActive]}
            onPress={() => applyFilter('available', !filters.available)}
          >
            <Text style={[styles.filterOptionText, filters.available && styles.filterOptionTextActive]}>
              Available for Events
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>
          {loading ? 'Searching...' : `${artists.length} artists found`}
        </Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#1DB954" style={styles.loading} />
        ) : (
          <FlatList
            data={artists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ArtistCard artist={item} onPress={() => handleArtistPress(item)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.artistsList}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchHeader: {
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#282828',
    borderRadius: 8,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginRight: 12,
  },
  searchButton: {
    backgroundColor: '#1DB954',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#282828',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: '#1DB954',
    borderColor: '#1DB954',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  filterOptions: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterOptionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  filterOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#282828',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    backgroundColor: '#1DB954',
    borderColor: '#1DB954',
  },
  filterOptionText: {
    color: '#666',
    fontSize: 14,
  },
  filterOptionTextActive: {
    color: '#fff',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  loading: {
    marginTop: 40,
  },
  artistsList: {
    paddingBottom: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
}); 