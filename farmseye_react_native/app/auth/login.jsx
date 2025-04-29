
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { api_login } from '../../apis/userApi'
import * as SecureStore from 'expo-secure-store'
import { useRouter } from 'expo-router'
import { useDispatch } from 'react-redux'
import { loginReducer } from '../../redux/authSlice'

const LoginScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    userId : '',
    userPw : ''
  });

  const handleLoginData = (text, keyValue) => {
    setLoginData({
      ...loginData,
      [keyValue] : text
    })
  };

  const login = () => {
    api_login(loginData)
      .then(res => {

        const token = res.headers.authorization;

        SecureStore.setItemAsync('accessToken', token)
        .then(() => {
          dispatch(loginReducer(token))
          router.replace('/')
        })
        .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.login_text}>아이디</Text>
      <TextInput
        style={styles.inp}
        value={loginData.userId}
        onChangeText={text => handleLoginData(text, 'userId')}
      />

      <Text style={styles.login_text}>비밀번호</Text>
      <TextInput 
        style={styles.inp}
        secureTextEntry={true}
        value={loginData.userPw}
        onChangeText={text => handleLoginData(text, 'userPw')}
      />

      <Pressable style={styles.btn} onPress={login}>
        <Text style={styles.btn_text}>로그인</Text>
      </Pressable>
      
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container : {
    width : '80%',
    margin : 'auto',
    borderRadius : 12,
    borderWidth : 1,
    padding : 12,
  },

  login_text : {
    fontSize : 18,
    fontWeight : 'bold',
  },

  inp : {
    borderWidth : 1,
    borderRadius : 10,
    marginVertical : 10,
  },

  btn : {
    height : 44,
    backgroundColor: '#007bff',
    justifyContent : 'center',
    borderRadius: 5,
    alignItems: 'center',
  },

  btn_text : {
    color: 'white',
    fontWeight: 'bold',
  },
})