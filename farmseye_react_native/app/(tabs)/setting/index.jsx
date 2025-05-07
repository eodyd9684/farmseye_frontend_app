// 라이브러리 import
import { StyleSheet, Text, View, ScrollView, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { api_env } from '../../../apis/envApis';
import { getUserSubFromToken } from '../../../redux/authHelper';
import * as SecureStore from 'expo-secure-store';
import { Feather } from '@expo/vector-icons';
import SearchDetail from './searchDetail';


const SettingHome = () => {
  const [envInfo, setEnvInfo] = useState(null); // 환경 데이터 저장
  const [userId, setUserId] = useState(null);   // 로그인한 사용자 ID 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 저장
  const [selectedCategory, setSelectedCategory] = useState(null); // 클릭한 항목 정보 저장 (모달용)

  // 화면에 표시할 항목 리스트
  const categories = [
    { label: '온도', key: 'temperature', unit: '℃' },
    { label: '습도', key: 'humidity', unit: '%' },
    { label: '조도', key: 'illuminance', unit: 'lx' },
    { label: '질소산화물', key: 'no2', unit: 'ppm' },
    { label: '이산화탄소', key: 'co2', unit: 'ppm' },
    { label: '암모니아', key: 'nh3', unit: 'ppm' },
    { label: '황화수소', key: 'h2s', unit: 'ppm' },
    { label: '톨루엔', key: 'toluene', unit: 'ppm' },
  ];

  // DB 컬럼명 매칭 테이블
  const keyMap = {
    temperature: { min: 'minTem', max: 'maxTem' },
    humidity: { min: 'minHumi', max: 'maxHumi' },
    illuminance: { min: 'minIllumi', max: 'maxIllumi' },
    no2: { min: 'bouNo2', max: 'danNo2' },
    co2: { min: 'bouCo2', max: 'danCo2' },
    nh3: { min: 'bouNh3', max: 'danNh3' },
    h2s: { min: 'bouH2s', max: 'danH2s' },
    toluene: { min: 'bouToluene', max: 'danToluene' },
  };

  // 1) 처음 화면이 열릴 때 사용자 ID 가져오기
  useEffect(() => {
    const fetchUserId = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        setUserId(getUserSubFromToken(token)); // 토큰 해석해서 ID 저장
      } else {
        console.log('Access token이 없습니다.');
      }
      setLoading(false); // 로딩 끝
    };
    fetchUserId();
  }, []);

  // 2) 사용자 ID가 있으면 환경 데이터 조회하기
  useEffect(() => {
    if (userId) {
      api_env()
        .then(res => {
          setEnvInfo(res.data); // 서버에서 받은 환경 데이터 저장
        })
        .catch(error => {
          console.log('환경 데이터 에러:', error);
        });
    } else if (!loading) {
      console.log('userId 없음 - 환경 데이터 요청 안 함');
    }
  }, [userId, loading]);

  // 톱니바퀴 클릭했을 때 모달 열기
  const openModal = (category) => {
    if (!category || !category.key) {
      console.error('잘못된 카테고리 클릭');
      return;
    }
    const keys = keyMap[category.key];
    if (!keys) {
      console.error('keyMap 매칭 실패:', category.key);
      return;
    }
    // 선택한 항목과 초기값(min/max)을 모달로 넘긴다
    const selectedData = {
      ...category,
      initialMin: envInfo?.[keys.min] ?? '',
      initialMax: envInfo?.[keys.max] ?? '',
    };
    setSelectedCategory(selectedData); // 모달 열기
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedCategory(null);
  };

  // 모달에서 저장했을 때 데이터 업데이트
  const handleSave = (updatedValues) => {
    setEnvInfo(prev => ({
      ...prev,
      ...updatedValues, // 수정된 값만 덮어쓰기
    }));
  };

  // 퍼센트 구간 표시 함수 (25%, 50%, 75%, 100%)
  const getRangeText = (categoryKey, section) => {
    if (!envInfo) return '00-00%'; // 데이터 없으면 00-00% 표시

    const keys = keyMap[categoryKey];
    if (!keys) return '00-00%';

    const min = envInfo[keys.min];
    const max = envInfo[keys.max];

    if (min == null || max == null) return '00-00%';

    const interval = (max - min) / 4;
    const start = min + interval * (section - 1);
    const end = min + interval * section;

    return `${start.toFixed(1)}~${end.toFixed(1)}`; // 소수점 1자리로 표시
  };

  // 화면에 그리기
  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <Text>사용자 정보를 가져오는 중...</Text>
      ) : userId ? (
        envInfo ? (
          <>
            {/* 항목별로 박스 5개(항목명 + 4단계 박스) 반복 */}
            {categories.map((category, idx) => (
              <View key={idx} style={styles.stateBoxContainer}>
                {/* 항목명 박스 */}
                <View style={[styles.stateBox, { backgroundColor: '#6B7280' }]}>
                  <Text style={styles.stateText}>{category.label}</Text>
                </View>

                {/* 4단계 상태 박스 */}
                <View style={[styles.stateBox, { backgroundColor: '#0090FF' }]}>
                  <Text style={styles.stateText}>{getRangeText(category.key, 1)}</Text>
                </View>
                <View style={[styles.stateBox, { backgroundColor: '#22C55E' }]}>
                  <Text style={styles.stateText}>{getRangeText(category.key, 2)}</Text>
                </View>
                <View style={[styles.stateBox, { backgroundColor: '#FACC15' }]}>
                  <Text style={styles.stateText}>{getRangeText(category.key, 3)}</Text>
                </View>
                <View style={[styles.stateBox, { backgroundColor: '#EF4444' }]}>
                  <Text style={styles.stateText}>{getRangeText(category.key, 4)}</Text>
                </View>

                {/* 설정(톱니바퀴) 버튼 */}
                <TouchableOpacity onPress={() => openModal(category)}>
                  <Feather name="settings" size={28} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
           
            {/* 모달 띄우기 */}
            {selectedCategory && (
              <Modal visible={true} animationType="slide" transparent={true}>
                <SearchDetail
                  title={`${selectedCategory.label} 설정`}
                  initialMin={selectedCategory.initialMin}
                  initialMax={selectedCategory.initialMax}
                  unit={selectedCategory.unit}
                  userId={userId}
                  envKey={selectedCategory.key}
                  onClose={closeModal}
                  onSave={handleSave}
                />
              </Modal>
            )}
          </>
        ) : (
          <Text>환경 데이터를 가져오는 중...</Text>
        )
      ) : (
        <Text>사용자 정보를 사용할 수 없습니다.</Text>
      )}
    </ScrollView>
  );
};

// 스타일 지정
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f0f0f0' },
  stateBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stateBox: {
    width: 70,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateText: { color: '#fff', fontSize: 12, textAlign: 'center' },
});

export default SettingHome;
