import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';

const SongInfoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {album} = route.params || {};
  const [songs, setSongs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    if (album && album.name) {
      const fetchSongs = async () => {
        setLoading(true);
        setError(null);

        const options = {
          method: 'GET',
          url: 'https://shazam.p.rapidapi.com/search',
          params: {
            term: album.name, // Albüm adı ile arama yapılacak
            locale: 'en-US',
            offset: '0',
            limit: '5',
          },
          headers: {
            'x-rapidapi-key':
              '16542e0184mshf352632a2e2fe8ap16d83ajsn2c7bc139301e',
            'x-rapidapi-host': 'shazam.p.rapidapi.com',
          },
        };

        try {
          const response = await axios.request(options);
          console.log(response.data); 
          setSongs(response.data.tracks.hits); 
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch songs');
          setLoading(false);
        }
      };

      fetchSongs();
    }
  }, [album]);

 
  if (!album) {
    return (
      <LinearGradient colors={['#040306', '#131624']} style={{flex: 1}}>
        <Text style={{color: 'white', textAlign: 'center', marginTop: 20}}>
          Loading album details...
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#040306', '#131624']} style={{flex: 1}}>
      <View style={{height: 60, margin: 10}} />
      <ScrollView>
        <View style={{padding: 10}}>
          
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          
          <View style={{flex: 1, alignItems: 'center'}}>
            <Image
              source={{uri: album.coverArt}} 
              style={{width: 250, height: 250}}
            />
          </View>
        </View>

        
        <Text
          style={{
            color: 'white',
            marginHorizontal: 12,
            marginTop: 10,
            fontSize: 22,
            fontWeight: 'bold',
          }}>
          {album.name}
        </Text>
        <Text style={{color: 'white', margin: 10}}>{album.artist} </Text>

        
        {loading ? (
          <ActivityIndicator
            size="large"
            color="white"
            style={{marginTop: 50}}
          />
        ) : error ? (
          <Text style={{color: 'red', textAlign: 'center', marginTop: 20}}>
            {error}
          </Text>
        ) : (
          <View style={{marginTop: 20}}>
            
            {songs ? (
              songs.map((song, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      marginBottom: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 20,
                    }}>
                    <Image
                      source={{uri: song.track.images.coverart}} 
                      style={{width: 60, height: 60, marginTop: 10}}
                    />
                    <View style={{gap: 5}}>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: '500',
                          fontSize: 16,
                        }}>
                        {song.track.title}
                      </Text>
                      <Text style={{color: 'white', fontWeight: 'bold'}}>
                        {song.track.subtitle}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Entypo
                      name="dots-three-horizontal"
                      size={24}
                      color="white"
                    />
                  </View>
                </View>
              ))
            ) : (
              <Text style={{color: 'white', textAlign: 'center'}}>
                No songs found.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default SongInfoScreen;
