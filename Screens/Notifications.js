import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome, Feather, Ionicons, AntDesign,MaterialCommunityIcons  } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../component/Header";
import HeaderBack from "../component/HeaderBack";
import { widthPercentageToDP } from "react-native-responsive-screen";

const window = Dimensions.get("window");

export default class Notifications extends React.Component{
  state = {
    notifications: [],
    isLoading: false,
    profilePic: null,
    userProfileId: "",
    refreshing: false,
  };

   async componentDidMount() {
console.log("running===>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
 const userProfileId = await AsyncStorage.getItem("userPrfileId");
    if (userProfileId !== null) {
      this.setState({ userProfileId });
    }

    const profilePic = await AsyncStorage.getItem("profilePic");
    if (profilePic !== null) {
      this.setState({ profilePic });
    }



    this.getNotifications(userProfileId, profilePic);

  }

  getNotifications = async (userProfileId, profilePic) => {
     this.setState({ isLoading: true });
console.log("==============>>>>>>>>>>>>>>>>");
    await fetch(
      "http://demo.wiraa.com/api/Notification/GetNotifications?Id=" +
        userProfileId
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let notifications = [...this.state.notifications];
        responseJson.map((item) => {
          notifications.push({
            id: item.$id,
            notifyId: item.notificationID,
            userName: item.userName,
            profilePic: item.profilePic,
            postedOn: item.postedOn,
            comments: item.comments,
            isSeen: item.isSeen,
          });

          this.setState({ notifications });
            item.isSeen === true ? console.log("no message to seen") : this.props.notify();
        });
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        //Error
        console.error(error);
        this.setState({ isLoading: false });
      });

    this.setState({ isLoading: false });
  };

  renderRightActions = (progress, dragX, id) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [5, 10, 20, 20],
    });

    return (
      <RectButton style={{ marginLeft: 10 }} onPress={this.close}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <TouchableOpacity onPress={() => this.deleteNotifications(id)}>
            <Ionicons name="md-trash" size={24} color="#f56" />
          </TouchableOpacity>
        </Animated.Text>
      </RectButton>
    );
  };

  deleteNotifications = (id) => {
    fetch("http://demo.wiraa.com/api/Notification/DeleteNotification?Id=" + id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          notifications: this.state.notifications.filter(
            (item) => item.notifyId !== id
          ),
        });

        ToastAndroid.showWithGravityAndOffset(
          "Deleted Successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );

        this.getNotifications();
      })
      .catch((err) => {
        ToastAndroid.showWithGravityAndOffset(
          err,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      });
  };

  updateNotification = (isSeen, id) => {
    if (isSeen === false) {
      fetch(
        "http://demo.wiraa.com/api/Notification/MarkReadNotification?Id=" + id,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            notifications: this.state.notifications.map((item) =>
              item.notifyId === id ? { ...item, isSeen: !item.isSeen } : item
            ),
          });
          ToastAndroid.showWithGravity(
            "Updated Successfully",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM
          );
        })
        .catch((err) => {
          ToastAndroid.showWithGravity(
            err,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM
          );
        });

      // this.state.notifications.map(item => {
      //     if(item.notifyId === id){
      //         let notifications = {

      //         }
      //     }
      // })
    }
  };

  viewProfile = (userName) => {
    fetch(
      "http://demo.wiraa.com/api/Users/GetProfileIdByUserName?Name=" + userName
    )
      .then((response) => response.json())
      .then((responseJson) => {
        responseJson !== this.state.userProfileId
          ? this.props.navigation.navigate("UserProfile", {
              fkUserProfileId: responseJson,
            })
          : this.props.navigation.navigate("Profile");
      });
  };

  renderNotifications = (item, index) => {
      console.log("render---->>>>",item)
    const val = item.postedOn.split("on");

    return (
      <Swipeable
      key={item.id}
        renderRightActions={(progress, dragX) =>
          this.renderRightActions(progress, dragX, item.notifyId)
        }
      >
        <TouchableOpacity
          style={[
            styles.card,
            {
              width: window.width,
              backgroundColor: item.isSeen === true ? "#fff" : "#efefef",
              borderBottomColor: item.isSeen ? "#efefef" : "#fff",
            },
          ]}
          onPress={() => this.updateNotification(item.isSeen, item.notifyId)}
        >
          <TouchableOpacity
            style={{ zIndex: 9999 }}
            onPress={() => this.viewProfile(item.userName)}
          >
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 10,
                marginVertical: 16,
                marginLeft: 16,
                marginRight: 10,
              }}
              source={{
                uri:
                  item.profilePic === null
                    ? "http://demo.wiraa.com/Images/Profile.png"
                    : "http://demo.wiraa.com/" + item.profilePic,
              }}
            />
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity style={{ marginTop: 20 }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: "Futura",
                  color: "#171919",
                  fontSize: widthPercentageToDP("4%"),
                  textAlignVertical: "center",
                  width: widthPercentageToDP("70%"),
                }}
              >
                {item.comments}
              
              </Text>
              <Text
                allowFontScaling={false}
                style={[styles.label, { color: "#767676", paddingTop: 3 }]}
              >
                {item.postedOn}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  _onRefresh = async () => {
    
  this.setState({refreshing:true})
     this.setState({notifications:[]}) 
       this.getNotifications(this.state.userProfileId, this.state.profilePic);
  this.setState({refreshing:false})
  
    // this.setState({ refreshing: true });
    // this.setState({ isLoading: true });
    
    // const userProfileId = await AsyncStorage.getItem("userPrfileId");
    // if (userProfileId !== null) {
    //   this.setState({ userProfileId });
    // }

    // const profilePic = await AsyncStorage.getItem("profilePic");
    // if (profilePic !== null) {
    //   this.setState({ profilePic });
    // }

    // await fetch(
    //   "http://demo.wiraa.com/api/Notification/GetNotifications?Id="+
    //     userProfileId
    // )
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     let notifications = [...this.state.notifications];
    //     responseJson.map((item) => {
    //       notifications.push({
    //         id: item.$id,
    //         notifyId: item.notificationID,
    //         userName: item.userName,
    //         profilePic: item.profilePic,
    //         postedOn: item.postedOn,
    //         comments: item.comments,
    //         isSeen: item.isSeen,
    //       });

    //       this.setState({ notifications });
    //     });
    //     this.setState({ refreshing: false });
    //     this.setState({ isLoading: false });
    //   })
    //   .catch((error) => {
    //     //Error
    //     console.error(error);
    //     this.setState({ isLoading: false });
    //     this.setState({ refreshing: false });
    //   });

    // this.setState({ isLoading: false });
    // this.setState({ refreshing: false });
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
            headerName="Notifications"
            navigation={this.props.navigation}
          />
         
            {/* <StatusBar style="light" /> */}
            {/* <View style={styles.headerr}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} style={{paddingTop:4}}>
                            <Image style={{width:32, height:32, borderRadius:30}} source={{uri: this.state.profilePic !== null ? "http://demo.wiraa.com"+this.state.profilePic : "http://demo.wiraa.com/Content/img/boys-avtar.jpg"}} />
                        </TouchableOpacity>   
                        <Text allowFontScaling={false} style={styles.heading}>Notifications</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Messages")}>
                            <Ionicons name="md-mail" size={24} color="#767676" style={{paddingTop:10, paddingLeft:0}} />
                        </TouchableOpacity>
                    </View> */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#efefef",
                width: "100%",
                justifyContent: "center",
                height:50,
                borderBottomColor:"#fff",
                borderBottomWidth:3
              }}
            >
              {/* <AntDesign name="arrowleft" size={24} color="#171919" /> */}
              <MaterialCommunityIcons name="gesture-swipe-left" size={24} color="grey" style={{marginTop:"auto",marginBottom:"auto",marginRight:"3%"}} />
              <Text style={{ fontSize: widthPercentageToDP("3.5%"), fontWeight: "bold", color: "grey",textAlign:"center",marginTop:"auto",marginBottom:"auto" }}>
                Slide Left for delete
              </Text>
            </View>

            {this.state.notifications.length > 0 ? (
              <View style={{ height: 700 }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  style={{ marginBottom: 18 }}
                  data={this.state.notifications}
                  keyExtractor={(item, index) => String(index)}
                  renderItem={({ item, index }) =>
                    this.renderNotifications(item, index)
                  }
                  refreshing={this.state.refreshing}
                  onRefresh={() => this._onRefresh()}
                />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={[styles.heading, { color: "#f56" }]}
                >
                  No New Notifications!
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    color: "#767676",
                    fontFamily: "OpenSans",
                    paddingHorizontal: 16,
                    textAlign: "center",
                    paddingTop: 10,
                  }}
                >
                  Check this section for future updates and general
                  notifications.
                </Text>
              </View>
            )}
          
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
  },
  label: {
    color: "#767676",
    fontFamily: "OpenSans",
    fontSize: 14,
    width: 280,
  },
  card: {
    flexDirection: "row",
    marginHorizontal: 0,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },

  actionText: {
    fontFamily: "Futura",
    color: "#f56",
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 20,
  },
});
