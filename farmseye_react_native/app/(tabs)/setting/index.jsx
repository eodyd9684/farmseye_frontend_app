import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { api_env } from '../../../apis/envApis';
import { getUserSubFromToken } from '../../../redux/authHelper';
import * as SecureStore from 'expo-secure-store';

const SettingHome = () => {
  const [envInfo, setEnvInfo] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        setUserId(getUserSubFromToken(token));
      } else {
        console.log('Access token이 없습니다.');
      }
      setLoading(false);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      api_env(userId)
        .then(res => setEnvInfo(res.data))
        .catch(error => console.log('환경 데이터 에러:', error));
    } else if (!loading) {
      console.log('userId 없음 - 환경 데이터 요청 안 함');
    }
  }, [userId, loading]);

  console.log('envInfo:', envInfo);

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <Text>사용자 정보를 가져오는 중...</Text>
      ) : userId ? (
        envInfo ? (
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>최소 온도</Text>
              <Text style={styles.value}>{envInfo?.minTem ? envInfo.minTem.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>최대 온도</Text>
              <Text style={styles.value}>{envInfo?.maxTem ? envInfo.maxTem.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>최소 습도</Text>
              <Text style={styles.value}>{envInfo?.minHumi ? envInfo.minHumi.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>최대 습도</Text>
              <Text style={styles.value}>{envInfo?.maxHumi ? envInfo.maxHumi.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>최소 조도</Text>
              <Text style={styles.value}>{envInfo?.minIllumi ? envInfo.minIllumi.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>최대 조도</Text>
              <Text style={styles.value}>{envInfo?.maxIllumi ? envInfo.maxIllumi.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>실내 이산화질소</Text>
              <Text style={styles.value}>{envInfo?.bouNo2 ? envInfo.bouNo2.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>축사 이산화질소</Text>
              <Text style={styles.value}>{envInfo?.danNo2 ? envInfo.danNo2.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>실내 이산화탄소</Text>
              <Text style={styles.value}>{envInfo?.bouCo2 ? envInfo.bouCo2.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>축사 이산화탄소</Text>
              <Text style={styles.value}>{envInfo?.danCo2 ? envInfo.danCo2.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>실내 암모니아</Text>
              <Text style={styles.value}>{envInfo?.bouNh3 ? envInfo.bouNh3.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>축사 암모니아</Text>
              <Text style={styles.value}>{envInfo?.danNh3 ? envInfo.danNh3.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>실내 황화수소</Text>
              <Text style={styles.value}>{envInfo?.bouH2s ? envInfo.bouH2s.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>축사 황화수소</Text>
              <Text style={styles.value}>{envInfo?.danH2s ? envInfo.danH2s.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>실내 톨루엔</Text>
              <Text style={styles.value}>{envInfo?.bouToluene ? envInfo.bouToluene.toFixed(1) : '-'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>축사 톨루엔</Text>
              <Text style={styles.value}>{envInfo?.danToluene ? envInfo.danToluene.toFixed(1) : '-'}</Text>
            </View>
          </View>
        ) : (
          <Text>환경 데이터를 가져오는 중...</Text>
        )
      ) : (
        <Text>사용자 정보를 사용할 수 없습니다.</Text>
      )}
    </ScrollView>
  );
};

export default SettingHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});