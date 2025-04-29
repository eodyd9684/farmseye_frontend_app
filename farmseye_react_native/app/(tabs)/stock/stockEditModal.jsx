import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, Button, StyleSheet } from 'react-native';
import { api_stockUpdate, api_stockDelete } from '../../../apis/stockApis';

const StockEditModal = ({ visible, onClose, selectedStock, setUserTrigger }) => {
  const [formData, setFormData] = useState(selectedStock);

  useEffect(() => {
    setFormData(selectedStock);
  }, [selectedStock]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = () => {
    api_stockUpdate(formData)
      .then(() => {
        alert('수정 완료되었습니다.');
        setUserTrigger({});
        onClose();
      })
      .catch(console.log);
  };

  const handleDelete = () => {
    api_stockDelete(formData)
      .then(() => {
        alert('삭제 완료되었습니다.');
        setUserTrigger({});
        onClose();
      })
      .catch(console.log);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalWrapper}>
        <View style={styles.modalContent}>

          {/* 개체수 + 개체번호 */}
          <View style={styles.row}>
            <Text style={styles.label}>개체수</Text>
            <Text style={styles.value}>{formData.individualNum}</Text>
          </View>

          {/* 입고수, 출고수, 재고수, 폐사수 입력창 */}
          <View style={styles.row}>
            <Text style={styles.label}>입고수</Text>
            <TextInput
              style={styles.input}
              value={formData.warehousing?.toString() || ''}
              onChangeText={(text) => handleChange('warehousing', text)}
              placeholder="입고수"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>출고수</Text>
            <TextInput
              style={styles.input}
              value={formData.shipment?.toString() || ''}
              onChangeText={(text) => handleChange('shipment', text)}
              placeholder="출고수"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>총무게</Text>
            <TextInput
              style={styles.input}
              value={formData.stockWeight?.toString() || ''}
              onChangeText={(text) => handleChange('stockWeight', text)}
              placeholder="총무게"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>폐사수</Text>
            <TextInput
              style={styles.input}
              value={formData.deathStock?.toString() || ''}
              onChangeText={(text) => handleChange('deathStock', text)}
              placeholder="폐사수"
              keyboardType="numeric"
            />
          </View>

          {/* 등록일 */}
          <Text style={styles.regDate}>{formData.regDate}</Text>

          {/* 버튼 영역 */}
          <View style={styles.buttonRow}>
            <Button title="확인" onPress={handleUpdate} />
            <Button title="삭제" onPress={handleDelete} />
            <Button title="취소" onPress={onClose} />
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default StockEditModal;

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: 80,
    fontWeight: 'bold',
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    textAlign: 'center',
  },
  regDate: {
    marginVertical: 10,
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
