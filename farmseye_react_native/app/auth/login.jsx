import { Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import { api_login } from '../../apis/userApi';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { loginReducer } from '../../redux/authSlice';

const LoginScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    userId: '',
    userPw: ''
  });

  const handleLoginData = (text, keyValue) => {
    setLoginData({
      ...loginData,
      [keyValue]: text
    });
  };

  const login = () => {
    api_login(loginData)
      .then(res => {
        const token = res.headers.authorization;
        SecureStore.setItemAsync('accessToken', token)
          .then(() => {
            dispatch(loginReducer(token));
            router.replace('/');
          })
          .catch(e => {
            Alert.alert('오류', '토큰 저장에 실패했습니다.');
          });
      })
      .catch(e => {
        Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.');
      });
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>로그인</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>아이디</Text>
          <TextInput
            style={styles.input}
            value={loginData.userId}
            onChangeText={text => handleLoginData(text, 'userId')}
            placeholder="아이디를 입력하세요"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={loginData.userPw}
            onChangeText={text => handleLoginData(text, 'userPw')}
            placeholder="비밀번호를 입력하세요"
            placeholderTextColor="#aaa"
          />
        </View>

        <Pressable style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>로그인</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inner: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
