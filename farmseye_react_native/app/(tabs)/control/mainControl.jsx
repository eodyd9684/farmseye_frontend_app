
import {  View, Text, TouchableOpacity, Image, StyleSheet, Switch  } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';

const MainControlScreen = () => {
  const [power, setPower] = useState(true);
  const [temperature, setTemperature] = useState(24);
  const [windLevel, setWindLevel] = useState('중');

  const handleTemperatureChange = (amount) => {
    setTemperature(prev => prev + amount);
  };

  const cycleWindLevel = () => {
    if (windLevel === '약') setWindLevel('중');
    else if (windLevel === '중') setWindLevel('강');
    else setWindLevel('약');
  };


  return (
  <View style={styles.container}>
      {/* 상단 */}
      <View style={styles.header}>
        <Ionicons name="menu-outline" size={24} color="black" />
        <Text style={styles.headerTitle}>PATIO</Text>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      {/* 탭 */}
      <View style={styles.tabMenu}>
        {['에어컨', '루프', '조명'].map((tab, idx) => (
          <TouchableOpacity key={idx} style={styles.tabButton}>
            <Text style={[styles.tabText, idx === 0 && styles.activeTab]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 에어컨 이미지 */}
      <Image source={require('@/assets/images/aircon.jpg')} style={styles.image} resizeMode="contain" />

      {/* 온도/습도 카드 */}
      <View style={styles.statusCards}>
        <View style={styles.statusCard}>
          <Ionicons name="thermometer-outline" size={30} color="#ff5e5e" />
          <Text style={styles.statusTitle}>온도</Text>
          <Text style={styles.statusValue}>나쁨</Text>
        </View>
        <View style={styles.statusCard}>
          <Ionicons name="water-outline" size={30} color="#5e9eff" />
          <Text style={styles.statusTitle}>습도</Text>
          <Text style={styles.statusValue}>매우 나쁨</Text>
        </View>
      </View>

      {/* 제어 패널 */}
      <View style={styles.controlPanel}>
        {/* 전원 */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>전원</Text>
          <Switch
            value={power}
            onValueChange={setPower}
            thumbColor={power ? '#00C896' : '#ccc'}
          />
        </View>

        {/* 온도 제어 */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>온도 제어</Text>
          <View style={styles.tempControl}>
            <TouchableOpacity onPress={() => handleTemperatureChange(-1)}>
              <Ionicons name="remove-circle-outline" size={28} color="#00C896" />
            </TouchableOpacity>
            <Text style={styles.tempText}>{temperature}°C</Text>
            <TouchableOpacity onPress={() => handleTemperatureChange(1)}>
              <Ionicons name="add-circle-outline" size={28} color="#00C896" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 바람세기 제어 */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>바람세기 제어</Text>
          <TouchableOpacity onPress={cycleWindLevel} style={styles.windButton}>
            <Text style={styles.windText}>{windLevel}</Text>
          </TouchableOpacity>
        </View>

        {/* 예약 설정 */}
        <TouchableOpacity style={styles.reservationButton}>
          <Text style={styles.reservationText}>예약설정</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#aaa" />
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default MainControlScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  tabMenu: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  tabButton: { marginHorizontal: 10 },
  tabText: { fontSize: 16, color: '#888' },
  activeTab: { color: '#00C896', fontWeight: 'bold' },
  image: { width: '100%', height: 120, marginBottom: 10 },
  statusCards: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  statusCard: { alignItems: 'center', backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, width: '40%' },
  statusTitle: { fontSize: 16, marginVertical: 8 },
  statusValue: { fontSize: 14, color: '#f00' },
  controlPanel: { marginHorizontal: 20, marginTop: 10 },
  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  controlLabel: { fontSize: 16, color: '#333' },
  tempControl: { flexDirection: 'row', alignItems: 'center' },
  tempText: { marginHorizontal: 12, fontSize: 18 },
  windButton: { backgroundColor: '#e0f7f4', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 20 },
  windText: { color: '#00C896', fontSize: 16 },
  reservationButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingVertical: 14, borderBottomWidth: 1, borderColor: '#eee' },
  reservationText: { fontSize: 16, color: '#333' },
})