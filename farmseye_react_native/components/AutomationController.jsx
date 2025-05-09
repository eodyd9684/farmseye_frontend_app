import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';

const iconMap = {
  TEMP: <Ionicons name="thermometer" size={24} color="#000" />,
  HUMI: <MaterialCommunityIcons name="water-percent" size={24} color="#000" />,
  NO2: <MaterialCommunityIcons name="molecule-co" size={24} color="#000" />,
  CO2: <FontAwesome5 name="cloud" size={24} color="#000" />,
  NH3: <MaterialCommunityIcons name="chemical-weapon" size={24} color="#000" />,
  H2S: <MaterialCommunityIcons name="gas-cylinder" size={24} color="#000" />,
  TOLUENE: <MaterialCommunityIcons name="flask" size={24} color="#000" />,
  ILLUMI: <Ionicons name="sunny" size={24} color="#000" />,
};

const labelMap = {
  TEMP: '온도',
  HUMI: '습도',
  NO2: '이산화질소',
  CO2: '이산화탄소',
  NH3: '암모니아',
  H2S: '황화수소',
  TOLUENE: '톨루엔',
  ILLUMI: '조도',
};

const unitMap = {
  TEMP: '°C',
  HUMI: '%',
  NO2: 'ppm',
  CO2: 'ppm',
  NH3: 'ppm',
  H2S: 'ppm',
  TOLUENE: 'ppm',
  ILLUMI: '',
};

const descriptionMap = {
  MIN_TEM: '최저 온도 (이하일 때 창문 닫기)',
  MAX_TEM: '최고 온도 (이상일 때 창문 열기)',
  MIN_HUMI: '최저 습도 (이하일 때 가습기 켜기)',
  MAX_HUMI: '최고 습도 (이상일 때 환풍기 켜기)',
  MIN_ILLUMI: '최저 조도 (이하일 때 조명 켜기)',
  MAX_ILLUMI: '최고 조도 (이상일 때 조명 끄기)',
  BOU_NO2: '경계 이산화질소 (이상일 때 환기)',
  DAN_NO2: '위험 이산화질소 (이상일 때 강제 환기)',
  BOU_CO2: '경계 이산화탄소 (이상일 때 환기)',
  DAN_CO2: '위험 이산화탄소 (이상일 때 강제 환기)',
  BOU_NH3: '경계 암모니아 (이상일 때 환기)',
  DAN_NH3: '위험 암모니아 (이상일 때 강제 환기)',
  BOU_H2S: '경계 황화수소 (이상일 때 환기)',
  DAN_H2S: '위험 황화수소 (이상일 때 강제 환기)',
  BOU_TOLUENE: '경계 톨루엔 (이상일 때 환기)',
  DAN_TOLUENE: '위험 톨루엔 (이상일 때 강제 환기)',
};

const sensorGroupMap = {
  TEMP: ['MIN_TEM', 'MAX_TEM'],
  HUMI: ['MIN_HUMI', 'MAX_HUMI'],
  ILLUMI: ['MIN_ILLUMI', 'MAX_ILLUMI'],
  NO2: ['BOU_NO2', 'DAN_NO2'],
  CO2: ['BOU_CO2', 'DAN_CO2'],
  NH3: ['BOU_NH3', 'DAN_NH3'],
  H2S: ['BOU_H2S', 'DAN_H2S'],
  TOLUENE: ['BOU_TOLUENE', 'DAN_TOLUENE'],
};

const AutomationController = () => {
  const [automationConfig, setAutomationConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [error, setError] = useState(null);

  const API_URL = 'http://192.168.30.236:5000';

  // 자동화 설정 가져오기
  const fetchAutomationConfig = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/automation/config`);
      setAutomationConfig(res.data);
      setError(null);
    } catch (err) {
      console.error('자동화 설정 가져오기 실패:', err);
      setError('설정을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 자동화 설정 저장하기
  const saveAutomationConfig = async () => {
    try {
      setSaving(true);
      await axios.post(`${API_URL}/api/automation/config`, automationConfig);
      Alert.alert('성공', '자동화 설정이 저장되었습니다.');
    } catch (err) {
      console.error('자동화 설정 저장 실패:', err);
      Alert.alert('오류', '설정을 저장하는 데 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    fetchAutomationConfig();
  }, []);

  // 값 변경 핸들러
  const handleValueChange = (key, value) => {
    setAutomationConfig(prev => {
      if (!prev) return prev;
      return { ...prev, [key]: parseFloat(value) || 0 };
    });
  };

  // 그룹 토글 핸들러
  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  // // 모의 데이터 (실제 개발 시 제거)
  // useEffect(() => {
  //   if (!automationConfig && !loading) {
  //     // 실제 API 연동 전 테스트용 모의 데이터
  //     setAutomationConfig({
  //       MIN_TEM: 20,
  //       MAX_TEM: 28,
  //       MIN_HUMI: 60,
  //       MAX_HUMI: 70,
  //       MIN_ILLUMI: 5,
  //       MAX_ILLUMI: 20,
  //       BOU_NO2: 2,
  //       DAN_NO2: 5,
  //       BOU_CO2: 3000,
  //       DAN_CO2: 5000,
  //       BOU_NH3: 10,
  //       DAN_NH3: 20,
  //       BOU_H2S: 0.5,
  //       DAN_H2S: 2,
  //       BOU_TOLUENE: 0.2,
  //       DAN_TOLUENE: 0.5,
  //       USER_ID: 'user',
  //     });
  //   }
  // }, [automationConfig, loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>설정을 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAutomationConfig}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>자동화 설정</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>자동화 사용</Text>
            <Switch
              value={automationEnabled}
              onValueChange={setAutomationEnabled}
              trackColor={{ false: "#767577", true: "#c8e6c9" }}
              thumbColor={automationEnabled ? "#4caf50" : "#f4f3f4"}
            />
          </View>
        </View>

        {!automationEnabled && (
          <View style={styles.disabledMessage}>
            <Text style={styles.disabledText}>자동화가 비활성화되었습니다. 활성화하려면 스위치를 켜세요.</Text>
          </View>
        )}

        {automationEnabled && automationConfig && (
          <>
            {Object.keys(sensorGroupMap).map((sensor) => (
              <View key={sensor} style={styles.sensorGroup}>
                <TouchableOpacity 
                  style={styles.groupHeader}
                  onPress={() => toggleGroup(sensor)}
                >
                  {iconMap[sensor]}
                  <Text style={styles.groupTitle}>{labelMap[sensor]} 설정</Text>
                  <Ionicons 
                    name={expandedGroups[sensor] ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color="#555" 
                  />
                </TouchableOpacity>

                {expandedGroups[sensor] && (
                  <View style={styles.groupContent}>
                    {sensorGroupMap[sensor].map((key) => (
                      <View key={key} style={styles.configItem}>
                        <Text style={styles.configLabel}>{descriptionMap[key]}</Text>
                        <View style={styles.inputContainer}>
                          <TextInput
                            style={styles.input}
                            value={automationConfig[key]?.toString()}
                            onChangeText={(value) => handleValueChange(key, value)}
                            keyboardType="numeric"
                          />
                          <Text style={styles.unit}>{unitMap[sensor]}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}

            <TouchableOpacity 
              style={[styles.saveButton, saving && styles.savingButton]}
              onPress={saveAutomationConfig}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>설정 저장</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 8,
    fontSize: 16,
  },
  disabledMessage: {
    backgroundColor: '#ffecb3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  disabledText: {
    color: '#ff6f00',
    fontSize: 14,
  },
  sensorGroup: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  groupContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  configItem: {
    marginBottom: 12,
  },
  configLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    flex: 1,
  },
  unit: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
    width: 30,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  savingButton: {
    backgroundColor: '#78909c',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutomationController;