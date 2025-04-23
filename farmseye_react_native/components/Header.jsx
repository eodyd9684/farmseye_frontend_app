import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'react-native';

const Header = () => {
  return (
    <View style={styles.headerContainder}>
      <Image 
        resizeMethod='contain'
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.headerTitle}>FarmsEye</Text>
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