import React,{useState,useEffect} from 'react'
import { View, Text,Image,useWindowDimensions } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Splash({navigation}) {
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;

    useEffect(() => {
        getData();
      }, []);
    
      const getData = async () => {
        try {
          const value = await AsyncStorage.getItem("userData");
          console.log("value--",value)
          if (value !== null) {
            navigation.navigate("Dashboard");
            console.log("====>>>>>", value);
          } else {
            navigation.navigate("LandingScreen")
          }
        } catch (e) {
          console.log("no data");
        }
      };


    return (
        <View
          style={{
            flex: 5,
            justifyContent: "center",
            alignItems: "center",
            width: windowWidth,
          }}
        >
         <Image source={require("../assets/splash.png")} style={{height:"100%",width:"100%"}} />
        </View>
    )
}
