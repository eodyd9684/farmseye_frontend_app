import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

// 개별 재고 정보를 표시하는 컴포넌트
const StockDetail = ({ stock, setSelectedStock, setModalShow }) => {

  // 개체를 클릭했을 때 실행되는 함수
  const openEditModal = () => {
    setSelectedStock(stock);  // 선택한 stock(재고 데이터)을 저장
    setModalShow(true);       // 수정할 수 있는 모달창 열기
  };

  return (
    // Pressable : 터치 가능한 영역 (눌렀을 때 반응함)
    <Pressable onPress={openEditModal}>
      <View style={styles.itemContainer}>
        
        {/*  재고 데이터들을 가로로 나열하는 부분 */}
        <View style={styles.detail}>
          <Text>{stock.individualNum}</Text>   {/* 개체수 */}
          <Text>{stock.warehousing}</Text>      {/* 입고수 */}
          <Text>{stock.shipment}</Text>         {/* 출하수 */}
          <Text>{stock.stockWeight}</Text>      {/* 총 무게 */}
          <Text>{stock.deathStock}</Text>       {/* 폐사수 */}
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
