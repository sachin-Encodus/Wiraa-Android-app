import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import {
  FontAwesome,
  Feather,
  Ionicons,
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Header from "../component/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import CommonHeader from "../component/CommonHeader";
import HeaderBack from "../component/HeaderBack";

export default class Categories extends React.Component {
  state = {
    posts: [],
    profilePic: null,
    isFetching: false,
    userProfileId: "",
    business: [],
    creative: [],
    it: [],
    engg: [],
    lifestyle: [],
    marketing: [],
    study: [],
    writing: [],
  };

 
  render() {
    if (this.state.isLoading === true) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#f56" />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
            <HeaderBack 
                headerName="Categories"
                navigation={this.props.navigation}
            />
            
          <ScrollView>
        <SafeAreaView>
            {/* <View style={{ width: "100%"}}>
              <TouchableOpacity
                style={{ marginHorizontal:"6%"}}
                onPress={()=>this.props.navigation.navigate('PostRequest')}

              //  onPress={() =>
              //     this.props.navigation.navigate("PostRequest",{
              //       id: 1,
              //       categoryName: "Business",
              //     })
              //   }
              >
                <ImageBackground
                  source={require("../assets/imgs/business.jpg")}
                  style={styles.bgImage}
                  imageStyle={{ borderRadius: 10 }}
                >
                  <LinearGradient
                    // Button Linear Gradient
                    start={[0.1, 0.1]}
                    colors={["#EF4845", "#A22DB3"]}
                    style={styles.button1}
                  >
                    <Ionicons
                      name="md-business"
                      size={24}
                      color="#fff"
                      style={{ textAlign: "center", marginTop: "auto" }}
                    />
                    <Text allowFontScaling={false} style={styles.catTitle}>
                      Business
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            </View> */}
            <View style={{ flexDirection: "row", width: "100%",padding:"5%"}}>
              <View style={{ flexDirection: "column", width: "50%"}}>
                <TouchableOpacity style={{ marginHorizontal: "2%",bottom:"3%" }}
                // onPress={() =>
                //   this.props.navigation.navigate("PostRequest", {
                //     id: 2,
                //     categoryName: "Creative",
                //   })
                // }
                onPress={()=>this.props.navigation.navigate('PostRequest')}
                >
                  <ImageBackground
                    source={require("../assets/imgs/business.jpg")}
                    style={styles.bgImage1}
                    imageStyle={{ borderRadius: 10 }}
                  >
                    <LinearGradient
                      // Button Linear Gradient
                      start={[0.1, 0.1]}
                      colors={["#EF4845", "#A22DB3"]}
                      style={styles.button2}
                    >
                      <Ionicons
                      name="md-business"
                      size={24}
                      color="#fff"
                      style={{ textAlign: "center", marginTop: "auto" }}
                    />
                      <Text
                        allowFontScaling={false}
                        style={[styles.catTitle, { alignSelf: "center" }]}
                      >
                        Business
                      </Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginHorizontal: "2%",bottom:"3%"}}
                //  onPress={() =>
                //   this.props.navigation.navigate("PostRequest", {
                //     id: 3,
                //     categoryName: "IT",
                //   })
                // }
                onPress={()=>this.props.navigation.navigate('PostRequest')}
                >
                  <ImageBackground
                    source={require("../assets/imgs/it.jpg")}
                    style={styles.bgImage2}
                    imageStyle={{ borderRadius: 10 }}
                  >
                    <LinearGradient
                      // Button Linear Gradient
                      colors={["#EF4845", "#A22DB3"]}
                      style={styles.button}
                    >
                      <MaterialCommunityIcons
                        name="cellphone-information"
                        size={24}
                        color="#fff"
                        style={{ textAlign: "center", marginTop: "auto" }}
                      />
                      <Text
                        allowFontScaling={false}
                        style={[styles.catTitle, { alignSelf: "center" }]}
                      >
                        IT
                      </Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginHorizontal: "2%",bottom:"3%" }}
                // onPress={() =>
                //   this.props.navigation.navigate("PostRequest", {
                //     id: 2,
                //     categoryName: "Creative",
                //   })
                // }
                onPress={()=>this.props.navigation.navigate('PostRequest')}
                >
                  <ImageBackground
                    source={require("../assets/imgs/creative.jpg")}
                    style={styles.bgImage1}
                    imageStyle={{ borderRadius: 10 }}
                  >
                    <LinearGradient
                      // Button Linear Gradient
                      start={[0.1, 0.1]}
                      colors={["#EF4845", "#A22DB3"]}
                      style={styles.button2}
                    >
                      <Ionicons
                        name="md-create"
                        size={24}
                        color="#fff"
                        style={{ textAlign: "center", marginTop: "auto" }}
                      />
                      <Text
                        allowFontScaling={false}
                        style={[styles.catTitle, { alignSelf: "center" }]}
                      >
                        Creative
                      </Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
               
                <TouchableOpacity style={{ marginHorizontal: "2%" ,bottom:"3%"}}
                // onPress={() =>
                //   this.props.navigation.navigate("PostRequest", {
                //     id: 4,
                //     categoryName: "Marketing",
                //   })
                // }
                onPress={()=>this.props.navigation.navigate('PostRequest')}
                >
                  <ImageBackground
                    source={require("../assets/imgs/marketing.jpg")}
                    style={styles.bgImage2}
                    imageStyle={{ borderRadius: 10 }}
                  >
                    <LinearGradient
                      // Button Linear Gradient
                      colors={["#EF4845", "#A22DB3"]}
                      style={styles.button}
                    >
                      <MaterialCommunityIcons
                        name="home-analytics"
                        size={24}
                        color="#fff"
                        style={{ textAlign: "center", marginTop: "auto" }}
                      />
                      <Text
                        allowFontScaling={false}
                        style={[styles.catTitle, { alignSelf: "center" }]}
                      >
                        Marketing
                      </Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
               
              </View>
              <View style={{ flexDirection: "column", width: "50%" }}>
                <TouchableOpacity style={{ marginHorizontal: "2%",bottom:"3%" }}
                //  onPress={() =>
                //   this.props.navigation.navigate("PostRequest", {
                //     id: 6,
                //     categoryName: "Engineering",
                //   })
                // }
                onPress={()=>this.props.navigation.navigate('PostRequest')}
                >
                  <ImageBackground
                    source={require("../assets/imgs/engineering.jpg")}
                    style={styles.bgImage2}
                    imageStyle={{ borderRadius: 10 }}
                  >
                    <LinearGradient
                      // Button Linear Gradient
                      colors={["#EF4845", "#A22DB3"]}
                      style={styles.button}
                    >
                      <MaterialIcons
                        name="computer"
                        size={24}
                        color="#fff"
                        style={{ textAlign: "center", marginTop: "auto" }}
                      />
                      <Text
                        allowFontScaling={false}
                        style={[styles.catTitle, { alignSelf: "center" }]}
                      >
                        Engineering
                      </Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginHorizontal: "2%",bottom:"3%" }}
                //  onPress={() =>
                //   this.props.navigation.navigate("PostRequest", {
                //     id: 7,
                //     categoryName: "Lifestyle",
                //   })
                // }
                onPress={()=>this.props.navigation.navigate('PostRequest')}
                >
                  <ImageBackground
                    source={require("../assets/imgs/lifestyle.jpg")}
                    style={styles.bgImage1}
                    imageStyle={{ borderRadius: 10 }}
                  >
                    <LinearGradient
                      // Button Linear Gradient
                      colors={["#EF4845", "#A22DB3"]}
                      style={styles.button2}
                    >
                      <MaterialIcons
                        name="style"
                        size={24}
                        color="#fff"
                        style={{ textAlign: "center", marginTop: "auto" }}
                      />
                      <Text
                        allowFontScaling={false}
                        style={[styles.catTitle, { alignSelf: "center" }]}
                      >
                        Lifestyle
                      </Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginHorizontal: "2%" ,bottom:"3%"}}
                  // onPress={() =>
                  //   this.props.navigation.navigate("PostRequest", {
                  //     id: 9,
                  //     categoryName: "Study",
                  //   })
                  // }
                  onPress={()=>this.props.navigation.navigate('PostRequest')}
                >
                  <ImageBackground
                    source={require("../assets/imgs/study.jpg")}
                    style={styles.bgImage2}
                    imageStyle={{ borderRadius: 10 }}
                  >
                    <LinearGradient
                      // Button Linear Gradient
                      colors={["#EF4845", "#A22DB3"]}
                      style={styles.button}
                    >
                      <Entypo
                        name="open-book"
                        size={24}
                        color="#fff"
                        style={{ textAlign: "center", marginTop: "auto" }}
                      />
                      <Text
                        allowFontScaling={false}
                        style={[styles.catTitle, { alignSelf: "center" }]}
                      >
                        Study
                      </Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginHorizontal: "2%",bottom:"3%" }}
                
                // onPress={() =>
                //   this.props.navigation.navigate("PostRequest", {
                //     id: 5,
                //     categoryName: "Writing",
                //   })
                // }
                onPress={()=>this.props.navigation.navigate('PostRequest')}
                >
                  <ImageBackground
                    source={require("../assets/imgs/marketing.jpg")}
                    style={styles.bgImage1}
                    imageStyle={{ borderRadius: 10 }}
                  >
                    <LinearGradient
                      // Button Linear Gradient
                      colors={["#EF4845", "#A22DB3"]}
                      style={styles.button2}
                    >
                      <MaterialCommunityIcons
                        name="typewriter"
                        size={24}
                        color="#fff"
                        style={{ textAlign: "center", marginTop: "auto" }}
                      />
                      <Text
                        allowFontScaling={false}
                        style={[styles.catTitle, { alignSelf: "center" }]}
                      >
                        Writing
                      </Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
            <View style={{margin:"3%"}}></View>
          </ScrollView>

          {/* <ScrollView>
                        <View style={{  flexDirection:"row",justifyContent:"space-evenly", alignItems:"center",  flexWrap:"wrap"}}>
                        <TouchableOpacity style={styles.card1} onPress={()=> this.props.navigation.navigate("PostRequest",{id:1,categoryName:"Business"})}> 
                        <ImageBackground source={require('../assets/imgs/business.jpg')}  style={styles.bgImage} imageStyle={{borderRadius:10}}>
                        <LinearGradient
                        // Button Linear Gradient
                        start={[0.1, 0.1]}
                        colors={["#EF4845","#A22DB3"]}
                        style={styles.button1}>
                            <Ionicons name="md-business" size={24} color="#fff" style={{textAlign:"center",marginTop:"auto"}} />
                            <Text allowFontScaling={false} style={styles.catTitle}>Business</Text>
                        </LinearGradient>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card}>
                    <ImageBackground source={require('../assets/imgs/creative.jpg')}  style={styles.bgImage1} imageStyle={{borderRadius:10}}>
                            <LinearGradient
                            // Button Linear Gradient
                            start={[0.1, 0.1]}
                            colors={["#EF4845","#A22DB3"]}
                            style={styles.button2}>
                                <Ionicons name="md-create" size={24} color="#fff" style={{textAlign:"center",marginTop:"auto"}} />
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>Creative</Text>
                            </LinearGradient>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card2}>
                        <ImageBackground source={require('../assets/imgs/engineering.jpg')}  style={styles.bgImage2} imageStyle={{borderRadius:10}}>
                            <LinearGradient
                            // Button Linear Gradient
                            colors={["#EF4845","#A22DB3"]}
                            style={styles.button}>
                                
                                <MaterialIcons name="computer" size={24} color="#fff" style={{textAlign:"center",marginTop:"auto"}}/>
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>Engineering</Text>
                            </LinearGradient>
                          </ImageBackground>  
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card2}>
                        <ImageBackground source={require('../assets/imgs/it.jpg')}  style={styles.bgImage2} imageStyle={{borderRadius:10}}>
                            <LinearGradient
                            // Button Linear Gradient
                            colors={["#EF4845","#A22DB3"]}
                            style={styles.button}>
                                <MaterialCommunityIcons name="cellphone-information" size={24} color="#fff" style={{textAlign:"center",marginTop:"auto"}} />
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>IT</Text>
                            </LinearGradient>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                        <ImageBackground source={require('../assets/imgs/lifestyle.jpg')}  style={styles.bgImage1} imageStyle={{borderRadius:10}}>
                            <LinearGradient
                            // Button Linear Gradient
                            colors={["#EF4845","#A22DB3"]}
                            style={styles.button2}>
                                <MaterialIcons name="style" size={24} color="#fff" style={{textAlign:"center", marginTop:"auto"}} />
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>Lifestyle</Text>
                            </LinearGradient>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                        <ImageBackground source={require('../assets/imgs/marketing.jpg')}  style={styles.bgImage1} imageStyle={{borderRadius:10}}>
                            <LinearGradient
                            // Button Linear Gradient
                            colors={["#EF4845","#A22DB3"]}
                            style={styles.button2}>
                                <MaterialCommunityIcons name="home-analytics" size={24} color="#fff" style={{textAlign:"center", marginTop:"auto"}} />
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>Marketing</Text>
                            </LinearGradient>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card2}>
                        <ImageBackground source={require('../assets/imgs/study.jpg')}  style={styles.bgImage2} imageStyle={{borderRadius:10}}>
                            <LinearGradient
                            // Button Linear Gradient
                            colors={["#EF4845","#A22DB3"]}
                            style={styles.button}>
                                <Entypo name="open-book" size={24} color="#fff" style={{textAlign:"center",marginTop:"auto"}} />
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>Study</Text>
                            </LinearGradient>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                        <ImageBackground source={require('../assets/imgs/marketing.jpg')}  style={styles.bgImage1} imageStyle={{borderRadius:10}}>
                            <LinearGradient
                            // Button Linear Gradient
                            colors={["#EF4845","#A22DB3"]}
                            style={styles.button2}>
                                <MaterialCommunityIcons name="typewriter" size={24} color="#fff" style={{textAlign:"center", marginTop:"auto"}} />
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>Writing</Text>
                            </LinearGradient>
                            </ImageBackground>
                        </TouchableOpacity>
                        
                        </View>
                    </ScrollView> */}

          {/* <View style={{ flex:1, flexDirection:"row", justifyContent:"space-evenly", alignItems:"center", flexWrap:"wrap"}}>
                        <TouchableOpacity style={styles.card1} onPress={()=> this.props.navigation.navigate("PostRequest",{id:1,categoryName:"Business"})}> 
                        
                            <LinearGradient
                            // Button Linear Gradient
                            colors={['#F2994A', '#F2C94C']}
                            style={styles.button1}>
                                <Ionicons name="md-briefcase" size={24} color="#fff" style={{textAlign:"center", padding:16, paddingTop:24}} />
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>Business</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                            <LinearGradient
                            // Button Linear Gradient
                            colors={['#F2994A', '#F2C94C']}
                            style={styles.button2}>
                                <Ionicons name="md-briefcase" size={24} color="#fff" style={{textAlign:"center", padding:16, paddingTop:24}} />
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>Creative</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                            <LinearGradient
                            // Button Linear Gradient
                            colors={['#F2994A', '#F2C94C']}
                            style={styles.button}>
                                <Ionicons name="md-briefcase" size={24} color="#fff" style={{textAlign:"center", padding:16, paddingTop:24}} />
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>Engineering</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                            <LinearGradient
                            // Button Linear Gradient
                            colors={['#F2994A', '#F2C94C']}
                            style={styles.button}>
                                <Ionicons name="md-briefcase" size={24} color="#fff" style={{textAlign:"center", padding:16, paddingTop:24}} />
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>IT</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                            <LinearGradient
                            // Button Linear Gradient
                            colors={['#F2994A', '#F2C94C']}
                            style={styles.button2}>
                                <Ionicons name="md-briefcase" size={24} color="#fff" style={{textAlign:"center", padding:16, paddingTop:24}} />
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>Lifestyle</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                            <LinearGradient
                            // Button Linear Gradient
                            colors={['#F2994A', '#F2C94C']}
                            style={styles.button}>
                                <Ionicons name="md-briefcase" size={24} color="#fff" style={{textAlign:"center", padding:16, paddingTop:24}} />
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>Marketing</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                            <LinearGradient
                            // Button Linear Gradient
                            colors={['#F2994A', '#F2C94C']}
                            style={styles.button}>
                                <Ionicons name="md-briefcase" size={24} color="#fff" style={{textAlign:"center", padding:16, paddingTop:24}} />
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>Study</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}>
                            <LinearGradient
                            // Button Linear Gradient
                            colors={['#F2994A', '#F2C94C']}
                            style={styles.button}>
                                <Ionicons name="md-briefcase" size={24} color="#fff" style={{textAlign:"center", padding:16, paddingTop:24}} />
                                <Text allowFontScaling={false} style={[styles.catTitle, {alignSelf:"center"}]}>Writing</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View> */}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerr: {
    flexDirection: "row",
    marginTop: 40,
    alignSelf: "stretch",
    justifyContent: "space-between",
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
    marginHorizontal: 16,
  },
  heading: {
    fontFamily: "Futura",
    fontSize: 22,
    marginTop: 6,
    textAlign: "center",
    color: "#171919",
  },

  img: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 16,
  },
  name: {
    fontFamily: "Futura",
    color: "#171919",
    padding: 16,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 12,
  },
  label: {
    fontFamily: "OpenSans",
    color: "#767676",
    fontSize: 12,
    paddingHorizontal: 16,
  },
  catTitle: {
    fontFamily: "Futura",
    fontSize: 20,
    color: "#fff",
    alignSelf: "center",
    marginBottom: "auto",
  },
  card: {
    marginTop: "10%",
    width: "45%",
  },
  card1: {
    marginTop: "10%",
    width: "45%",
    borderRadius: 10,
  },
  card2: {
    width: "45%",
  },
  button: {
    borderRadius: 10,
    height: 200,
  },
  button1: {
    borderRadius: 10,
    height: 150,
  },
  button2: {
    borderRadius: 10,
    height: 150,
  },
  bgImage: {
    marginTop: "10%",
    width: "100%",
    opacity: 0.7,
  },
  bgImage1: {
    marginTop: "10%",
    width: "100%",
    opacity: 0.7,
  },
  bgImage2: {
    marginTop: "10%",
    width: "100%",
    opacity: 0.7,
  },
});
