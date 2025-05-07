
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TempControlScreen from './tempControl';
import MainControllerScreen from './mainController';
import AutomationController from '../../../components/AutomationController';


const ControlHome = () => {
  return (
    <View  style={styles.container}>
      {/* <TempControlScreen /> */}
      {/* <MainControllerScreen /> */}
      <AutomationController />
    </View>
  )
}

export default ControlHome

const styles = StyleSheet.create({
  container: { flex: 1,  },
}
)