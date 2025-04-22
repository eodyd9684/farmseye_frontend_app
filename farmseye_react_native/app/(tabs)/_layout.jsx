
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from '@/components/Header';
import { Platform, StatusBar } from 'react-native';

const TabLayout = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.tabArea}>
        <Tabs screenOptions={{headerShown : false}} edges={['top', 'bottom']}>
          <Tabs.Screen 
            name='(home)'
            options={{
              title : '홈',
              tabBarIcon : ({color}) => <Ionicons name="home-outline" size={24} color={color} />
            }}
          />
    
          <Tabs.Screen 
            name='(control)'
            options={{
              title : '제어',
              tabBarIcon : ({color}) => <Ionicons name="file-tray-full" size={24} color={color} />
            }}
          />

          <Tabs.Screen 
            name='(chart)'
            options={{
              title : '차트',
              tabBarIcon : ({color}) => <Ionicons name="bar-chart-outline" size={24} color={color} />
            }}
          />
    
          <Tabs.Screen 
            name='(setting)'
            options={{
              title : '설정',
              tabBarIcon : ({color}) => <Ionicons name="settings-outline" size={24} color={color} />
            }}
          />
    
        </Tabs>
      </View>
    </SafeAreaView>
  )
}

export default TabLayout

const styles = StyleSheet.create({
  container : {
    flex : 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  tabArea : {
    flex : 1
  }
})