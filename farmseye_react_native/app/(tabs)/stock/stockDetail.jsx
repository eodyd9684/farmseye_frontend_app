import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const StockDetail = ({ stock, setSelectedStock, setModalShow }) => {
  const openEditModal = () => {
    setSelectedStock(stock); // 선택한 데이터를 넘김
    setModalShow(true);       // 모달 열기
  };

  return (
    <Pressable onPress={openEditModal}>
      <View style={styles.itemContainer}>
        <View style={styles.detail}>
          <Text>{stock.individualNum}</Text>
          <Text>{stock.warehousing}</Text>
          <Text>{stock.shipment}</Text>
          <Text>{stock.stockWeight}</Text>
          <Text>{stock.deathStock}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default StockDetail;

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F8F4E1',
    borderRadius: 10,
    elevation: 2
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});
