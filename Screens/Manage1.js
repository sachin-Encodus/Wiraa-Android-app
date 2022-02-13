import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Modal,
  RefreshControl,
} from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Provider, Menu, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommonHeader from "../../expo-encodus/my-app/component/CommonHeader";
const window = Dimensions.get("window");

export default class Manage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false, //MENU
      headingVal: "Professional",
      toggleActive: false, //CHANGE ONLINE / FACE-2-FACE
      userId: "",
      orders: [],
      online: [],
      face2Face: [],
      isLoading: true,
      profilePic: null,
      isFetching: false,
      cityEnabled: false,
      userType: "",
      isModalVisible: false,
      userProfileId: "",
      city: [],
      refresh: false,
      parseData: [],
      userCityName: "",
      userCountryName: "",
    };
  }

  closeMenu = () => {
    this.setState({
      isVisible: false,
    });
  };

  openMenu = () => {
    this.setState({
      isVisible: true,
    });
  };

  componentDidMount = async () => {
    const userInfo = await AsyncStorage.getItem("userData");
    var parseData = await JSON.parse(userInfo);
    this.setState({ parseData: parseData });
    // console.log("parseData---->>>>", parseData);

    const userId = await AsyncStorage.getItem("userId");
    if (userId !== null) {
      this.setState({ userId });
    } else {
      console.log("null");
    }

    const userProfileId = await AsyncStorage.getItem("userPrfileId");
    if (userProfileId !== null) {
      this.setState({ userProfileId });
    }

    const profilePic = await AsyncStorage.getItem("profilePic");
    if (profilePic !== null) {
      this.setState({ profilePic });
    }

    const userType = await AsyncStorage.getItem("userType");
    if (userType !== null) {
      this.setState({ userType });
    }
    // console.log('userTyp-----',userId)

    this.toggle();
    if (this.props.route.params.projectType === "ONLINE") {
      this.toggle();
      this.getOnlineProjects(this.state.userId);
    } else if (this.props.route.params.projectType === "FACE2FACE") {
      this.toggle();
      this.getFace2FaceProjects(this.state.userId);
    } else if (this.props.route.params.myOrder === "MYORDER") {
      this.getOrders(userId);
    }
    // console.log("parse data~~~~~~~~~~~~~~~~~~~~", parseData);

    this.getProfileBasicInfo(userId);
  };

  getProfileBasicInfo = (userId) => {
    //GET PROFILE INFO
    this.setState({ isLoading: true });
    fetch("http://demo.wiraa.com/api/Profile/GetProfile?userId=" + userId)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log("profile city-->>", responseJson.userCity);
        this.setState({
          userCityName: responseJson.userCity.cityName
            ? responseJson.userCity.cityName
            : "search city...",
        });
        this.setState({
          userCountryName: responseJson.userCity.countryName
            ? responseJson.userCity.countryName
            : " ",
        });

        // let userInfo = [];
        // userInfo.push({
        //     id: responseJson.$id,
        //     // userProfileId: responseJson.usersProfileID,
        //     // userName: responseJson.name+" "+responseJson.lName,
        //     // occupation: responseJson.occupation,
        //     // about: responseJson.aboutMe,
        //     // profilePic: responseJson.profilePic,
        //     // followers: responseJson.totalFollowers,
        //     // following: responseJson.totalFollowings,
        //     // bannerImg: responseJson.bannerImage,
        //     // followStatus: responseJson.followStatus,
        //     // qual: responseJson.highestQualification,
        //     // uni:responseJson.university,
        //     // school: responseJson.school,
        //     city: responseJson.userCity !== undefined && responseJson.userCity.cityName !== null ? responseJson.userCity.cityName : "",
        //     // country: responseJson.userCity !== undefined && responseJson.userCitycountryName !== null ? responseJson.userCity.countryName : "",
        //     // userType: responseJson.userType
        // });
      });
      
  };

  toggle = () => {
    this.setState({
      toggleActive: !this.state.toggleActive,
    });

    if (this.props.route.params.projectType === "ONLINE") {
      this.getOnlineProjects(this.state.userId);
    } else if (this.props.route.params.projectType === "FACE2FACE") {
      // this.setState({ isLoading: true, toggleActive:"Face2Face" })
      this.getFace2FaceProjects(this.state.userId);
    }
  };

  getOrders = (userId) => {
    this.setState({ isFetching: true });

    fetch("http://demo.wiraa.com/Api/Project/GetOrders?Id=" + userId, {
      method: "GET",
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        if (responseJson.length > 0) {
          let orders = [];
          responseJson.map((item) => {
            orders.push({
              id: item.$id,
              reqId: item.postreqID,
              userName: item.userName,
              profilePic: item.profilePic,
              password: item.password,
              description: item.pR_Description,
              status: item.postStatus,
              respone: item.responseNo,
              date: item.applyDate,
              directUserId:item.directUserId
            });
            this.setState({
              orders,
              isLoading: false,
              isFetching: false,
            });
            // console.log(
            //   "---------------0==00=0=-0=0=009-09-9-",
            //   item.postStatus
            // );
          });
        } else {
          this.setState({ isLoading: false });
        }
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        console.error(error);
      });
  };

  getOnlineProjects = async (userId) => {
    

    let API = "";

    if (this.state.userType === "3") {
      API = "http://demo.wiraa.com/API/Project/GetAllProjects?Id=";
    } else {
      API = "http://demo.wiraa.com/api/users/GetClientOnlineProject?userId=";
    } 

    fetch(API + userId + "&mode=online", {
      method: "GET",
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        // console.log("sadhjagsdjgjagjgaaaaaaaaaaaa", responseJson);
        let online = [];
        responseJson.map((item) => {
          online.push({
            id: item.$id,
            reqId: item.postreqID,
            userName: item.userName,
            profilePic: item.profilePic,
            password: item.password,
            description: item.pR_Description,
            status: item.postStatus,
            respone: item.responseNo,
            date: item.applyDate,
            senderUserId: item.userid,
            remaingDays: item.postValidity,
            directUserId:item.directUserId
          });

          this.setState({
            online,
            isLoading: false,
            isFetching: false,
          });
        });
        //   alert('online project')
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        console.error(error);
      });
  };

  getFace2FaceProjects = (userId) => {
    // this.setState({ isFetching: true });

    let API = "";

    if (this.state.userType === "3") {
      API = "http://demo.wiraa.com/API/Project/GetAllProjects?Id=";
    } else {
      API =
        "http://demo.wiraa.com/api/users/GetClientFacetoFaceeProject?userId=";
    }

    fetch(API + userId + "&mode=face-2-face", {
      method: "GET",
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success

      .then((responseJson) => {
        //Success
      
        let face2Face = [];

        if (responseJson.length > 0) {
          responseJson.map((item) => {
            face2Face.push({
              id: item.$id,
              reqId: item.postreqID,
              userName: item.userName,
              profilePic: item.profilePic,
              password: item.password,
              description: item.pR_Description,
              status: item.postStatus,
              respone: item.responseNo,
              date: item.applyDate,
              senderUserId: item.userid,
              city: item.city,
              remaingDays: item.postValidity,
              directUserId:item.directUserId
            });

            this.setState({
              face2Face,
              isLoading: false,
              isFetching: false,
            });
          });
        } else {
          this.setState({
            face2Face: [],
            isLoading: false,
            isFetching: false,
          });
        }
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        console.error(error);
      });
  };

  viewProfile = (userId) => {
    fetch("http://demo.wiraa.com/api/Users/GetUsers?Id=" + userId)
      .then((respone) => respone.json())
      .then((responseJson) => {
        responseJson.usersProfile.usersProfileID !== this.state.userProfileId
          ? this.props.navigation.navigate("UserProfile", {
              fkUserProfileId: responseJson.usersProfile.usersProfileID,
            })
          : this.props.navigation.navigate("Profile");
      });
  };

  onRefresh = (data) => {
    // this.getFace2FaceProjects(this.state.userId);

    console.log('mode-111--->>',data)
    if(data.detail.mode[0] === "Online"){
        this.setState({
            online: this.state.online.map(item => item.reqId === data.detail.id ? {...item, status: data.detail.status[0] , respone: data.detail.response[0]} : item)
        })
    }else{
        this.setState({
            face2Face: this.state.face2Face.map(item => item.reqId === data.detail.id ? {...item, status: data.detail.status[0], respone: data.detail.response[0]} : item)
        })
    }
  };

  renderOrders = (item, index) => {
    const date = item.date.split("T");
    // console.log('-------------------...',item)
    return (

      // item.directUserId == this.state.userId  || item.directUserId == 0 ?

      <TouchableOpacity
        style={{
          backgroundColor:  item.directUserId !== 0 ? "#d9feff" : "#fff" ,  //item.directUserId == this.state.userId ? "#d9feff" :
          marginVertical: "2%",
          elevation: 7,
          borderRadius: 10,
          width: "95%",
          display: "flex",
          marginLeft: "3.3%",
          marginRight: "auto",
        }}
        onPress={() =>
          this.props.navigation.navigate("OrderDetails", {
            id: item.reqId,
            response: item.respone,
            date:date
          })
        }
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              margin: 16,
              marginBottom: 10,
              marginRight: 10,
              marginTop: 20,
            }}
            source={{
              uri:
                item.profilePic === null
                  ? "http://demo.wiraa.com/Images/Profile.png"
                  : "http://demo.wiraa.com/" + item.profilePic,
            }}
          />
          <View style={{ marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Profile")}
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                zIndex: 999,
              }}
            >
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: "Futura",
                  color: "#171919",
                  fontSize: 16,
                  paddingTop: 14,
                  width: 200,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.userName}
              </Text>
              <Text
                allowFontScaling={false}
                style={
                  (styles.status,
                  {
                    fontFamily: "OpenSans",
                    color:
                      item.status === "Running"
                        ? "#2C974B"
                        : item.status === "Active"
                        ? "#2C974B"
                        : "#aaaaaa",
                    fontSize: 12,
                    marginLeft: "13%",
                    fontStyle: "italic",
                    paddingTop: 16,
                  })
                }
              >
                {item.status}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "stretch",
                justifyContent: "flex-start",
                marginVertical: 8,
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Ionicons name="md-repeat" size={18} color="#767676" />
                <Text
                  allowFontScaling={false}
                  style={[styles.labell, { fontSize: 12, paddingLeft: 6 }]}
                >
                  {item.respone}
                </Text>
              </View>
              <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
                <Ionicons name="md-calendar" size={18} color="#767676" />
                <Text
                  allowFontScaling={false}
                  style={[styles.labell, { fontSize: 12, paddingLeft: 6 }]}
                >
                  {date[0]}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Text
          allowFontScaling={false}
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[
            styles.label,
            {
              color: "#767676",
              lineHeight: 15,
              paddingTop: 2,
              marginHorizontal: 16,
              paddingBottom: 16,
              marginRight: 20,
              paddingLeft: 0,
            },
          ]}
        >
          {item.description}
        </Text>
      </TouchableOpacity>
      // :
      // null
    );
  };

  renderOnlineProjects = (item, index) => {
    // console.log('***********************1111111',item);
    let status = "";
    if (item.respone > 0 && item.status !== "Closed"){
        status = "Running";
    }else{
        status = item.status
    }
    const date = item.date.split("T");
    return (     
      item.directUserId == this.state.userId  ||  item.directUserId == 0 ?
          <View style={[styles.onProject,{backgroundColor: item.directUserId == this.state.userId ? "#d9feff" : "#fff"}]}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("ProjectDetails", {
            id: item.reqId,
            response: item.respone,
            senderUserId: item.senderUserId,
            userName: item.userName,
            profilePic: item.profilePic,
            status: item.status,
            onRefresh: this.onRefresh,
            date:date
          })
        }
      >
        <View style={{ flexDirection: "row",width:"80%"}}>
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              margin: 16,
              marginBottom: 10,
              marginRight: 10,
              marginTop: 20,
            }}
            source={{
              uri:
                item.profilePic === null
                  ? "http://demo.wiraa.com/Images/Profile.png"
                  : "http://demo.wiraa.com/" + item.profilePic,
            }}
          />
          <View style={{ marginTop: 8 }}>
            <View style={{ flexDirection: "row"}}>
                <View style={{width:"80%"}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: "Futura",
                  color: "#171919",
                  fontSize: 16,
                  paddingTop: 14,
                  width: "60%",
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.userName}
              </Text>
              </View>
              
            </View>

            <View
              style={{
                flexDirection: "row",
                alignSelf: "stretch",
                justifyContent: "flex-start",
                marginVertical: 8,
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Ionicons name="md-repeat" size={18} color="#767676" />
                <Text
                  allowFontScaling={false}
                  style={[styles.labell, { fontSize: 12, paddingLeft: 6 }]}
                >
                  {item.respone}
                </Text>
              </View>
              <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
                <Ionicons name="md-calendar" size={18} color="#767676" />
                <Text
                  allowFontScaling={false}
                  style={[styles.labell, { fontSize: 12, paddingLeft: 6 }]}
                >
                  {date[0]}
                </Text>
              </View>
            </View>
          </View>
          <View style={{width:"20%"}}>
              <Text
                allowFontScaling={false}
                style={
                  (styles.status,
                  {
                    fontFamily: "OpenSans",
                    color:
                      item.status === "Running"
                        ? "#2C974B"
                        : item.status === "Active"
                        ? "#2C974B"
                        : "#aaaaaa",
                    fontSize: 12,
                    fontStyle: "italic",
                    paddingTop: 16,
                  })
                }
              >
                {/* item.status === "Running" ? "Active" : */}
                { item.status}
              </Text>
              </View>
        </View>
        <View style={{width:"80%"}}>
        <Text
          allowFontScaling={false}
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[
            styles.label,
            {
              color: "#767676",
              lineHeight: 15,
              paddingTop: 2,
              paddingBottom: 16,
            },
          ]}
        >
          {item.description}
        </Text>
        </View>
      </TouchableOpacity>
      </View>
      
      :
      null
    );
  };

  renderFace2FaceProjects = (item, index) => {
    // console.log("////////////////???~~~~~", item.directUserId);
    let status = "";

    if (item.respone > 0 && item.status !== "Closed") {
        status = "Running";
    }else{
        status = item.status
    }
    // console.log('////////////////???',item)
    const date = item.date.split("T");

    return (


      item.directUserId == this.state.userId  || item.directUserId == 0 ?


      <TouchableOpacity
        style={{
          backgroundColor: item.directUserId == this.state.userId ? "#d9feff" : "#fff",
          marginVertical: "2%",
          elevation: 7,
          borderRadius: 10,
          width: "93%",
          display: "flex",
          marginLeft: "3%",
          marginRight: "auto",
          top: 10,
        }}
        onPress={() =>
          this.props.navigation.navigate("ProjectDetails", {
            id: item.reqId,
            response: item.respone,
            senderUserId: item.senderUserId,
            userName: item.userName,
            profilePic: item.profilePic,
            status: item.status,
            onRefresh: this.onRefresh,
            date:date
          })
        }
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              margin: 16,
              marginBottom: 10,
              marginRight: 10,
              marginLeft: 10,
              marginTop: 20,
            }}
            source={{
              uri:
                item.profilePic === null
                  ? "http://demo.wiraa.com/Images/Profile.png"
                  : "http://demo.wiraa.com/" + item.profilePic,
            }}
          />
          <View style={{ marginTop: 8 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                zIndex: 9999,
              }}
            >
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: "Futura",
                  color: "#171919",
                  fontSize: 16,
                  paddingTop: 14,
                  width: 200,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.userName}
              </Text>
              <Text
                allowFontScaling={false}
                style={
                  (styles.status,
                  {
                    fontFamily: "OpenSans",
                    color:
                      item.status === "Running"
                        ? "#2C974B"
                        : item.status === "Active"
                        ? "#2C974B"
                        : "#aaaaaa",
                    fontSize: 12,
                    fontStyle: "italic",
                    paddingTop: 16,
                    marginLeft: "13%",
                  })
                }
              >
                {item.status === "Running" ? "Active" : item.status}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                alignSelf: "stretch",
                justifyContent: "flex-start",
                marginVertical: 8,
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Ionicons name="md-repeat" size={18} color="#767676" />
                <Text
                  allowFontScaling={false}
                  style={[styles.labell, { fontSize: 12, paddingLeft: 6 }]}
                >
                  {item.respone}
                </Text>
              </View>
              <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
                <Ionicons name="md-calendar" size={18} color="#767676" />
                <Text
                  allowFontScaling={false}
                  style={[styles.labell, { fontSize: 12, paddingLeft: 6 }]}
                >
                  {date[0]}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Text
          allowFontScaling={false}
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[
            styles.label,
            {
              color: "#767676",
              lineHeight: 15,
              paddingTop: 2,
              marginHorizontal: 16,
              paddingBottom: 16,
              marginRight: 20,
              paddingLeft: 0,
            },
          ]}
        >
          {item.description}
        </Text>
      </TouchableOpacity>
      :
      null
    );
  };

  searchOrders = (text) => {
    const searchText = text.toLowerCase();
    let order = this.state.orders;

    if (searchText !== "" && searchText.length > 1) {
      // console.log("Working");

      this.setState({
        orders: order.filter(
          (item) =>
            item.description && item.description.toLowerCase().match(searchText)
        ),
      });
    } else {
      this.getOrders(this.state.userId);
    }
  };

  searchProjects = (text) => {
    const searchText = text.toLowerCase();

    if (this.props.route.params.projectType === "ONLINE") {
      let onlineProj = this.state.online;
      if (searchText !== "" && searchText.length > 1) {
        this.setState({
          online: onlineProj.filter(
            (item) =>
              item.description &&
              item.description.toLowerCase().match(searchText)
          ),
        });
      } else {
        this.getOnlineProjects(this.state.userId);
      }
    } else {
      let face2FaceProj = this.state.face2Face;
      if (searchText !== "" && searchText.length > 1) {
        this.setState({
          face2Face: face2FaceProj.filter(
            (item) =>
              item.description &&
              item.description.toLowerCase().match(searchText)
          ),
        });
      } else {
        this.getFace2FaceProjects(this.state.userId);
      }
    }
  };

  searchCity = (text) => {
    const searchText = text.toLowerCase();

    if (searchText !== "" && searchText.length > 3) {
      fetch("http://demo.wiraa.com/api/Profile/GetCity")
        .then((respone) => respone.json())
        .then((responseJson) => {
          const city = responseJson.filter((item) =>
            item.cityName.toLowerCase().match(searchText)
          );
          this.setState({ city });
        });
    } else {
      console.log("nothing to show");
    }
  };

  filterCity = (city) => {
    let searchText = city.toLowerCase();

    searchText = searchText.split(",");

    const searchVal = searchText[0] + searchText[1];

    let face2FaceProj = this.state.face2Face;

    this.setState({
      face2Face: face2FaceProj.filter(
        (item) => item.city && item.city.toLowerCase().match(searchVal)
      ),
      isModalVisible: false,
    });
  };
  
  render() {
    console.log("=======PROJECT11 TYPE====-=--=-=-",this.state.online);
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
        <Provider>
          <View style={styles.container}>
            <View style={[styles.headerr, { marginTop: 0 }]}>
              <TouchableOpacity
                onPress={() => this.props.navigation.openDrawer()}
                style={{ paddingTop: 4 }}
              >
                <Feather
                  name="chevron-left"
                  size={24}
                  color="#767676"
                  style={{ zIndex: 999999 }}
                  onPress={() => this.props.navigation.navigate("Dashboard")}
                />
                {/* <Image style={{width:30, height:30, borderRadius:30}} source={{uri: this.state.profilePic !== null ? "http://demo.wiraa.com"+this.state.profilePic : "http://demo.wiraa.com/Content/img/boys-avtar.jpg"}} /> */}
              </TouchableOpacity>
              {/* <CommonHeader 
                                
                                navigation={this.props.navigation}
                            /> */}
              {/* <Menu
                                visible={this.state.isVisible}
                                onDismiss={this.closeMenu}
                                anchor={<Text allowFontScaling={false} style={styles.heading} onPress={this.openMenu}> {this.state.headingVal}<Feather name="chevron-down" size={20} color="#171919" /></Text>}
                                style={{marginTop:46, width:360, marginLeft: this.state.headingVal === "Client" ? 127 : 95, borderRadius:10,}}         
                            >
                                <Text style={[styles.heading, { fontFamily:"OpenSans", paddingLeft:0, fontSize:18} ]}>View dashboard as:</Text>
                                <Divider style={{backgroundColor:"#efefef", paddingVertical:1, marginHorizontal:16, marginTop:6}} />
                                <View style={{flexDirection:"row", justifyContent:"space-evenly", alignSelf:"center", paddingVertical:10}}>
                                    <Menu.Item titleStyle={{fontFamily:"Futura",color: this.state.headingVal === "Client" ? "#f56" : "#171919",fontSize:18,textAlign:"justify"}}  onPress={() => { this.setState({headingVal: "Client"}); this.closeMenu() }} title="Client" />
                                    <Menu.Item titleStyle={{fontFamily:"Futura",color: this.state.headingVal === "Professional" ? "#f56" : "#171919",fontSize:18}}  onPress={() => {this.setState({headingVal: "Professional", isLoading: !this.state.isLoading}); this.closeMenu(); this.getOnlineProjects(this.state.userId) }} title="Professional" />
                                </View>
                            </Menu> */}

              {this.props.route.params.projectType == "ONLINE" ? (
                <Text
                  style={{
                    fontFamily: "Futura",
                    fontSize: 22,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignSelf: "center",
                    paddingVertical: 10,
                  }}
                >
                    Global Projects
                </Text>
              ) : this.props.route.params.myOrder == "MYORDER" ? (
                <Text
                  style={{
                    fontFamily: "Futura",
                    fontSize: 22,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignSelf: "center",
                    paddingVertical: 10,
                  }}
                >
                  My Orders
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: "Futura",
                    fontSize: 22,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignSelf: "center",
                    paddingVertical: 10,
                  }}
                >
                  Local Projects
                </Text>
              )}

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Messages")}
              >
                <Ionicons
                  name="md-mail"
                  size={24}
                  color="#767676"
                  style={{ paddingTop: 10, paddingLeft: 10 }}
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl 
                onRefresh={() => this.getOrders(this.state.userId) }
                refreshing={this.state.isFetching}
                />
              }
            
            >
              {/* <View style={{flexDirection:"row", alignSelf:"stretch", justifyContent:"space-between", margin:16, marginBottom:0, marginTop:10, display: this.state.headingVal === "Client" ? "none" : "flex"}}> 
    
                                <View style={{flexDirection:"row", justifyContent:"space-between", borderRadius:10 }}>
                                    
                                    <TouchableOpacity onPress={() => this.toggle()} style={{borderRadius:10, width:180}}>
                                        <Text allowFontScaling={false} style={[styles.name, {textAlign:"center", marginRight:8, backgroundColor:this.state.toggleActive ? "#efefef" : "#f56", borderRadius:10,color: this.state.toggleActive ? "#171919" : "#fff", fontSize:14}]}>Online</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.toggle()} style={{borderRadius:10, width:180}}>
                                        <Text allowFontScaling={false} style={[styles.name, { textAlign:"center", marginLeft:8, backgroundColor:this.state.toggleActive ? "#f56" : "#efefef", borderRadius:10,color: this.state.toggleActive ? "#fff" : "#171919", fontSize:14}]}>Face 2 Face</Text>
                                    </TouchableOpacity>
                                </View>
                            
                            </View> */}

              {this.props.route.params.projectType == "ONLINE" ? (
                <View style={{ flex: 1 }}>
                  <View style={{ alignSelf: "stretch", marginHorizontal: 16 }}>
                    <TextInput
                      onChangeText={(text) => this.searchProjects(text)}
                      allowFontScaling={false}
                      placeholder="Search Projects..."
                      style={[styles.txtipt, { marginTop: 16 }]}
                    />
                    <Feather
                      name="search"
                      size={24}
                      color="#f56"
                      style={{ position: "absolute", top: 28, right: 15 }}
                    />
                  </View>

                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.online}
                    // onRefresh={() => this.getOnlineProjects(this.state.userId)}
                    // refreshControl={
                    //   <RefreshControl 
                    //   onRefresh={() => this.getOnlineProjects(this.state.userId) }
                    //   refreshing={this.state.isFetching}
                    //   />
                    // }
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) =>
                      this.renderOnlineProjects(item, index)
                    }
                  />
                </View>
              ) : this.props.route.params.projectType == "FACE2FACE" ? (
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", width: "100%" }}>
                    <View
                      style={{
                        width: "90%",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      <TextInput
                        onChangeText={(text) => this.searchProjects(text)}
                        allowFontScaling={false}
                        placeholder="Search Projects..."
                        style={[styles.txtipt, { marginTop: 16, width: 330 }]}
                      />
                      <Feather
                        name="search"
                        size={24}
                        color="#f56"
                        style={{
                          position: "absolute",
                          top: 28,
                          marginHorizontal: "4%",
                          right: 0,
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      style={{
                        padding: 10,
                        paddingVertical: 8,
                        position: "absolute",
                        top: 16,
                        zIndex: 9999,
                        width: "10%",
                        right: "1%",
                      }}
                      onPress={() => this.setState({ isModalVisible: true })}
                    >
                      <Ionicons name="md-pin" size={30} color="#f56" />
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.face2Face}
                    // onRefresh={() =>
                    //   this.getFace2FaceProjects(this.state.userId)
                    // }
                    // refreshControl={
                    //   <RefreshControl 
                    //   onRefresh={() => this.getFace2FaceProjects(this.state.userId) }
                    //   refreshing={this.state.isFetching}
                    //   />
                    // }
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) =>
                      this.renderFace2FaceProjects(item, index)
                    }
                  />
                </View>
              ) : this.state.orders.length > 0 ? (
                <View style={{ flex: 1 }}>
                  {/* <View style={{alignSelf:"stretch", marginHorizontal:16}}>
                            <TextInput onChangeText={(text) => this.searchOrders(text)} allowFontScaling={false}  placeholder="Search Orders..." style={[styles.txtipt, {marginTop:16}]} />
                            <Feather name="search" size={24} color="#171919" style={{position:"absolute", top:28, right:16}} />
                        </View> */}

                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.orders}
                    onRefresh={() => this.getOrders(this.state.userId)}
                    refreshing={this.state.isFetching}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) =>
                      this.renderOrders(item, index)
                    }
                    
                  
                  />
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    height: 650,
                    justifyContent: "center",
                    alignSelf: "center",
                    marginLeft: 32,
                  }}
                >
                  <Text style={[styles.heading, { color: "#f56" }]}>
                    No Orders Created!
                  </Text>
                  <Text
                    style={{
                      color: "#767676",
                      fontFamily: "OpenSans",
                      paddingHorizontal: 16,
                      textAlign: "center",
                      paddingTop: 10,
                    }}
                  >
                    You haven't posted any requirements yet!
                  </Text>
                </View>
              )}
            </ScrollView>

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.isModalVisible}
              onRequestClose={() => {
                this.setState({ isModalVisible: !this.state.isModalVisible });
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#fff",
                    elevation: 3,
                    padding:"3%",

                  }}
                >
                  <View
                    style={{ marginHorizontal: "3%", flexDirection: "row" }}
                  >
                    <TouchableOpacity
                      style={{}}
                      onPress={() => this.setState({ isModalVisible: false })}
                    >
                      <Feather
                        name="chevron-left"
                        size={24}
                        color="#767676"
                        style={{ zIndex: 999999, marginBottom: "7%" }}
                      />
                    </TouchableOpacity>
                    
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 16,
                        fontFamily: "Futura",
                        color: "#171919",
                        marginHorizontal:"25%",
                      }}
                    >
                      SEARCH BY CITY
                    </Text>
                    
                  </View>
                </View>

                <View>
                  <TextInput
                    allowFontScaling={false}
                    placeholder={
                      this.state.userCityName + " " + this.state.userCountryName
                    }
                    onChangeText={(text) => this.searchCity(text)}
                    style={[
                      styles.txtipt,
                      { marginTop: 10, marginHorizontal: 16 },
                    ]}
                  />
                </View>

                <ScrollView>
                  {this.state.city.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{ backgroundColor: "#f9f9f9", marginTop: 6 }}
                      onPress={() => this.filterCity(item.cityName)}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: "Futura",
                          color: "#171919",
                          fontSize: 16,
                          padding: 14,
                        }}
                      >
                        {item.cityName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Modal>
          </View>
        </Provider>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#fff",
  },
  headerr: {
    flexDirection: "row",
    paddingTop: 40,
    alignSelf: "stretch",
    justifyContent: "space-between",
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
    paddingHorizontal: 16,
  },
  heading: {
    fontFamily: "Futura",
    fontSize: 22,
    marginTop: 6,
    textAlign: "center",
    color: "#171919",
    paddingLeft: 16,
  },
  name: {
    fontFamily: "Futura",
    color: "#171919",
    padding: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  label: {
    fontFamily: "OpenSans",
    color: "#aaaaaa",
    fontSize: 14,
    paddingLeft: 16,
  },
  btn: {
    backgroundColor: "#f56",
    borderRadius: 32,
    padding: 16,
    width: 200,
    marginTop: 16,
    alignSelf: "center",
  },
  txtipt: {
    borderRadius: 6,
    paddingHorizontal: 16,
    marginVertical: 6,
    fontFamily: "OpenSans",
    marginHorizontal: 0,
    backgroundColor: "#efefef",
    height: 50,
  },
  onProject:{
    flex:1,
    marginVertical: "2%",
    elevation: 7,
    borderRadius: 10,
    width:"92%",
    alignSelf:"stretch",
    marginHorizontal:16,
  }
});
