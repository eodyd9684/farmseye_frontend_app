import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../../components/common/CustomButton'
import { api_join } from '../../apis/userApi'
import LoginCustomInput from '../../components/common/LoginCustomInput'
import { api_user_list } from '../../apis/userApi'

const JoinScreen = () => {

  //회원가입 전 회원 중복 검사를 위한 회원 리스트 정보 담을 변수
  const [checkList, setCheckList] = useState(null);

  //입력받은 회원 정보 저장 변수
  const [joinData, setJoinData] = useState({
    userId : '',
    userPw : '',
    userName : '',
    userAge : null,
    userTel : '',
    userEmail : '',
    userAddr : '',
  });

  useEffect(() => {
    api_user_list()
      .then(res => {
        console.log(res.data);
        setCheckList(res.data)
      })
      .catch(e => console.log(e));
  }, []);

  //회원 정보 변경시 실행될 함수
  const handleJoinData = (text, keyValue) => {
    setJoinData({
      ...joinData,
      [keyValue] : text
    })
  };

  //axios로 회원가입시 요청할 함수
  const join = () => {
    console.log(joinData);

    api_join(joinData)
      .then(res => alert('성공'))
      .catch(e => console.log(e));
  };


  return (
    <View style={styles.container}>
      <View>
        <LoginCustomInput 
          label={'아이디'} 
          value={joinData.userId}
          onChangeText={text => handleJoinData(text, 'userId')}
        />
      </View>

      <View>
        <LoginCustomInput 
          label={'비밀번호'} 
          isPw={true} 
          value={joinData.userPw}
          onChangeText={text => handleJoinData(text, 'userPw')}
        />
      </View>

      <View>
        <LoginCustomInput 
          label={'이름'} 
          value={joinData.userName}
          onChangeText={text => handleJoinData(text, 'userName')}
        />
      </View>

      <View>
        <LoginCustomInput 
          label={'나이'} 
          value={joinData.userAge}
          onChangeText={text => handleJoinData(text, 'userAge')}
        />
      </View>

      <View>
        <LoginCustomInput 
          label={'전화번호'} 
          value={joinData.userTel}
          onChangeText={text => handleJoinData(text, 'userTel')}
        />
      </View>

      <View>
        <LoginCustomInput 
          label={'이메일'} 
          value={joinData.userEmail}
          onChangeText={text => handleJoinData(text, 'userEmail')}
        />
      </View>

      <View>
        <LoginCustomInput 
          label={'주소'} 
          value={joinData.userAddr}
          onChangeText={text => handleJoinData(text, 'userAddr')}
        />
      </View>

      <View >
        <CustomButton 
          label={'회원가입'} 
          size={'large'} 
          onPress={() => join()}
        />
      </View>

    </View>
  )
}

export default JoinScreen

const styles = StyleSheet.create({
  container : {
    width : '80%',
    marginHorizontal : 'auto'
  },
})