import { Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { get_user, get_user_img, get_user_list } from '../../apis/userApi';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { axiosInstance } from '../../apis/axiosInstance';
import FormData from 'form-data';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const edit = () => {
  const router = useRouter();
  
  //이미지 경로 표시
  const [imageUrl, setImageUrl] = useState('');

  //현재 변경할 데이터
  const [editData, setEditData] = useState(null);

  //변경할 이미지 데이터
  const [userImg, setUserImg] = useState(null);


//////////////////////////////////////////////////////////////////////////
  // 모든 회원 정보를 담는 함수
  const [userList, setUserList] = useState({});

  // 상태 설정: 비밀번호 변경 여부
  const [changePw, setChangePw] = useState(false);
  
  // 에러 메세지
  const [errorMsg, setErrorMsg] = useState({});
//////////////////////////////////////////////////////////////////////////


  useEffect(() => {
    const fetchEdit = async () => {
      try {
        const response = await get_user();
        const data = response.data;
        setEditData({
          userId: data.userId ?? '',
          userPw: '',
          confirmPw : '',
          userAge : data.userAge ?? '',
          userTel: data.userTel ?? '',
          userEmail: data.userEmail ?? '',
          userAddr: data.userAddr ?? ''
        });
      } catch (err) {
        console.error('회원 정보 불러오기 실패:', err);
      }
    };

    const fetchImg = async () => {
      try {
        const response = await get_user_img()
        setUserImg(response.data);
      } catch(err){
        console.log(err)
      }
    };

    const fetchUserList = async () => {
      try {
        const response = await get_user_list();
        setUserList(response.data);
      }catch (err) { console.log(err) }
    };
    
    fetchEdit();
    fetchImg();
    fetchUserList();
  } , []);


  //회원 이미지 경로 불러오는 함수
  useEffect(() => {
    if(!editData) return;

    const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';

    const fetchImage = async () => {
      try {
        const response = await axios.get(`${baseURL}/users/${editData.userId}/image`);
        setImageUrl(response.config.url);
      } catch (err) {
        console.error('이미지 불러오기 실패:', err);
      }
    };

    fetchImage();
    
  } , [editData]);

  //새로운 이미지 선택
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // 1. mediaTypes 수정
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const selectedImage = result.assets[0];
      await handleImageUpdate(selectedImage); // 2. 분리된 처리 함수 호출
      return true;
    }
    return false;
  };

  //이미지는 변경시 db데이터 삭제 후 다시 등록하게 되어 있음(중복 방지) ///////////////////////
  //이미지 삭제하는 함수
  const deleteImage = async () => {
    try {
      const response = await axiosInstance.delete(`/users/${editData.userId}/image`);
      return response;
    } catch (err) {
      console.log('삭제 에러', err);
      return null;
    }
  };

  //이미지 삭제 후 업로드 기능
  const handleImageUpdate = async (selectedImage) => {
    // 3. 즉시 UI 업데이트
    setImageUrl(selectedImage.uri);
    
    try {
      // 4. 삭제 & 업로드 동시 처리
      if (imageUrl) {
        const deleteResponse = await deleteImage();
        if (!deleteResponse || deleteResponse.status !== 200) {
          throw new Error('이미지 삭제 실패');
        }
      }
  
      // 5. FormData 생성
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage.uri,
        name: selectedImage.fileName || 'image.jpg',
        type: selectedImage.mimeType || 'image/jpeg',
      });
  
      // 6. 업로드 실행
      const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
      await axios.post(
        `${baseURL}/users/${editData.userId}`, // 7. 엔드포인트 수정
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      alert('이미지 변경 완료!');
    } catch (error) {
      console.error('처리 실패:', error);
      alert('이미지 업로드 중 오류 발생');
      setImageUrl(''); // 8. 실패 시 UI 롤백
    }
  };
  /////////////////////////////////////////////////////////////////////////////////////



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

    setEditData({ ...editData, [field]: formattedValue });
    if (errorMsg[field]) {
      setErrorMsg({ ...errorMsg, [field]: '' });
    }
  };

  console.log(editData);

  return (
    <View style={styles.container}>
      {
        imageUrl 
          ? <Image source={{ uri: `${imageUrl}?ts=${Date.now()}` }} style={styles.userImg} />
          : (
            <FontAwesome 
              style={styles.img_upload} 
              name="user-circle" 
              size={100} 
              color="black" 
            />
          )
      }
      {editData && <Text>{editData.userId}</Text>}
      <View style={styles.img_btn_container}>
        <Pressable style={styles.change_btn} 
          onPress={pickImage}
        >
          <Text style={styles.btn_text}>
            {imageUrl ? "사진 변경" : "사진 등록"}
          </Text>
        </Pressable>
  
        <Pressable style={styles.change_btn} 
          onPress={() => {deleteImage}}
        >
          <Text style={styles.btn_text}>
            사진 삭제
          </Text>
        </Pressable>
      </View>

      
      {
        editData &&
        <View>
          <View>
            <TextInput 
              style={styles.user_info_inp} 
              value={editData.userId} 

            />
            {errorMsg.userId && <Text style={styles.errorMsg}>{errorMsg.userId}</Text>}
          </View>
        </View>
      }
      

      <Pressable style={styles.change_btn} onPress={() => {router.replace('/(home)')}}>
        <Text style={styles.btn_text}>취소</Text>
      </Pressable>
    </View>
  )
  
}

export default edit

const styles = StyleSheet.create({
  container : {
    alignItems : 'center',
  },

  userImg : {
    borderWidth : 1,
    borderRadius : 100,
    width : 100,
    height : 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // 내부 텍스트 넘침 방지
  },

  img_btn_container : {
    flexDirection : 'row',
    gap : 10,
  },

  change_btn : {
    width : 80,
    height : 44,
    padding : 6,
    justifyContent : 'center',
    alignItems : 'center',
    borderRadius : 5,
    backgroundColor: '#007bff',
    marginVertical : 10,
  },

  btn_text : {
    color: 'white',
    fontWeight: 'bold',
  },

  user_info_inp : {
    borderWidth : 1,
    borderRadius : 10,
    padding : 6,
  },


  error: {
    borderBottomColor: 'red',
  },

  errorMsg: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
})