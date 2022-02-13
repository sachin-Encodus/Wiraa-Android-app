import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LandingScreen({ navigation }) {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 5,
            justifyContent: "center",
            alignItems: "center",
            width: windowWidth,
          }}
        >
          <Image
            style={{ width: 210, height: 48 }}
            source={require("../assets/Logo/white.png")}
          />
        </View>

        <View
          style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 120 }}
        >
          <Text allowFontScaling={false} style={styles.txt}>
            Discover the world's{"\n"}top professionals
          </Text>
          <TouchableOpacity
            style={[styles.join, { width: windowWidth - 60 }]}
            onPress={() => navigation.navigate("LoginScreen")}
          >
            <Text allowFontScaling={false} style={styles.jointxt}>
              Login
            </Text>
          </TouchableOpacity>
          <Text allowFontScaling={false} style={styles.acc}>
            Don't have an account? &nbsp;
            <Text
              allowFontScaling={false}
              style={styles.login}
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              {" "}
              Join
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f56",
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    fontSize: 24,
    paddingLeft: 16,
    fontFamily: "Futura",
    color: "#fff",
    textAlign: "center",
  },
  join: {
    backgroundColor: "#171919",
    padding: 20,
    margin: 20,
    marginVertical: 5,
    borderRadius: 16,
    elevation: 4,
    marginTop: 64,
  },
  jointxt: {
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
    fontFamily: "Futura",
  },
  postReq: {
    backgroundColor: "#171919",
    alignSelf: "stretch",
    padding: 20,
    margin: 20,
    marginVertical: 10,
    borderRadius: 16,
    elevation: 4,
  },
  postReqtxt: {
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
    fontFamily: "OpenSans",
  },
  acc: {
    fontFamily: "OpenSans",
    textAlign: "center",
    padding: 10,
    alignSelf: "center",
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  login: {
    color: "#171919",
    fontFamily: "Futura",
    fontSize: 16,
  },
});
