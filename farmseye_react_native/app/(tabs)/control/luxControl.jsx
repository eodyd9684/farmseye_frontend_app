import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable, Image, Modal, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { router } from 'expo-router';
import LuxRuleEditorScreen from './luxRuleEditor';

const LuxControlScreen = () => {
  const [ledState, setLedState] = useState('off');
  const [status, setStatus] = useState('');
  const [showAutoControl, setShowAutoControl] = useState(false);

  const controlLed = async (state) => {
    try {
      setStatus('조명 제어 중...');
      await axios.post('http://192.168.30.236:5000/api/control/led', 
        { state },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setLedState(state);
      setStatus(`조명이 ${state === 'on' ? '켜졌습니다' : '꺼졌습니다'}.`);
    } catch (error) {
      console.log(error);
      setStatus(`오류: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <Ionicons name="menu-outline" size={24} color="black" />
        <Text style={styles.headerTitle}>FarmsEye</Text>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      {/* 탭 메뉴 */}
      <View style={styles.tabMenu}>
        <Pressable onPress={() => router.push('/control/tempControl')}>
          <Text style={styles.tabText}>에어컨</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/control/roofControl')}>
          <Text style={styles.tabText}>루프</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/control/luxControl')}>
          <Text style={[styles.tabText, styles.activeTab]}>조명</Text>
        </Pressable>
      </View>

      {/* 조명 이미지 */}
      <Image source={require('@/assets/images/lamp.jpg')} style={styles.image} resizeMode="cover"/>

      {/* 제어 카드 */}
      <View style={styles.card}>
        <Ionicons name="sunny-outline" size={36} color="#FFA500" />
        <Text style={styles.cardTitle}>조도</Text>
        <Text style={styles.cardStatus}>{ledState === 'on' ? '좋음' : '꺼짐'}</Text>
        <View style={styles.buttonRow}>
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
        <Text style={styles.statusText}>{status}</Text>
      </View>
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
                <LuxRuleEditorScreen />
                <Button title="닫기" onPress={() => setShowAutoControl(false)} color="#ff5e5e" />
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
}

export default LuxControlScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  tabMenu: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  tabText: { fontSize: 16, marginHorizontal: 16, color: '#888' },
  activeTab: { color: '#00C896', fontWeight: 'bold' },
  image: { width: '100%', height: 160, resizeMode: 'contain', marginBottom: 10 },
  card: { margin: 20, backgroundColor: '#f5f5f5', borderRadius: 16, padding: 20, alignItems: 'center' },
  cardTitle: { fontSize: 20, marginVertical: 8 },
  cardStatus: { fontSize: 16, color: '#00C896', marginBottom: 12 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  statusText: { marginTop: 10, fontSize: 14, color: '#666' },
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