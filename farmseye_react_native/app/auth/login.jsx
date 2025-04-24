
import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import CustomInput from '../../components/common/LoginCustomInput'
import CustomButton from '../../components/common/CustomButton'
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
          router.navigate('/')
        })
        .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  };

  return (
    <View>
      <View>
        <CustomInput 
          label={'아이디'} 
          value={loginData.userId}
          onChangeText={text => handleLoginData(text, 'userId')}
        />

        <CustomInput 
          label={'비밀번호'}
          isPw={true}
          value={loginData.userPw}
          onChangeText={text => handleLoginData(text, 'userPw')}
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