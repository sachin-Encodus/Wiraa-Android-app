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
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import CommonHeader from "../component/CommonHeader";
import { widthPercentageToDP } from "react-native-responsive-screen";

export default class Pricing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePic: null,
      isFetching: false,
      userProfileId: "",
      projectModal: false,
      monthly: true,
      packageName: "",
      packagePrice: "",
      packageconnects: "",
      monthlyPackage: [],
      quaterlyPackage: [],
      selectPackage:null,
      packageDetails:''
    };
  }

  componentDidMount() {
    this.getPackages();
  }

  getPackages = () => {
    fetch("http://demo.wiraa.com/api/Users/GetPackages",{
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("packages-->", responseJson);
        let monthlyPackage = [];
        let quaterlyPackage = [];
        // responseJson.map((e)=>console.log('11111111111--',e).filter((item)=>console.log('------>>>??',item)))
        responseJson
          .filter((item) => item.isMonthly)
          .map((data) => {
            monthlyPackage.push({
              name: data.name,
              price: data.price,
              connects: data.connects,
              id: data.id,
              isMonthly: data.isMonthly,
            });
          });
        responseJson
          .filter((item) => !item.isMonthly)
          .map((data) => {
            quaterlyPackage.push({
              name: data.name,
              price: data.price,
              connects: data.connects,
              id: data.id,
              isMonthly: data.isMonthly,
            });
          });

        this.setState({ monthlyPackage, quaterlyPackage });
      });
  };


  openModel=(i,item)=>{
      console.log("iiii",item)
    this.setState({ projectModal: true, selectPackage:i ,packageDetails:item })
  }


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
        <View
          style={[
            styles.container,
            { opacity: this.state.projectModal ? 0.3 : 1 },
          ]}
        >
          <CommonHeader
            headerName="Packages"
            navigation={this.props.navigation}
          />

          {/* <View style={styles.headerr}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{marginTop:"5%"}}>
                            <Ionicons name="ios-arrow-back" size={24} color="#767676"/>
                        </TouchableOpacity>
                        <Text allowFontScaling={false} style={{marginLeft:"auto",marginRight:"auto",fontSize:22,
        color:"#171919",marginBottom:'5%',fontFamily:"Futura",marginTop:"5%"}}>Packages</Text>
                         */}
          {/* <TouchableOpacity onPress={() => this.props.navigation.navigate("Messages")}>
                            <Ionicons name="md-person" size={24} color="#767676" style={{paddingTop:10, paddingLeft:0}} />
                        </TouchableOpacity> */}
          {/* </View> */}

          {/* <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center", marginTop:0}}>
                        <TouchableOpacity style={styles.follow} onPress={() => this.setState({monthly: true})}>
                            <Text style={[styles.followTxt, {color: !this.state.monthly ? "#fff" : "#fff"}]}>Monthly</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.follow} onPress={() => this.setState({monthly: false})}>
                            <Text style={[styles.followTxt, {color: this.state.monthly ? "#fff" : "#fff"}]}>Quarterly</Text>
                        </TouchableOpacity>
                    </View> */}
<ScrollView>
          <View
            style={{
              flexDirection: "row",
              // alignSelf: "stretch",
              justifyContent:'space-evenly',
              margin: 16,
         
              marginBottom: 0,
              marginTop: "5%",
              display: this.state.headingVal === "Client" ? "none" : "flex",
            }}
          >
         
              <TouchableOpacity
                onPress={() => this.setState({ monthly: true })}
                style={{ borderRadius: 10, width: widthPercentageToDP(40)}}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.name,
                    {
                      paddingTop: 16,
                      paddingBottom: 16,
                      textAlign: "center",
                      marginRight: 8,
                      backgroundColor: !this.state.monthly ? "#efefef" : "#f56",
                      borderRadius: 10,
                      color: !this.state.monthly ? "#171919" : "#fff",
                      fontSize: 16,
                    },
                  ]}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ monthly: false })}
                style={{ borderRadius: 10,  width: widthPercentageToDP(40) }}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.name,
                    {
                      paddingTop: 16,
                      paddingBottom: 16,
                      textAlign: "center",
                      marginLeft: 8,
                      backgroundColor: !this.state.monthly ? "#f56" : "#efefef",
                      borderRadius: 10,
                      color: !this.state.monthly ? "#fff" : "#171919",
                      fontSize: 16,
                    },
                  ]}
                >
                  Quarterly
                </Text>
              </TouchableOpacity>
            </View>
        

          <Text
            style={[
              styles.name,
              { color: "#f56", fontSize: 22, paddingTop: 0, paddingTop: 32 },
            ]}
          >
            On 0% Commission
          </Text>
          <Text
            style={[
              styles.name,
              { color: "#171919", fontSize: 12, paddingTop: 10 },
            ]}
          >
            Upgrade To A Curated Package To Maximise Your Business Success And
            Earnings! Change Your Plans Anytime.
          </Text>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            snapToAlignment="center"
            snapToInterval={320}
            style={{marginTop:30, marginBottom:20}}
          >
            <ScrollView   >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                display: this.state.monthly ? "flex" : "none",
                padding: 0,
              }}
            >
              {this.state.monthlyPackage
                ? this.state.monthlyPackage.map((item) => {
                    return (
                      <TouchableOpacity
                        style={styles.card}
                        onPress={() => this.openModel(item.id,item)}
                      >
                        <LinearGradient
                          // Button Linear Gradient
                          colors={
                            item.name === "Basic"
                              ? ["#F4A3F1", "#FC5B87"]
                              : item.name === "Plus"
                              ? ["#fc4a1a", "#f7b733"]
                              : item.name === "Premium"
                              ? ["#00c6ff", "#0072ff"]
                              : null
                          }
                          start={{ x: -1, y: 3 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.button}
                        >
                          <Ionicons
                            name="md-gift"
                            size={32}
                            color="#fff"
                            style={{
                              textAlign: "center",
                              backgroundColor: "rgba(255,255,255,.2)",
                              borderRadius: 60,
                              alignSelf: "center",
                              padding: 24,
                              paddingVertical: 20,
                              marginTop: 24,
                            }}
                          />

                          <Text
                            style={[
                              styles.name,
                              { paddingBottom: 16, paddingTop: 16 },
                            ]}
                          >
                            {item.name}
                          </Text>
                          <Text style={styles.label}>
                            {item.connects} {"Connects"}
                          </Text>
                          {item.name === "Basic" ? (
                            <View>
                              <Text style={styles.label}>
                                Higher Score Badge
                              </Text>
                              <Text style={styles.label}>
                                Normal Customer Support
                              </Text>
                              <Text
                                style={[
                                  styles.label,
                                  {
                                    textDecorationLine: "line-through",
                                    opacity: 0.5,
                                  },
                                ]}
                              >
                                Direct Projects from Clients
                              </Text>
                              <Text
                                style={[
                                  styles.label,
                                  {
                                    textDecorationLine: "line-through",
                                    opacity: 0.5,
                                  },
                                ]}
                              >
                                Promote your own Website
                              </Text>
                              <Text
                                style={[
                                  styles.label,
                                  {
                                    textDecorationLine: "line-through",
                                    opacity: 0.5,
                                  },
                                ]}
                              >
                                Get Suggested to Clients
                              </Text>
                              <Text
                                style={[
                                  styles.label,
                                  {
                                    textDecorationLine: "line-through",
                                    opacity: 0.5,
                                  },
                                ]}
                              >
                                30 min Advanced Project Alerts
                              </Text>
                            </View>
                          ) : item.name === "Plus" ? (
                            <View>
                              {/* <Text style={styles.label}>60 Connects</Text> */}
                              <Text style={styles.label}>
                                Higher Score Badge
                              </Text>
                              <Text style={styles.label}>
                                Normal Customer Support
                              </Text>
                              <Text style={styles.label}>
                                Direct Projects from Clients
                              </Text>
                              <Text style={styles.label}>
                                Promote your own Website
                              </Text>
                              <Text
                                style={[
                                  styles.label,
                                  {
                                    textDecorationLine: "line-through",
                                    opacity: 0.5,
                                  },
                                ]}
                              >
                                Get Suggested to Clients
                              </Text>
                              <Text
                                style={[
                                  styles.label,
                                  {
                                    textDecorationLine: "line-through",
                                    opacity: 0.5,
                                  },
                                ]}
                              >
                                30 min Advanced Project Alerts
                              </Text>
                            </View>
                          ) : item.name === "Premium" ? (
                            <View>
                              {/* <Text style={styles.label}>Unlimited Connects</Text> */}
                              <Text style={styles.label}>
                                Higher Score Badge
                              </Text>
                              <Text style={styles.label}>
                                Normal Customer Support
                              </Text>
                              <Text style={styles.label}>
                                Direct Projects from Clients
                              </Text>
                              <Text style={styles.label}>
                                Promote your own Website
                              </Text>
                              <Text style={styles.label}>
                                Get Suggested to Clients
                              </Text>
                              <Text style={styles.label}>
                                30 min Advanced Project Alerts
                              </Text>
                            </View>
                          ) : null}

                          <Text style={[styles.name]}>₹{item.price}</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    );
                  })
                : null}

              {/* <TouchableOpacity style={styles.card}>
                                <LinearGradient
                                    // Button Linear Gradient
                                    colors={['#fc4a1a', '#f7b733']}
                                    start={{ x: -1, y: 3 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.button}>

                                    <Ionicons name="md-gift" size={32} color="#fff" style={{textAlign:"center", backgroundColor:"rgba(255,255,255,.2)", borderRadius:60, alignSelf:"center", padding:24, paddingVertical:20, marginTop:24}} />

                                    <Text style={[styles.name, {paddingBottom:16, paddingTop:16}]}>Plus</Text>
                                    <View>
                                        <Text style={styles.label}>60 Connects</Text>
                                        <Text style={styles.label}>Higher Score Badge</Text>
                                        <Text style={styles.label}>Normal Customer Support</Text>
                                        <Text style={styles.label}>Direct Projects from Clients</Text>
                                        <Text style={styles.label}>Promote your own Website</Text>
                                        <Text style={[styles.label, {textDecorationLine:"line-through", opacity:0.5}]}>Get Suggested to Clients</Text>
                                        <Text style={[styles.label, {textDecorationLine:"line-through", opacity:0.5}]}>30 min Advanced Project Alerts</Text>
                                    </View>
                                    <Text style={[styles.name]}>₹499</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.card, {marginRight:44}]}>
                                <LinearGradient
                                    // Button Linear Gradient
                                    colors={['#00c6ff', '#0072ff']}
                                    start={{ x: -1, y: 3 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.button}>

                                    <Ionicons name="md-gift" size={32} color="#fff" style={{textAlign:"center", backgroundColor:"rgba(255,255,255,.2)", borderRadius:60, alignSelf:"center", padding:24, paddingVertical:20, marginTop:24}} />

                                    <Text style={[styles.name, {paddingBottom:16, paddingTop:16}]}>Premium</Text>
                                    <View>
                                        <Text style={styles.label}>Unlimited Connects</Text>
                                        <Text style={styles.label}>Higher Score Badge</Text>
                                        <Text style={styles.label}>Normal Customer Support</Text>
                                        <Text style={styles.label}>Direct Projects from Clients</Text>
                                        <Text style={styles.label}>Promote your own Website</Text>
                                        <Text style={styles.label}>Get Suggested to Clients</Text>
                                        <Text style={styles.label}>30 min Advanced Project Alerts</Text>
                                    </View>
                                    <Text style={[styles.name]}>₹999</Text>
                                </LinearGradient>
                            </TouchableOpacity> */}
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                display: !this.state.monthly ? "flex" : "none",
              }}
            >
              {this.state.quaterlyPackage
                ? this.state.quaterlyPackage.map((item) => {
                    return (
                      <TouchableOpacity style={styles.card}
                      onPress={() => this.openModel(item.id,item)}
                      >
                        <LinearGradient
                          // Button Linear Gradient
                          colors={
                            item.name === "Basic"
                              ? ["#F4A3F1", "#FC5B87"]
                              : item.name === "Plus"
                              ? ["#fc4a1a", "#f7b733"]
                              : item.name === "Premium"
                              ? ["#00c6ff", "#0072ff"]
                              : null
                          }
                          start={{ x: -1, y: 3 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.button}
                        >
                          <Ionicons
                            name="md-gift"
                            size={32}
                            color="#fff"
                            style={{
                              textAlign: "center",
                              backgroundColor: "rgba(255,255,255,.2)",
                              borderRadius: 60,
                              alignSelf: "center",
                              padding: 24,
                              paddingVertical: 20,
                              marginTop: 24,
                            }}
                          />

                          <Text
                            style={[
                              styles.name,
                              { paddingBottom: 16, paddingTop: 16 },
                            ]}
                          >
                            {item.name}
                          </Text>
                          <Text style={styles.label}>
                            {item.connects} {"Connects"}
                          </Text>

                          {item.name === "Basic" ? (
                            <View>
                              <Text style={styles.label}>
                                Higher Score Badge
                              </Text>
                              <Text style={styles.label}>
                                Normal Customer Support
                              </Text>
                              <Text
                                style={[
                                  styles.label,
                                  {
                                    textDecorationLine: "line-through",
                                    opacity: 0.5,
                                  },
                                ]}
                              >
                                Direct Projects from Clients
                              </Text>
                              <Text
                                style={[
                                  styles.label,
                                  {
                                    textDecorationLine: "line-through",
                                    opacity: 0.5,
                                  },
                                ]}
                              >
                                Promote your own Website
                              </Text>
                              <Text
                                style={[
                                  styles.label,
                                  {
                                    textDecorationLine: "line-through",
                                    opacity: 0.5,
                                  },
                                ]}
                              >
                                Get Suggested to Clients
                              </Text>
                              <Text
                                style={[
                                  styles.label,
                                  {
                                    textDecorationLine: "line-through",
                                    opacity: 0.5,
                                  },
                                ]}
                              >
                                30 min Advanced Project Alerts
                              </Text>
                            </View>
                          ) : item.name === "Plus" ? (
                            <View>
                              {/* <Text style={styles.label}>180 Connects</Text> */}
                              <Text style={styles.label}>
                                Higher Score Badge
                              </Text>
                              <Text style={styles.label}>
                                Normal Customer Support
                              </Text>
                              <Text style={styles.label}>
                                Direct Projects from Clients
                              </Text>
                              <Text style={styles.label}>
                                Promote your own Website
                              </Text>
                              <Text
                                style={[
                                  styles.label,
                                  {
                                    textDecorationLine: "line-through",
                                    opacity: 0.5,
                                  },
                                ]}
                              >
                                Get Suggested to Clients
                              </Text>
                              <Text
                                style={[
                                  styles.label,
                                  {
                                    textDecorationLine: "line-through",
                                    opacity: 0.5,
                                  },
                                ]}
                              >
                                30 min Advanced Project Alerts
                              </Text>
                            </View>
                          ) : item.name === "Premium" ? (
                            <View>
                              {/* <Text style={styles.label}>Unlimited Connects</Text> */}
                              <Text style={styles.label}>
                                Higher Score Badge
                              </Text>
                              <Text style={styles.label}>
                                Normal Customer Support
                              </Text>
                              <Text style={styles.label}>
                                Direct Projects from Clients
                              </Text>
                              <Text style={styles.label}>
                                Promote your own Website
                              </Text>
                              <Text style={styles.label}>
                                Get Suggested to Clients
                              </Text>
                              <Text style={styles.label}>
                                30 min Advanced Project Alerts
                              </Text>
                            </View>
                          ) : null}

                          <Text style={[styles.name]}>
                            ₹{item.price}{" "}
                            <Text style={{ fontSize: 12 }}>10% Off</Text>{" "}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    );
                  })
                : null}

              {/* <TouchableOpacity style={styles.card}>
                                <LinearGradient
                                    // Button Linear Gradient
                                    colors={['#fc4a1a', '#f7b733']}
                                    start={{ x: -1, y: 3 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.button}>

                                    <Ionicons name="md-gift" size={32} color="#fff" style={{textAlign:"center", backgroundColor:"rgba(255,255,255,.2)", borderRadius:60, alignSelf:"center", padding:24, paddingVertical:20, marginTop:24}} />

                                    <Text style={[styles.name, {paddingBottom:16, paddingTop:16}]}>Plus</Text>
                                    <View>
                                        <Text style={styles.label}>180 Connects</Text>
                                        <Text style={styles.label}>Higher Score Badge</Text>
                                        <Text style={styles.label}>Normal Customer Support</Text>
                                        <Text style={styles.label}>Direct Projects from Clients</Text>
                                        <Text style={styles.label}>Promote your own Website</Text>
                                        <Text style={[styles.label, {textDecorationLine:"line-through", opacity:0.5}]}>Get Suggested to Clients</Text>
                                        <Text style={[styles.label, {textDecorationLine:"line-through", opacity:0.5}]}>30 min Advanced Project Alerts</Text>
                                    </View>
                                    <Text style={[styles.name]}>₹1349 <Text style={{fontSize:12}}>10% Off</Text> </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.card, {marginRight:44}]}>
                                <LinearGradient
                                    // Button Linear Gradient
                                    colors={['#00c6ff', '#0072ff']}
                                    start={{ x: -1, y: 3 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.button}>

                                    <Ionicons name="md-gift" size={32} color="#fff" style={{textAlign:"center", backgroundColor:"rgba(255,255,255,.2)", borderRadius:60, alignSelf:"center", padding:24, paddingVertical:20, marginTop:24}} />

                                    <Text style={[styles.name, {paddingBottom:16, paddingTop:16}]}>Premium</Text>
                                    <View>
                                        <Text style={styles.label}>Unlimited Connects</Text>
                                        <Text style={styles.label}>Higher Score Badge</Text>
                                        <Text style={styles.label}>Normal Customer Support</Text>
                                        <Text style={styles.label}>Direct Projects from Clients</Text>
                                        <Text style={styles.label}>Promote your own Website</Text>
                                        <Text style={styles.label}>Get Suggested to Clients</Text>
                                        <Text style={styles.label}>30 min Advanced Project Alerts</Text>
                                    </View>
                                    <Text style={[styles.name]}>₹2699 <Text style={{fontSize:12}}>10% Off</Text> </Text>
                                </LinearGradient>
                            </TouchableOpacity> */}
            </View>
            </ScrollView>
          </ScrollView>

          {/* <TouchableOpacity style={[styles.follow, {marginTop:16, padding:16, paddingHorizontal:32, borderRadius:60, alignSelf:"center", marginBottom:32}]}>
                        <Text style={styles.followTxt}>Choose Plan</Text>
                    </TouchableOpacity> */}
          <Modal
            transparent={true}
            animationType="fade"
            visible={this.state.projectModal}
            onRequestClose={() =>
              this.setState({ projectModal: !this.state.projectModal })
            }
          >
            <View
              behavior="height"
              style={[styles.modalContainer, { marginVertical: 280 }]}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.heading,
                  { paddingTop: 10, paddingHorizontal: 16 },
                ]}
              >
                Are you sure you want to change your current package?
              </Text>
              <Text
                allowFontScaling={false}
                style={[styles.labell, { paddingVertical: 16, paddingTop: 0 }]}
              >
                Once changed, so your old plan deactivated!
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 32,
                }}
              >
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    this.setState({ projectModal: false });
                    this.props.navigation.navigate("PackageDetails",{packageDetails:this.state.packageDetails,selectPackage:this.state.selectPackage});
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontFamily: "Futura",
                      color: "#fff",
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    YES
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#767676" }]}
                  onPress={() => this.setState({ projectModal: false })}
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontFamily: "Futura",
                      color: "#fff",
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    NO
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          </ScrollView>
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
    marginTop: "5%",
    alignSelf: "stretch",
    paddingBottom: 6,
    borderBottomWidth: 0,
    borderBottomColor: "#efefef",
    marginHorizontal: 16,
  },
  heading: {
    fontFamily: "Futura",
    fontSize: 22,
    color: "#171919",
    marginTop: 6,
    textAlign: "center",
    paddingBottom: 16,
  },
  modalContainer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 300,
    paddingTop: 16,
    borderRadius: 16,
    elevation: 6,
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
    color: "#fff",
    padding: 14,
    paddingTop: "5%",
    paddingBottom: 0,
    fontSize: 32,
    textAlign: "center",
  },
  label: {
    fontFamily: "OpenSans",
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 0,
    textAlign: "left",
    lineHeight: 30,
  },
  labell: {
    fontFamily: "OpenSans",
    color: "#171919",
    fontSize: 14,
    padding: 22,
    textAlign: "center",
  },
  follow: {
    backgroundColor: "#f56",
    alignSelf: "stretch",
    padding: 10,
    margin: 20,
    marginBottom: 0,
    marginTop: 10,
    marginVertical: 5,
    borderRadius: 6,
    elevation: 4,
  },
  followTxt: {
    textAlign: "center",
    fontSize: 14,
    color: "#fff",
    fontFamily: "Futura",
  },
  catTitle: {
    textAlign: "center",
    fontFamily: "Futura",
    fontSize: 14,
    paddingTop: 10,
    marginBottom: 32,
  },
  incom: {
    marginLeft: 24,
  },
  card: {
    width: "30%",
    marginLeft: 24,
  },
  button: {
    padding: 24,
    paddingTop: 16,
    borderRadius: 20,
  },
  btn: {
    backgroundColor: "#f56",
    borderRadius: 10,
    paddingVertical: 14,
    width: 100,
    marginTop: 10,
    alignSelf: "center",
    elevation: 6,
  },
});
