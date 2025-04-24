import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux';
import { getUserSubFromToken } from '../redux/authHelper';
import * as SecureStore from 'expo-secure-store';
import { logoutReducer } from '../redux/authSlice';


const Header = () => {
  const router = useRouter();

  const auth = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const handleLogout = () => {
    SecureStore.deleteItemAsync('accessToken')
    .then(() => {
      console.log("SecureStore 삭제 완료");
      dispatch(logoutReducer());
      router.replace('/')
    })
    .catch(error => console.error("SecureStore 오류:", error));
  };

  return (
    <View style={styles.headerContainder}>
      <View style={styles.logoView}>
        <Image 
          resizeMethod='contain'
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
        
        <Text style={styles.headerTitle}>FarmsEye</Text>
      </View>

      {
        auth.isLogin
        ?
          <Pressable 
            style={({pressed}) => [ styles.authContainer, pressed && styles.pressed ]}
            onPress={handleLogout}
          >
            <Text style={styles.authText}>Logout</Text>
          </Pressable>
        :
        <View style={styles.loginStatus}>
          <Pressable 
            style={({pressed}) => [ styles.authContainer, pressed && styles.pressed ]}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.authText}>로그인</Text>
          </Pressable>
          
          <Pressable 
            style={({pressed}) => [ styles.authContainer, pressed && styles.pressed ]}
            onPress={() => router.push('/auth/join')}
          >
            <Text style={styles.authText}>회원가입</Text>
          </Pressable>
        </View>
      }
      
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  headerContainder : {
    height : 60,
    backgroundColor : 'white',
    borderWidth : 1,
    flexDirection: 'row',
    justifyContent : 'space-between',
    alignItems : 'center',
    paddingHorizontal : 10
  },

  logoView : {
    flexDirection : 'row', 
    alignItems:'center'
  },

  headerTitle : {
    fontSize : 30,
    color : 'green',
  },

  logo : {
    height: 50,
    width : 50,
  },

  loginStatus : {
    flexDirection : 'row',
    gap : 10,
  },

  authContainer : {
    backgroundColor: '#007bff',
    padding : 6,
    borderRadius : 6,
  },

  pressed : {
    opacity : 0.8,
  },

  authText : {
    color : 'white',
    fontWeight : 700,
  },
})