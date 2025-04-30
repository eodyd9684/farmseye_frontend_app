// import { Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { get_user, get_user_img, get_user_list, update_user } from '../../apis/userApi';
// import axios from 'axios';
// import * as ImagePicker from 'expo-image-picker';
// import { axiosInstance } from '../../apis/axiosInstance';
// import FormData from 'form-data';
// import { useRouter } from 'expo-router';
// import FontAwesome from '@expo/vector-icons/FontAwesome';

// const edit = () => {
//   const router = useRouter();
  
//   //이미지 경로 표시
//   const [imageUrl, setImageUrl] = useState('');

//   //현재 변경할 데이터
//   const [editData, setEditData] = useState(null);

//   //변경할 이미지 데이터
//   const [userImg, setUserImg] = useState(null);


// //////////////////////////////////////////////////////////////////////////
//   // 모든 회원 정보를 담는 함수
//   const [userList, setUserList] = useState({});

//   // 상태 설정: 비밀번호 변경 여부
//   const [changePw, setChangePw] = useState(false);
  
//   // 에러 메세지
//   const [errorMsg, setErrorMsg] = useState({});
// //////////////////////////////////////////////////////////////////////////


//   useEffect(() => {
//     const fetchEdit = async () => {
//       try {
//         const response = await get_user();
//         const data = response.data;
//         setEditData({
//           userId: data.userId ?? '',
//           userPw: '',
//           confirmPw : '',
//           userAge : data.userAge ?? '',
//           userTel: data.userTel ?? '',
//           userEmail: data.userEmail ?? '',
//           userAddr: data.userAddr ?? ''
//         });
//       } catch (err) {
//         console.error('회원 정보 불러오기 실패:', err);
//       }
//     };

//     const fetchImg = async () => {
//       try {
//         const response = await get_user_img()
//         setUserImg(response.data);
//       } catch(err){
//         console.log(err)
//       }
//     };

//     const fetchUserList = async () => {
//       try {
//         const response = await get_user_list();
//         setUserList(response.data);
//       }catch (err) { console.log(err) }
//     };
    
//     fetchEdit();
//     fetchImg();
//     fetchUserList();
//   } , []);


//   //회원 이미지 경로 불러오는 함수
//   useEffect(() => {
//     if(!editData) return;

//     const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';

//     const fetchImage = async () => {
//       try {
//         const response = await axios.get(`${baseURL}/users/${editData.userId}/image`);
//         setImageUrl(response.config.url);
//       } catch (err) {
//         console.error('이미지 불러오기 실패:', err);
//       }
//     };

//     fetchImage();
    
//   } , [editData]);

//   //새로운 이미지 선택
//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images, // 1. mediaTypes 수정
//       allowsEditing: true,
//       aspect: [3, 3],
//       quality: 1,
//     });
  
//     if (!result.canceled) {
//       const selectedImage = result.assets[0];
//       await handleImageUpdate(selectedImage); // 2. 분리된 처리 함수 호출
//       return true;
//     }
//     return false;
//   };

//   //이미지는 변경시 db데이터 삭제 후 다시 등록하게 되어 있음(중복 방지) ///////////////////////
//   //이미지 삭제하는 함수
//   const deleteImage = async () => {
//     try {
//       const response = await axiosInstance.delete(`/users/${editData.userId}/image`);
//       return response;
//     } catch (err) {
//       console.log('삭제 에러', err);
//       return null;
//     }
//   };

//   //이미지 삭제 후 업로드 기능
//   const handleImageUpdate = async (selectedImage) => {
//     // 3. 즉시 UI 업데이트
//     setImageUrl(selectedImage.uri);
    
//     try {
//       // 4. 삭제 & 업로드 동시 처리
//       if (imageUrl) {
//         const deleteResponse = await deleteImage();
//         if (!deleteResponse || deleteResponse.status !== 200) {
//           throw new Error('이미지 삭제 실패');
//         }
//       }
  
//       // 5. FormData 생성
//       const formData = new FormData();
//       formData.append('file', {
//         uri: selectedImage.uri,
//         name: selectedImage.fileName || 'image.jpg',
//         type: selectedImage.mimeType || 'image/jpeg',
//       });
  
//       // 6. 업로드 실행
//       const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
//       await axios.post(
//         `${baseURL}/users/${editData.userId}`, // 7. 엔드포인트 수정
//         formData,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
  
//       alert('이미지 변경 완료!');
//     } catch (error) {
//       console.error('처리 실패:', error);
//       alert('이미지 업로드 중 오류 발생');
//       setImageUrl(''); // 8. 실패 시 UI 롤백
//     }
//   };
//   /////////////////////////////////////////////////////////////////////////////////////

//   //유효성 검사
//   const joinValiData = () => {
//     let result = 0;

//     setErrorMsg({
//       userId: '',
//       userPw: '',
//       userPwConfirm: '', // 비밀번호 확인 에러 메시지
//       userName: '',
//       userEmail: '',
//       userTel: '',
//       userAddr: '',
//     });

//     const regex_id = /^[A-Za-z0-9]{4,16}$/;
//     const regex_pw = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;
//     const regex_tel = /^(01[0-9])-([0-9]{3,4})-([0-9]{4})$|^(0[2-9]{1})-([0-9]{3,4})-([0-9]{4})$/;

//     if (!regex_id.test(joinData.userId)) {
//       result = 1;
//       setErrorMsg(prev => ({ ...prev, userId: "잘못된 아이디 입니다." }));
//     }

//     if (!regex_pw.test(joinData.userPw)) {
//       result = 1;
//       setErrorMsg(prev => ({ ...prev, userPw: "잘못된 비밀번호 입니다." }));
//     }

//     // 비밀번호 확인 로직 추가
//     if (joinData.userPw !== joinData.userPwConfirm) {
//       result = 1;
//       setErrorMsg(prev => ({ ...prev, userPwConfirm: "비밀번호가 일치하지 않습니다." }));
//     }

//     if (!regex_tel.test(joinData.userTel)) {
//       result = 1;
//       setErrorMsg(prev => ({ ...prev, userTel: "잘못된 전화번호 입니다." }));
//     }

//     return result;
//   };

//   //입력 데이터 정규식 검사 및 joinData 데이터 변경 함수
//   const handleChange = (field, value) => {
//     let formattedValue = value;
//     if (field === 'userTel') {
//       formattedValue = value.replace(/[^0-9]/g, '');
//       if (formattedValue.length > 11) {
//         formattedValue = formattedValue.slice(0, 11);
//       }
//       if (formattedValue.startsWith('02')) {
//         if (formattedValue.length > 2 && formattedValue.length <= 5) {
//           formattedValue = formattedValue.replace(/(\d{2})(\d{0,3})/, '$1-$2');
//         } else if (formattedValue.length > 5) {
//           formattedValue = formattedValue.replace(/(\d{2})(\d{3,4})(\d{0,4})/, '$1-$2-$3');
//         }
//       } else {
//         if (formattedValue.length > 3 && formattedValue.length <= 7) {
//           formattedValue = formattedValue.replace(/(\d{3})(\d{0,4})/, '$1-$2');
//         } else if (formattedValue.length > 7) {
//           formattedValue = formattedValue.replace(/(\d{3})(\d{3,4})(\d{0,4})/, '$1-$2-$3');
//         }
//       }
//       formattedValue = formattedValue.replace(/-$/, '');
//     }

//     setEditData({ ...editData, [field]: formattedValue });
//     if (errorMsg[field]) {
//       setErrorMsg({ ...errorMsg, [field]: '' });
//     }
//   };


//   //필수 입력값 유효성 검사 및 가입 요청 함수
//   const insertUser = async () => {
//       const result = joinValiData();
//       const newErrors = {};
  
//       if (!joinData.userId.trim()) newErrors.userId = '아이디 : 필수 정보입니다.';
//       if (!joinData.userPw.trim()) newErrors.userPw = '비밀번호 : 필수 정보입니다.';
//       if (!joinData.userPwConfirm.trim()) newErrors.userPwConfirm = '비밀번호가 일치하지 않습니다.';
//       if (!joinData.userEmail.trim()) newErrors.userEmail = '이메일 : 필수 정보입니다.';
//       if (!joinData.userName.trim()) newErrors.userName = '이름 : 필수 정보입니다.';
//       if (!joinData.userAddr.trim()) newErrors.userAddr = '주소 : 필수 정보입니다.';
//       if (!joinData.userTel.trim()) newErrors.userTel = '전화번호 : 필수 정보입니다.';
  
//       if (Object.keys(newErrors).length > 0) {
//         setErrorMsg(newErrors);
//         return false;
//       }
  
//       const isIdDuplicate = checkList?.some(user => user.userId === joinData.userId);
//       const isEmailDuplicate = checkList?.some(user => user.userEmail === joinData.userEmail);
//       const isTelDuplicate = checkList?.some(user => user.userTel === joinData.userTel);
  
//       const duplicateErrors = {};
//       if (isIdDuplicate) duplicateErrors.userId = '이미 존재하는 아이디입니다.';
//       if (isEmailDuplicate) duplicateErrors.userEmail = '이미 존재하는 이메일입니다.';
//       if (isTelDuplicate) duplicateErrors.userTel = '이미 존재하는 전화번호입니다.';
  
//       if (Object.keys(duplicateErrors).length > 0) {
//         setErrorMsg(prev => ({ ...prev, ...duplicateErrors }));
//         return false;
//       }
  
// //////////////// 회원 정보 수정 요청 ///////////////////////////////
//       if (result === 0) {
//         try {
//           const res = await update_user(editData);
//           if (res.status === 200) {
//             Alert.alert('정보 수정 완료 !!');
//             router.replace('/(home)');
//             return true;
//           }
//         } catch (error) {
//           console.error(error);
//         }
//       }
// //////////////////////////////////////////////////////////////
//       return false;
//     };


//   return (
//     <View style={styles.container}>
//       {
//         imageUrl 
//           ? <Image source={{ uri: `${imageUrl}?ts=${Date.now()}` }} style={styles.userImg} />
//           : (
//             <FontAwesome 
//               style={styles.img_upload} 
//               name="user-circle" 
//               size={100} 
//               color="black" 
//             />
//           )
//       }
//       {editData && <Text>{editData.userId}</Text>}
//       <View style={styles.img_btn_container}>
//         <Pressable style={styles.change_btn} 
//           onPress={pickImage}
//         >
//           <Text style={styles.btn_text}>
//             {imageUrl ? "사진 변경" : "사진 등록"}
//           </Text>
//         </Pressable>
  
//         <Pressable style={styles.change_btn} 
//           onPress={() => {deleteImage}}
//         >
//           <Text style={styles.btn_text}>
//             사진 삭제
//           </Text>
//         </Pressable>
//       </View>

      
//       {
//         editData &&
//         <View>
//           <View style={styles.input_change}>
//             <Text style={styles.inp_guide}>아이디</Text>
//             <TextInput 
//               style={styles.user_info_inp} 
//               value={editData.userId} 
//               onChangeText={(text) => {handleChange('userId', text)}}
//             />
//             {errorMsg.userId && <Text style={styles.errorMsg}>{errorMsg.userId}</Text>}
//           </View>

//           {
//             changePw ? 
//             <>
//               <View style={styles.input_change}>
//                 <Text style={styles.inp_guide}>비밀번호</Text>
//                 <TextInput 
//                   style={styles.user_info_inp} 
//                   value={editData.userPw} 
//                   onChangeText={(text) => {handleChange('userPw', text)}}
//                 />
//                 {errorMsg.userPw && <Text style={styles.errorMsg}>{errorMsg.userPw}</Text>}
//               </View>
    
//               <View style={styles.input_change}>
//                 <Text style={styles.inp_guide}>비밀번호 확인</Text>
//                 <TextInput 
//                   style={styles.user_info_inp} 
//                   value={editData.userPwConfirm} 
//                   onChangeText={(text) => {handleChange('userPwConfirm', text)}}
//                 />
//                 {errorMsg.userPwConfirm && <Text style={styles.errorMsg}>{errorMsg.userPwConfirm}</Text>}
//               </View>
//               <Pressable style={styles.change_pw} onPress={() => setChangePw(false)}>
//                 <Text style={styles.change_pw_text}>취소</Text>
//               </Pressable>
//             </>
//             :
//             <Pressable style={styles.change_pw} onPress={() => setChangePw(true)}>
//               <Text style={styles.change_pw_text}>비밀번호 변경</Text>
//             </Pressable>
//           }
          

//           <View style={styles.input_change}>
//             <Text style={styles.inp_guide}>나이</Text>
//             <TextInput 
//               style={styles.user_info_inp} 
//               value={editData.userAge} 
//               onChangeText={(text) => {handleChange('userAge', text)}}
//             />
//             {errorMsg.userAge && <Text style={styles.errorMsg}>{errorMsg.userAge}</Text>}
//           </View>

//           <View style={styles.input_change}>
//             <Text style={styles.inp_guide}>전화번호</Text>
//             <TextInput 
//               style={styles.user_info_inp} 
//               value={editData.userTel} 
//               onChangeText={(text) => {handleChange('userTel', text)}}
//             />
//             {errorMsg.userTel && <Text style={styles.errorMsg}>{errorMsg.userTel}</Text>}
//           </View>

//           <View style={styles.input_change}>
//             <Text style={styles.inp_guide}>이메일</Text>
//             <TextInput 
//               style={styles.user_info_inp} 
//               value={editData.userEmail} 
//               onChangeText={(text) => {handleChange('userEmail', text)}}
//             />
//             {errorMsg.userEmail && <Text style={styles.errorMsg}>{errorMsg.userEmail}</Text>}
//           </View>

//           <View style={styles.input_change}>
//             <Text style={styles.inp_guide}>주소</Text>
//             <TextInput 
//               style={styles.user_info_inp} 
//               value={editData.userAddr} 
//               onChangeText={(text) => {handleChange('userAddr', text)}}
//             />
//             {errorMsg.userAddr && <Text style={styles.errorMsg}>{errorMsg.userAddr}</Text>}
//           </View>
//         </View>
//       }
      
//       <Pressable style={styles.change_btn} onPress={() => {insertUser();}}>
//         <Text style={styles.btn_text}>변경</Text>
//       </Pressable>

//       <Pressable style={styles.change_btn} onPress={() => {router.replace('/(home)')}}>
//         <Text style={styles.btn_text}>취소</Text>
//       </Pressable>
//     </View>
//   )
  
// }

// export default edit

// const styles = StyleSheet.create({
//   container : {
//     alignItems : 'center',
//   },

//   userImg : {
//     borderWidth : 1,
//     borderRadius : 100,
//     width : 100,
//     height : 100,
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden', // 내부 텍스트 넘침 방지
//   },

//   img_btn_container : {
//     flexDirection : 'row',
//     gap : 10,
//   },

//   change_btn : {
//     width : 80,
//     height : 44,
//     padding : 6,
//     justifyContent : 'center',
//     alignItems : 'center',
//     borderRadius : 5,
//     backgroundColor: '#007bff',
//     marginVertical : 10,
//   },

//   btn_text : {
//     color: 'white',
//     fontWeight: 'bold',
//   },

//   input_change : {
//     borderWidth : 1,
//     width : 300,
//   },

//   user_info_inp : {
//     borderWidth : 1,
//     borderRadius : 10,
//     padding : 6,
//     width : '100%',
//   },


//   error: {
//     borderBottomColor: 'red',
//   },

//   errorMsg: {
//     color: 'red',
//     fontSize: 12,
//     marginTop: 5,
//   },
// })
/// 최적화 //////////////////////////////////////////////////////////////////////////////


import { Image, Platform, Pressable, StyleSheet, Text, TextInput, View, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { get_user, get_user_list, update_user } from '../../apis/userApi';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { axiosInstance } from '../../apis/axiosInstance';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const EditProfile = () => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState('');
  const [editData, setEditData] = useState(null);
  const [changePw, setChangePw] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});
  const [userList, setUserList] = useState([]);


  const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';


  useEffect(() => {
    const fetchEdit = async () => {
      try {
        const userResponse = await get_user();
        const userData = userResponse.data;
        setEditData({
          userId: userData.userId ?? '',
          userPw: '',
          userPwConfirm: '',
          userAge: userData.userAge !== undefined && userData.userAge !== null ? userData.userAge.toString() : '',
          userTel: userData.userTel ?? '',
          userEmail: userData.userEmail ?? '',
          userAddr: userData.userAddr ?? ''
        });
  
        const imgResponse = await axios.get(`${baseURL}/users/${userData.userId}/image`);
        setImageUrl(imgResponse.config.url);
  
        // ✅ 회원 목록 가져오기
        const listResponse = await get_user_list();
        setUserList(listResponse.data);
  
      } catch (err) {
        console.error('회원 정보 불러오기 실패:', err);
      }
    };
  
    fetchEdit();
  }, []);
  

  //중복 확인 함수
  const checkDuplicate = () => {
    const newErrors = {};
  
    // 이메일 중복 체크 (본인 제외)
    const isEmailDuplicate = userList.some(user =>
      user.userEmail === editData.userEmail && user.userId !== editData.userId
    );
  
    if (isEmailDuplicate) {
      newErrors.userEmail = '이미 존재하는 이메일입니다.';
    }
  
    // 전화번호 중복 체크 (본인 제외)
    const isTelDuplicate = userList.some(user =>
      user.userTel === editData.userTel && user.userId !== editData.userId
    );
  
    if (isTelDuplicate) {
      newErrors.userTel = '이미 존재하는 전화번호입니다.';
    }
  
    setErrorMsg(newErrors);
    
    return Object.keys(newErrors).length === 0; // 에러 없으면 true
  };
  

  //이미지 삭제 함수
  const deleteImage = async () => {
    try {
      const response = await axiosInstance.delete(`/users/${editData.userId}/image`);
      setImageUrl('');
      return response;
    } catch (err) {
      console.error('이미지 삭제 실패:', err);
      return null;
    }
  };

  //이미지 재 업로드 함수
  const handleImageUpdate = async (selectedImage) => {
    try {
      if (imageUrl) {
        const deleteResponse = await deleteImage();
        if (!deleteResponse || deleteResponse.status !== 200) {
          throw new Error('이미지 삭제 실패');
        }
      }
  
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage.uri,
        name: selectedImage.fileName || 'image.jpg',
        type: selectedImage.mimeType || 'image/jpeg',
      });
  
      await axios.post(
        `${baseURL}/users/${editData.userId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      setImageUrl(selectedImage.uri);
      Alert.alert('이미지 변경 완료!');
    } catch (error) {
      Alert.alert('이미지 업로드 중 오류 발생');
      setImageUrl('');
    }
  };
  
  
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setImageUrl(selectedImage.uri);
      await handleImageUpdate(selectedImage);
    }
  };

  const formatPhoneNumber = (value) => {
    const onlyNums = value.replace(/[^0-9]/g, '');
    if (onlyNums.length <= 3) return onlyNums;
    if (onlyNums.length <= 7) return `${onlyNums.slice(0,3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0,3)}-${onlyNums.slice(3,7)}-${onlyNums.slice(7,11)}`;
  };
  

  const handleChange = (field, value) => {
    let formattedValue = value;
  
    if (field === 'userTel') {
      formattedValue = formatPhoneNumber(value);
    }
  
    setEditData({ ...editData, [field]: formattedValue });
    if (errorMsg[field]) {
      setErrorMsg({ ...errorMsg, [field]: '' });
    }
  };

  //유효성 검사
  const validateForm = () => {
    const newErrors = {};
  
    // 이메일 형식 체크
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(editData.userEmail)) {
      newErrors.userEmail = '올바른 이메일 형식을 입력하세요.';
    }
  
    // 비밀번호 형식 체크 (6~20자 영문/숫자 조합)
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;
    if (changePw) {
      if (!pwRegex.test(editData.userPw)) {
        newErrors.userPw = '비밀번호는 6~20자 영문/숫자 조합이어야 합니다.';
      }
  
      if (editData.userPw !== editData.userPwConfirm) {
        newErrors.userPwConfirm = '비밀번호가 일치하지 않습니다.';
      }
    }
  
    // 필수 입력값 체크
    if (!editData.userId.trim()) newErrors.userId = '아이디는 필수 입력입니다.';
    if (!editData.userEmail.trim()) newErrors.userEmail = '이메일은 필수 입력입니다.';
    if (!editData.userTel.trim()) newErrors.userTel = '전화번호는 필수 입력입니다.';
    if (!editData.userAddr.trim()) newErrors.userAddr = '주소는 필수 입력입니다.';
  
    setErrorMsg(newErrors);
  
    return Object.keys(newErrors).length === 0; // 에러가 없으면 true
  };
  
  
  //정보 수정 버튼 클릭시
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('입력 오류', '필수 정보를 정확히 입력하세요.');
      console.log(editData);
      return;
    }
  
    if (!checkDuplicate()) {
      Alert.alert('중복 오류', '이미 존재하는 이메일 또는 전화번호입니다.');
      return;
    }
  
    try {
      const res = await update_user(editData);
      if (res.status === 200) {
        Alert.alert('정보 수정 완료!!');
        router.replace('/(home)');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('수정 실패', '서버 오류가 발생했습니다.');
    }
  };
  
  

  if (!editData) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        {imageUrl ? (
          <Image source={{ uri: `${imageUrl}?${Date.now()}` }} style={styles.userImg} />
        ) : (
          <FontAwesome name="user-circle" size={100} color="gray" />
        )}
        <View style={styles.imageButtons}>
          <Pressable style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>사진 등록</Text>
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={deleteImage}>
            <Text style={styles.deleteButtonText}>사진 삭제</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.inputGroup} >
        <Text style={styles.label}>userId</Text>
        <TextInput value={editData.userId} style={styles.input} />
        {['userAge', 'userTel', 'userEmail', 'userAddr'].map((field) => (
            <View key={field}>
              <Text  style={styles.label}>{field}</Text>
              <TextInput
                style={styles.input}
                value={editData[field]}
                onChangeText={(text) => handleChange(field, text)}
              />
              {errorMsg[field] && <Text style={styles.errorMsg}>{errorMsg[field]}</Text>}
            </View>
          ))}
      </View>
        
      {changePw && (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={editData.userPw}
              onChangeText={(text) => handleChange('userPw', text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>비밀번호 확인</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={editData.userPwConfirm}
              onChangeText={(text) => handleChange('userPwConfirm', text)}
            />
          </View>
        </>
      )}

      <Pressable style={styles.toggleButton} onPress={() => setChangePw(!changePw)}>
        <Text style={styles.toggleButtonText}>{changePw ? '비밀번호 변경 취소' : '비밀번호 변경'}</Text>
      </Pressable>

      <View style={styles.buttonGroup}>
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>저장</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={() => router.replace('/(home)')}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },

  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },

  userImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },

  imageButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  imageButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },

  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },

  label: {
    marginBottom: 5,
    fontWeight: '600',
    fontSize: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },

  errorMsg: {
    color: 'red',
    marginTop: 5,
    fontSize: 13,
  },

  toggleButton: {
    marginVertical: 10,
  },

  toggleButtonText: {
    color: '#007bff',
    fontSize: 16,
  },

  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },

  submitButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  cancelButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  deleteButton: {
    backgroundColor: '#dc3545',  // 빨간색 danger 버튼 스타일
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },

  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
});
