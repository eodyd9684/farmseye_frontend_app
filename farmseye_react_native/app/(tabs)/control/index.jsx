
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MainControlScreen from './mainControl';


const ControlHome = () => {
  return (
    <View  style={styles.container}>
      <MainControlScreen />
    </View>
  )
}

export default ControlHome

const styles = StyleSheet.create({
  container: { flex: 1,  },
}
)