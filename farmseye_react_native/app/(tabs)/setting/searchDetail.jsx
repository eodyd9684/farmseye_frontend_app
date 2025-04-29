// 필요한 라이브러리 import
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { api_envUpdate } from '../../../apis/envApis'; // 환경 설정 수정 API

// 환경 항목(key)과 실제 DB 컬럼명을 매핑하는 테이블
const fieldKeyMap = {
  temperature: { min: 'minTem', max: 'maxTem' },
  humidity: { min: 'minHumi', max: 'maxHumi' },
  illuminance: { min: 'minIllumi', max: 'maxIllumi' },
  no2: { min: 'bouNo2', max: 'danNo2' },
  co2: { min: 'bouCo2', max: 'danCo2' },
  nh3: { min: 'bouNh3', max: 'danNh3' },
  h2s: { min: 'bouH2s', max: 'danH2s' },
  toluene: { min: 'bouToluene', max: 'danToluene' },
};

// 모달 컴포넌트
const SearchDetail = ({ title, initialMin, initialMax, unit, userId, envKey, onClose, onSave }) => {
  // 입력된 최소/최대 값 상태 관리
  const [minValue, setMinValue] = useState(initialMin?.toString() || '');
  const [maxValue, setMaxValue] = useState(initialMax?.toString() || '');

  // 저장(수정) 버튼 눌렀을 때 실행
  const handleSubmit = () => {
    // envKey가 없거나 잘못된 경우
    if (!envKey || !fieldKeyMap[envKey]) {
      console.error('envKey 매핑 실패:', envKey);
      return;
    }

    // 수정할 데이터를 만든다
    const updatedEnv = {};
    
    // 최소값 입력되어 있으면 추가
    if (minValue !== '') updatedEnv[fieldKeyMap[envKey].min] = parseFloat(minValue);
    // 최대값 입력되어 있으면 추가
    if (maxValue !== '') updatedEnv[fieldKeyMap[envKey].max] = parseFloat(maxValue);

    // 서버에 수정 요청 보내기
    api_envUpdate(userId, updatedEnv)
      .then(() => {
        onSave(updatedEnv); // 부모(SettingHome)에도 수정한 데이터 전달
        Alert.alert('수정 완료', '환경 설정이 저장되었습니다.'); // 완료 알림 띄우기
        onClose(); // 모달 닫기
      })
      .catch(err => {
        console.log('업데이트 실패:', err);
      });
  };

  // 화면 구성
  return (
    <View style={styles.modalWrapper}>
      <View style={styles.modalContent}>
        {/* 모달 제목 */}
        <Text style={styles.title}>{title}</Text>

        {/* 최소 입력창 */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>최소</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric" // 숫자 키패드
            value={minValue}
            onChangeText={setMinValue}
            placeholder={`최소 ${unit}`} // 단위 표시
          />
        </View>

        {/* 최대 입력창 */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>최대</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={maxValue}
            onChangeText={setMaxValue}
            placeholder={`최대 ${unit}`}
          />
        </View>

        {/* 저장(적용) 버튼 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveText}>적용</Text>
        </TouchableOpacity>

        {/* 닫기 버튼 */}
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelText}>닫기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 스타일 지정
const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // 뒷배경 반투명
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff', // 흰색 배경
    borderRadius: 12,
    padding: 20,
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  inputRow: { 
    marginBottom: 15 
  },
  label: { 
    fontSize: 14, 
    color: '#444', 
    marginBottom: 5 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#007bff', // 초록색 버튼
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveText: { 
    color: '#fff', 
    fontSize: 16,
    fontWeight : 'bold' 
  },
  cancelText: { 
    textAlign: 'center', 
    marginTop: 10, 
    color: '#888' 
  },
});

// 컴포넌트 export
export default SearchDetail;
