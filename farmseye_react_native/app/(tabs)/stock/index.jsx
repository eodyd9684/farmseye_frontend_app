import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native'; 
import StockDetail from './stockDetail'; 
import { useRouter } from 'expo-router'; 
import { api_stock } from '../../../apis/stockApis';
import StockEditModal from './stockEditModal';
import StockRegistration from './stockRegistration'; // ✅ 등록 컴포넌트 가져오기

const Stock = () => {
  const [stockInfo, setStockInfo] = useState([]);
  const [userTrigger, setUserTrigger] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [modalShow, setModalShow] = useState(false); // 수정 모달
  const [registerModalShow, setRegisterModalShow] = useState(false); // ✅ 등록 모달
  const [selectedStock, setSelectedStock] = useState(null);

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = stockInfo.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(stockInfo.length / itemsPerPage);

  useEffect(() => {
    api_stock()
      .then(res => {
        setStockInfo(res.data);
        setCurrentPage(1);
      })
      .catch(error => {
        console.log(error);
        Alert.alert('불러오기 실패', '서버에 문제가 있거나 네트워크 오류입니다.');
      });
  }, [userTrigger]);

  const renderPagination = () => (
    <View style={styles.pagination}>
      {Array.from({ length: totalPages }, (_, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            currentPage === i + 1 && styles.activePage
          ]}
          onPress={() => setCurrentPage(i + 1)}
        >
          <Text style={currentPage === i + 1 ? styles.activeText : styles.inactiveText}>
            {i + 1}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>개체 등록</Text>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => setRegisterModalShow(true)} // ✅ 등록 모달 열기
        >
          <Text style={styles.registerButtonText}>등록</Text>
        </TouchableOpacity>
      </View>

      {/* 테이블 헤더 */}
      <View style={styles.tableHeader}>
        <Text style={styles.cell}>개체수</Text>
        <Text style={styles.cell}>입고수</Text>
        <Text style={styles.cell}>출하수</Text>
        <Text style={styles.cell}>총무게</Text>
        <Text style={styles.cell}>폐사수</Text>
      </View>

      {/* 재고 목록 */}
      <FlatList
        data={currentItems}
        keyExtractor={item => item.stockNum.toString()}
        renderItem={({ item }) => (
          <StockDetail
            stock={item}
            setSelectedStock={setSelectedStock}
            setModalShow={setModalShow}
          />
        )}
      />

      {/* 페이지네이션 */}
      {renderPagination()}

      {/* 수정 모달 */}
      {selectedStock && (
        <StockEditModal
          visible={modalShow}
          onClose={() => setModalShow(false)}
          selectedStock={selectedStock}
          setUserTrigger={setUserTrigger}
        />
      )}

      {/* 등록 모달 */}
      <Modal
        visible={registerModalShow}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRegisterModalShow(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <StockRegistration
              closeModal={() => setRegisterModalShow(false)} // StockRegistration 안에서 모달 닫을 수 있게
              setUserTrigger={setUserTrigger} // 등록 후 새로고침
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Stock;

// 스타일
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f9fa',
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  registerButton: {
    backgroundColor: 'cornflowerblue',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    marginBottom: 5
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
    flexWrap: 'wrap'
  },
  pageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginHorizontal: 2
  },
  activePage: {
    backgroundColor: 'cornflowerblue'
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold'
  },
  inactiveText: {
    color: '#333'
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    padding: 20,
  }
});
