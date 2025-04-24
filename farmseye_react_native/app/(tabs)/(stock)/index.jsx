import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native'; 
import StockDetail from './stockDetail'; 
import { useRouter } from 'expo-router'; 
import { api_stock } from '../../../apis/stockApis';

const Stock = () => {
  const router = useRouter(); // 라우터 초기화
  const [stockInfo, setStockInfo] = useState([]); // 재고 정보를 저장하는 state
  const [userTrigger, setUserTrigger] = useState({}); // 재고 정보가 업데이트 될 때마다 새로 요청하기 위한 트리거 state
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지를 추적하는 state
  const itemsPerPage = 5; // 한 페이지에 보여줄 항목의 개수

  // 페이지네이션을 위한 변수들
  const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지에서 마지막 아이템의 인덱스
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫 번째 아이템의 인덱스
  const currentItems = stockInfo.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지에 해당하는 재고 정보
  const totalPages = Math.ceil(stockInfo.length / itemsPerPage); // 전체 페이지 수

  // 컴포넌트가 렌더링될 때 재고 정보를 불러오는 useEffect
  useEffect(() => {
    api_stock(stockInfo) // 서버에서 재고 정보를 가져오는 HTTP 요청
      .then(res => {
        setStockInfo(res.data); // 응답 받은 재고 정보를 state에 저장
        setCurrentPage(1); // 페이지를 1로 초기화
      })
      .catch(error => {
        console.log(error); // 에러 발생 시 콘솔에 출력
        Alert.alert('불러오기 실패', '서버에 문제가 있거나 네트워크 오류입니다.'); // 에러 메시지 알림
      });
  }, [userTrigger]); // userTrigger가 변경될 때마다 재고 정보를 다시 불러옴

  // 페이지네이션을 렌더링하는 함수
  const renderPagination = () => (
    <View style={styles.pagination}>
      {Array.from({ length: totalPages }, (_, i) => ( // 전체 페이지 수만큼 버튼을 생성
        <TouchableOpacity
          key={i}
          style={[ // 버튼 스타일
            styles.pageButton,
            currentPage === i + 1 && styles.activePage // 현재 페이지에 해당하면 활성화된 스타일 추가
          ]}
          onPress={() => setCurrentPage(i + 1)} // 페이지 버튼을 클릭하면 페이지 변경
        >
          <Text style={currentPage === i + 1 ? styles.activeText : styles.inactiveText}>
            {i + 1} {/* 페이지 번호 텍스트 */}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 부분: 개체 등록 버튼과 제목 */}
      <View style={styles.header}>
        <Text style={styles.title}>개체 등록</Text>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push('/stock/stockRegistration')} // 등록 버튼 클릭 시 등록 페이지로 이동
        >
          <Text style={styles.registerButtonText}>등록</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push('/stock/stockDetail')}>
          <Text style={styles.registerButtonText}>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push('/stock/stockDetail')}>
          <Text style={styles.registerButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.tableHeader}>
        <Text style={styles.cell}>개체수</Text>
        <Text style={styles.cell}>입고수</Text>
        <Text style={styles.cell}>출하수</Text>
        <Text style={styles.cell}>총무게</Text>
        <Text style={styles.cell}>폐사수</Text>
      </View>

      {/* 재고 목록을 FlatList로 렌더링 */}
      <FlatList
        data={currentItems} // 현재 페이지의 데이터만 전달
        keyExtractor={item => item.stockNum.toString()} // 각 항목의 고유한 키는 stockNum을 문자열로 변환하여 사용
        renderItem={({ item }) => ( // 각 항목에 대해 StockDetail 컴포넌트를 렌더링
          <StockDetail
            stock={item}
            stockInfo={stockInfo}
            setStockInfo={setStockInfo}
            setUserTrigger={setUserTrigger}
          />
        )}
      />

      {/* 페이지네이션 렌더링 */}
      {renderPagination()}
    </View>
  );
};

export default Stock;

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
  }
});
