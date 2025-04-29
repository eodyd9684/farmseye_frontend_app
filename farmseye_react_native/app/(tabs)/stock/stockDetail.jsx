import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import axios from 'axios';
import { api_stockDelete, api_stockUpdate } from '../../../apis/stockApis';

const StockDetail = ({ stock, setStockInfo, stockInfo, setUserTrigger, setModalShow }) => {
  const [isShow, setIsShow] = useState(false);
  const [updateInfo, setUpdateInfo] = useState({ ...stock });

  const updateStock = () => {
    api_stockUpdate(updateInfo)
      .then(() => {
        alert('수정 되었습니다.');
        setIsShow(false);
        setUserTrigger({});
      })
      .catch(console.log);
  };

  const deleteStock = () => {
    api_stockDelete(updateInfo)
      .then(() => {
        alert('삭제 되었습니다.');
        setUserTrigger({});
      })
      .catch(console.log);
  };

  const changeInfo = (name, value) => {
    setUpdateInfo({
      ...updateInfo,
      [name]: value
    });
  };

  return (
    <View style={styles.itemContainer}>
      {isShow ? (
        <>
          <Text>{updateInfo.individualNum}</Text>
          <TextInput
            style={styles.input}
            value={updateInfo.warehousing.toString()}
            onChangeText={(text) => changeInfo('warehousing', text)}
          />
          <TextInput
            style={styles.input}
            value={updateInfo.shipment?.toString()}
            onChangeText={(text) => changeInfo('shipment', text)}
          />
          <TextInput
            style={styles.input}
            value={updateInfo.stockWeight.toString()}
            onChangeText={(text) => changeInfo('stockWeight', text)}
          />
          <TextInput
            style={styles.input}
            value={updateInfo.deathStock?.toString()}
            onChangeText={(text) => changeInfo('deathStock', text)}
          />
          <Text>{updateInfo.regDate}</Text>
          <View style={styles.buttonGroup}>
            <Button title="확인" onPress={updateStock} />
            <Button title="취소" onPress={() => setIsShow(false)} />
          </View>
        </>
      ) : (
        <>
          <Pressable onPress={() => {setModalShow(true)}}>
            <View style={styles.detail}>
              <Text>{stock.individualNum}</Text>
              <Text>{stock.warehousing}</Text>
              <Text>{stock.shipment}</Text>
              <Text>{stock.stockWeight}</Text>
              <Text>{stock.deathStock}</Text>
              <View style={styles.buttonGroup}>
                <Button title="수정" onPress={() => setIsShow(true)} />
                <Button title="삭제" onPress={deleteStock} />
            </View>
            </View>
          </Pressable>
        </>
      )}
    </View>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 4,
    borderRadius: 5,
    backgroundColor: 'white'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10
  },
  detail : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-around'
  }
});