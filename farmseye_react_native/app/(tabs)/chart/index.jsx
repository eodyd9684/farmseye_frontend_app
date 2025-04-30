import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet, ActivityIndicator,TouchableOpacity,}from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons, Ionicons, Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { api_envS } from '../../../apis/envApis';

// 숫자인지 확인하는 함수
const isValidNumber = (val) => {
  const num = Number(val);
  return typeof num === 'number' && !isNaN(num) && isFinite(num);
};

// 센서 값 중 숫자만 필터링해서 반환
const getSafeData = (dataArray, key) => {
  return dataArray
    .map(item => {
      const value = item?.[key]; // 데이터에서 key값 추출
      const num = Number(value); // 숫자로 변환
      return isValidNumber(num) ? num : null;
    })
    .filter(val => val !== null); // null 값 제거
};

// 시간(시 단위)으로 x축 라벨 포맷
const formatTimestampToHourGroup = (timestamp) => {
  if (!timestamp) return '0';
  try {
    const date = new Date(timestamp);
    const hour = date.getHours(); // 시(hour)만 추출
    return `${hour}`;
  } catch (error) {
    return '0';
  }
};

// 센서 그룹 정의 (아이콘 포함)
// 아이콘을 누르면 이 그룹에 해당하는 차트가 보여짐
const sensorGroups = [
  {
    name: '온도/습도',
    keys: ['temp', 'humi'], // 보여줄 데이터 키
    labels: ['온도', '습도'],
    suffixes: ['°C', '%'],
    icon: <FontAwesome5 name="temperature-high" size={24} color="red" />,
  },
  {
    name: '조도',
    keys: ['illumi'],
    labels: ['조도'],
    suffixes: ['lx'],
    icon: <MaterialIcons name="light-mode" size={24} color="yellow" />,
  },
  {
    name: 'NO₂ / CO₂',
    keys: ['no2', 'co2'],
    labels: ['NO₂', 'CO₂'],
    suffixes: ['ppm', 'ppm'],
    icon: <MaterialCommunityIcons name="weather-hazy" size={24} color="gray" />,
  },
  {
    name: '톨루엔',
    keys: ['toluene'],
    labels: ['톨루엔'],
    suffixes: ['ppm'],
    icon: <MaterialCommunityIcons name="cloud-alert" size={24} color="black" />,
  },
  {
    name: 'NH₃ / H₂S',
    keys: ['nh3', 'h2s'],
    labels: ['NH₃', 'H₂S'],
    suffixes: ['ppm', 'ppm'],
    icon: <FontAwesome5 name="smog" size={24} color="gray" />,
  },
];

const ChartHome = () => {
  const [data, setData] = useState([]); // 센서 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0); // 선택된 센서 그룹 (기본값: 0번)

  // 컴포넌트가 처음 실행될 때 데이터 요청
  useEffect(() => {
    api_envS()
      .then((res) => {
        // 최근 10개 데이터만 저장
        const recent = res.data ? res.data.slice(-10) : [];
        setData(recent);
      })
      .catch((error) => console.error('API 호출 오류:', error))
      .finally(() => setLoading(false)); // 로딩 끝
  }, []);

  // 차트 데이터 구성 함수
  const getChartData = (keys) => {
    const labels = data
      .map(item => formatTimestampToHourGroup(item.timestamp)) // x축 라벨
      .slice(0, 10);

    const datasets = keys.map((key, idx) => ({
      data: getSafeData(data, key), // y축 값
      color: () => chartColors[idx % chartColors.length], // 선 색상
      strokeWidth: 2, // 선 두께
    }));

    return {
      labels: labels.length > 0 ? labels : ['0'], // x축 라벨이 없으면 기본값
      datasets,
      legend: keys, // 범례
    };
  };

  const chartColors = ['red', 'blue', 'green', 'orange', 'purple']; // 차트 선 색상 배열

  // 로딩 화면
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  const group = sensorGroups[selectedGroupIndex]; // 현재 선택된 그룹
  const chartData = getChartData(group.keys); // 해당 그룹의 차트 데이터 가져오기

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 상단 아이콘 선택 바 */}
      <View style={styles.iconRow}>
        {sensorGroups.map((g, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setSelectedGroupIndex(idx)} // 아이콘 클릭 시 인덱스 변경
            style={[
              styles.iconButton,
              selectedGroupIndex === idx && styles.selectedIconButton, // 선택된 아이콘 스타일
            ]}
          >
            {g.icon}
          </TouchableOpacity>
        ))}
      </View>

      {/* 차트 영역 */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{group.name}</Text>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 32} // 전체 너비에서 여백 제외
          height={220}
          yAxisSuffix="" // y축 단위 (비워두면 없음)
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: '3',
              strokeWidth: '1',
              stroke: '#fff',
            },
          }}
          bezier
          style={styles.chartStyle}
        />
      </View>
    </ScrollView>
  );
};

export default ChartHome;
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
  },
  selectedIconButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  chartContainer: {
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  chartStyle: {
    borderRadius: 16,
    marginBottom: 24,
  },
});
