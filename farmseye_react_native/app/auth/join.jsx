import { StyleSheet, Text, TextInput, View, Alert, Pressable, Platform, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { api_join } from '../../apis/userApi';
import { api_user_list } from '../../apis/userApi';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';
import axios from 'axios';

const JoinScreen = () => {
  const router = useRouter();

  //선택 이미지 저장할 변수
  const [mainImg, setMainImg] = useState(null);

  // State variables
  const [checkList, setCheckList] = useState(null);
  
  //에러 메세지 저장 변수
  const [errorMsg, setErrorMsg] = useState({});

  //요청 보낼시 입력받은 데이터 저장할 변수
  const [joinData, setJoinData] = useState({
    userId: '',
    userPw: '',
    userPwConfirm: '', // 비밀번호 확인 필드 추가
    userName: '',
    userAge: 0,
    userTel: '',
    userEmail: '',
    userAddr: '',
    userImg : null,
  });

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append('file', {
      uri : mainImg.uri,
      name : mainImg.fileName,
      type : mainImg.mimeType
    })
    
    const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080'
    try {
      const response = await axios.post(
        `${baseURL}/users`,
        formData,
        { headers : { 'Content-Type': 'multipart/form-data' } })
        console.log(response.data);
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    fetchUserList();

    // 파일 업로드 갤러리 접근 권한 요청 코드 //////////////////
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('갤러리 접근 권한이 필요합니다!');
        }
      }
    })();
    //////////////////////////////////////////////////////////
  }, []);

  useEffect(() => {
    if(mainImg) {
      console.log(mainImg)
    };
  }, [mainImg]);

  // 이미지 선택 함수
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMainImg(result.assets[0]); // 이미지 경로 저장
    }
  };

  // 데이터베이스 기존 회원 목록 조회해서 checkList 변수에 항목 저장할 함수
  const fetchUserList = async () => {
    try {
      const res = await api_user_list();
      setCheckList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  //입력 데이터 정규식 검사 및 joinData 데이터 변경 함수
  const handleChange = (field, value) => {
    let formattedValue = value;
    if (field === 'userTel') {
      formattedValue = value.replace(/[^0-9]/g, '');
      if (formattedValue.length > 11) {
        formattedValue = formattedValue.slice(0, 11);
      }
      if (formattedValue.startsWith('02')) {
        if (formattedValue.length > 2 && formattedValue.length <= 5) {
          formattedValue = formattedValue.replace(/(\d{2})(\d{0,3})/, '$1-$2');
        } else if (formattedValue.length > 5) {
          formattedValue = formattedValue.replace(/(\d{2})(\d{3,4})(\d{0,4})/, '$1-$2-$3');
        }
      } else {
        if (formattedValue.length > 3 && formattedValue.length <= 7) {
          formattedValue = formattedValue.replace(/(\d{3})(\d{0,4})/, '$1-$2');
        } else if (formattedValue.length > 7) {
          formattedValue = formattedValue.replace(/(\d{3})(\d{3,4})(\d{0,4})/, '$1-$2-$3');
        }
      }
      formattedValue = formattedValue.replace(/-$/, '');
    }

    setJoinData({ ...joinData, [field]: formattedValue });
    if (errorMsg[field]) {
      setErrorMsg({ ...errorMsg, [field]: '' });
    }
  };

  const joinValiData = () => {
    let result = 0;

    setErrorMsg({
      userId: '',
      userPw: '',
      userPwConfirm: '', // 비밀번호 확인 에러 메시지
      userName: '',
      userEmail: '',
      userTel: '',
      userAddr: '',
    });

    const regex_id = /^[A-Za-z0-9]{4,16}$/;
    const regex_pw = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;
    const regex_tel = /^(01[0-9])-([0-9]{3,4})-([0-9]{4})$|^(0[2-9]{1})-([0-9]{3,4})-([0-9]{4})$/;

    if (!regex_id.test(joinData.userId)) {
      result = 1;
      setErrorMsg(prev => ({ ...prev, userId: "잘못된 아이디 입니다." }));
    }

    if (!regex_pw.test(joinData.userPw)) {
      result = 1;
      setErrorMsg(prev => ({ ...prev, userPw: "잘못된 비밀번호 입니다." }));
    }

    // 비밀번호 확인 로직 추가
    if (joinData.userPw !== joinData.userPwConfirm) {
      result = 1;
      setErrorMsg(prev => ({ ...prev, userPwConfirm: "비밀번호가 일치하지 않습니다." }));
    }

    if (!regex_tel.test(joinData.userTel)) {
      result = 1;
      setErrorMsg(prev => ({ ...prev, userTel: "잘못된 전화번호 입니다." }));
    }

    return result;
  };

  //필수 입력값 유효성 검사 및 가입 요청 함수
  const insertUser = async () => {
    const result = joinValiData();
    const newErrors = {};

    if (!joinData.userId.trim()) newErrors.userId = '아이디 : 필수 정보입니다.';
    if (!joinData.userPw.trim()) newErrors.userPw = '비밀번호 : 필수 정보입니다.';
    if (!joinData.userPwConfirm.trim()) newErrors.userPwConfirm = '비밀번호가 일치하지 않습니다.';
    if (!joinData.userEmail.trim()) newErrors.userEmail = '이메일 : 필수 정보입니다.';
    if (!joinData.userName.trim()) newErrors.userName = '이름 : 필수 정보입니다.';
    if (!joinData.userAddr.trim()) newErrors.userAddr = '주소 : 필수 정보입니다.';
    if (!joinData.userTel.trim()) newErrors.userTel = '전화번호 : 필수 정보입니다.';

    if (Object.keys(newErrors).length > 0) {
      setErrorMsg(newErrors);
      return;
    }

    const isIdDuplicate = checkList?.some(user => user.userId === joinData.userId);
    const isEmailDuplicate = checkList?.some(user => user.userEmail === joinData.userEmail);
    const isTelDuplicate = checkList?.some(user => user.userTel === joinData.userTel);

    const duplicateErrors = {};
    if (isIdDuplicate) duplicateErrors.userId = '이미 존재하는 아이디입니다.';
    if (isEmailDuplicate) duplicateErrors.userEmail = '이미 존재하는 이메일입니다.';
    if (isTelDuplicate) duplicateErrors.userTel = '이미 존재하는 전화번호입니다.';

    if (Object.keys(duplicateErrors).length > 0) {
      setErrorMsg(prev => ({ ...prev, ...duplicateErrors }));
      return;
    }


    if (result === 0) {
      try {
        const res = await api_join(joinData);
        if (res.status === 200) {
          Alert.alert('회원가입 성공!!');
          router.replace('/(home)');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.logo}>FarmsEye</Text>

      <View style={styles.inputGroup}>
        <View>
          
          {mainImg ? 
            <Image 
              source={{ uri: mainImg.uri }} 
              style={styles.img_upload} 
            />
            :
            <FontAwesome 
              style={styles.img_upload} 
              name="user-circle" 
              size={100} 
              color="black" 
            />
          }
          <Pressable onPress={pickImage} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>이미지 선택하기</Text>
          </Pressable>

          <Pressable onPress={uploadImage} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>저장</Text>
          </Pressable>
        </View>

        <View style={[styles.inputLine, errorMsg.userId && styles.error]}>
          <TextInput
            style={styles.input}
            placeholder="아이디"
            value={joinData.userId}
            onChangeText={(text) => handleChange('userId', text)}
          />
        </View>
        {errorMsg.userId && <Text style={styles.errorMsg}>{errorMsg.userId}</Text>}

        <View style={[styles.inputLine, errorMsg.userPw && styles.error]}>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 (영어 대/소문자 + 숫자 포함)"
            secureTextEntry={true}
            value={joinData.userPw}
            onChangeText={(text) => handleChange('userPw', text)}
          />
        </View>
        {errorMsg.userPw && <Text style={styles.errorMsg}>{errorMsg.userPw}</Text>}

        <View style={[styles.inputLine, errorMsg.userPwConfirm && styles.error]}>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 확인"
            secureTextEntry={true}
            value={joinData.userPwConfirm}
            onChangeText={(text) => handleChange('userPwConfirm', text)}
          />
        </View>
        {errorMsg.userPwConfirm && <Text style={styles.errorMsg}>{errorMsg.userPwConfirm}</Text>}

        <View style={[styles.inputLine, errorMsg.userName && styles.error]}>
          <TextInput
            style={styles.input}
            placeholder="이름"
            value={joinData.userName}
            onChangeText={(text) => handleChange('userName', text)}
          />
        </View>
        {errorMsg.userName && <Text style={styles.errorMsg}>{errorMsg.userName}</Text>}

        <View style={[styles.inputLine]}>
          <TextInput
            style={styles.input}
            placeholder="나이"
            value={joinData.userAge}
            onChangeText={(text) => handleChange('userAge', text)}
            keyboardType="number-pad"
          />
        </View>

        <View style={[styles.inputLine, errorMsg.userTel && styles.error]}>
          <TextInput
            style={styles.input}
            placeholder="전화번호 입력 ( - 없이)"
            keyboardType="phone-pad"
            value={joinData.userTel}
            onChangeText={(text) => handleChange('userTel', text)}
          />
        </View>
        {errorMsg.userTel && <Text style={styles.errorMsg}>{errorMsg.userTel}</Text>}

        <View style={[styles.inputLine, errorMsg.userEmail && styles.error]}>
          <TextInput
            style={styles.input}
            placeholder="이메일 (비밀번호 찾기 등 본인 확인용)"
            value={joinData.userEmail}
            onChangeText={(text) => handleChange('userEmail', text)}
          />
        </View>
        {errorMsg.userEmail && <Text style={styles.errorMsg}>{errorMsg.userEmail}</Text>}

        <View style={[styles.inputLine, errorMsg.userAddr && styles.error]}>
          <TextInput
            style={styles.input}
            placeholder="주소"
            value={joinData.userAddr}
            onChangeText={(text) => handleChange('userAddr', text)}
          />
        </View>
        {errorMsg.userAddr && <Text style={styles.errorMsg}>{errorMsg.userAddr}</Text>}

        <Pressable style={styles.submitButton} onPress={insertUser}>
          <Text style={styles.submitButtonText}>가입요청</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default JoinScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '80%',
    marginHorizontal: 'auto',
    padding: 20,
  },

  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  inputGroup: {
    marginBottom: 20, // inputGroup 스타일 추가
  },

  inputLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop : 4,
    borderRadius : 6,
    padding : 6,
    borderWidth: 1,
    border: '#ccc',
  },

  input: {
    flex: 1,
    paddingVertical: 10,
  },

  error: {
    borderBottomColor: 'red',
  },

  errorMsg: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },

  submitButton: {
    width : 120,
    height : 44,
    backgroundColor: '#007bff',
    justifyContent : 'center',
    borderRadius: 5,
    alignItems: 'center',
    marginTop : 10,
    marginHorizontal : 'auto',
  },

  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  img_upload : {
    borderRadius : 50,
    width : 100,
    height : 100,
    marginHorizontal : 'auto',
  },
});
