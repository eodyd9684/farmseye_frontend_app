// import { StyleSheet, View } from 'react-native'
// import React from 'react'

// const StatusLegend = ({dataKey, data, min, max}) => {

//   const getTempColor = () => {
//     if(dataKey === 'temp' || dataKey === 'humi' || dataKey === 'illumi'){
//       if(data <= min || data >= max){
//         return 'orange'
//       }else {
//         return 'green'
//       }
//     }else{
//       if(data >= max){
//         return 'crimson'
//       } else if (data >= min){
//         return 'orange'
//       } else{
//         return 'green'
//       }
//     }
//   };

//   return (
//     <View style={[styles.status , { backgroundColor : getTempColor() }]}/>
//   )
// }

// export default StatusLegend

// const styles = StyleSheet.create({
//   status : {
//     width : 20,
//     height : 20,
//     borderRadius : 10,
//   },
// })

import { StyleSheet, View, Text } from 'react-native';
import React from 'react';

const StatusLegend = ({ dataKey, data, min, max }) => {
  const getStatus = () => {
    if (dataKey === 'temp' || dataKey === 'humi' || dataKey === 'illumi') {
      if (data <= min || data >= max) return { label: '주의', color: '#FFC107' }; // orange
      return { label: '정상', color: '#4CAF50' }; // green
    } else {
      if (data >= max) return { label: '위험', color: '#DC143C' }; // crimson
      if (data >= min) return { label: '주의', color: '#FFC107' };
      return { label: '정상', color: '#4CAF50' };
    }
  };

  const status = getStatus();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{status.label}</Text>
      <View style={[styles.indicator, { backgroundColor: status.color }]} />
    </View>
  );
};

export default StatusLegend;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
});
