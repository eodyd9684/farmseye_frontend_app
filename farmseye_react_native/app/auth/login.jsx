
import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import CustomInput from '../../components/common/LoginCustomInput'
import CustomButton from '../../components/common/CustomButton'
import { api_login } from '../../apis/userApi'
import * as SecureStore from 'expo-secure-store'

const LoginScreen = () => {
  const [loginData, setLoginData] = useState({
    memEmail : '',
    memPw : ''
  });

  const handleLoginData = (text, keyValue) => {
    setLoginData({
      ...loginData,
      [keyValue] : text
    })
  };

  const login = () => {
    api_login(loginData)
      .then(async res => {
        alert('성공');

        const token = res.headers.authorization;

        await SecureStore.setItemAsync('accessToken', String(token));
        const savedToken = await SecureStore.getItemAsync('accessToken');
        console.log(savedToken);
      })
      .catch(e => console.log(e));
  };

  return (
    <View>
      <View>
        <CustomInput 
          label={'아이디'} 
          value={loginData.memEmail}
          onChangeText={text => handleLoginData(text, 'memEmail')}
        />

        <CustomInput 
          label={'비밀번호'}
          isPw={true}
          value={loginData.memPw}
          onChangeText={text => handleLoginData(text, 'memPw')}
        />

        <CustomButton 
          label={'로그인'} 
          size={'large'} 
          onPress={() => {login()}}
        />
      </View>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})