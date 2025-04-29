import { StyleSheet, View } from 'react-native'
import React from 'react'

const StatusLegend = ({dataKey, data, min, max}) => {

  const getTempColor = () => {
    if(dataKey === 'temp' || dataKey === 'humi' || dataKey === 'illumi'){
      if(data <= min || data >= max){
        return 'orange'
      }else {
        return 'green'
      }
    }else{
      if(data >= max){
        return 'crimson'
      } else if (data >= min){
        return 'orange'
      } else{
        return 'green'
      }
    }
  };

  return (
    <View style={[styles.status , { backgroundColor : getTempColor() }]}/>
  )
}

export default StatusLegend

const styles = StyleSheet.create({
  status : {
    width : 20,
    height : 20,
    borderRadius : 10,
  },
})