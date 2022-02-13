import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  FlatList,
  Modal,
  TextInput,
  BackHandler,
  RefreshControl,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video, AVPlaybackStatus } from "expo-av";
import PostArticle from "./PostArticle";
import * as ImagePicker from "expo-image-picker";
import { cos } from "react-native-reanimated";
import PostComponent from "./PostComponent";

export default class Dashboard extends React.Component {
  state = {
    projects: [],
    orders: [],
    followings: [],
    userProfileId: "",
    username: "",
    posts: [],
    comments: [],
    isVisible: false,
    postId: "",
    comment: "",
    isLoading: false,
    day: "",
    month: "",
    year: "",
    userType: 0,
    count: 0,
    bannerNone: false,
    refresh: false,
    profilePic: "",
    userType: "",
    openArticleModal: false,
    image: null,
    paused: false,
    video: null,
    parseData: "",
    refreshing: false,
    footerLoader: false,
  };

  componentDidMount = async () => {
    this.setState({ isLoading: true });
    const userInfo = await AsyncStorage.getItem("userData");
    var parseData = await JSON.parse(userInfo);
    this.setState({ parseData: parseData });
    const completedResponse = await AsyncStorage.getItem("completedResponse");

    const bannerRemove = await AsyncStorage.getItem("bannerRemove");
    if (bannerRemove !== undefined && bannerRemove !== null) {
      this.setState({ bannerNone: bannerRemove });
    }

    const userProfileId = await AsyncStorage.getItem("userPrfileId");
    if (userProfileId !== null) {
      this.setState({ userProfileId: userProfileId });
    }

    const userId = await AsyncStorage.getItem("userId");
    if (userId !== null) {
      this.setState({ userId: userId });
    }

    this.setState({ isLoading: true });
    // Get Posts
    this.getPosts(userProfileId, this.state.count);
    //GET ALL USERS
    this.getAllUserData(userId);
    //    get project
    this.getrecentproject(userId);
    //  get orders
    this.getorders(userId);
    //   this.setState({isLoading:false})
    this.willFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.getPosts(userProfileId, this.state.count);
        this.getAllUserData(userId);
        this.getrecentproject(userId);
        this.getorders(userId);
      }
    );
  };

  componentWillUnmount() {
    this.willFocusSubscription;
    this.setState({});
  }

  getrecentproject = (userId) => {
    this.setState({ isLoading: true });

    try {
      fetch("http://demo.wiraa.com/Api/Users/GetRecentProject?userId=" + userId, {
        method: "GET",
        //Request Type
      })
        .then((response) => response.json())
        //If response is in json then in success
        .then((responseJson) => {
          //Success
          let projects = [];
       responseJson.map((item) => {
            // console.log('direct user id---',item.directUserId)
            projects.push({
              reqId: item.postreqID,
              id: item.$id,
              userName: item.fullName,
              profilePic: item.profilePic,
              description: item.pR_Description,
              status: item.postStatus,
              respone: item.responseNo,
              date: item.applyDate,
              directUserId: item.directUserId,
            });
  
            this.setState({
              projects,
            });
          });
          this.setState({ isLoading: false });
        })
        //If response is not in json then in error
        .catch((error) => {
          //Error
          alert(error);
          this.setState({ isLoading: false });
        });
    } catch (error) {
      alert(error)
    }
  };

  getorders = (userId) => {
    this.setState({ isLoading: true });
    //Orders

    try {
      fetch("http://demo.wiraa.com/Api/Project/GetOrders?Id=" + userId, {
        method: "GET",
        //Request Type
      })
        .then((response) => response.json())
        //If response is in json then in success
        .then((responseJson) => {
          //Success
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
            });
  
            this.setState({
              orders,
            });
          });
          // this.setState({ isLoading: false });
        })
        //If response is not in json then in error
        .catch((error) => {
          //Error
          alert(error);
          this.setState({ isLoading: false });
        });
      
    } catch (error) {
      alert(error)
    }

   
  };

  getAllUserData = (userId) => {
    this.setState({ isLoading: true });
    //Get All Users
    try {
      fetch("http://demo.wiraa.com/api/Users/GetUsers?Id=" + userId, {
      method: "GET",
      //Request Type
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ isLoading: false });
        this.setState({
          userProfileId: responseJson.usersProfile.usersProfileID,
          userName: responseJson.firstName + " " + responseJson.lastName,
          userType: responseJson.userType,
          profilePic:
            responseJson.usersProfile.profilePic !== null
              ? responseJson.usersProfile.profilePic
              : null,
        });

        this.setState({ isLoading: false });
        this.storeData(this.state.userProfileId);
        this.storePic(this.state.profilePic);
        this.storeType(this.state.userType);
      })
      .catch((error)=>{
        alert(error)
      })
    } catch (error) {
      alert(error)
    }
    
  };

  getPosts = (userProfileId, count) => {
    this.setState({ isLoading: true });
    // this.setState({ refreshing: true });
    //     this.setState({ footerLoader: true });
  try {
    fetch(
      "http://demo.wiraa.com/api/Post/GetAllPost?Id=" +
        userProfileId +
        "&pageNo=" +
        count,
      {
        method: "GET",
        //Request Type
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        // this.setState({ isLoading: false });
        // this.setState({ footerLoader: false });
        let posts = [];
        responseJson.map((item) => {
          posts.push({
            fkUserProfileId: item.fkUserProfileID,
            id: item.$id,
            postId: item.postID,
            userName: item.firstName,
            occupation: item.occupation,
            profilePic: item.profilePic,
            desc: item.description,
            likesCount: item.likesCount,
            commentsCount: item.commentCount,
            isPostLiked: item.isPostLiked,
            imageURL:
              item.postImagesList[0] !== undefined
                ? item.postImagesList[0].imageURL
                : "",
            postDate: item.postDate,
            postComments: item.postComments,
          });
          this.setState({ posts });
          this.setState({ isLoading: false });
          this.setState({ footerLoader: false });
        });
        this.setState({ isLoading: false });
        this.setState({ refreshing: false });
        this.setState({ footerLoader: false });
      });
  } catch (error) {
    alert(error)
    
  }
  };

  getMorePost = (userProfileId, count) => {
    this.setState({ footerLoader: true });
    fetch(
      "http://demo.wiraa.com/api/Post/GetAllPost?Id=" +
        userProfileId +
        "&pageNo=" +
        count,
      {
        method: "GET",
        //Request Type
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ isLoading: false });
        this.setState({ refreshing: false });
        this.setState({ footerLoader: false });
        let posts = [...this.state.posts];
        responseJson.map((item) => {
          posts.push({
            fkUserProfileId: item.fkUserProfileID,
            id: item.$id,
            postId: item.postID,
            userName: item.firstName,
            occupation: item.occupation,
            profilePic: item.profilePic,
            desc: item.description,
            likesCount: item.likesCount,
            commentsCount: item.commentCount,
            isPostLiked: item.isPostLiked,
            imageURL:
              item.postImagesList[0] !== undefined
                ? item.postImagesList[0].imageURL
                : "",
            postDate: item.postDate,
            postComments: item.postComments,
          });

          // item.postComments.map((comment) => {
          //   comments.push({
          //     id: comment.$id,
          //     postId: item.postID,
          //     userName: comment.commentedByName,
          //     profilePic: comment.profilePic,
          //     commentDesc: comment.comment,
          //     commentDate: comment.commentDate.split("T"),
          //   });
          // });

          this.setState({ posts });
          this.setState({ isLoading: false });
          //   this.setState({ footerLoader: false });
        });
        // this.setState({ isLoading: false });
        // this.setState({ refreshing: false });
        // this.setState({ footerLoader: false });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ isLoading: false });
        this.setState({ refreshing: false });
        this.setState({ footerLoader: false });
      });
  };

  storeData = async (value) => {
    try {
      value = value.toString();
      await AsyncStorage.setItem("userPrfileId", value);
    } catch (e) {
      // saving error
    }
  };

  storePic = async (value) => {
    try {
      await AsyncStorage.setItem("profilePic", value);
    } catch (e) {
      // saving error
    }
  };

  storeType = async (value) => {
    try {
      value = value.toString();
      await AsyncStorage.setItem("userType", value);
    } catch (e) {
      // saving error
    }
  };

  addLike = async (postId) => {
    await fetch("http://demo.wiraa.com/api/Post/AddRemoveLike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postID: postId,
        reactedBy: this.state.userProfileId,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          posts: this.state.posts.map((item) =>
            item.postId === postId
              ? {
                  ...item,
                  isPostLiked: !item.isPostLiked,
                  likesCount: responseJson,
                }
              : item
          ),
        });

        ToastAndroid.showWithGravity(
          "Post Liked",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  renderProjects = (item, index) => {
    const date = item.date.split("T");
    return item.directUserId == this.state.userId || item.directUserId == 0 ? (
      <View>
        <TouchableOpacity
          style={{
            width: 300,
            marginTop: 7,
            marginBottom: 5,
            borderRadius: 10,
            backgroundColor:
              item.directUserId == this.state.userId ? "#d9feff" : "#fafafa",
            elevation: 6,
            marginLeft: 16,
          }}
          onPress={() =>
            this.props.navigation.navigate("ProjectDetails", {
              id: item.reqId,
              response: item.respone,
              status: item.status,
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
            <View style={{ marginTop: 8, width: 320 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: 235,
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: "Futura",
                    color: "#171919",
                    fontSize: 16,
                    paddingTop: 14,
                  }}
                >
                  {item.userName}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: "OpenSans",
                    color:
                      item.status === "Active"
                        ? "#49ed5f"
                        : item.status === "Running"
                        ? "#f57"
                        : "#ff0000",
                    fontSize: 12,
                    fontStyle: "italic",
                    height: 22,
                    marginRight: 16,
                    marginTop: 10,
                    paddingTop: 2,
                    paddingHorizontal: 10,
                    borderRadius: 4,
                  }}
                >
                  {item.status}
                </Text>
                {/* <Ionicons name="ios-circle" size={24} color={item.status === "Active" ? "#49ed5f" : item.status === "Running" ? "#f57" : "#767676"} /> */}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "stretch",
                  justifyContent: "flex-start",
                  marginVertical: 4,
                  marginBottom: 16,
                  paddingTop: 4,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Ionicons name="md-repeat" size={18} color="#767676" />
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.labell,
                      { paddingLeft: 6, color: "#171919" },
                    ]}
                  >
                    {item.respone}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
                  <Ionicons name="md-calendar" size={18} color="#767676" />
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.labell,
                      { paddingLeft: 6, color: "#171919" },
                    ]}
                  >
                    {date[0]}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={[
              styles.label,
              {
                color: "#767676",
                paddingTop: 0,
                marginHorizontal: 16,
                paddingBottom: 20,
              },
            ]}
          >
            {item.description}
          </Text>
        </TouchableOpacity>
      </View>
    ) : null;
  };

  handleMainButton = () => {
    this.setState({ paused: !this.state.paused });
  };

  renderArticles = (item, index) => {
    const date = item.postDate.split("T");
    const imageURL = item.imageURL.split("~");
    const videoURL = imageURL[1] !== undefined ? imageURL[1].split(".") : "";

    const newDate = date[0].split("-");
    return (
      <PostComponent
        item={item}
        index={index}
        videoURL={videoURL}
        imageURL={imageURL}
        date={date}
        isLoading={this.state.isLoading}
        count={this.state.count}
        addLike={this.addLike}
        userProfileId={this.state.userProfileId}
        navigation={this.props.navigation}
      />

      // <View
      //   key={index}
      //   style={{
      //     backgroundColor: "#fafafa",
      //     marginHorizontal: 16,
      //     borderRadius: 16,
      //     marginBottom: 16,
      //     elevation: 6,
      //   }}
      // >
      //   <View style={{ flexDirection: "row" }}>
      //     <Image
      //       style={{
      //         width: 45,
      //         height: 45,
      //         borderRadius: 60,
      //         margin: 16,
      //         marginBottom: 10,
      //         marginRight: 10,
      //       }}
      //       source={{
      //         uri:
      //           item.profilePic === null
      //             ? "http://demo.wiraa.com/Images/Profile.png"
      //             : "http://demo.wiraa.com/" + item.profilePic,
      //       }}
      //     />
      //     <View
      //       style={{
      //         flex: 1,
      //         flexDirection: "row",
      //         justifyContent: "space-between",
      //       }}
      //     >
      //       <TouchableOpacity
      //         onPress={() =>
      //           item.fkUserProfileId !== this.state.userProfileId
      //             ? this.props.navigation.navigate("UserProfile", {
      //                 fkUserProfileId: item.fkUserProfileId,
      //               })
      //             : this.props.navigation.navigate("Profile")
      //         }
      //         style={{ marginTop: 8 }}
      //       >
      //         <Text
      //           allowFontScaling={false}
      //           style={{
      //             fontFamily: "Futura",
      //             color: "#171919",
      //             fontSize: 16,
      //             paddingTop: 10,
      //           }}
      //         >
      //           {item.userName}
      //         </Text>
      //         <Text allowFontScaling={false} style={styles.label}>
      //           {item.occupation}
      //         </Text>
      //       </TouchableOpacity>
      //     </View>
      //   </View>
      //   {/* <View> */}
      //     <View style={{ display: item.imageURL !== "" ? "flex" : "none" }}>
      //       <Image
      //         style={{
      //           alignSelf: "center",
      //           width: 360,
      //           height: 360,
      //           marginTop: 10,
      //           display:
      //             videoURL[1] !== undefined && videoURL[1] === "mp4"
      //               ? "none"
      //               : "flex",
      //         }}
      //         source={{
      //           uri:
      //             imageURL[0] !== undefined
      //               ? "http://demo.wiraa.com" + imageURL[0]
      //               : "",
      //         }}
      //       />

      //       <Video
      //         source={{
      //           uri:
      //             videoURL[0] !== undefined && videoURL[1] === "mp4"
      //               ? "http://demo.wiraa.com" + videoURL[0] + "." + videoURL[1]
      //               : "",
      //         }}
      //         rate={1.0}
      //         volume={1.0}
      //         isMuted={false}
      //         resizeMode="cover"
      //         useNativeControls
      //         isLooping
      //         usePoster
      //         posterSource={require("../assets/imgs/playbutton.png")}
      //         posterStyle={{
      //           height: 70,
      //           width: 70,
      //           borderRadius: 20,
      //           position: "absolute",
      //           top: "40%",
      //           left: "40%",
      //           alignSelf: "center",
      //         }}
      //         onPlaybackStatusUpdate={() => this.setState({ paused: true })}
      //         style={{
      //           alignSelf: "center",
      //           width: 360,
      //           height: 360,
      //           zIndex: 9999999,
      //           marginTop: 10,
      //           display:
      //             videoURL[1] !== undefined && videoURL[1] === "mp4"
      //               ? "flex"
      //               : "none",
      //         }}
      //       />
      //     </View>
      //   {/* </View> */}
      //   {/* {item.desc === "" ? (
      //     <Text></Text>
      //   ) : (
      //     <Text
      //       allowFontScaling={false}
      //       numberOfLines={2}
      //       style={[
      //         styles.label,
      //         { marginHorizontal: 16, color: "#171919", paddingVertical: 10 },
      //       ]}
      //     >
      //       {item.desc}
      //     </Text>
      //   )} */}
      //   <Text
      //       allowFontScaling={false}
      //       numberOfLines={2}
      //       style={[
      //         styles.label,
      //         { marginHorizontal: 16, color: "#171919", paddingVertical:'0.2%' },
      //       ]}
      //     >
      //       {item.desc}
      //     </Text>

      //   {/* <Text allowFontScaling={false} numberOfLines={2} style={[styles.label,{marginHorizontal:16, color:"#171919", paddingVertical:16}]}>{item.desc}</Text> */}
      //   <View
      //     style={{ flexDirection: "row", marginLeft: 12, marginBottom: 10 }}
      //   >
      //     <TouchableOpacity
      //       style={{ flexDirection: "row" }}
      //       onPress={() => this.addLike(item.postId)}
      //     >
      //       <Ionicons
      //         name="md-heart"
      //         size={24}
      //         color={item.isPostLiked ? "#f56" : "#767676"}
      //         style={{ paddingLeft: 16, paddingRight: 6 }}
      //       />
      //       <Text
      //         allowFontScaling={false}
      //         style={[styles.labell, { paddingTop: 3, paddingRight: 16 }]}
      //       >
      //         {item.likesCount}
      //       </Text>
      //     </TouchableOpacity>
      //     <TouchableOpacity
      //       style={{ flexDirection: "row" }}
      //       onPress={() =>
      //         this.props.navigation.navigate("Comment", {
      //           id: item.postId,
      //           userProfileId: this.state.userProfileId,
      //           postData: item,
      //         })
      //       }
      //     >
      //       <Ionicons name="chatbox-ellipses" size={22} color="#767676" />
      //       <Text
      //         allowFontScaling={false}
      //         style={[
      //           styles.labell,
      //           { paddingLeft: 6, paddingTop: 3, paddingRight: 16 },
      //         ]}
      //       >
      //         {item.commentsCount}
      //       </Text>
      //     </TouchableOpacity>
      //   </View>
      // </View>
    );
  };

  removeBanner = async () => {
    try {
      let bannerRemove = true;
      await AsyncStorage.setItem("bannerRemove", bannerRemove.toString());
    } catch (e) {
      // saving error
    }
  };

  onScroll = () => {
    let count = this.state.count + 1;
    this.setState({ count }, () => {
      this.getMorePost(this.state.userProfileId, this.state.count);
    });
  };

  handleFloatPress = () => {
    if (this.state.userType === 3) {
      this.getAsyncPermissions();
      this.uploadImage();
    } else {
      this.props.navigation.navigate("BusinessUser");
    }
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
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri, openArticleModal: true });
    }
  };

  _onRefresh = () => {
    this.getPosts(this.state.userProfileId, this.state.count);
    // this.getAllUserData(this.state.userId);
    // this.getorders(this.state.userId);
    // this.getrecentproject(this.state.userId);
  };

  render() {
    // console.log("idiiiiiiiiiii",this.state.userId)
    const { navigation } = this.props;
    if (this.state.isLoading === true) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#f56" />
        </View>
      );
    } else {
      return (
        <SafeAreaView
          style={[
            styles.container,
            { opacity: this.state.openArticleModal === true ? 0.2 : 1 },
          ]}
        >
          <View style={styles.headerr}>
            <TouchableOpacity
              onPress={() => this.props.navigation.openDrawer()}
              style={{ paddingTop: 4 }}
            >
              <Image
                style={{ width: 30, height: 30, borderRadius: 30 }}
                source={{
                  uri:
                    this.state.profilePic !== null
                      ? "http://demo.wiraa.com" + this.state.profilePic
                      : "http://demo.wiraa.com/Content/img/boys-avtar.jpg",
                }}
              />
            </TouchableOpacity>
            <Image
              style={{
                width: 90,
                height: 20,
                marginTop: 12,
                justifyContent: "center",
              }}
              source={require("../assets/Logo/logow.png")}
            />
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Messages")}
            >
              <Ionicons
                name="md-mail"
                size={24}
                color="#767676"
                style={{ paddingTop: 10, paddingLeft: 0 }}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              opacity: this.state.isVisible ? 0.3 : 1,
              backgroundColor: this.state.isVisible ? "#171919" : "#fff",
            }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this._onRefresh()}
              />
            }
          >
            {/*  || this.state.bannerNone  === "true"  */}
            {/* <TouchableOpacity style={{ display: this.state.userType === 3? "none" : "flex", paddingBottom:10, backgroundColor:"#f56", marginHorizontal:16, borderRadius:10, marginTop:16}} onPress={() => this.props.navigation.navigate("BusinessUser")}>
                            <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:0, height:150}}>
                                <View style={{marginTop:20}}>
                                    <Text allowFontScaling={false} style={[styles.name, {color:"#fff", fontSize:28, paddingTop:0, lineHeight:30}]}> Become a {"\n"} Professional</Text>
                                    <TouchableOpacity style={{backgroundColor:"#00203f", padding: 10, paddingHorizontal:24, borderRadius:6, alignSelf:"flex-start", elevation:10, marginTop:16, marginLeft:32}} onPress={() => this.props.navigation.navigate("BusinessUser")}>
                                        <Text allowFontScaling={false} style={[styles.label, {color:"#fff", fontFamily:"OpenSans"}]}>APPLY</Text>
                                    </TouchableOpacity>
                                </View>
                                <Image source={require('../assets/imgs/img.png')} style={{ width:180, height:150, position:"absolute", bottom:-50, right:0}} />

                                <TouchableOpacity style={{position:"absolute", top:3, right:5}} onPress={() => this.removeBanner()}>
                                    <Ionicons name="md-close-circle" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity> */}

            {/* <View style={{flex:2, marginTop:16}}>

                            <Text allowFontScaling={false} style={[styles.name, {alignSelf:"flex-start", marginLeft:16, paddingHorizontal:0, paddingBottom:6}]}>Recent Orders</Text>

                            <FlatList
                                data={this.state.orders.slice(0,2)}
                                maxToRenderPerBatch={2}
                                keyExtractor={item => item.id}
                                renderItem={({item, index}) => this.renderOrders(item, index)}
                            />
                        </View> */}

            <View
              style={{
                flex: 1,
                borderBottomWidth: 3,
                borderBottomColor: "#efefef",
                marginTop: 0,
              }}
            >
              {this.state.userType === 3 ? (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => this.handleFloatPress()}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.btntxt}> Post Your Portfolio </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => this.props.navigation.navigate("BusinessUser")}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.btntxt}>UPGRADE TO PROFESSIONAL</Text>
                  </View>
                </TouchableOpacity>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.name,
                    {
                      alignSelf: "flex-start",
                      marginLeft: 16,
                      paddingHorizontal: 0,
                      paddingBottom: 0,
                      fontSize: 14,
                    },
                  ]}
                >
                  PROJECTS
                </Text>
                {/* view more                         */}
                {/* onPress={() => this.props.navigation.navigate("Notifications")} */}
                <TouchableOpacity>
                  <Text
                    style={[
                      styles.name,
                      {
                        alignSelf: "flex-start",
                        marginLeft: 16,
                        paddingHorizontal: 0,
                        paddingTop: 16,
                        fontFamily: "OpenSans",
                        fontSize: 12,
                        paddingRight: 16,
                        color: "#f56",
                      },
                    ]}
                  >
                    View More
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View
                  style={{
                    flex: 1,
                    paddingBottom: 16,
                    borderBottomWidth: 6,
                    borderBottomColor: "#efefef",
                    marginBottom: 16,
                  }}
                >
                  {/* <Text allowFontScaling={false} style={[styles.name, {alignSelf:"flex-start", marginLeft:16, paddingHorizontal:0, paddingBottom:6}]}>Recent Projects</Text> */}

                  <FlatList
                    data={this.state.projects.slice(0, 10)}
                    maxToRenderPerBatch={1}
                    horizontal
                    keyExtractor={(item) => item.id}
                    // numColumns={3}
                    renderItem={({ item, index }) =>
                      this.renderProjects(item, index)
                    }
                  />
                </View>
              </ScrollView>

              <View style={{ flex: 1 }}>
                <FlatList
                  data={this.state.posts}
                  keyExtractor={(item) => item.id}
                  extraData={this.state}
                  renderItem={({ item, index }) =>
                    this.renderArticles(item, index)
                  }
                  // ListEmptyComponent={()=>{
                  //   return this.state.isLoading == false ?
                  //   <ActivityIndicator color="#f56" size="large" />
                  //   :
                  //   <Text>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text>
                  // }}

                  ListFooterComponent={() => {
                    return this.state.footerLoader == true ? (
                      <View style={{ marginBottom: "3%" }}>
                        <ActivityIndicator color="#f56" size="large" />
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.follow}
                        onPress={() => this.onScroll()}
                      >
                        <Text style={styles.followTxt}>Show More</Text>
                      </TouchableOpacity>
                    );
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={() => this._onRefresh()}
                    />
                  }
                  // refreshing={this.state.refreshing}
                  // onScrollEndDrag={()=>console.log('hiiiiiiiiiiii')}
                  // onEndReachedThreshold={5}
                  // onEndReached={()=>this.onScroll()}
                  // ListFooterComponent={() => {
                  //     return(
                  //        this.state.refreshing === false ?
                  //         <View style={{padding:10}}>
                  //             <ActivityIndicator size="large" color="#f56"/>
                  //         </View>
                  //         :
                  //         null
                  //     )
                  // }}
                  // ListFooterComponentStyle={{color:"red"}}
                  // refreshControl={
                  //     <RefreshControl
                  //     refreshing={this.state.refreshing}
                  //     onRefresh={()=>this.onScroll()}/>}
                />
              </View>
            </View>
          </ScrollView>

          {/* <TouchableOpacity style={styles.fltbtn} onPress={() => this.handleFloatPress()}>
                        <Ionicons name={ this.state.userType === 3 ? "md-images" : "ios-rocket"} size={28} color="#fff" />
                    </TouchableOpacity> */}

          {/* COMMENTS MODAL */}
          {/* <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.isVisible}
                        onRequestClose={() => {
                            this.setState({ postId: "", isVisible : !this.state.isVisible})
                        }}
                    >

                            <View style={{flex:1, backgroundColor:'#fff', borderTopLeftRadius:10, borderTopRightRadius:10}}>
                            <ScrollView>


                            <TouchableOpacity style={{flexDirection:"row", justifyContent:"space-between", paddingRight:16, paddingTop:16}} onPress={() => this.setState({ isVisible: false })}>
                                <Text style={[styles.heading, {paddingLeft:16}]}>Articles</Text>
                                <Ionicons name="md-close" size={24} color="#171919" />
                            </TouchableOpacity>
                            <View style={{elevation:6}}>
                            <Image style={{elevation:6,width:"90%",height:200,marginLeft:"auto",marginRight:"auto",borderRadius:20}} source={{uri:"http://demo.wiraa.com/Images/Profile.png"}}  /> 
                            </View>
                            <Text allowFontScaling={false} style={[styles.label,{marginHorizontal:16,marginVertical:15, color:"#171919", paddingVertical:16}]}>Consequat sit dolor irure non minim exercitation. Cillum laboris culpa sit consectetur tempor esse. Fugiat laboris non 
                            nisi deserunt labore sint sint proident aliqua aliquip adipisicing. Do voluptate ea labore eu esse adipisicing labore officia laborum. Do do ea excepteur id officia labore adipisicing adipisicing amet. 
                            Sint aliqua dolor pariatur ad reprehenderit in pariatur dolor esse duis non laboris voluptate. Do id voluptate amet non ex laboris dolor velit. Dolor dolor proident cupidatat exercitation reprehenderit adipisicing proident Lorem. Irure et qui ut consequat labore incididunt fugiat aliqua dolore aute. </Text>

                            <View style={{borderBottomWidth:1, borderBottomColor:"#efefef", paddingBottom:16, flexDirection:"row", marginTop:16, justifyContent:"space-evenly"}}>
                                <TextInput allowFontScaling={false} style={[styles.commentBox, {flex:1, marginHorizontal:16}]} onChangeText={(text) => this.setState({ comment: text })} value={this.state.comment} multiline={true} numberOfLines={6} placeholder="Your comments" />
                                <TouchableOpacity onPress={() => this.postComment()}>
                                    <Ionicons name="ios-send" size={24} color="#767676" style={{marginTop:14, paddingRight:16}} />
                                </TouchableOpacity>
                            </View>

                            {this.state.comments.length > 0 ?
                                
                                <ScrollView showsVerticalScrollIndicator={false}>
                                        {this.state.comments.map((item, index) => {
                                            const cmtDate = item.commentDate[0].split("-");
                                          
                                            if(item.postId === this.state.postId){
                                                console.log('post cmnt',item.commentDesc)
                                                return(
                                                    <View key={item.id+index} style={{backgroundColor:"#fff", padding:16, borderRadius:10, paddingBottom:10, paddingTop:10, borderBottomWidth:1, borderBottomColor:"#efefef"}}>
                                                        <View style={styles.comment}>
                                                            <Image style={{width:35, height:35, borderRadius:30}} source={{uri: item.ProfilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com"+item.profilePic}} />
                                                            <View style={{paddingLeft:10}}>
                                                                <Text allowFontScaling={false} style={{fontFamily:"Futura", fontSize:14, color:"#171919"}}>{item.userName}</Text>
                                                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", fontSize:12, color:"#767676"}}>{cmtDate[2]+"/"+cmtDate[1]+"/"+cmtDate[0]}</Text>
                                                            </View>
                                                        </View>
                                                        <View>
                                                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", fontSize:14, color:"#171919", display: item.commentDesc !== null ? "flex" : "none"}}>{item.commentDesc}</Text>
                                                           
                                                        </View>
                                                    </View>
                                                )
                                            }
                                        })}
                                </ScrollView>
                            : 
                                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                                    <Text style={styles.label}>No Comments Available</Text>
                                </View>
                            }
                        </ScrollView>
                        </View>
                    </Modal> */}

          {/* ARTICLE MODAL */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.openArticleModal}
            onRequestClose={() => {
              this.setState({ openArticleModal: !this.state.openArticleModal });
            }}
          >
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                elevation: 6,
                paddingBottom: 16,
                backgroundColor: "#fff",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingRight: 16,
                    paddingTop: 16,
                  }}
                  onPress={() => this.setState({ openArticleModal: false })}
                >
                  <Text style={[styles.heading, { paddingLeft: 16 }]}>
                    Post Article
                  </Text>
                  <Ionicons name="md-close" size={24} color="#171919" />
                </TouchableOpacity>
                <PostArticle
                  navigation={navigation}
                  image={this.state.image}
                  checkModal={this.state.openArticleModal}
                />
              </KeyboardAvoidingView>
            </ScrollView>
          </Modal>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
    paddingBottom: 16,
  },
  name: {
    fontFamily: "Futura",
    color: "#171919",
    padding: 16,
    paddingBottom: 0,
    fontSize: 18,
  },
  label: {
    color: "#767676",
    fontFamily: "OpenSans",
    fontSize: 14,
    fontWeight: "normal",
  },
  labell: {
    color: "#767676",
    fontFamily: "OpenSans",
    fontSize: 12,
  },
  fltbtn: {
    backgroundColor: "#171919",
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    alignSelf: "center",
    position: "absolute",
    bottom: 32,
    right: 0,
    elevation: 6,
  },
  follow: {
    backgroundColor: "#f56",
    alignSelf: "center",
    padding: 10,
    margin: 20,
    marginBottom: 32,
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
  commentBox: {
    backgroundColor: "#efefef",
    color: "#171919",
    paddingHorizontal: 16,
    marginHorizontal: 0,
    borderRadius: 10,
    height: 50,
    fontFamily: "OpenSans",
  },
  comment: {
    flexDirection: "row",
    margin: 10,
    marginLeft: 0,
  },
  btntxt: {
    textAlign: "center",
    justifyContent: "center",
    fontSize: 20,
    color: "#fff",
    fontFamily: "Futura",
    marginLeft: "auto",
    marginRight: "auto",
  },
  btn: {
    backgroundColor: "#f56",
    borderRadius: 10,
    padding: 16,
    paddingVertical: 14,
    elevation: 6,
    marginHorizontal: 16,
    height: 55,
    marginTop: 16,
    marginBottom: 0,
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
});

// import React from 'react'
// import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, ToastAndroid ,FlatList, Modal, TextInput, BackHandler, RefreshControl, KeyboardAvoidingView } from 'react-native'
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Video } from 'expo-av';
// import PostArticle from './PostArticle'
// import * as ImagePicker from 'expo-image-picker';
// import { cos } from 'react-native-reanimated';

// export default class Dashboard extends React.Component{

//     state = {
//         projects:[],
//         orders:[],
//         followings:[],
//         userProfileId:"",
//         username: "",
//         posts:[],
//         comments:[],
//         isVisible: false,
//         postId:"",
//         comment:"",
//         isLoading: false,
//         day:"",
//         month:"",
//         year:"",
//         userType:0,
//         count:0,
//         bannerNone: false,
//         refresh: false,
//         profilePic:"",
//         userType:"",
//         openArticleModal: false,
//         image:null,
//     }

//     componentDidMount = async() =>{

//         const bannerRemove = await AsyncStorage.getItem("bannerRemove")
//         if(bannerRemove !== undefined && bannerRemove !== null){
//             this.setState({ bannerNone: bannerRemove })
//         }

//         const userProfileId = await AsyncStorage.getItem('userPrfileId')
//         if(userProfileId !== null){
//             this.setState({ userProfileId })
//         }

//         const userId = await AsyncStorage.getItem('userId')
//         if(userId !== null){
//             this.setState({ userId })
//         }
//         this.setState({isLoading:true})
//         fetch("http://demo.wiraa.com/Api/Users/GetRecentProject?userId="+userId, {
//             method: 'GET'
//             //Request Type
//         })
//         .then((response) => response.json())
//         //If response is in json then in success
//         .then((responseJson) => {
//             //Success
//             let projects = [];
//             responseJson.map(item => {
//               projects.push({
//                   reqId: item.postreqID,
//                 id: item.$id,
//                 userName: item.fullName,
//                 profilePic: item.profilePic,
//                 description:item.pR_Description,
//                 status:item.postStatus,
//                 respone:item.responseNo,
//                 date:item.applyDate,
//               })

//               this.setState({
//                 projects
//               })
//             })
//             this.setState({isLoading:false})

//         })
//         //If response is not in json then in error
//         .catch((error) => {
//             //Error
//             console.error(error);
//             this.setState({isLoading:false})
//         });

//         //Orders

//         fetch("http://demo.wiraa.com/Api/Project/GetOrders?Id="+userId, {
//             method: 'GET'
//             //Request Type
//         })
//         .then((response) => response.json())
//         //If response is in json then in success
//         .then((responseJson) => {
//             //Success
//             let orders = [];
//             responseJson.map(item => {
//               orders.push({
//                 id: item.$id,
//                 reqId: item.postreqID,
//                 userName: item.userName,
//                 profilePic: item.profilePic,
//                 password: item.password,
//                 description:item.pR_Description,
//                 status:item.postStatus,
//                 respone:item.responseNo,
//                 date:item.applyDate,
//               })

//               this.setState({
//                 orders
//               })

//             })
//       this.setState({isLoading:false})
//         })
//         //If response is not in json then in error
//         .catch((error) => {
//             //Error
//             console.error(error);
//             this.setState({isLoading:false})
//         });

//         //GET ALL USERS
//         this.getAllUserData(userId);

//        // Get Posts
//        this.getPosts(userProfileId, this.state.count);
//     }

//     getAllUserData = (userId) => {
//         this.setState({isLoading:true})
//         //Get All Users
//         fetch("http://demo.wiraa.com/api/Users/GetUsers?Id="+userId, {
//             method: 'GET'
//             //Request Type
//         })
//         .then(response => response.json())
//         .then(responseJson => {
//             this.setState({
//                 userProfileId: responseJson.usersProfile.usersProfileID,
//                 userName: responseJson.firstName+" "+responseJson.lastName,
//                 userType: responseJson.userType,
//                 profilePic: responseJson.usersProfile.profilePic !== null ? responseJson.usersProfile.profilePic : null ,
//             })

//             this.storeData(this.state.userProfileId);
//             this.storePic(this.state.profilePic);
//             this.storeType(this.state.userType);
//             this.setState({isLoading:false})
//         })
//     }

//     getPosts = (userProfileId,count) => {
//         this.setState({isLoading:true})

//         fetch("http://demo.wiraa.com/api/Post/GetAllPost?Id="+userProfileId+"&pageNo="+count, {
//             method: 'GET'
//             //Request Type
//         })
//         .then(response => response.json())
//         .then(responseJson => {
//             let posts = [...this.state.posts];
//             let comments = [];
//             responseJson.map(item => {
//                 posts.push({
//                     fkUserProfileId: item.fkUserProfileID,
//                     id: item.$id,
//                     postId: item.postID,
//                     userName: item.firstName,
//                     occupation: item.occupation,
//                     profilePic: item.profilePic,
//                     desc: item.description,
//                     likesCount: item.likesCount,
//                     commentsCount: item.commentCount,
//                     isPostLiked: item.isPostLiked,
//                     imageURL: item.postImagesList[0] !== undefined ? item.postImagesList[0].imageURL : "",
//                     postDate: item.postDate,
//                     postComments:item.postComments
//                 })

//                 item.postComments.map(comment => {
//                     comments.push({
//                         id: comment.$id,
//                         postId: item.postID,
//                         userName: comment.commentedByName,
//                         profilePic: comment.profilePic,
//                         commentDesc: comment.comment,
//                         commentDate: comment.commentDate.split("T"),
//                     })
//                 })

//                 this.setState({ posts, comments, isLoading: false });
//             })
//         })
//     }

//     storeData = async (value) => {
//         try {
//             value = value.toString();
//           await AsyncStorage.setItem('userPrfileId', value)
//         } catch (e) {
//           // saving error
//         }
//     }

//     storePic = async (value) => {
//         try{
//             await AsyncStorage.setItem("profilePic", value)
//         }catch (e) {
//             // saving error
//         }
//     }

//     storeType = async (value) => {
//         try{
//             value = value.toString();
//             await AsyncStorage.setItem("userType", value)
//         }catch (e) {
//             // saving error
//         }
//     }

//     // postComment = () => {

//     //     fetch("http://demo.wiraa.com/api/Post/AddComment",{
//     //         method : "POST",
//     //         headers:{
//     //             'Content-Type': 'application/json',
//     //         },
//     //         body:JSON.stringify({
//     //             "postID": this.state.postId,
//     //             "commentedBY": this.state.userProfileId,
//     //             "comment": this.state.comment
//     //         })

//     //     })
//     //     .then(response => response.json())

//     //     .then(responseJson => {
//     //         ToastAndroid.showWithGravity(
//     //             "Comment Posted",
//     //             ToastAndroid.LONG,
//     //             ToastAndroid.BOTTOM,
//     //         );
//     //         this.setState({ comment:"" })
//     //         this.getPosts(this.state.userProfileId, this.state.count)

//     //     })

//     //     .catch(err => {
//     //         ToastAndroid.showWithGravity(
//     //             err,
//     //             ToastAndroid.LONG,
//     //             ToastAndroid.BOTTOM,
//     //         );
//     //     })
//     // }

//     addLike = (postId) => {

//         fetch("http://demo.wiraa.com/api/Post/AddRemoveLike",{
//             method: "POST",
//             headers:{
//                 'Content-Type': 'application/json',
//             },
//             body:JSON.stringify({
//                 "postID": postId,
//                 "reactedBy": this.state.userProfileId,
//             })
//         })
//         .then(response => response.json())
//         .then(responseJson => {

//            this.setState({
//                posts: this.state.posts.map(item => item.postId === postId ? {...item, isPostLiked: !item.isPostLiked,likesCount: responseJson } : item)
//            })

//            ToastAndroid.showWithGravity(
//                 "Post Liked",
//                 ToastAndroid.SHORT,
//                 ToastAndroid.BOTTOM,
//             );

//         })
//     }

//     renderProjects = (item, index) => {

//         const date = item.date.split("T");

//         return(
//             <View >
//                 <TouchableOpacity style={{backgroundColor:"#f7f7f7", width:300,marginTop:7,marginBottom:3,borderRadius:10, marginLeft:16}} onPress={() => this.props.navigation.navigate("ProjectDetails", {id: item.reqId, response: item.respone, status: item.status})}>
//                     <View style={{flex:1, flexDirection:"row"}}>
//                         <Image style={{width:50, height:50, borderRadius:10, margin:16, marginBottom:10, marginRight:10, marginTop:20}} source={{uri: item.profilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com/"+item.profilePic}} />
//                         <View style={{marginTop:8, width:320}}>
//                             <View style={{flexDirection:"row", justifyContent:"space-between", width: 235}}>
//                                 <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#171919", fontSize:16, paddingTop:14}}>{item.userName}</Text>
//                                 <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color: item.status === "Active" ? "#49ed5f" : item.status === "Running" ? "#f57" : "#ff0000", fontSize:12, fontStyle:"italic", height:22, marginRight:16, marginTop:10, paddingTop:2, paddingHorizontal:10, borderRadius:4}}>{item.status}</Text>
//                                 {/* <Ionicons name="ios-circle" size={24} color={item.status === "Active" ? "#49ed5f" : item.status === "Running" ? "#f57" : "#767676"} /> */}
//                             </View>

//                             <View style={{flexDirection:"row", alignSelf:"stretch", justifyContent:"flex-start", marginVertical:4, marginBottom:16, paddingTop:4}}>
//                                 <View style={{flexDirection:"row"}}>
//                                     <Ionicons name="md-repeat" size={18} color="#767676" />
//                                     <Text allowFontScaling={false} style={[styles.labell, {paddingLeft:6, color:"#171919"}]}>{item.respone}</Text>
//                                 </View>
//                                 <View style={{flexDirection:"row", paddingHorizontal:20}}>
//                                     <Ionicons name="md-calendar" size={18} color="#767676" />
//                                     <Text allowFontScaling={false} style={[styles.labell, {paddingLeft:6, color:"#171919"}]}>{date[0]}</Text>
//                                 </View>
//                             </View>
//                         </View>

//                     </View>
//                     <Text allowFontScaling={false} numberOfLines={1} style={[styles.label, {color:"#767676",  paddingTop:0, marginHorizontal:16, paddingBottom:20}]}>{item.description}</Text>
//                 </TouchableOpacity>
//             </View>
//         )
//     }

//     // renderOrders = (item, index) => {

//     //     const date = item.date.split("T");

//     //     return(

//     //         item.status !== "Closed" ?
//     //         <View>
//     //             <TouchableOpacity  style={{backgroundColor:"#f9f9f9", marginTop:6}} onPress={() => this.props.navigation.navigate("OrderDetails", {id: item.reqId, response: item.respone})}>
//     //                 <View style={{flex:1, flexDirection:"row"}}>
//     //                     <Image style={{width:50, height:50, borderRadius:10, margin:16, marginBottom:10, marginRight:10, marginTop:20}} source={{uri: item.profilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com/"+item.profilePic}} />
//     //                     <View style={{marginTop:8, width:320}}>
//     //                         <View style={{flexDirection:"row", justifyContent:"space-between"}}>
//     //                             <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#171919", fontSize:16, paddingTop:14}}>{item.userName}</Text>
//     //                             <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color: item.status === "Active" ? "#49ed5f" : item.status === "Running" ? "#f57" : "#767676", fontSize:12, paddingTop:14, paddingRight:20, fontStyle:"italic"}}>{item.status}</Text>
//     //                         </View>

//     //                         <View style={{flexDirection:"row", alignSelf:"stretch", justifyContent:"flex-start", marginVertical:8, marginBottom:16,}}>
//     //                             <View style={{flexDirection:"row"}}>
//     //                                 <Ionicons name="md-repeat" size={18} color="#767676" />
//     //                                 <Text allowFontScaling={false} style={[styles.labell, {paddingLeft:6, color:"#171919"}]}>{item.respone}</Text>
//     //                             </View>
//     //                             <View style={{flexDirection:"row", paddingHorizontal:20}}>
//     //                                 <Ionicons name="md-calendar" size={18} color="#767676" />
//     //                                 <Text allowFontScaling={false} style={[styles.labell, {paddingLeft:6, color:"#171919"}]}>{date[0]}</Text>
//     //                             </View>
//     //                         </View>
//     //                     </View>

//     //                 </View>
//     //                 <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {color:"#767676", lineHeight: 15, paddingTop:2, marginHorizontal:16, paddingBottom:16}]}>{item.description}</Text>
//     //             </TouchableOpacity>
//     //         </View>
//     //         : null
//     //     )
//     // }

//     renderArticles = (item, index) => {
//         // console.log("render--->>>",item)
//         const date = item.postDate.split("T");
//         const imageURL =  item.imageURL.split("~");
//         const videoURL = imageURL[1] !== undefined ? imageURL[1].split(".") : "";

//         const newDate = date[0].split("-");
//         return(
//             <View style={{
//                 backgroundColor:"#fafafa", marginHorizontal:16, borderRadius:16, marginBottom:16, elevation:6}}>
//                 <View style={{flexDirection:"row"}}>
//                     <Image style={{width:45, height:45, borderRadius:60, margin:16, marginBottom:10, marginRight:10}} source={{uri: item.profilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com/"+item.profilePic}} />
//                     <View style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
//                         <TouchableOpacity onPress={() => item.fkUserProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.fkUserProfileId}) : this.props.navigation.navigate("Profile") } style={{marginTop:8}}>
//                             <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#171919", fontSize:16, paddingTop:10}}>{item.userName}</Text>
//                             <Text allowFontScaling={false} style={styles.label}>{item.occupation}</Text>
//                         </TouchableOpacity>
//                         <Ionicons name="md-add-circle" size={28} color="#f56" style={{marginTop:16, marginRight:16, display: "none"}} />
//                     </View>
//                 </View>
//                 <TouchableOpacity onPress={() =>this.props.navigation.navigate('Comment',{id:item.postId, userProfileId:this.state.userProfileId,postData:item}) }>
//                 <View style={{display: item.imageURL !== "" ? "flex" : "none"}} >

//                     <Image style={{alignSelf:"center", width: 360, height:360, marginTop:10, display: videoURL[1] !== undefined && videoURL[1] === "mp4" ? "none" : "flex"}} source={{uri: imageURL[0] !== undefined ? "http://demo.wiraa.com"+ imageURL[0] : ""}} />

//                     <Video
//                         source={{ uri: videoURL[0] !== undefined && videoURL[1] === "mp4" ? "http://demo.wiraa.com"+ videoURL[0]+"."+videoURL[1] : "" }}
//                         rate={1.0}
//                         volume={1.0}
//                         isMuted={false}
//                         resizeMode="cover"
//                         useNativeControls={true}
//                         style={{ alignSelf:"center", width: 360, height: 360, marginTop:10, display: videoURL[1] !== undefined && videoURL[1] === "mp4" ? "flex" : "none" }}
//                     />
//                 </View>
//                 </TouchableOpacity>
//                 <Text allowFontScaling={false} numberOfLines={2} style={[styles.label,{marginHorizontal:16, color:"#171919", paddingVertical:16}]}>{item.desc}</Text>

//                 <View style={{flexDirection:"row", marginLeft:12, marginBottom:10}}>
//                     <TouchableOpacity style={{flexDirection:"row"}} onPress={() => this.addLike(item.postId)}>
//                         <Ionicons name= "md-heart" size={24} color= {item.isPostLiked ? "#f56" : "#767676"} style={{paddingLeft:16, paddingRight:6}} />
//                         <Text allowFontScaling={false} style={[styles.labell, {paddingTop:3, paddingRight:16}]}>{item.likesCount}</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity style={{flexDirection:"row"}} onPress={() =>this.props.navigation.navigate('Comment',{id:item.postId, userProfileId:this.state.userProfileId,postData:item})}>
//                         <Ionicons name="chatbox-ellipses" size={22} color="#767676" />
//                         <Text allowFontScaling={false} style={[styles.labell, {paddingLeft:6,paddingTop:3, paddingRight:16}]}>{item.commentsCount}</Text>
//                     </TouchableOpacity>

//                 </View>
//             </View>
//         )
//     }

//     removeBanner = async() => {
//         try {
//             let bannerRemove = true;
//             await AsyncStorage.setItem('bannerRemove', bannerRemove.toString())
//         } catch (e) {
//           // saving error
//         }
//     }

//     showMore = () => {

//         let count = this.state.count + 1;

//         this.setState({ count }, () => {
//             this.getPosts(this.state.userProfileId, this.state.count)
//         })
//     }

//     handleFloatPress = () => {
//         if(this.state.userType === 3){
//             this.getAsyncPermissions();
//             this.uploadImage();
//         }else{
//             this.props.navigation.navigate("BusinessUser")
//         }
//     }

//     getAsyncPermissions = async() => {
//         if (Platform.OS !== 'web') {
//             const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
//             if (status !== 'granted') {
//               alert('Sorry, we need camera roll permissions to make this work!');
//             }
//         }
//     }

//     uploadImage = async() => {
//         let result = await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.All,
//           allowsEditing: false,
//           aspect: [1, 1],
//           quality: 1,
//         });

//         console.log(result);

//         if (!result.cancelled) {
//           this.setState({ image : result.uri, openArticleModal: true })
//         }
//     };

//     render(){
//         const {navigation} = this.props
//         if(this.state.isLoading === true){
//             return(
//                 <View style={styles.container}>
//                     <ActivityIndicator size="large" color="#f56"/>
//                 </View>
//             )
//         }else{
//             return(
//                 <SafeAreaView style={[styles.container, {opacity: this.state.openArticleModal === true ? .2 : 1}]}>
//                     <View style={styles.headerr}>
//                         <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} style={{paddingTop:4}}>
//                             <Image style={{width:30, height:30, borderRadius:30}} source={{uri: this.state.profilePic !== null ? "http://demo.wiraa.com"+this.state.profilePic : "http://demo.wiraa.com/Content/img/boys-avtar.jpg"}} />
//                         </TouchableOpacity>
//                             <Image style={{width:90, height:20, marginTop:12, justifyContent:"center"}} source={require('../assets/Logo/logow.png')} />
//                         <TouchableOpacity onPress={() => this.props.navigation.navigate("Messages")}>
//                             <Ionicons name="md-mail" size={24} color="#767676" style={{paddingTop:10, paddingLeft:0}} />
//                         </TouchableOpacity>
//                     </View>

//                     <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{opacity: this.state.isVisible ? .3 : 1, backgroundColor: this.state.isVisible ? "#171919" : "#fff"}}>
//     {/*  || this.state.bannerNone  === "true"  */}
//                         {/* <TouchableOpacity style={{ display: this.state.userType === 3? "none" : "flex", paddingBottom:10, backgroundColor:"#f56", marginHorizontal:16, borderRadius:10, marginTop:16}} onPress={() => this.props.navigation.navigate("BusinessUser")}>
//                             <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:0, height:150}}>
//                                 <View style={{marginTop:20}}>
//                                     <Text allowFontScaling={false} style={[styles.name, {color:"#fff", fontSize:28, paddingTop:0, lineHeight:30}]}> Become a {"\n"} Professional</Text>
//                                     <TouchableOpacity style={{backgroundColor:"#00203f", padding: 10, paddingHorizontal:24, borderRadius:6, alignSelf:"flex-start", elevation:10, marginTop:16, marginLeft:32}} onPress={() => this.props.navigation.navigate("BusinessUser")}>
//                                         <Text allowFontScaling={false} style={[styles.label, {color:"#fff", fontFamily:"OpenSans"}]}>APPLY</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                                 <Image source={require('../assets/imgs/img.png')} style={{ width:180, height:150, position:"absolute", bottom:-50, right:0}} />

//                                 <TouchableOpacity style={{position:"absolute", top:3, right:5}} onPress={() => this.removeBanner()}>
//                                     <Ionicons name="md-close-circle" size={24} color="#fff" />
//                                 </TouchableOpacity>
//                             </View>
//                         </TouchableOpacity> */}

//                         {/* <View style={{flex:2, marginTop:16}}>

//                             <Text allowFontScaling={false} style={[styles.name, {alignSelf:"flex-start", marginLeft:16, paddingHorizontal:0, paddingBottom:6}]}>Recent Orders</Text>

//                             <FlatList
//                                 data={this.state.orders.slice(0,2)}
//                                 maxToRenderPerBatch={2}
//                                 keyExtractor={item => item.id}
//                                 renderItem={({item, index}) => this.renderOrders(item, index)}
//                             />
//                         </View> */}

//                         <View style={{flex:1, borderBottomWidth:3, borderBottomColor:"#efefef", marginTop:0}}>

//                             <TouchableOpacity style={styles.btn} onPress={() => this.handleFloatPress()}>
//                                 <View style={{flexDirection:"row"}}>
//                                 {/* <Text style={{color:"#fff",textAlign:"left",fontSize:22}}>  </Text> */}
//                                 <Text style={styles.btntxt}>Post Your Portfolio</Text>
//                                 </View>
//                             </TouchableOpacity>
//                             <View style={{flexDirection:"row", justifyContent:"space-between"}}>
//                                 <Text allowFontScaling={false} style={[styles.name, {alignSelf:"flex-start", marginLeft:16, paddingHorizontal:0, paddingBottom:0, fontSize:14}]}>PROJECTS</Text>
//                                 <Text style={[styles.name, {alignSelf:"flex-start", marginLeft:16, paddingHorizontal:0, paddingTop:16, fontFamily:"OpenSans", fontSize:12, paddingRight:16, color:"#f56"}]}>View More</Text>
//                             </View>

//                             <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
//                                 <View style={{flex:1, paddingBottom:16, borderBottomWidth:6, borderBottomColor:"#efefef", marginBottom:16}}>
//                                     {/* <Text allowFontScaling={false} style={[styles.name, {alignSelf:"flex-start", marginLeft:16, paddingHorizontal:0, paddingBottom:6}]}>Recent Projects</Text> */}

//                                     <FlatList
//                                         data={this.state.projects.slice(0,10)}
//                                         maxToRenderPerBatch={1}
//                                         horizontal
//                                         keyExtractor={item => item.id}
//                                         // numColumns={3}
//                                         renderItem={({item, index}) => this.renderProjects(item, index)}
//                                     />
//                                 </View>

//                             </ScrollView>

//                             <View style={{flex:1}}>
//                                 <FlatList
//                                     data={this.state.posts}
//                                     keyExtractor={item => item.id}
//                                     extraData={this.state}
//                                     renderItem={({item, index}) => this.renderArticles(item, index)}
//                                     ListFooterComponent={() => {
//                                         return(
//                                             <TouchableOpacity style={styles.follow} onPress={() => this.showMore() }>
//                                                 <Text style={styles.followTxt}>Show More</Text>
//                                             </TouchableOpacity>
//                                         )
//                                     }}
//                                 />
//                             </View>
//                         </View>

//                     </ScrollView>

//                     {/* <TouchableOpacity style={styles.fltbtn} onPress={() => this.handleFloatPress()}>
//                         <Ionicons name={ this.state.userType === 3 ? "md-images" : "ios-rocket"} size={28} color="#fff" />
//                     </TouchableOpacity> */}

//                     {/* COMMENTS MODAL */}
//                     {/* <Modal
//                         animationType="slide"
//                         transparent={true}
//                         visible={this.state.isVisible}
//                         onRequestClose={() => {
//                             this.setState({ postId: "", isVisible : !this.state.isVisible})
//                         }}
//                     >

//                             <View style={{flex:1, backgroundColor:'#fff', borderTopLeftRadius:10, borderTopRightRadius:10}}>
//                             <ScrollView>

//                             <TouchableOpacity style={{flexDirection:"row", justifyContent:"space-between", paddingRight:16, paddingTop:16}} onPress={() => this.setState({ isVisible: false })}>
//                                 <Text style={[styles.heading, {paddingLeft:16}]}>Articles</Text>
//                                 <Ionicons name="md-close" size={24} color="#171919" />
//                             </TouchableOpacity>
//                             <View style={{elevation:6}}>
//                             <Image style={{elevation:6,width:"90%",height:200,marginLeft:"auto",marginRight:"auto",borderRadius:20}} source={{uri:"http://demo.wiraa.com/Images/Profile.png"}}  />
//                             </View>
//                             <Text allowFontScaling={false} style={[styles.label,{marginHorizontal:16,marginVertical:15, color:"#171919", paddingVertical:16}]}>Consequat sit dolor irure non minim exercitation. Cillum laboris culpa sit consectetur tempor esse. Fugiat laboris non
//                             nisi deserunt labore sint sint proident aliqua aliquip adipisicing. Do voluptate ea labore eu esse adipisicing labore officia laborum. Do do ea excepteur id officia labore adipisicing adipisicing amet.
//                             Sint aliqua dolor pariatur ad reprehenderit in pariatur dolor esse duis non laboris voluptate. Do id voluptate amet non ex laboris dolor velit. Dolor dolor proident cupidatat exercitation reprehenderit adipisicing proident Lorem. Irure et qui ut consequat labore incididunt fugiat aliqua dolore aute. </Text>

//                             <View style={{borderBottomWidth:1, borderBottomColor:"#efefef", paddingBottom:16, flexDirection:"row", marginTop:16, justifyContent:"space-evenly"}}>
//                                 <TextInput allowFontScaling={false} style={[styles.commentBox, {flex:1, marginHorizontal:16}]} onChangeText={(text) => this.setState({ comment: text })} value={this.state.comment} multiline={true} numberOfLines={6} placeholder="Your comments" />
//                                 <TouchableOpacity onPress={() => this.postComment()}>
//                                     <Ionicons name="ios-send" size={24} color="#767676" style={{marginTop:14, paddingRight:16}} />
//                                 </TouchableOpacity>
//                             </View>

//                             {this.state.comments.length > 0 ?

//                                 <ScrollView showsVerticalScrollIndicator={false}>
//                                         {this.state.comments.map((item, index) => {
//                                             const cmtDate = item.commentDate[0].split("-");

//                                             if(item.postId === this.state.postId){
//                                                 console.log('post cmnt',item.commentDesc)
//                                                 return(
//                                                     <View key={item.id+index} style={{backgroundColor:"#fff", padding:16, borderRadius:10, paddingBottom:10, paddingTop:10, borderBottomWidth:1, borderBottomColor:"#efefef"}}>
//                                                         <View style={styles.comment}>
//                                                             <Image style={{width:35, height:35, borderRadius:30}} source={{uri: item.ProfilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com"+item.profilePic}} />
//                                                             <View style={{paddingLeft:10}}>
//                                                                 <Text allowFontScaling={false} style={{fontFamily:"Futura", fontSize:14, color:"#171919"}}>{item.userName}</Text>
//                                                                 <Text allowFontScaling={false} style={{fontFamily:"OpenSans", fontSize:12, color:"#767676"}}>{cmtDate[2]+"/"+cmtDate[1]+"/"+cmtDate[0]}</Text>
//                                                             </View>
//                                                         </View>
//                                                         <View>
//                                                             <Text allowFontScaling={false} style={{fontFamily:"OpenSans", fontSize:14, color:"#171919", display: item.commentDesc !== null ? "flex" : "none"}}>{item.commentDesc}</Text>

//                                                         </View>
//                                                     </View>
//                                                 )
//                                             }
//                                         })}
//                                 </ScrollView>
//                             :
//                                 <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
//                                     <Text style={styles.label}>No Comments Available</Text>
//                                 </View>
//                             }
//                         </ScrollView>
//                         </View>
//                     </Modal> */}

//                      {/* ARTICLE MODAL */}
//                      <Modal
//                         animationType="slide"
//                         transparent={true}
//                         visible={this.state.openArticleModal}
//                         onRequestClose={() => {
//                             this.setState({openArticleModal : !this.state.openArticleModal})
//                         }}
//                     >
//                         <ScrollView contentContainerStyle={{flex:1, elevation:6, paddingBottom:16, backgroundColor:"#fff", borderTopLeftRadius:10, borderTopRightRadius:10}}>
//                             <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
//                                 <TouchableOpacity style={{flexDirection:"row", justifyContent:"space-between", paddingRight:16, paddingTop:16}} onPress={() => this.setState({ openArticleModal: false })}>
//                                     <Text style={[styles.heading, {paddingLeft:16}]}>Post Article</Text>
//                                     <Ionicons name="md-close" size={24} color="#171919" />
//                                 </TouchableOpacity>
//                                 <PostArticle navigation={navigation} image={this.state.image} checkModal={this.state.openArticleModal}   />
//                             </KeyboardAvoidingView>
//                         </ScrollView>
//                     </Modal>

//                 </SafeAreaView>
//             )
//         }
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: "center",
//         justifyContent:"center",
//     },
//     headerr:{
//         flexDirection:"row",
//         marginTop:40,
//         alignSelf:"stretch",
//         justifyContent:"space-between",
//         paddingBottom:6,
//         borderBottomWidth:1,
//         borderBottomColor:"#efefef",
//         marginHorizontal:16
//     },
//     heading:{
//         fontFamily:"Futura",
//         fontSize:22,
//         marginTop:6,
//         textAlign:"center",
//         color:"#171919",
//         paddingBottom:16
//     },
//     name:{
//         fontFamily:"Futura",
//         color:"#171919",
//         padding:16,
//         paddingBottom:0,
//         fontSize:18,
//     },
//     label:{
//         color:"#767676",
//         fontFamily:"OpenSans",
//         fontSize:14,
//         fontWeight:"normal"
//     },
//     labell:{
//         color:"#767676",
//         fontFamily:"OpenSans",
//         fontSize:12,
//     },
//     fltbtn:{
//         backgroundColor:"#171919",
//         borderRadius:10,
//         padding:16,
//         marginTop:16,
//         alignSelf:"center",
//         position:"absolute",
//         bottom:32,
//         right: 0,
//         elevation:6
//     },
//     follow:{
//         backgroundColor:"#f56",
//         alignSelf:"center",
//         padding:10,
//         margin: 20,
//         marginBottom:32,
//         marginTop:10,
//         marginVertical:5,
//         borderRadius:6,
//         elevation:4,
//     },
//     followTxt:{
//         textAlign:"center",
//         fontSize:14,
//         color:"#fff",
//         fontFamily:"Futura",
//     },
//     commentBox:{
//         backgroundColor:"#efefef",
//         color:"#171919",
//         paddingHorizontal:16,
//         marginHorizontal:0,
//         borderRadius:10,
//         height:50,
//         fontFamily:"OpenSans"
//     },
//     comment:{
//         flexDirection:"row",
//         margin:10,
//         marginLeft:0
//     },
//     btntxt:{
//         textAlign:"center",
//         justifyContent:"center",
//         fontSize:20,
//         color:"#fff",
//         fontFamily:"Futura",
//         marginLeft:"auto",
//         marginRight:"auto",
//     },
//     btn:{
//         backgroundColor:"grey",
//         borderRadius:10,
//         padding:16,
//         paddingVertical:14,
//         elevation:6,
//         marginHorizontal:16,
//         height:55,
//         marginTop:16,
//         marginBottom:0
//     },
// });
