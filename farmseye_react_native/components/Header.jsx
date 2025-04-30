import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux';
import { getUserSubFromToken } from '../redux/authHelper';
import * as SecureStore from 'expo-secure-store';
import { logoutReducer } from '../redux/authSlice';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Header = () => {
  const router = useRouter();

  const [dropDown, setDropDown] = useState(false);

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
      setDropDown(false);
      router.replace('/');
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
      

      
          <View style={styles.user_info}>
            {
              imageUrl ? 
              <Pressable onPress={() => setDropDown(!dropDown)}>
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
            
          </View>
        

      {
        dropDown && 
        <View style={styles.dropDown}>
          <Pressable
            style={({pressed}) => [ styles.drop_menu, pressed && styles.pressed ]}
            onPress={() => router.push('/auth/edit')}
          >
            <FontAwesome5 name="user-edit" size={22} color={'#007bff'}/>
            <Text style={{color : '#007bff', fontWeight : 'bold'}}>정보 수정</Text>
          </Pressable>

          <Pressable 
            style={({pressed}) => [ styles.drop_menu, pressed && styles.pressed ]}
            onPress={handleLogout}
          >
            <FontAwesome name="power-off" size={24} color={'#007bff'}/>
            <Text style={{color : '#007bff', fontWeight : 'bold'}}>로그 아웃</Text>
          </Pressable>
        </View>
      }
      
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  headerContainder : {
    backgroundColor : 'white',
    borderBottomWidth : 0.5,
    borderLeftWidth : 0.5,
    borderRightWidth : 0.5,
    borderBottomLeftRadius : 12,
    borderBottomRightRadius : 12,
    flexDirection: 'row',
    justifyContent : 'space-between',
    alignItems : 'center',
    paddingHorizontal : 20,
    paddingVertical : 8,
    height : 70,
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
    flexDirection : 'row',
    alignItems : 'center',
    gap : 10,
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation : 12,
    borderRadius : 25,
    width : 50,
    height : 50,
  },

  dropDown : {
    padding : 6,
    position : 'absolute',
    zIndex : 99,
    top : 74,
    right : 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation : 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    gap : 16,
  },

  drop_menu : {
    flexDirection : 'row',
    justifyContent : 'space-between',
    padding : 6,
    gap : 10,
  },
})