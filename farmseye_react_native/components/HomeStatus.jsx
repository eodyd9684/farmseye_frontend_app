import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { api_env, now_env } from '../apis/envApis';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import StatusLegend from './StatusLegend';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const HomeStatus = () => {
  const [nowEnv, setNowEnv] = useState(null);
  const [danEnv, setDanEnv] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nowRes, danRes] = await Promise.all([now_env(), api_env()]);
        setNowEnv(nowRes.data);
        setDanEnv(danRes.data);
      } catch (error) {
        console.error('환경 데이터 불러오기 실패:', error);
      }
    };
    
    console.log(danEnv);
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {
        nowEnv && 
        <>
          <View style={styles.status_bar}>
            <FontAwesome6 name="temperature-half" size={24} color="crimson" />
            <Text style={styles.status_text}>{nowEnv.temp}</Text>
            <StatusLegend dataKey={'temp'} data={nowEnv.temp} min={danEnv.minTem} max={danEnv.maxTem}/>
          </View>

          <View style={styles.status_bar}>
            <Ionicons name="water" size={24} color="skyblue" />
            <Text style={styles.status_text}>{nowEnv.humi}</Text>
            <StatusLegend dataKey={'humi'} data={nowEnv.humi} min={danEnv.minHumi} max={danEnv.maxHumi}/>
          </View>

          <View style={styles.status_bar}>
            <FontAwesome6 name="lightbulb" size={24} color="darkorange" />
            <Text style={styles.status_text}>{nowEnv.illumi}</Text>
            <StatusLegend dataKey={'illumi'} data={nowEnv.illumi} min={danEnv.minIllumi} max={danEnv.maxIllumi}/>
          </View>

          <View style={styles.status_bar}>
            <MaterialCommunityIcons name="molecule-co2" size={24} color="black" />
            <Text style={styles.status_text}>{nowEnv.co2.toFixed(1)}</Text>
            <StatusLegend dataKey={'co2'} data={nowEnv.co2} min={danEnv.bouCo2} max={danEnv.danCo2}/>
          </View>

          <View style={styles.status_bar}>
            <FontAwesome6 name="biohazard" size={24} color="black" />
            <Text style={styles.status_text}>{nowEnv.no2}</Text>
            <StatusLegend dataKey={'no2'} data={nowEnv.no2} min={danEnv.bouNo2} max={danEnv.danNo2}/>
          </View>
        </>
      }
      
    </View>
  );
};

export default HomeStatus;

const styles = StyleSheet.create({
  container : {
    width : '80%',
    height : '100%',
    marginHorizontal : 'auto',
    backgroundColor : 'white',
  },

  status_bar : {
    flexDirection : 'row',
  },
});
