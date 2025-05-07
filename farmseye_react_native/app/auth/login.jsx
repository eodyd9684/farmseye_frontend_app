import { Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, Alert, Image, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { api_login } from '../../apis/userApi';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { loginReducer } from '../../redux/authSlice';

const { width } = Dimensions.get('window');
const images = [
  require('@/assets/images/banner1.jpg'),
  require('@/assets/images/banner2.png'),
  require('@/assets/images/banner3.png'),
  require('@/assets/images/banner4.jpg'),
  require('@/assets/images/banner5.png'),
];

// 더미 이미지 추가
const extendedImages = [
  images[images.length - 1], // 마지막 이미지(앞에)
  ...images,
  images[0], // 첫번째 이미지(뒤에)
];

const LoginScreen = () => {

  const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(1); // extendedImages 기준
  
    // 자동 슬라이드
    useEffect(() => {
      const timer = setInterval(() => {
        let nextIndex = currentIndex + 1;
        scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
        setCurrentIndex(nextIndex);
      }, 7000);
  
      return () => clearInterval(timer);
    }, [currentIndex]);
  
    // 스크롤 이벤트 핸들러
    const onMomentumScrollEnd = (e) => {
      let offsetX = e.nativeEvent.contentOffset.x;
      let pageIndex = Math.round(offsetX / width);
  
      // 맨 뒤(더미)로 넘어갔을 때 → 진짜 첫번째로 점프
      if (pageIndex === extendedImages.length - 1) {
        scrollRef.current?.scrollTo({ x: width, animated: false });
        setCurrentIndex(1);
      }
      // 맨 앞(더미)로 넘어갔을 때 → 진짜 마지막으로 점프
      else if (pageIndex === 0) {
        scrollRef.current?.scrollTo({ x: (images.length) * width, animated: false });
        setCurrentIndex(images.length);
      }
      else {
        setCurrentIndex(pageIndex);
      }
    };
  
    // 첫 렌더링 시 첫 이미지로 이동
    useEffect(() => {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: width, animated: false });
      }, 0);
    }, []);

  ///////////////////////////////////////////////////////////////////

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

        <View style={styles.logoView}>
          <Image 
            resizeMethod='contain'
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
          />
          
          <Text style={styles.headerTitle}>FarmsEye</Text>
        </View>

        <View style={styles.slide}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            onMomentumScrollEnd={onMomentumScrollEnd}
          >
            {extendedImages.map((img, index) => (
              <Image key={index} source={img} style={styles.image} />
            ))}
          </ScrollView>
        </View>

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

        <Pressable style={styles.button} onPress={() => router.replace('/auth/join')}>
          <Text style={styles.buttonText}>회원가입</Text>
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

  logoView : {
    flexDirection : 'row', 
    alignItems:'center',
    marginHorizontal : 'auto',
    marginBottom : 12,
  },

  headerTitle : {
    fontSize : 44,
    color : 'green',
  },

  logo : {
    height: 60,
    width : 60,
  },

  image: {
    width: width,
    height: 200,
    resizeMode: 'cover',
  },

  slide : {
    borderRadius : 16,
    overflow : 'hidden',
    marginBottom : 12,
    opacity : 0.7,
  },
});
