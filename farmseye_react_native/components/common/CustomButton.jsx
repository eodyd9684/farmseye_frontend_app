import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../constants/colorConstant'

const CustomButton = ({ label = '버튼', size = 'normal' , ...props}) => {
  return (
    <Pressable 
      style={({pressed}) => [ styles.container, styles[size], pressed && styles.pressed ]}
      {...props}
    >
      <Text>{label}</Text>
    </Pressable>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  container : {
    borderWidth : 1,
    borderRadius : 8,
    justifyContent : 'center',
    alignItems : 'center',
    backgroundColor : colors.ORANGE_600,
    opacity : 0.8,
  },

  large : {
    width : '100%',
    height : 44
  },

  normal : {
    width : 120,
    height : 44
  },

  small : {
    width : 80,
    height : 44
  },

  pressed : {
    opacity : 1,
  },
})