import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Tabs, useRouter } from 'expo-router'
import Header from '@/components/Header'
import { useSelector } from 'react-redux'
import Ionicons from '@expo/vector-icons/Ionicons';

const TabLayout = () => {
  
  const auth = useSelector(state => state.auth);
  const router = useRouter();

  // 로그인이 필요한 탭 목록
  const protectedTabs = ['control', 'chart', 'setting']; // 로그인이 필요한 탭 이름들

  // 탭 접근 권한 확인 함수
  const checkAuthForTab = (tabName) => {
    if (protectedTabs.includes(tabName) && !auth.isLogin) {
      console.log(`${tabName} 탭은 로그인이 필요합니다`);
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.tabArea}>
        <Tabs 
          screenOptions={{headerShown : false}} 
          // initialRouteName='(home)'
          edges={['top', 'bottom']}
        >
          <Tabs.Screen 
            name='(home)'
            options={{
              title : '홈',
              tabBarIcon : ({color}) => <Ionicons name="home-outline" size={24} color={color} />
            }}
          />
    
          <Tabs.Screen 
            name='control'
            options={{
              title : '제어',
              tabBarIcon : ({color}) => <Ionicons name="file-tray-full" size={24} color={color} />
            }}
            listeners={{
              tabPress : (e) => {
                if (!checkAuthForTab('control')) {
                  // 기본 탭 이벤트 방지
                  e.preventDefault();
                  // 로그인 페이지로 이동
                  router.push('/auth/login');
                }
              }
            }}
          />

          <Tabs.Screen 
            name='chart'
            options={{
              title : '차트',
              tabBarIcon : ({color}) => <Ionicons name="bar-chart-outline" size={24} color={color} />
            }}
            listeners={{
              tabPress: (e) => {
                if (!checkAuthForTab('chart')) {
                  // 기본 탭 이벤트 방지
                  e.preventDefault();
                  // 검색 페이지로 이동
                  router.push('/auth/login');
                }
              }
            }}
          />
    
          <Tabs.Screen 
            name='setting'
            options={{
              title : '설정',
              tabBarIcon : ({color}) => <Ionicons name="settings-outline" size={24} color={color} />
            }}
            listeners={{
              tabPress: (e) => {
                if (!checkAuthForTab('setting')) {
                  // 기본 탭 이벤트 방지
                  e.preventDefault();
                  // 검색 페이지로 이동
                  router.push('/auth/login');
                }
              }
            }}
          />

          <Tabs.Screen 
            name='(stock)'
            options={{
              title : '개체',
              tabBarIcon : ({color}) => <Ionicons name="paw-outline" size={24} color="black" />
            }}
          />
    
        </Tabs>
      </View>
    </View>
  )
}

export default TabLayout

const styles = StyleSheet.create({
  container : {
    flex : 1,
  },

  tabArea : {
    flex : 1
  }
})