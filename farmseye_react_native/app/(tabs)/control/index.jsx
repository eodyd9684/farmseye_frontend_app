
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TempControlScreen from './tempControl';
import AirqControlScreen from './roofControl';


const ControlHome = () => {
  return (
    <View  style={styles.container}>
      <TempControlScreen />
      {/* <AirqControlScreen /> */}
    </View>
  )
}

export default ControlHome

const styles = StyleSheet.create({
  container: { flex: 1,  },
}
)