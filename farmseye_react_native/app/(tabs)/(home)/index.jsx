import { StyleSheet, Text, View, TextInput, Pressable, ActivityIndicator, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import HomeStatus from '@/components/HomeStatus';

const API_KEY = "d2a371b0579c616f5a7b1edc780996c0";

const HomeScreen = () => {
  const today = useSelector(state => state.today.today);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cityInput, setCityInput] = useState(''); // 사용자가 입력하는 도시
  const [city, setCity] = useState('ulsan'); // 현재 조회하는 도시
  

  //날씨에 따라 들어갈 아이콘
  const weatherIcons = {
    Clear: <MaterialCommunityIcons name="weather-sunny" style={styles.weather_icon} />,
    Clouds: <MaterialCommunityIcons name="weather-partly-cloudy" style={styles.weather_icon} />,
    Rain: <MaterialCommunityIcons name="weather-pouring" style={styles.weather_icon} />,
    Thunderstorm: <MaterialCommunityIcons name="weather-lightning" style={styles.weather_icon} />,
    Snow: <MaterialCommunityIcons name="weather-snowy-heavy" style={styles.weather_icon} />,
    Mist: <MaterialCommunityIcons name="weather-rainy" style={styles.weather_icon} />,
  };

  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=kr`
      );
      setWeather(response.data);
    } catch (error) {
      console.error('날씨 가져오기 오류:', error);
      alert('날씨를 가져올 수 없습니다. 도시명을 다시 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  

  // city 값이 변하면 날씨 불러오기
  useEffect(() => {
    if (city) {
      fetchWeather(city);
      

      const interval = setInterval(() => {
        fetchWeather(city);
      }, 10 * 60000);

      return () => clearInterval(interval);
    }
  }, [city]);

  

  const handleSearch = () => {
    if (cityInput.trim() !== '') {
      setCity(cityInput.trim());
      setCityInput('');
      setLoading(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>현재 위치를 확인 중입니다...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      
      {weather ? (
        <View style={styles.weather}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={cityInput}
              placeholder="도시명을 입력하세요"
              onChangeText={setCityInput}
              onSubmitEditing={handleSearch}
            />
            <Pressable style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>검색</Text>
            </Pressable>
          </View>

          <View style={styles.weather_data}>
            <View style={styles.weather_status}>
              <View>{weatherIcons[weather.weather[0].main]}</View>
              <Text style={styles.city}>{weather.name}</Text>
            </View>
            
            <View>
              <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
              <Text style={styles.desc}>{weather.weather[0].description}</Text>
              <Text style={styles.desc}>{today.substring(5, 16)}</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text>날씨 정보를 불러오는 중...</Text>
      )}

      <HomeStatus />      

    </ScrollView>
    
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container : {
    
  },
  weather : {
    padding : 24,
    width : '80%',
    marginHorizontal : 'auto',
    marginVertical : 12,
    borderRadius : 12,
    backgroundColor : 'white',
  },

  weather_data : {
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent : 'flex-end',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  city: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  desc: {
    fontSize: 18,
    color: '#555',
  },

  weather_icon : {
    fontSize : 80,
    color : 'black',
  },

  weather_status : {
    alignItems : 'center',
  },
});
