// import { StyleSheet, Text, View } from "react-native";
// import React, { useEffect, useState } from "react";
// import { api_env, now_env } from "../apis/envApis";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import StatusLegend from "./StatusLegend";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// const HomeStatus = () => {
//   const [nowEnv, setNowEnv] = useState(null);
//   const [danEnv, setDanEnv] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [nowRes, danRes] = await Promise.all([now_env(), api_env()]);
//         setNowEnv(nowRes.data);
//         setDanEnv(danRes.data);
//       } catch (error) {
//         console.error("환경 데이터 불러오기 실패:", error);
//       }
//     };

//     console.log(danEnv);
//     fetchData();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {nowEnv && (
//         <View style={styles.statut_container}>
//           <FontAwesome6 name="temperature-half" size={36} color="crimson" />
//           <View style={styles.status_bar}>
//             <Text style={styles.status_title}>온도</Text>
//             <Text style={styles.status_text}>{nowEnv.temp}</Text>
//             <StatusLegend
//               dataKey={"temp"}
//               data={nowEnv.temp}
//               min={danEnv.minTem}
//               max={danEnv.maxTem}
//             />
//           </View>

//           <Ionicons name="water" size={36} color="skyblue" />
//           <View style={styles.status_bar}>
//             <Text style={styles.status_title}>습도</Text>
//             <Text style={styles.status_text}>{nowEnv.humi}</Text>
//             <StatusLegend
//               dataKey={"humi"}
//               data={nowEnv.humi}
//               min={danEnv.minHumi}
//               max={danEnv.maxHumi}
//             />
//           </View>

//           <FontAwesome6 name="lightbulb" size={36} color="darkorange" />
//           <View style={styles.status_bar}>
//             <Text style={styles.status_title}>조도</Text>
//             <Text style={styles.status_text}>{nowEnv.illumi}</Text>
//             <StatusLegend
//               dataKey={"illumi"}
//               data={nowEnv.illumi}
//               min={danEnv.minIllumi}
//               max={danEnv.maxIllumi}
//             />
//           </View>

//           <MaterialCommunityIcons name="molecule-co2" size={36} color="black" />
//           <View style={styles.status_bar}>
//             <Text style={styles.status_title}>Co2</Text>
//             <Text style={styles.status_text}>{nowEnv.co2.toFixed(1)}</Text>
//             <StatusLegend
//               dataKey={"co2"}
//               data={nowEnv.co2}
//               min={danEnv.bouCo2}
//               max={danEnv.danCo2}
//             />
//           </View>

//           <View>
//             <FontAwesome6 name="biohazard" size={36} color="orange" />

//             <View style={styles.status_bar}>
//               <Text style={styles.status_title}>No2</Text>
//               <Text style={styles.status_text}>{nowEnv.no2}</Text>
//               <StatusLegend
//                 dataKey={"no2"}
//                 data={nowEnv.no2}
//                 min={danEnv.bouNo2}
//                 max={danEnv.danNo2}
//               />
//             </View>

//             <View style={styles.status_bar}>
//               <Text style={styles.status_title}>NH3</Text>
//               <Text style={styles.status_text}>{nowEnv.nh3}</Text>
//               <StatusLegend
//                 dataKey={"nh3"}
//                 data={nowEnv.nh3}
//                 min={danEnv.bouNh3}
//                 max={danEnv.danNh3}
//               />
//             </View>

//             <View style={styles.status_bar}>
//               <Text style={styles.status_title}>H2S</Text>
//               <Text style={styles.status_text}>{nowEnv.h2s}</Text>
//               <StatusLegend
//                 dataKey={"h2s"}
//                 data={nowEnv.h2s}
//                 min={danEnv.bouH2s}
//                 max={danEnv.danH2s}
//               />
//             </View>

//             <View style={styles.status_bar}>
//               <Text style={styles.status_title}>TOLUENE</Text>
//               <Text style={styles.status_text}>{nowEnv.toluene}</Text>
//               <StatusLegend
//                 dataKey={"toluene"}
//                 data={nowEnv.toluene}
//                 min={danEnv.bouToluene}
//                 max={danEnv.danToluene}
//               />
//             </View>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// export default HomeStatus;

// const styles = StyleSheet.create({
//   container: {
//     width: "80%",
//     height: "90%",
//     marginHorizontal: "auto",
//     backgroundColor: "white",
//   },

//   statut_container : {
//     padding : 12,
//   },

//   status_bar: {
//     flexDirection: "row",
//     justifyContent : 'space-evenly',
//     borderBottomWidth : 1,
//     borderBottomColor : 'lightgrey',
//     marginBottom : 20,
//   },
// });


import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { api_env, now_env } from "../apis/envApis";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import StatusLegend from "./StatusLegend";

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
        console.error("환경 데이터 불러오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  

  const statusItems = [
    {
      icon: <FontAwesome6 name="temperature-half" size={28} color="crimson" />,
      label: "온도 (°C)",
      value: nowEnv?.temp,
      key: "temp",
      min: danEnv?.minTem,
      max: danEnv?.maxTem,
    },
    {
      icon: <Ionicons name="water" size={28} color="deepskyblue" />,
      label: "습도 (%)",
      value: nowEnv?.humi,
      key: "humi",
      min: danEnv?.minHumi,
      max: danEnv?.maxHumi,
    },
    {
      icon: <FontAwesome6 name="lightbulb" size={28} color="darkorange" />,
      label: "조도 (lx)",
      value: (((nowEnv?.illumi)/1023) * 10).toFixed(1),
      key: "illumi",
      min: danEnv?.minIllumi,
      max: danEnv?.maxIllumi,
    },
    {
      icon: <MaterialCommunityIcons name="molecule-co2" size={28} color="black" />,
      label: "CO₂ (ppm)",
      value: nowEnv?.co2?.toFixed(1),
      key: "co2",
      min: danEnv?.bouCo2,
      max: danEnv?.danCo2,
    },
    {
      icon: <MaterialCommunityIcons name="weather-hazy" size={28} color="#B22222" />,
      label: "NO₂ (ppb)",
      value: nowEnv?.no2,
      key: "no2",
      min: danEnv?.bouNo2,
      max: danEnv?.danNo2,
    },
    {
      icon: <MaterialCommunityIcons name="chemical-weapon" size={28} color="#8B008B" />,
      label: "NH₃ (ppm)",
      value: nowEnv?.nh3,
      key: "nh3",
      min: danEnv?.bouNh3,
      max: danEnv?.danNh3,
    },
    {
      icon: <MaterialCommunityIcons name="emoticon-dead-outline" size={28} color="#2E8B57" />,
      label: "H₂S (ppm)",
      value: nowEnv?.h2s,
      key: "h2s",
      min: danEnv?.bouH2s,
      max: danEnv?.danH2s,
    },
    {
      icon: <MaterialCommunityIcons name="test-tube" size={28} color="#1E90FF" />,
      label: "Toluene (ppm)",
      value: (nowEnv?.toluene/10).toFixed(2),
      key: "toluene",
      min: danEnv?.bouToluene,
      max: danEnv?.danToluene,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {nowEnv && danEnv && statusItems.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.row}>
            {item.icon}
            <View style={styles.info}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          </View>
          <StatusLegend
            dataKey={item.key}
            data={item.value}
            min={item.min}
            max={item.max}
            />
          </View>
      ))}
    </ScrollView>
  );
};

export default HomeStatus;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
  },
  card: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection : 'row',
    justifyContent : 'space-between',
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap : 20,
  },
  info: {
    marginLeft: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 18,
    color: "#555",
  },
});
