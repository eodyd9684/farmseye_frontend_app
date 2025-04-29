import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux';
import { getUserSubFromToken } from '../redux/authHelper';
import * as SecureStore from 'expo-secure-store';
import { logoutReducer } from '../redux/authSlice';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';


const Header = () => {
  const router = useRouter();

  const auth = useSelector(state => state.auth);
  
  //회원 이미지 다운로드 요청시 보낼 회원 아이디 정보
  const [userId, setUserId] = useState(null);

  //이미지 경로 표시
  const [imageUrl, setImageUrl] = useState('');

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


  useEffect(() => {
    const fetchUserId = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      const id = getUserSubFromToken(token);
      if (id) {
        setUserId(id); // 이후 이 값이 바뀌면 다음 useEffect가 실행됨
      }
    };
  
    fetchUserId();
  }, []);
  
  useEffect(() => {
    if (!userId) return;
  
    const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';

    const fetchImage = async () => {
      try {
        const response = await axios.get(`${baseURL}/users/${userId}/image`);
        setImageUrl(response.config.url);
      } catch (err) {
        console.error('이미지 불러오기 실패:', err);
      }
    };
  
    fetchImage();
  }, [userId]);
  
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
          <View style={styles.user_info}>
            {
              imageUrl ? 
              <Pressable onPress={() => router.push('/auth/edit')}>
                <Image source={{uri : `${imageUrl}?ts=${Date.now()}`}} style={styles.userImg} />
              </Pressable> 
              : 
              <Pressable onPress={() => router.push('/auth/edit')}>
                <FontAwesome 
                  style={styles.img_upload} 
                  name="user-circle" 
                  size={50} 
                  color="black" 
                />
              </Pressable>
            }
            
            <Pressable 
              style={({pressed}) => [ styles.authContainer, pressed && styles.pressed ]}
              onPress={handleLogout}
            >
              <Text style={styles.authText}>Logout</Text>
            </Pressable>
          </View>
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
    borderBottomWidth : 1,
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

  user_info : {
    flexDirection : 'row',
    alignItems : 'center',
    gap : 10,
  },

  userImg : {
    borderWidth : 1,
    borderRadius : 25,
    width : 50,
    height : 50,
  },
})