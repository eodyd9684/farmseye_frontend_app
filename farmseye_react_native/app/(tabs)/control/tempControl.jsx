
import {  View, Text, TouchableOpacity, Image, StyleSheet, Button, Pressable, ScrollView  } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { router } from 'expo-router';
import TempRuleEditorScreen from './tempRuleEditor';
import { Modal } from 'react-native';

const TempControlScreen = () => {
  const [servoAngle, setServoAngle] = useState(24);
  const [ledState, setLedState] = useState('off');
  const [status, setStatus] = useState('');
  const [showAutoControl, setShowAutoControl] = useState(false);

  const controlServo = async (amount) => {
    try {
      setStatus('서보모터 제어 중...');
      await axios.post('http://192.168.30.236:5000/api/control/servo', 
        { angle: servoAngle },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setServoAngle(prev => prev + amount);
      setStatus('서보모터가 성공적으로 제어되었습니다.');
    } catch (error) {
      console.log(error);
      setStatus(`오류: ${error.message}`);
    }
  };

  const controlLed = async (state) => {
    try {
      setStatus('LED 제어 중...');
      await axios.post('http://192.168.30.236:5000/api/control/led', 
        { state },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setLedState(state);
      setStatus('LED가 성공적으로 제어되었습니다.');
    } catch (error) {
      console.log(error);
      setStatus(`오류: ${error.message}`);
    }
  };


  return (
  <View style={styles.container}>
      {/* 상단 */}
      <View style={styles.header}>
        <Ionicons name="menu-outline" size={24} color="black" />
        <Text style={styles.headerTitle}>FarmsEye</Text>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      {/* 탭 */}
      <View style={styles.tabMenu}>
        <Pressable onPress={() => router.push('/control/tempControl')}>
          <Text style={[styles.tabText, styles.activeTab]}>에어컨</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/control/roofControl')}>
          <Text style={styles.tabText}>루프</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/control/luxControl')}>
          <Text style={styles.tabText}>조명</Text>
        </Pressable>

      </View>

      {/* 에어컨 이미지 */}
      <Image source={require('@/assets/images/aircon.jpg')} style={styles.image} resizeMode="cover" />

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
          <Button
            title="켜기"
            color={ledState === 'on' ? 'green' : 'gray'}
            onPress={() => controlLed('on')}
          />
          <Button
            title="끄기"
            color={ledState === 'off' ? 'red' : 'gray'}
            onPress={() => controlLed('off')}
          />
        </View>

        {/* 온도 제어 */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>온도 제어</Text>
          <View style={styles.tempControl}>
            <TouchableOpacity onPress={() => controlServo(-1)}>
              <Ionicons name="remove-circle-outline" size={28} color="#00C896" />
            </TouchableOpacity>
            <Text style={styles.tempText}>{servoAngle}°C</Text>
            <TouchableOpacity onPress={() => controlServo(1)}>
              <Ionicons name="add-circle-outline" size={28} color="#00C896" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 자동 제어 */}
        {/* <TouchableOpacity style={styles.reservationButton}>

        <ScrollView style={styles.container}>
          <Text style={styles.header}>디바이스 제어 화면</Text>

          <View style={styles.buttonContainer}>
            <Button
              title={showAutoControl ? '자동 제어 닫기' : '자동 제어 열기'}
              onPress={() => setShowAutoControl(prev => !prev)}
              color="#28A745"
            />
          </View> */}

          {/* 자동 제어 펼치기 */}
          {/* {showAutoControl && (
            <View style={styles.ruleContainer}>
              <RuleEditorScreen />
            </View>
          )}
        </ScrollView>
         */}
          {/* <Text style={styles.reservationText}>자동제어</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#aaa" /> */}
        {/* </TouchableOpacity> */}
        <View style={{ marginTop: 20 }}>
          <Button
            title="자동 제어 설정"
            onPress={() => setShowAutoControl(true)}
            color="#28A745"
          />

          <Modal
            visible={showAutoControl}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowAutoControl(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>  {/* 크기 제어를 위해 새로운 wrapper 스타일 사용 */}
                <ScrollView contentContainerStyle={styles.modalScrollContent}>
                  <Text style={styles.modalTitle}>자동 제어 설정</Text>
                  <TempRuleEditorScreen />
                  <Button title="닫기" onPress={() => setShowAutoControl(false)} color="#ff5e5e" />
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>




      </View>
    </View>
  );
};


export default TempControlScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  tabMenu: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  tabButton: { marginHorizontal: 10 },
  tabText: { fontSize: 16, marginHorizontal: 16, color: '#888' },
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
  reservationButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingVertical: 14, borderBottomWidth: 1, borderColor: '#eee' },
  reservationText: { fontSize: 16, color: '#333' },
  buttonContainer: { marginBottom: 12 },
  ruleContainer: { marginTop: 16, backgroundColor: '#F3F4F6', borderRadius: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalContainer: {
    maxHeight: '80%',
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  modalScrollContent: {
    paddingBottom: 20,
  },
})