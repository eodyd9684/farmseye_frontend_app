import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

const Header = () => {
  const router = useRouter();

  return (
    <View style={styles.headerContainder}>
      <View>
        <Image 
          resizeMethod='contain'
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
        
        <Text style={styles.headerTitle}>FarmsEye</Text>
      </View>

      <View style={styles.loginStatus}>
        <Pressable onPress={() => router.push('/auth/login')}>
          <Text>로그인</Text>
        </Pressable>
        
        <Pressable onPress={() => router.push('/auth/join')}>
          <Text>회원가입</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  headerContainder : {
    height : 60,
    backgroundColor : 'orange',
    flexDirection: 'row',
    justifyContent : 'center',
    alignItems : 'center'
  },

  headerTitle : {
    fontSize : 30,
    color : 'white',
  },

  logo : {
    height: 50,
    width : 50,
  },
})