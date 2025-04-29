import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { api_stocInsert } from "../../../apis/stockApis";

const StockRegistration = ({ closeModal, setUserTrigger }) => {
  const [stockData, setStockData] = useState({
    warehousing: "",
    stockWeight: "",
    userId: "user",
  });

  // 입력 값 변경
  const changeData = (name, value) => {
    setStockData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 등록 실행
  const insertStock = () => {
    if (!stockData.warehousing || !stockData.stockWeight) {
      Alert.alert("입력 오류", "입고 수와 총 무게를 모두 입력해주세요.");
      return;
    }

    api_stocInsert(stockData)
      .then((res) => {
        console.log(res.data);
        setStockData({ warehousing: "", stockWeight: "", userId: "user" }); // 입력 초기화
        setUserTrigger({}); // ✅ 새로고침 트리거
        closeModal(); // ✅ 모달 닫기
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("등록 실패", "서버 오류 또는 입력값을 확인해주세요.");
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
          onChangeText={(text) => changeData("warehousing", text)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>총 무게</Text>
        <TextInput
          style={styles.input}
          name="stockWeight"
          value={stockData.stockWeight}
          onChangeText={(text) => changeData("stockWeight", text)}
          keyboardType="numeric"
        />
      </View>

      {/* 버튼 그룹 */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={closeModal} // 취소 -> 모달만 닫기
        >
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={insertStock} // 등록 실행
        >
          <Text style={styles.registerText}>등록</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StockRegistration;

// 스타일
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F4E1",
    padding: 40,
    maxWidth: 500,
    alignSelf: "center",
    borderRadius: 10,
    elevation: 4,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
    padding: 12,
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  registerButton: {
    backgroundColor: "#007bff",
  },
  cancelText: {
    color: "black",
    fontWeight: "bold",
  },
  registerText: {
    color: "white",
    fontWeight: "bold",
  },
});
