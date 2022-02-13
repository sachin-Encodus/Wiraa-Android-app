import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Keyboard,
} from "react-native";
import {
  MaterialCommunityIcons,
  Feather,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP } from "react-native-responsive-screen";

export default class Conversation extends React.Component {
  state = {
    isModalVisible: false,
    isModalVisible1: false,
    isModalVisible2: false,
    status: "",
    image: null,
    comment: "",
    id: 0,
    chat: [],
    userId: "",
    senderUserId: "",
    completedResponse: false,
    userName: "",
    profilePic: "",
    userProfileId: "",
    projectModal: false,
    orderModal: false,
    requestedStatus: null,
    isChatDisabled: false,
  };

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId !== null) {
      this.setState({ userId: userId });
    }
    const userProfileId = await AsyncStorage.getItem("userPrfileId");
    if (userProfileId !== null) {
      this.setState({ userProfileId });
    }

    this.getAsyncPermissions();

    const { id, senderUserId, userName, profilePic,  desc } = this.props.route.params;
console.log("===========>>>>>>>>>>>>xxxxxxxxxxxxx", id, senderUserId, userName, profilePic, desc);
    this.setState({ id, senderUserId, userName, profilePic });

    this.interval = setInterval(
      () => this.getChat(senderUserId, userId, id),
      2000
    );

    const userType = await AsyncStorage.getItem("userType");
    if (userType !== null) {
      this.setState({ userType });
    }

    if (userType === '3') {  
      this.getOrderRequestStatus(senderUserId, userId, id);
    } else {
      this.getProjectRequestStatus(userId, id);
    }
    // this.getProjectRequestStatus(userId, id);
    const completedResponse = await AsyncStorage.getItem('completedResponse');
    console.log('compelete response --- -- - - -- ',completedResponse)
   

    // fetch(
      //   "http://demo.wiraa.com/api/post/GetProjectRequestStatus?prid=" +
    //     id +
    //     "&userId=" +
    //     userId
    // )
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     // alert(responseJson)
    //       console.log("responseJson------------",responseJson)
    //     if (responseJson.requestedStatus === null || responseJson === null ) {
    //       this._storeData(false);
    //     }
    //   })
    //   .catch((error)=>{
    //       console.log("error with get project status",error)
    //     })

    if (completedResponse === 'true') {
      this.setState({
        completedResponse: true,
        isModalVisible2: true,
        isChatDisabled: true,
      });
    } else if (completedResponse === 'false') {
      this.setState({
        completedResponse: false,
        isModalVisible2: false,
        isChatDisabled: false,
      });
    } 
    const { status, screenName  } = this.props.route.params;
    console.log('status----------',status)
    if (status === 'Completed' || status === 'Cancelled' ) {
      this.setState({isModalVisible2:false})
    }

    // this.getCompletencancel();
  };

  getCompletencancel = () => {
    
    const { status, screenName,id  } = this.props.route.params;

    fetch(
      "http://demo.wiraa.com/api/post/CompleteProject?userId=" +
        this.state.userId +
        "&projectId=" +
        id,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(
          "*********************************************....>>>>",
          responseJson
        );
        // if(responseJson === true){
        //     this.setState({ isModalVisible1 : false, isModalVisible2 : true, completedResponse: true });
        //     this._storeData(responseJson);
        // }
        // this.setState({ isModalVisible1 : false, isModalVisible2 : true });
      })
      .catch((error)=>{
        console.log('error with get complete cancel',error)
      })
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getOrderRequestStatus = (senderUserId, userId, id) => {
    console.log('senderUserId, userId, id----',senderUserId, userId, id)
    fetch(
      "http://demo.wiraa.com/api/post/GetOrderRequestStatus?prid=" +id +"&senderid=" + userId +"&userId=" + senderUserId
    )
      .then((response) => response.json())
      .then((responseJson) => {
          console.log("request------111",responseJson)
        if(responseJson !== null){
          if (responseJson.requestedStatus === null) {
            this._storeData(false)
          }else  if (responseJson.requestedStatus === "Cancelled") {
            this.setState({ orderModal: true, requestedStatus: "Cancel" });
          } else if (responseJson.requestedStatus === "Completed") {
            this.setState({ orderModal: true, requestedStatus: "Complete" });
          }
        }else{
          this._storeData(false)
        }
      })
      .catch((e)=>{
        console.log("error in getOrderRequestStatus------->>///",e)
      })
  };

  getProjectRequestStatus = (userId, id) => {
    console.log('22222@@@@@',userId,id)
    fetch(
      "http://demo.wiraa.com/api/post/GetProjectRequestStatus?prid=" +
        id +
        "&userId=" +
        userId
    )
      .then((response) => response.json())
      .then((responseJson) => {
  
          console.log("request project status----",responseJson)
          if(responseJson !== null){
            if ( responseJson.requestedStatus === null) {
              this._storeData(false)
            }else 
          if (responseJson.requestedStatus === "Cancelled") {
            this.setState({ projectModal: true, requestedStatus: "Cancel" });
          } else if (responseJson.requestedStatus === "Completed") {
            this.setState({ projectModal: true, requestedStatus: "Complete" });
          }
          }
          else{
            this._storeData(false)
          }
          
      }).
      catch((e)=>{
        console.log("error in getProjectRequestStatus------->>///",e)
      })
  };

  getChat = (senderUserId, userId, id) => {
    fetch(
      "http://demo.wiraa.com/api/post/ChatData?senderId=" +
        senderUserId +
        "&userId=" +
        userId +
        "&projectId=" +
        id,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())

      .then((responseJson) => {
        let chat = [];
        responseJson.chatList.map((item) => {
          chat.push({
            messageId: item.inboxMessageId,
            userId: item.userId,
            message: item.messagebody,
            fileName: item.fileName1,
            filePath: item.filePath !== null ? item.filePath.split("~") : "",
          });
        });
        this.setState({ chat });
      });
  };

  getAsyncPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [3, 2],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      let newImage = result.uri.split("-");

      this.setState({ image: result.uri });

      const model = new FormData();

      model.append("userProfileId", this.state.userId);
      model.append("senderProfileId", this.state.senderUserId);
      model.append("projectId", this.state.id);
      model.append("image", {
        name: newImage[4],
        type: "image/jpg",
        uri: this.state.image,
      });

      fetch("http://demo.wiraa.com/api/Post/UploadChatDocument", {
        method: "POST",
        body: model,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("Uploaded Successfully " + JSON.stringify(responseJson));
        })
        .catch((err) => {
          console.log("Error Uploading " + err);
        });
    }
  };

  sendMsg = () => {
    if (this.state.comment !== "") {
      fetch("http://demo.wiraa.com/Api/Post/SendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.state.userId,
          projectId: this.state.id,
          friendId: this.state.senderUserId,
          message: this.state.comment,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.getChat(
            this.state.senderUserId,
            this.state.userId,
            this.state.id
          );
        })
        .catch((err) => {
          console.log("Error Uploading " + err);
        });

      this.setState({ comment: "" });
    }
  };

  completencancel = () => {
    const { id, screenName } = this.props.route.params;
    console.log("status of compltecnacel--->>", this.state.status,screenName,id);
    if (screenName === "Projects") {
      if (this.state.status === "Complete") {
        fetch(
          "http://demo.wiraa.com/api/post/CompleteProject?userId=" +
            this.state.userId +
            "&projectId=" +
            id,
          {
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            console.log("complete response---", responseJson);
            if (responseJson === true) {
              this.setState({
                isModalVisible1: false,
                isModalVisible2: true,
                completedResponse: true,
              });
              this._storeData(responseJson);
            }
            this.setState({ isModalVisible1: false, isModalVisible2: true });
          })
          .catch((e)=>{
            alert(e)
          })
      } else if (this.state.status === "Cancel") {
        fetch(
          "http://demo.wiraa.com/api/post/CancelProject?userId=" +
            this.state.userId +
            "&projectId=" +
            id,
          {
            method: "POST",
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            console.log("cancel---", responseJson);
            if (responseJson === true) {
              this.setState({
                isModalVisible1: false,
                isModalVisible2: true,
                completedResponse: true,
              });
              this._storeData(responseJson);
            }
            this.setState({ isModalVisible1: false, isModalVisible2: true });
          })
          .catch((e)=>{
            alert(e)
          })
      }
    } else {
      if (this.state.status === "Complete") {
        fetch(
          "http://demo.wiraa.com/api/post/CompleteOrder?userId=" + this.state.userId + "&projectId="+ id,
          {
            method: "POST",
          }
          // "http://demo.wiraa.com/api/post/CompleteOrder?senderId=" +
          //   this.state.senderUserId +
          //   "&userId=" +
          //   this.state.userId +
          //   "&projectId=" +
          //   id,
        )
          .then((response) => response.json())
          .then((responseJson) => {
            console.log("11111111111111order", responseJson);
            if (responseJson === true) {
              this.setState({
                isModalVisible1: false,
                isModalVisible2: true,
                completedResponse: true,
              });
              this._storeData(responseJson);
            }
            this.setState({ isModalVisible1: false, isModalVisible2: true });
          }).catch((e)=>{
              console.log(e)
          })
      } else if (this.state.status === "Cancel") {
        fetch(
          "http://demo.wiraa.com/api/post/CancelOrder?senderId=" +
            this.state.senderUserId +
            "&userId=" +
            this.state.userId +
            "&projectId=" +
            id,
          {
            method: "POST",
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            console.log("2222222222order", responseJson);
            if (responseJson === true) {
              this.setState({
                isModalVisible1: false,
                isModalVisible2: true,
                completedResponse: true,
              });
              this._storeData(responseJson);
            }
            this.setState({ isModalVisible1: false, isModalVisible2: true });
          }).catch((e)=>{
            console.log(e)
          })
      }
    }
  };

  _storeData = async (val) => {
    try {
      await AsyncStorage.setItem('completedResponse',JSON.stringify(val));
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  };

  detailsPage = () => {
    const { screenName } = this.props.route.params;
    console.log("====>>>>", screenName);
    // console.log("screen name---->>", this.props.route.params);
    if (screenName === "Projects") {
      this.props.navigation.navigate("ProjectDetails", {
        id: this.props.route.params.id,
        senderUserId: this.props.route.params.senderUserId,
        response: this.props.route.params.response,
        desc: this.props.route.params.response,
        status: this.props.route.params.status,
        userName: this.props.route.params.userName,
        profilePic: this.props.route.params.profilePic,
      
      });
    } else {
      this.props.navigation.navigate("ProjectDetails", {
      id: this.props.route.params.id,
        senderUserId: this.props.route.params.senderUserId,
        response: this.props.route.params.response,
        desc: this.props.route.params.response,
        status: this.props.route.params.status,
        userName: this.props.route.params.userName,
        profilePic: this.props.route.params.profilePic,
     
      });
    }
    this.setState({ isModalVisible: false });
  };

  acceptProjectRequest = () => {
    if (this.state.requestedStatus === "Cancel") {
      fetch(
        "http://demo.wiraa.com/api/post/AcceptProjectCancelRequest?prid=" +
          this.state.id +
          "&userId=" +
          this.state.userId
      )
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log("APRCA" + responseJson);
          this.setState({ projectModal: false });
        });
    } else {
      fetch(
        "http://demo.wiraa.com/api/post/AcceptProjectCompleteRequest?prid=" +
          this.state.id +
          "&userId=" +
          this.state.userId
      )
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log("APRCO" + responseJson);
          this.setState({ projectModal: false });
        });
    }
  };

  declineProjectRequest = () => {
    if (this.state.requestedStatus === "Cancel") {
      fetch(
        "http://demo.wiraa.com/api/post/DeclineProjectCancelRequest?prid=" +
          this.state.id +
          "&userId=" +
          this.state.userId
      )
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log("DPRCA" + responseJson);
          this.setState({ projectModal: false });
        });
    } else {
      fetch(
        "http://demo.wiraa.com/api/post/DeclineProjectCompleteRequest?prid=" +
          this.state.id +
          "&userId=" +
          this.state.userId
      )
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log("DPRCO" + responseJson);
          this.setState({ projectModal: false });
        });
    }
  };

  acceptOrderRequest = () => {
    if (this.state.requestedStatus === "Cancel") {
      fetch(
        "http://demo.wiraa.com/api/post/AcceptCancelRequest?prid=" +
          this.state.id +
          "&senderid=" +
          this.state.senderUserId
      )
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log("AORCA" + responseJson);
          this.setState({ orderModal: false });
        });
    } else {
      fetch(
        "http://demo.wiraa.com/api/post/AcceptCompleteRequest?prid=" +
          this.state.id +
          "&senderid=" +
          this.state.senderUserId
      )
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log("AORCA" + responseJson);
          this.setState({ orderModal: false });
        });
    }
  };

  declineOrderRequest = () => {
    if (this.state.requestedStatus === "Cancel") {
      fetch(
        "http://demo.wiraa.com/api/post/DeclineCancelStatus?prid=" +
          this.state.id +
          "&senderid=" +
          this.state.userId
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("declineOrderRequest------", responseJson);
          this.setState({ orderModal: false });
        });
    } else {
      fetch(
        "http://demo.wiraa.com/api/post/DeclineCompleteStatus?prid=" +
          this.state.id +
          "&senderid=" +
          this.state.userId
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("DORCA-----------------decline", responseJson);
          this.setState({ orderModal: false });
        });
    }
  };

  // !change redirect to UserProfile
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

  render() {
    const { status, userName, profilePic, params,id } = this.props.route.params;
    // console.log("chat11111111111122222222222-->>", this.state.userId,id);
    return (
      <View
        style={[
          styles.container,
          {
            opacity:
              this.state.isModalVisible ||
              this.state.isModalVisible1 ||
              this.state.isModalVisible2
                ? 0.2
                : 1,
            backgroundColor:
              this.state.isModalVisible ||
              this.state.isModalVisible1 ||
              this.state.isModalVisible2
                ? "#000"
                : "#efefef",
          },
        ]}
      >
        {
          // this.props.route.params ?
          // this.props.route.params.map((item)=>{
          //     return(
          <View style={styles.headerr}>
            <Feather
              name="chevron-left"
              size={24}
              color="#767676"
              style={{ zIndex: 99999999, paddingTop: 6 }}
              onPress={() => this.props.navigation.goBack()}
            />
            <TouchableOpacity
              onPress={() => this.viewProfile(this.state.senderUserId)}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 16,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf:"center"
                }}
              >
                <Image
                  style={{ width: 30, height: 30, borderRadius: 30 }}
                  source={{
                    uri:
                      this.state.profilePic !== null
                        ? "http://demo.wiraa.com/" + this.state.profilePic
                        : "http://demo.wiraa.com/Images/Profile.png",
                  }}
                />
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.headingName}
                >
                  {this.props.route.params.userName}
                </Text>
              </View>
            </TouchableOpacity>

            {/* <Text allowFontScaling={false} style={styles.heading}>Chat</Text> */}
            <Feather
              name="more-horizontal"
              size={24}
              color="#767676"
              style={{ zIndex: 999999, paddingTop: 6 }}
              onPress={() =>
                this.setState({ isModalVisible: !this.state.isModalVisible })
              }
            />
          </View>
          //     )
          // }
          // )
          // :
          // null
        }

        <View style={{ flex: 1, alignSelf: "stretch" }}>
          <ScrollView style={{ marginBottom: 10, paddingHorizontal: 16 }}>
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
              {this.state.chat.map((item, index) =>
                this.state.senderUserId !== item.userId ? (
                  <View key={item.messageId} style={{}}>
                    <View
                      style={{
                        alignSelf: "flex-end",
                        justifyContent: "flex-start",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginLeft: 60,
                        backgroundColor: "#f56",
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        borderTopLeftRadius: 10,
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={[
                          styles.label,
                          {
                            paddingVertical: 10,
                            color: "#fff",
                            flexWrap: "wrap",
                            textAlign: "left",
                            display: item.message !== "" ? "flex" : "none",
                          },
                        ]}
                      >
                        {" "}
                        {item.message}{" "}
                      </Text>
                    </View>
                    <Image
                      source={{
                        uri:
                          item.filePath !== undefined
                            ? "http://demo.wiraa.com/" + item.filePath[1]
                            : "http://demo.wiraa.com/UserImages/Profile/CropImage/DP_20256_05112020_043058.png",
                      }}
                      style={{
                        alignSelf: "flex-end",
                        width: 300,
                        height:
                          item.filePath !== undefined
                            ? item.filePath[1] !== undefined
                              ? 200
                              : 0
                            : 0,
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        borderTopLeftRadius: 10,
                      }}
                    />
                  </View>
                ) : (
                  <View key={item.messageId}>
                    <View
                      style={{
                        alignSelf: "flex-start",
                        justifyContent: "flex-start",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginRight: 60,
                        backgroundColor: "#fff",
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        borderTopRightRadius: 10,
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={[
                          styles.label,
                          {
                            paddingVertical: 10,
                            textAlign: "left",
                            display: item.message !== "" ? "flex" : "none",
                          },
                        ]}
                      >
                        {item.message}
                      </Text>
                    </View>
                    <Image
                      source={{
                        uri:
                          item.filePath !== undefined
                            ? "http://demo.wiraa.com/" + item.filePath[1]
                            : "http://demo.wiraa.com/UserImages/Profile/CropImage/DP_20256_05112020_043058.png",
                      }}
                      style={{
                        width: 300,
                        height:
                          item.filePath !== undefined
                            ? item.filePath[1] !== undefined
                              ? 200
                              : 0
                            : 0,
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                    />
                  </View>
                )
              )}
            </TouchableOpacity>
          </ScrollView>
          {/* {
                       status === "Closed" ? <Text style={{textAlign:"center",flex:1,fontSize:25,fontWeight:"bold"}}>Chat Blocked</Text> : <Text></Text>
                   } */}

          <View
            style={{
              backgroundColor: "#fff",
              alignItems: "flex-end",
              flexDirection: "row",
              padding: 16,
              justifyContent: "space-evenly",
              display:
                status === "Completed" ||
                status === "Cancelled" ||
                status === "Closed" ||
                this.state.isChatDisabled === true
                  ? "none"
                  : "flex",
            }}
          >
            <TextInput
              allowFontScaling={false}
              style={[styles.commentBox, { flex: 1, marginRight: 16 }]}
              value={this.state.comment}
              onChangeText={(text) => this.setState({ comment: text })}
              multiline={true}
              numberOfLines={6}
              placeholder="Type your message..."
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 28,
                right: 100,
                zIndex: 9999,
              }}
              onPress={() => this.uploadImage()}
            >
              <Ionicons name="md-attach" size={24} color="#767676" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: "#f56", borderRadius: 10 }}
              onPress={() => this.sendMsg()}
            >
              <Ionicons
                name="ios-send"
                size={24}
                color="#fff"
                style={{ paddingVertical: 9, marginHorizontal: 16 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => {
            this.setState({
              postId: "",
              isModalVisible: !this.state.isModalVisible,
            });
          }}
        >
          <View style={{ flex: 1, marginHorizontal: 10 }}>
            <TouchableOpacity
              style={{
                marginTop:
                  status === "Completed" || status === "Cancelled" ? 560 : 420,
                backgroundColor: "#fff",
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}
              onPress={() => this.detailsPage()}
            >
              <Text
                style={[
                  styles.label,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: "#efefef",
                    fontSize: 16,
                  },
                ]}
              >
                CHECK DETAILS
              </Text>
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: "#fff",
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
              }}
            >
              <TouchableOpacity
                style={{ display: status === "Completed" || status === "Cancelled" ? "none" : "flex",
                }}
                onPress={() =>
                  this.setState({
                    isModalVisible1: !this.state.isModalVisible1,
                    isModalVisible: !this.state.isModalVisible,
                    status: "Complete",
                  })
                }
              >
                <Text
                  style={[
                    styles.label,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: "#efefef",
                      fontSize: 16,
                    },
                  ]}
                >
                  Complete Project
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  display:
                    status === "Completed" || status === "Cancelled"
                      ? "none"
                      : "flex",
                }}
                onPress={() =>
                  this.setState({
                    isModalVisible1: !this.state.isModalVisible1,
                    isModalVisible: !this.state.isModalVisible,
                    status: "Cancel",
                  })
                }
              >
                <Text
                  style={[
                    styles.label,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: "#efefef",
                      fontSize: 16,
                    },
                  ]}
                >
                  Cancel Project
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={[styles.label, { fontSize: 16 }]}>Report</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: "#f9f9f9",
                borderRadius: 10,
              }}
              onPress={() => this.setState({ isModalVisible: false })}
            >
              <Text style={[styles.label, { fontFamily: "Futura" }]}>
                CANCEL
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType="fade"
          visible={this.state.isModalVisible1}
          onRequestClose={() =>
            this.setState({ isModalVisible1: !this.state.isModalVisible1 })
          }
        >
          <View behavior="height" style={[styles.modalContainer]}>
            <View  style={{backgroundColor:'#fff' , marginHorizontal:10, borderRadius:16 , elevation:6  }} >
            <Text
              allowFontScaling={false}
              style={[
                styles.heading,
                {
                  color: "#171919",
                  paddingTop: 6,
                  fontSize: 18,
                  textAlign: "center",
                  paddingTop:25,
                  fontWeight:'bold'
                },
              ]}
            >
              {this.state.status} Project Request
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.label, { paddingVertical: 16 , fontWeight:'bold'}]}
            >
              Are you sure you want to {this.state.status} the project ?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 32,
                paddingBottom:30
              }}
            >
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.completencancel()}
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
                onPress={() => this.setState({ isModalVisible1: false })}
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
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType="fade"
          visible={this.state.isModalVisible2}
          onRequestClose={() => this.setState({ isModalVisible2: true })}
        >
          <View behavior="height" style={[styles.modalContainer]}>
            <View  style={{backgroundColor:'#fff' , marginHorizontal:10, borderRadius:16 , elevation:6  }} >
            <Text
              allowFontScaling={false}
              style={[
                styles.heading,
                { color: "#171919", paddingTop: 25, fontWeight:'bold', fontSize: 18 },
              ]}
            >
              Project Request
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.label, { paddingVertical: 16 }]}
            >
              Please wait until response not coming from client.
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.label, { paddingVertical: 16 , fontWeight:'bold' }]}
            >
              You have already sent {this.state.status} request
            </Text>
            <View  style={{  marginHorizontal: 32,
            paddingVertical:25
              }}  >
            <TouchableOpacity
              style={{
                elevation: 7,
                backgroundColor: "#fff",
                width: widthPercentageToDP(30),
                marginRight: "auto",
                marginLeft: "auto",
                borderRadius: 10,
                paddingVertical:15,

              }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                Back
              </Text>
            </TouchableOpacity>
          </View>
          </View>
           </View>
        </Modal>

        {/* PROJECT COMPLETE AND CANCEL REQUEST */}
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
                {
                  color: "#171919",
                  paddingTop: 6,
                  fontSize: 18,
                  textAlign: "center",
                },
              ]}
            >
              Order {this.state.requestedStatus} Request
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.label, { paddingTop: 10 }]}
            >
              Client requested to {this.state.requestedStatus} your order ?
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.label, { paddingVertical: 16, paddingTop: 0 }]}
            >
              Are you sure you want to {this.state.requestedStatus} it ?
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
                onPress={() => this.acceptProjectRequest()}
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
                onPress={() => this.declineProjectRequest()}
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

        {/* ORDER COMPLETE AND CANCEL REQUEST */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={this.state.orderModal}
          onRequestClose={() =>
            this.setState({ orderModal: false })
          }
        >
          <View
            behavior="height"
            style={([styles.modalContainer])}
          >
            <View style={{backgroundColor:'#fff' , marginHorizontal:10, borderRadius:16 , elevation:6 }}   >
            <Text
              allowFontScaling={false}
              style={[
                styles.heading,
                {
                  color: "#171919",
                  paddingTop: 25,
                  fontSize: 18,
                  textAlign: "center",
fontWeight:'bold'
                },
              ]}
            >
              Order {this.state.requestedStatus} Request
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.label, { paddingTop: 15}]}
            >
              Professional requested to {this.state.requestedStatus} your order
              ?
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.label, { paddingVertical: 16 ,  fontWeight:'bold'}]}
            >
              Are you sure you want to {this.state.requestedStatus} it ?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 32,
                marginVertical:10 ,
                paddingBottom:20

              }}
            >
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.acceptOrderRequest()}
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
                onPress={() => this.declineOrderRequest()}
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
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  modalContainer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    // backgroundColor: "#fff",
    // marginHorizontal: 10,
    // marginVertical: 300,
    // paddingTop: 16,
    // borderRadius: 16,
    // elevation: 6,
  },
  headerr: {
    flexDirection: "row",
    paddingTop: 40,
    alignSelf: "stretch",
    justifyContent: "space-between",
    paddingBottom: 6,
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    borderBottomColor: "#efefef",
    paddingHorizontal: 16,
  },
  heading: {
    fontFamily: "Futura",
    fontSize: widthPercentageToDP("4%"),
    marginTop: 6,
    textAlign: "center",
    color: "#171919",
    paddingLeft: 10,
    // width:widthPercentageToDP("70%")
  },
  headingName: {
    fontFamily: "Futura",
    fontWeight:'bold',
    fontSize: widthPercentageToDP("4%"),
  
    textAlign:"center",
    color: "#171919",
    paddingLeft: 10,
    width:widthPercentageToDP("30%")
  },
  // topcard:{
  //     backgroundColor:"#fff",
  //     borderRadius:6,
  //     padding:10,
  //     margin:16,
  //     alignSelf:"stretch",
  //     marginVertical:6
  // },
  // card:{
  //     flexDirection:"row",
  //     justifyContent:"space-between",
  //     padding:10,
  //     marginHorizontal:10,
  //     marginTop:6,
  //     borderRadius:16,
  // },
  // name:{
  //     fontFamily:"Futura",
  //     color:"#171919",
  //     padding:16,
  //     paddingBottom:0,
  //     fontSize:20,
  // },
  label: {
    fontFamily: "OpenSans",
    color: "#171919",
    fontSize: widthPercentageToDP("4%"),
    padding: 22,
    textAlign: "center",
  },
  // fltbtn:{
  //     backgroundColor:"#f56",
  //     borderRadius:32,
  //     padding:16,
  //     marginTop:16,
  //     alignSelf:"center",
  //     position:"absolute",
  //     bottom:16,
  //     right:16,
  //     elevation:6
  // },
  // join:{
  //     backgroundColor:"#171919",
  //     alignSelf:"stretch",
  //     padding:20,
  //     margin: 20,
  //     marginVertical:5,
  //     borderRadius:16,
  //     elevation:4,
  // },
  // jointxt:{
  //     textAlign:"center",
  //     fontSize:16,
  //     color:"#fff",
  //     fontFamily:"OpenSans",
  // },
  commentBox: {
    backgroundColor: "#efefef",
    color: "#171919",
    paddingHorizontal: 16,
    marginHorizontal: 0,
    borderRadius: 10,
    height: 50,
    fontFamily: "OpenSans",
  },
  // comment:{
  //     flexDirection:"row",
  //     margin:10,
  //     marginLeft:0
  // },
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

// import React from 'react'
// import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, TextInput, Keyboard } from 'react-native'
// import { MaterialCommunityIcons, Feather, Ionicons, AntDesign } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default class Conversation extends React.Component{

//     state = {
//         isModalVisible:false,
//         isModalVisible1: false,
//         isModalVisible2: false,
//         status:"",
//         image:null,
//         comment:"",
//         id:0,
//         chat:[],
//         userId:"",
//         senderUserId:"",
//         completedResponse:false,
//         userName:"",
//         profilePic:"",
//         userProfileId:"",
//         projectModal: false,
//         orderModal: false,
//         requestedStatus: null,
//         isChatDisabled: false,
//     }

//     componentDidMount = async() =>{

//         const userId = await AsyncStorage.getItem('userId')
//         if(userId !== null){
//             this.setState({ userId: userId });
//         }
//         const userProfileId = await AsyncStorage.getItem('userPrfileId')
//         if(userProfileId !== null){
//             this.setState({ userProfileId })
//         }

//         this.getAsyncPermissions();

//         const { id, senderUserId, userName, profilePic } = this.props.route.params;
//         this.setState({ id, senderUserId, userName, profilePic});

//         this.interval = setInterval(() => this.getChat(senderUserId, userId, id), 2000);

//         const userType = await AsyncStorage.getItem('userType')
//         if(userType !== null){
//             this.setState({ userType })
//         }

//         if(userType === "3"){
//             // console.log("Professional")
//             this.getOrderRequestStatus(senderUserId, userId, id);
//         }else{
//             this.getProjectRequestStatus(userId, id);
//         }

//         const completedResponse = await AsyncStorage.getItem('completedResponse');

//         console.log('complete response----------------->>>>>>>>>>>>>>>',completedResponse)

//         fetch("http://demo.wiraa.com/api/post/GetProjectRequestStatus?prid="+id+"&userId="+userId)
//         .then(response => response.json())
//         .then(responseJson => {
//             if(responseJson.requestedStatus === null){
//                 this._storeData(false)
//             }
//         })

//         if(completedResponse === "true"){
//             this.setState({ completedResponse : true, isModalVisible2: true, isChatDisabled: true });
//         }else if (completedResponse === "false"){
//             this.setState({ completedResponse : false, isModalVisible2: false, isChatDisabled: false });
//         }else{
//             // alert("error with code")
//         }

//         this.getCompletencancel()

//     }

// getCompletencancel = () =>{
//     // alert('okokoko')
//     fetch("http://demo.wiraa.com/api/post/CompleteProject?userId="+this.state.userId+"&projectId="+id, {
//                     method : "GET"
//                 })
//                 .then(response => response.json())
//                 .then(responseJson => {
//                         console.log('*********************************************....>>>>',responseJson)
//                     // if(responseJson === true){
//                     //     this.setState({ isModalVisible1 : false, isModalVisible2 : true, completedResponse: true });
//                     //     this._storeData(responseJson);
//                     // }
//                     // this.setState({ isModalVisible1 : false, isModalVisible2 : true });

//                 })

// }

//     componentWillUnmount(){
//         clearInterval(this.interval);
//     }

//     getOrderRequestStatus = (senderUserId, userId, id) => {
//         fetch("http://demo.wiraa.com/api/post/GetOrderRequestStatus?prid="+id+"&senderid="+senderUserId+"&userId="+userId)
//         .then(response => response.json())
//         .then(responseJson => {

//             if(responseJson.requestedStatus === "Cancelled"){
//                 this.setState({ orderModal: true, requestedStatus: "Cancel" });
//             }else if(responseJson.requestedStatus === "Completed"){
//                 this.setState({ orderModal: true, requestedStatus: "Complete" });
//             }
//         })
//     }

//     getProjectRequestStatus = (userId, id) => {
//         fetch("http://demo.wiraa.com/api/post/GetProjectRequestStatus?prid="+id+"&userId="+userId)
//         .then(response => response.json())
//         .then(responseJson => {

//             if(responseJson.requestedStatus === "Cancelled"){
//                 this.setState({ projectModal: true, requestedStatus: "Cancel" });
//             }else if(responseJson.requestedStatus === "Completed"){
//                 this.setState({ projectModal: true, requestedStatus: "Complete" });
//             }
//         })
//     }

//     getChat = (senderUserId, userId, id) => {

//         fetch("http://demo.wiraa.com/api/post/ChatData?senderId="+senderUserId+"&userId="+userId+"&projectId="+id, {
//             method : "POST"
//         })
//         .then(response => response.json())

//         .then(responseJson => {
//             let chat = [];
//             responseJson.chatList.map(item => {
//                 chat.push({
//                     messageId: item.inboxMessageId,
//                     userId: item.userId,
//                     message: item.messagebody,
//                     fileName: item.fileName1,
//                     filePath: item.filePath !== null ? item.filePath.split("~") : ""
//                 })
//             })
//             this.setState({ chat })
//         })
//     }

//     getAsyncPermissions = async() => {
//         if (Platform.OS !== 'web') {
//             const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
//             if (status !== 'granted') {
//               alert('Sorry, we need camera roll permissions to make this work!');
//             }
//         }
//     }

//     uploadImage = async () => {
//         let result = await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.All,
//           allowsEditing: false,
//           aspect: [3, 2],
//           quality: 1,
//         });

//         // console.log(result);

//         if (!result.cancelled) {

//             let newImage = result.uri.split("-");

//           this.setState({ image : result.uri });

//           const model = new FormData();

//             model.append("userProfileId", this.state.userId);
//             model.append("senderProfileId", this.state.senderUserId );
//             model.append("projectId", this.state.id);
//             model.append("image", {
//                 name: newImage[4],
//                 type: "image/jpg",
//                 uri: this.state.image,
//             })

//           fetch("http://demo.wiraa.com/api/Post/UploadChatDocument", {
//             method : "POST",
//             body: model
//             })
//             .then(response => response.json())
//             .then(responseJson => {
//                 console.log("Uploaded Successfully "+ JSON.stringify(responseJson));
//             })
//             .catch(err => {
//                 console.log("Error Uploading "+ err)
//             })

//         }
//     };

//     sendMsg = () => {
//         if(this.state.comment !== ""){
//             fetch("http://demo.wiraa.com/Api/Post/SendMessage", {
//                 method : "POST",
//                 headers:{
//                     "Content-Type" : "application/json"
//                 },
//                 body: JSON.stringify({
//                     "userId": this.state.userId,
//                     "projectId" : this.state.id,
//                     "friendId" : this.state.senderUserId,
//                     "message" : this.state.comment,
//                 })
//             })
//             .then(response => response.json())
//             .then(responseJson => {
//                 this.getChat(this.state.senderUserId, this.state.userId, this.state.id)
//             })
//             .catch(err => {
//                 console.log("Error Uploading "+ err)
//             })

//             this.setState({ comment: "" })
//         }
//     }

//     completencancel = () => {

//         const { id, screenName } = this.props.route.params;
//         console.log("screen name1111111111--->>",screenName)

//         if(screenName === "Projects"){
//             if(this.state.status === "Complete"){
//                 fetch("http://demo.wiraa.com/api/post/CompleteProject?userId="+this.state.userId+"&projectId="+id, {
//                     method : "POST"
//                 })
//                 .then(response => response.json())
//                 .then(responseJson => {
//                     if(responseJson === true){
//                         console.log('complete response---',responseJson)
//                         this.setState({ isModalVisible1 : false, isModalVisible2 : true, completedResponse: true });
//                         this._storeData(responseJson);
//                     }
//                     this.setState({ isModalVisible1 : false, isModalVisible2 : true });

//                 })
//             }else if(this.state.status === "Cancel"){
//                 fetch("http://demo.wiraa.com/api/post/CancelProject?userId="+this.state.userId+"&projectId="+id, {
//                     method : "POST"
//                 })
//                 .then(response => response.json())
//                 .then(responseJson => {
//                     console.log('cancel---',responseJson)
//                     if(responseJson === true){
//                         this.setState({ isModalVisible1 : false, isModalVisible2 : true, completedResponse: true });
//                         this._storeData(responseJson);
//                     }
//                     this.setState({ isModalVisible1 : false, isModalVisible2 : true });
//                 })
//             }
//         }else{
//             if(this.state.status === "Complete"){
//                 fetch("http://demo.wiraa.com/api/post/CompleteOrder?senderId="+this.state.senderUserId+"&userId="+this.state.userId+"&projectId="+id, {
//                     method : "POST"
//                 })
//                 .then(response => response.json())
//                 .then(responseJson => {
//                     console.log('11111111111111order',responseJson)
//                     if( responseJson === true ){
//                         this.setState({ isModalVisible1 : false, isModalVisible2 : true, completedResponse: true });
//                         this._storeData(responseJson);
//                     }
//                     this.setState({ isModalVisible1 : false, isModalVisible2 : true });
//                 })
//             }else if(this.state.status === "Cancel"){
//                 fetch("http://demo.wiraa.com/api/post/CancelOrder?senderId="+this.state.senderUserId+"&userId="+this.state.userId+"&projectId="+id, {
//                     method : "POST"
//                 })
//                 .then(response => response.json())
//                 .then(responseJson => {
//                     console.log('2222222222order',responseJson)
//                     if(responseJson === true){
//                         this.setState({ isModalVisible1 : false, isModalVisible2 : true, completedResponse: true });
//                         this._storeData(responseJson);
//                     }
//                     this.setState({ isModalVisible1 : false, isModalVisible2 : true });
//                 })
//             }
//         }

//     }

//     _storeData = async(val) => {
//         try {
//             await AsyncStorage.setItem(
//               'completedResponse',
//               val.toString()
//             );
//           } catch (error) {
//             // Error saving data
//         }

//         console.log(val)
//     }

//     detailsPage = () => {
//         const { screenName } = this.props.route.params;
//             console.log("screen name---->>",this.props.route.params)
//         if(screenName === "Projects" ){
//             this.props.navigation.navigate("ProjectDetails",{status:this.props.route.params.status,userName:this.props.route.params.userName,profilePic:this.props.route.params.profilePic,hi:"hiiiiii" })
//         }else{
//             this.props.navigation.navigate("ProjectDetails",{status:this.props.route.params.status,userName:this.props.route.params.userName,profilePic:this.props.route.params.profilePic,hi:"hiiiiii" })
//         }
//         this.setState({isModalVisible:false})
//     }

//     acceptProjectRequest = () => {
//         if(this.state.requestedStatus === "Cancel"){
//             fetch("http://demo.wiraa.com/api/post/AcceptProjectCancelRequest?prid="+this.state.id+"&userId="+this.state.userId)
//             .then(response => response.json())
//             .then(responseJson => {
//                 console.log("APRCA" + responseJson);
//                 this.setState({ projectModal: false })
//             })
//         }else{
//             fetch("http://demo.wiraa.com/api/post/AcceptProjectCompleteRequest?prid="+this.state.id+"&userId="+this.state.userId)
//             .then(response => response.json())
//             .then(responseJson => {
//                 console.log("APRCO" + responseJson);
//                 this.setState({ projectModal: false })
//             })
//         }
//     }

//     declineProjectRequest = () => {
//         if(this.state.requestedStatus === "Cancel"){
//             fetch("http://demo.wiraa.com/api/post/DeclineProjectCancelRequest?prid="+this.state.id+"&userId="+this.state.userId)
//             .then(response => response.json())
//             .then(responseJson => {
//                 console.log("DPRCA" + responseJson);
//                 this.setState({ projectModal: false })
//             })
//         }else{
//             fetch("http://demo.wiraa.com/api/post/DeclineProjectCompleteRequest?prid="+this.state.id+"&userId="+this.state.userId)
//             .then(response => response.json())
//             .then(responseJson => {
//                 console.log("DPRCO" + responseJson);
//                 this.setState({ projectModal: false })
//             })
//         }
//     }

//     acceptOrderRequest = () => {
//         if(this.state.requestedStatus === "Cancel"){
//             fetch("http://demo.wiraa.com/api/post/AcceptCancelRequest?prid="+this.state.id+"&senderid="+this.state.senderUserId)
//             .then(response => response.json())
//             .then(responseJson => {
//                 console.log("AORCA" + responseJson);
//                 this.setState({ orderModal: false })
//             })
//         }else{
//             fetch("http://demo.wiraa.com/api/post/AcceptCompleteRequest?prid="+this.state.id+"&senderid="+this.state.senderUserId)
//             .then(response => response.json())
//             .then(responseJson => {
//                 console.log("AORCA" + responseJson);
//                 this.setState({ orderModal: false })
//             })
//         }
//     }

//     declineOrderRequest = () => {
//         if(this.state.requestedStatus === "Cancel"){
//             fetch("http://demo.wiraa.com/api/post/DeclineCancelStatus?prid="+this.state.id+"&senderid="+this.state.senderUserId)
//             .then(response => response.json())
//             .then(responseJson => {
//                 console.log("DORCO" + responseJson);
//                 this.setState({ orderModal: false })
//             })
//         }else{
//             fetch("http://demo.wiraa.com/api/post/DeclineCompleteStatus?prid="+this.state.id+"&senderid="+this.state.senderUserId)
//             .then(response => response.json())
//             .then(responseJson => {
//                 console.log("DORCA" + responseJson);
//                 this.setState({ orderModal: false })
//             })
//         }
//     }

//     render(){

//         const { status, userName , profilePic,params,senderUserId,id,fkUserProfileId } = this.props.route.params;
//         console.log('chat11111111111122222222222-->>',this.props.route)
//         return(
//             <View style={[styles.container, { opacity:this.state.isModalVisible || this.state.isModalVisible1 || this.state.isModalVisible2 ? 0.2 : 1, backgroundColor: this.state.isModalVisible || this.state.isModalVisible1 || this.state.isModalVisible2 ? '#000' : '#efefef'}]}>

//             {
//                 // this.props.route.params ?
//                 // this.props.route.params.map((item)=>{
//                 //     return(
//                         <View style={styles.headerr}>
//                         <Feather name="chevron-left" size={24} color="#767676" style={{zIndex: 999999, paddingTop:6}} onPress={() => this.props.navigation.goBack()} />

//                         <TouchableOpacity onPress={()=>this.props.navigation.navigate('UserProfile',{fkUserProfileId: this.props.route.paramsfkUserProfileId})} style={{flexDirection: "row", marginHorizontal:16, flex:1, justifyContent:"center", alignItems:"center"}}>
//                             <Image style={{width:30, height:30, borderRadius:30}} source={{uri: this.state.profilePic !== null ? "http://demo.wiraa.com/"+this.state.profilePic : "http://demo.wiraa.com/Images/Profile.png"}} />
//                             <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.heading]}>{this.props.route.params.userName}</Text>
//                         </TouchableOpacity>
//                         {/* <Text allowFontScaling={false} style={styles.heading}>Chat</Text> */}
//                         <Feather name="more-horizontal" size={24} color="#767676" style={{zIndex: 999999, paddingTop:6}} onPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })} />
//                     </View>
//                 //     )
//                 // }
//                 // )
//                 // :
//                 // null
//             }

//                 <View style={{flex:1, alignSelf:"stretch", }}>
//                    <ScrollView style={{marginBottom:10, paddingHorizontal:16}}>

//                         <TouchableOpacity onPress={() => Keyboard.dismiss() }>
//                             {this.state.chat.map((item,index) => (
//                                 this.state.senderUserId !== item.userId ?
//                                         <View key={item.messageId} style={{}}>
//                                             <View style={{ alignSelf:"flex-end", justifyContent:"flex-start", flexDirection:"row", flexWrap:"wrap", marginLeft:60, backgroundColor:"#f56", borderBottomLeftRadius:10, borderBottomRightRadius:10, borderTopLeftRadius:10, marginTop:10}}>
//                                                 <Text style={[styles.label, {paddingVertical:10, color:"#fff", flexWrap:"wrap", textAlign:"left", display:item.message !== "" ? "flex" : "none"}]}> {item.message} </Text>
//                                             </View>
//                                             <Image source={{uri : item.filePath !== undefined ? "http://demo.wiraa.com/"+item.filePath[1] : "http://demo.wiraa.com/UserImages/Profile/CropImage/DP_20256_05112020_043058.png"}} style={{ alignSelf:"flex-end", width:300, height: item.filePath !== undefined ? item.filePath[1] !== undefined ? 200 : 0 : 0, borderBottomLeftRadius:10, borderBottomRightRadius:10, borderTopLeftRadius:10,}} />
//                                         </View>
//                                     :
//                                         <View key={item.messageId}>
//                                             <View style={{alignSelf:"flex-start", justifyContent:"flex-start", flexDirection:"row", flexWrap:"wrap", marginRight:60, backgroundColor:"#fff", borderBottomLeftRadius:10, borderBottomRightRadius:10, borderTopRightRadius:10, marginTop:10}}>
//                                                 <Text style={[styles.label, {paddingVertical:10, textAlign:"left", display:item.message !== "" ? "flex" : "none"}]}>{item.message}</Text>
//                                             </View>
//                                             <Image source={{uri : item.filePath !== undefined ? "http://demo.wiraa.com/"+item.filePath[1] : "http://demo.wiraa.com/UserImages/Profile/CropImage/DP_20256_05112020_043058.png"}} style={{width:300, height: item.filePath !== undefined ? item.filePath[1] !== undefined ? 200 : 0 : 0, borderBottomLeftRadius:10, borderBottomRightRadius:10, borderTopRightRadius:10,}}  />
//                                         </View>
//                                 ))}
//                         </TouchableOpacity>

//                    </ScrollView>
//                    {/* {
//                        status === "Closed" ? <Text style={{textAlign:"center",flex:1,fontSize:25,fontWeight:"bold"}}>Chat Blocked</Text> : <Text></Text>
//                    } */}

//                     <View style={{ backgroundColor:"#fff", alignItems:"flex-end",flexDirection:"row", padding:16, justifyContent:"space-evenly", display: status === "Completed" || status === "Cancelled" || status === "Closed" || this.state.isChatDisabled === true ? "none" : "flex"}}>
//                         <TextInput allowFontScaling={false} style={[styles.commentBox, {flex:1, marginRight:16}]} value={this.state.comment} onChangeText={(text) => this.setState({ comment: text })} multiline={true} numberOfLines={6} placeholder="Type your message..." />
//                         <TouchableOpacity style={{position:"absolute", bottom:28, right:100, zIndex:9999}}  onPress={() => this.uploadImage()}>
//                             <Ionicons name="md-attach" size={24} color="#767676" />
//                         </TouchableOpacity>
//                         <TouchableOpacity style={{backgroundColor:"#f56", borderRadius:10}} onPress={() => this.sendMsg()}>
//                             <Ionicons name="ios-send" size={24} color="#fff" style={{paddingVertical:13,marginHorizontal:16}} />
//                         </TouchableOpacity>
//                     </View>

//                 </View>

//                 <Modal
//                     animationType="slide"
//                     transparent={true}
//                     visible={this.state.isModalVisible}
//                     onRequestClose={() => {
//                         this.setState({ postId: "", isModalVisible : !this.state.isModalVisible})
//                     }}
//                 >

//                     <View style={{flex:1, marginHorizontal:10}}>

//                         <TouchableOpacity style={{marginTop: status === "Completed" || status === "Cancelled" ? 560 : 420,backgroundColor:'#fff', borderTopRightRadius:10, borderTopLeftRadius:10}} onPress={() => this.detailsPage()} >
//                             <Text style={[styles.label, {borderBottomWidth:1, borderBottomColor:"#efefef", fontSize:16}]}>CHECK DETAILS</Text>
//                         </TouchableOpacity>

//                         <View style={{backgroundColor:'#fff', borderBottomRightRadius:10, borderBottomLeftRadius:10}}>
//                             <TouchableOpacity style={{display: status === "Completed" || status === "Cancelled" ? "none" : "flex"}} onPress={() => this.setState({isModalVisible1 : !this.state.isModalVisible1, isModalVisible: !this.state.isModalVisible, status:"Complete"})}>
//                                 <Text style={[styles.label,{borderBottomWidth:1, borderBottomColor:"#efefef", fontSize:16}]}>Complete Project</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={{display: status === "Completed" || status === "Cancelled" ? "none" : "flex"}} onPress={() => this.setState({isModalVisible1 : !this.state.isModalVisible1, isModalVisible: !this.state.isModalVisible,status:"Cancel"})}>
//                                 <Text style={[styles.label,{borderBottomWidth:1, borderBottomColor:"#efefef", fontSize:16}]}>Cancel Project</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity>
//                                 <Text style={[styles.label,{fontSize:16}]}>Report</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <TouchableOpacity style={{marginTop:10, backgroundColor:"#f9f9f9", borderRadius:10}} onPress={() => this.setState({isModalVisible: false})}>
//                             <Text style={[styles.label, {fontFamily:"Futura"}]}>CANCEL</Text>
//                         </TouchableOpacity>
//                     </View>

//                 </Modal>

//                 <Modal
//                     transparent={true}
//                     animationType="fade"
//                     visible={this.state.isModalVisible1}
//                     onRequestClose={() => this.setState({isModalVisible1:!this.state.isModalVisible1})}>

//                     <View behavior="height" style={[styles.modalContainer]}>
//                         <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:6, fontSize:18, textAlign:"center"}]}>{this.state.status} Project Request</Text>
//                         <Text allowFontScaling={false} style={[styles.label, {paddingVertical:16}]}>Are you sure you want to {this.state.status} the project ?</Text>

//                         <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:32}}>
//                             <TouchableOpacity style={styles.btn} onPress={() => this.completencancel()}>
//                                 <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#fff", textAlign:"center", fontSize:14}}>YES</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676"}]} onPress={() => this.setState({isModalVisible1: false})}>
//                                 <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#fff", textAlign:"center", fontSize:14}}>NO</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </Modal>

//                 <Modal
//                     transparent={true}
//                     animationType="fade"
//                     visible={this.state.isModalVisible2}
//                     onRequestClose={() => this.setState({isModalVisible2:true})}>

//                     <View behavior="height" style={[styles.modalContainer]}>
//                         <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:6, fontSize:18}]}>Project Request</Text>
//                         <Text allowFontScaling={false} style={[styles.label, {paddingVertical:16}]}>Please wait until response not coming from client.</Text>
//                         <Text allowFontScaling={false} style={[styles.label, {paddingVertical:16}]}>You have already sent {this.state.status} request</Text>
//                     <TouchableOpacity style={{elevation:7,backgroundColor:"#fff",width:"40%",marginRight:"auto",marginLeft:"auto",borderRadius:10}} onPress={()=>this.props.navigation.goBack()}>
//                         <Text style={{ textAlign:"center",fontWeight:"bold" ,fontSize:20 }}>Back</Text>
//                     </TouchableOpacity>
//                     </View>
//                 </Modal>

//                 {/* PROJECT COMPLETE AND CANCEL REQUEST */}
//                 <Modal
//                     transparent={true}
//                     animationType="fade"
//                     visible={this.state.projectModal}
//                     onRequestClose={() => this.setState({projectModal:!this.state.projectModal})}>

//                     <View behavior="height" style={[styles.modalContainer, {marginVertical:280}]}>
//                         <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:6, fontSize:18, textAlign:"center"}]}>Order {this.state.requestedStatus} Request</Text>
//                         <Text allowFontScaling={false} style={[styles.label, {paddingTop: 10}]}>Client requested to {this.state.requestedStatus} your order ?</Text>
//                         <Text allowFontScaling={false} style={[styles.label, {paddingVertical:16, paddingTop:0}]}>Are you sure you want to {this.state.requestedStatus} it ?</Text>

//                         <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:32}}>
//                             <TouchableOpacity style={styles.btn} onPress={() => this.acceptProjectRequest()}>
//                                 <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#fff", textAlign:"center", fontSize:14}}>YES</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676"}]} onPress={() => this.declineProjectRequest()}>
//                                 <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#fff", textAlign:"center", fontSize:14}}>NO</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </Modal>

//                 {/* ORDER COMPLETE AND CANCEL REQUEST */}
//                 <Modal
//                     transparent={true}
//                     animationType="fade"
//                     visible={this.state.orderModal}
//                     onRequestClose={() => this.setState({orderModal:!this.state.orderModal})}>

//                     <View behavior="height" style={[styles.modalContainer], {marginVertical:280}}>
//                     <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:6, fontSize:18, textAlign:"center"}]}>Order {this.state.requestedStatus} Request</Text>
//                         <Text allowFontScaling={false} style={[styles.label, {paddingTop: 10}]}>Professional requested to {this.state.requestedStatus} your order ?</Text>
//                         <Text allowFontScaling={false} style={[styles.label, {paddingVertical:16}]}>Are you sure you want to {this.state.requestedStatus} it ?</Text>

//                         <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:32}}>
//                             <TouchableOpacity style={styles.btn} onPress={() => this.acceptOrderRequest()}>
//                                 <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#fff", textAlign:"center", fontSize:14}}>YES</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676"}]} onPress={() => this.declineOrderRequest()}>
//                                 <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#fff", textAlign:"center", fontSize:14}}>NO</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </Modal>

//             </View>
//         )
//     }
// }

// const styles = StyleSheet.create({
//     container:{
//         flex:1,
//         justifyContent:"flex-start",
//         alignItems:"flex-start",
//     },
//     modalContainer:{
//         flex:1,
//         alignItems:"stretch",
//         justifyContent:"flex-start",
//         backgroundColor:"#fff",
//         marginHorizontal:10,
//         marginVertical:300,
//         paddingTop:16,
//         borderRadius:16,
//         elevation:6,
//     },
//     headerr:{
//         flexDirection:"row",
//         paddingTop:40,
//         alignSelf:"stretch",
//         justifyContent:"space-between",
//         paddingBottom:6,
//         borderBottomWidth:1,
//         backgroundColor:"#fff",
//         borderBottomColor:"#efefef",
//         paddingHorizontal:16,
//     },
//     heading:{
//         fontFamily:"Futura",
//         fontSize:16,
//         marginTop:6,
//         textAlign:"left",
//         color:"#171919",
//         paddingLeft:10
//     },
//     // topcard:{
//     //     backgroundColor:"#fff",
//     //     borderRadius:6,
//     //     padding:10,
//     //     margin:16,
//     //     alignSelf:"stretch",
//     //     marginVertical:6
//     // },
//     // card:{
//     //     flexDirection:"row",
//     //     justifyContent:"space-between",
//     //     padding:10,
//     //     marginHorizontal:10,
//     //     marginTop:6,
//     //     borderRadius:16,
//     // },
//     // name:{
//     //     fontFamily:"Futura",
//     //     color:"#171919",
//     //     padding:16,
//     //     paddingBottom:0,
//     //     fontSize:20,
//     // },
//     label:{
//         fontFamily:"OpenSans",
//         color:"#171919",
//         fontSize:14,
//         padding:22,
//         textAlign:"center",
//     },
//     // fltbtn:{
//     //     backgroundColor:"#f56",
//     //     borderRadius:32,
//     //     padding:16,
//     //     marginTop:16,
//     //     alignSelf:"center",
//     //     position:"absolute",
//     //     bottom:16,
//     //     right:16,
//     //     elevation:6
//     // },
//     // join:{
//     //     backgroundColor:"#171919",
//     //     alignSelf:"stretch",
//     //     padding:20,
//     //     margin: 20,
//     //     marginVertical:5,
//     //     borderRadius:16,
//     //     elevation:4,
//     // },
//     // jointxt:{
//     //     textAlign:"center",
//     //     fontSize:16,
//     //     color:"#fff",
//     //     fontFamily:"OpenSans",
//     // },
//     commentBox:{
//         backgroundColor:"#efefef",
//         color:"#171919",
//         paddingHorizontal:16,
//         marginHorizontal:0,
//         borderRadius:10,
//         height:50,
//         fontFamily:"OpenSans"
//     },
//     // comment:{
//     //     flexDirection:"row",
//     //     margin:10,
//     //     marginLeft:0
//     // },
//     btn:{
//         backgroundColor:"#f56",
//         borderRadius:10,
//         paddingVertical:14,
//         width:100,
//         marginTop:10,
//         alignSelf:"center",
//         elevation:6
//     },
// })
