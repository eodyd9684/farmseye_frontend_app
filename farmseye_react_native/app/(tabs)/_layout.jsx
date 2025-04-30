import { StyleSheet, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Header from "@/components/Header";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import LoginScreen from "../auth/login";

const TabLayout = () => {
  const auth = useSelector((state) => state.auth);

  return (
    <View style={styles.container}>
      {auth.isLogin ? (
        <>
          <Header />
          <View style={styles.tabArea}>
            <Tabs
              screenOptions={{ headerShown: false }}
              // initialRouteName='(home)'
              edges={["top", "bottom"]}
            >
              <Tabs.Screen
                name="(home)"
                options={{
                  title: "홈",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="home-outline" size={24} color={color} />
                  ),
                }}
              />

              <Tabs.Screen
                name="control"
                options={{
                  title: "제어",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="file-tray-full" size={24} color={color} />
                  ),
                }}
              />

              <Tabs.Screen
                name="chart"
                options={{
                  title: "차트",
                  tabBarIcon: ({ color }) => (
                    <Ionicons
                      name="bar-chart-outline"
                      size={24}
                      color={color}
                    />
                  ),
                }}
              />

              <Tabs.Screen
                name="setting"
                options={{
                  title: "설정",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="settings-outline" size={24} color={color} />
                  ),
                }}
              />

              <Tabs.Screen
                name="stock"
                options={{
                  title: "개체",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="paw-outline" size={24} color={color} />
                  ),
                }}
              />
            </Tabs>
          </View>
        </>
      ) : (
        <LoginScreen />
      )}
    </View>
  );
};

export default TabLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  tabArea: {
    flex: 1,
  },
});
