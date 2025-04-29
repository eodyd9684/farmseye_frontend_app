import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { api_stocInsert } from '../../../apis/stockApis';

const StockRegistration = () => {
  const router = useRouter();

  const [stockData, setStockData] = useState({
    warehousing: '',
    stockWeight: '',
    userId: 'user'
  });

  const changeData = (name, value) => {
    setStockData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const insertStock = () => {
    api_stocInsert(stockData)
      .then(res => {
        console.log(res.data);
        setStockData({ warehousing: '', stockWeight: '' });
        router.push('/stock');
      })
      .catch(error => {
        console.log(error);
        Alert.alert('등록 실패', '서버 오류 또는 입력값을 확인해주세요.');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>입고 수</Text>
        <TextInput
          style={styles.input}
          name="warehousing"
          value={stockData.warehousing}
          onChangeText={(text) => changeData('warehousing', text)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>총 무게</Text>
        <TextInput
          style={styles.input}
          name="stockWeight"
          value={stockData.stockWeight}
          onChangeText={(text) => changeData('stockWeight', text)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.push('/stock')}
        >
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={insertStock}
        >
          <Text style={styles.registerText}>등록</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StockRegistration;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F4E1',
    padding: 40,
    maxWidth: 500,
    alignSelf: 'center',
    marginTop: 40,
    borderRadius: 10,
    elevation: 4
  },
  fieldGroup: {
    marginBottom: 20
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'white',
    padding: 12,
    fontSize: 14
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 5
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  registerButton: {
    backgroundColor: '#2ecc71'
  },
  cancelText: {
    color: 'black',
    fontWeight: 'bold'
  },
  registerText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
