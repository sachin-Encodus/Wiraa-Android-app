import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Modal,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
  KeyboardAvoidingView,
  SectionList,
} from "react-native";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { Picker } from "@react-native-community/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video } from "expo-av";
import ProfilePic from "../component/ProfilePic";
import * as ImagePicker from "expo-image-picker";
import { widthPercentageToDP } from "react-native-responsive-screen";

export default class UserProfile extends React.Component {
  state = {
    isVisible: false,
    expanded: false,
    expanded1: false,
    infoExpanded: false,
    postExpanded: true,
    expertizeExpanded: false,
    galleryExpanded: false,
    userId: "",
    loggedInUserId: "",
    userProfileId: "",
    myUserProfileId: "",
    userInfo: [],
    experiences: [],
    interests: [],
    galleryPics: [],
    posts: [],
    comments: [],
    expertize: [],
    isBasicProfile: false,
    fName: "",
    lName: "",
    bio: "",
    comment: "",
    expTitle: "",
    expDesc: "",
    expId: "",
    qualification: [],
    qual: "",
    uni: "",
    school: "",
    allInterests: [],
    interstModalVisible: false,
    isShow: false,
    isLoading: false,
    hasFollowStatus: false,
    dp: null,
    postId: "",
    userType: "",
    fkUserProfileId: "",
  };

  componentDidMount = async () => {
    console.log("this.props.route.params----",this.props.route.params.fkUserProfileId)
    this.setState({ isLoading: true });
    const fkUserProfileId =
      this.props.route.params !== undefined
        ? this.props.route.params.fkUserProfileId
        : "";
    const myUserProfileId = await AsyncStorage.getItem("userPrfileId");
    this.setState({ fkUserProfileId: fkUserProfileId });
  
    const userId = await AsyncStorage.getItem("userId");
    if (userId !== null) {
      this.setState({ loggedInUserId: userId });
    }

    const userType = await AsyncStorage.getItem("userType");
    if (userType !== null) {
      this.setState({ userType });
    }

    if (fkUserProfileId !== "") {
      await fetch(
        "http://demo.wiraa.com/Api/Users/GetUserId?userProfileId=" +
          fkUserProfileId
      )
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log("userId--",responseJson)
          this.setState({
            userId: responseJson,
            userProfileId: fkUserProfileId,
            myUserProfileId: myUserProfileId,
          });
          this.setState({ isLoading: false });
          this.getProfileBasicInfo(responseJson);
        });
    } else {
      const userId = await AsyncStorage.getItem("userId");
      if (myUserProfileId !== null && userId !== null) {
        this.setState({ userProfileId: myUserProfileId, userId });
      }
      this.getProfileBasicInfo(userId);

    }

    fetch(
      "http://demo.wiraa.com/api/Profile/GetFollowingStatus?userId=" +
        this.state.userId +
        "&loggedInUserId=" +
        this.state.loggedInUserId
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ hasFollowStatus: responseJson });
        this.setState({ isLoading: false });
      })
      .catch((error)=>{
        console.log(error)
      })

     this.getInfo();
  };

  getProfileBasicInfo = (userId) => {
    //GET PROFILE INFO
    this.setState({ isLoading: true });
    fetch("http://demo.wiraa.com/api/Profile/GetProfile?userId=" + userId)
      .then((response) => response.json())
      .then((responseJson) => {
        let userInfo = [];
        userInfo.push({
          id: responseJson.$id,
          userProfileId: responseJson.usersProfileID,
          userName: responseJson.name + " " + responseJson.lName,
          occupation: responseJson.occupation,
          about: responseJson.aboutMe,
          profilePic: responseJson.profilePic,
          followers: responseJson.totalFollowers,
          following: responseJson.totalFollowings,
          bannerImg: responseJson.bannerImage,
          followStatus: responseJson.followStatus,
          qual: responseJson.highestQualification,
          uni: responseJson.university,
          school: responseJson.school,
          city:
            responseJson.userCity !== undefined &&
            responseJson.userCity.cityName !== null
              ? responseJson.userCity.cityName
              : "",
          country:
            responseJson.userCity !== undefined &&
            responseJson.userCitycountryName !== null
              ? responseJson.userCity.countryName
              : "",
          userType: responseJson.userType,
        });

        let experiences = [];
        console.log("aaaaaaaaaqqqqqqqqqqqqqqqqqq", responseJson);
        if (responseJson.experiences !== undefined) {
          responseJson.experiences.map((item) => {
            experiences.push({
              id: item.$id,
              expTitle: item.title,
              expDesc: item.description,
            });
          });
        }

        let expertize = [];
        if (responseJson.userGradeList !== undefined) {
          responseJson.userGradeList.map((expt) => {
            expertize.push({
              id: expt.gradeID,
              cirId: expt.fkCurriculumID,
              name: expt.gradeName,
              isActive: expt.isActive,
            });
          });
        }

        this.setState({ userInfo, experiences, expertize });
      });
    this.setState({ isLoading: false });
  };

  getPosts = (userProfileId) => {
    this.setState({ isLoading: true });
    fetch(
      "http://demo.wiraa.com/api/Post/GetUserPost?Id=" +
        userProfileId +
        "&pageNo=0",
      {
        method: "GET",
        //Request Type
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.length > 0) {
          let posts = [...this.state.posts];
          let comments = [];
          responseJson.map((item) => {
            // console.log('get posts--->>',item)
            posts.push({
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
            });

            item.postComments.map((comment) => {
              comments.push({
                id: comment.$id,
                postId: item.postID,
                userName: comment.commentedByName,
                profilePic: comment.profilePic,
                commentDesc: comment.comment,
                commentDate: comment.commentDate,
              });
            });

            this.setState({
              posts,
              comments,
              infoExpanded: false,
              postExpanded: true,
              expertizeExpanded: false,
              galleryExpanded: false,
            });
          });
        } else {
          this.getInfo();
        }
      });
    this.setState({ isLoading: false });
  };

  getInfo = () => {
    this.setState({
      infoExpanded: true,
      postExpanded: false,
      expertizeExpanded: true,
      galleryExpanded: false,
    });
    this.setState({ isLoading: false });
  };

  getGallery = () => {
    this.setState({
      infoExpanded: false,
      postExpanded: false,
      expertizeExpanded: false,
      galleryExpanded: true,
    });
    fetch(
      "http://demo.wiraa.com/api/Profile/GetUserGallery?userProfileId=" +
        this.state.userProfileId
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let galleryPics = [...this.state.galleryPics];

        responseJson.map((item) => {
          galleryPics.push({
            imageURL: item.imageUrl.split("."),
          });
          this.setState({ galleryPics });
        });
      });
  };

  postComment = () => {
    fetch("http://demo.wiraa.com/api/Post/AddComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postID: this.state.postId,
        commentedBY: this.state.userProfileId,
        comment: this.state.comment,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        ToastAndroid.showWithGravity(
          "Comment Posted",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
        this.setState({ comment: "" });
        this.getPosts(this.state.userProfileId);
      })
      .catch((err) => {
        ToastAndroid.showWithGravity(
          err,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      });
  };

  addLike = (postId) => {
    fetch("http://demo.wiraa.com/api/Post/AddRemoveLike", {
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
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      });
  };

  _onScroll = (e) => {
    var contentOffset = e.nativeEvent.contentOffset.y;

    if (contentOffset > 210) {
      this.setState({ isShow: true });
    } else {
      this.setState({ isShow: false });
    }
  };

  addFollower = () => {
    this.setState({ isLoading: true });
    fetch(
      "http://demo.wiraa.com/api/Network/AddFollower?FollowerId=" +
        this.state.userProfileId +
        "&UserId=" +
        this.state.myUserProfileId,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ hasFollowStatus: true });
        this.setState({ isLoading: false });
      });
  };

  removeFollower = () => {
    this.setState({ isLoading: true });
    fetch(
      "http://demo.wiraa.com/api/Network/RemoveFollower?FollowerId=" +
        this.state.userProfileId +
        "&UserId=" +
        this.state.myUserProfileId,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ hasFollowStatus: false });
        this.setState({ isLoading: false });
      });
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
      return this.state.userInfo.map((item) => (
        <View
          key={item.id}
          style={{
            flex: 1,
            justifyContent: "flex-start",
            backgroundColor: "#efefef",
          }}
        >
          <View
            style={[
              styles.headerr,
              {
                paddingTop: 40,
                display: this.state.isShow === true ? "flex" : "none",
              },
            ]}
          >
            <Feather
              name="chevron-left"
              size={24}
              color="#767676"
              style={{ zIndex: 999999, paddingTop: 6 }}
              onPress={() => this.props.navigation.goBack()}
            />

            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <Image
                style={{ width: 30, height: 30, borderRadius: 30 }}
                source={{ uri: "http://demo.wiraa.com/" + item.profilePic }}
              />
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.heading,
                  {
                    fontSize: 16,
                    paddingLeft: 10,
                    width: 200,
                    textAlign: "center",
                  },
                ]}
              >
                {item.userName}
              </Text>
            </View>

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

          <ScrollView
            onScroll={this._onScroll}
            contentContainerStyle={styles.container}
          >
            <Image
              source={{
                uri:
                  item.bannerImg !== null
                    ? "http://demo.wiraa.com/" + item.bannerImg
                    : "http://demo.wiraa.com/Content/img/Writing/Transcription.jpg",
              }}
              style={{ height: 400, width: 600 }}
            />

            <Feather
              name="chevron-left"
              size={18}
              color="#fff"
              style={{
                backgroundColor: "#aaaaaa",
                padding: 3,
                borderRadius: 30,
                zIndex: 999999,
                position: "absolute",
                top: 60,
                left: 16,
                display: this.state.isShow === true ? "none" : "flex",
              }}
              onPress={() => this.props.navigation.goBack()}
            />
            <Feather
              name="more-horizontal"
              size={18}
              color="#fff"
              style={{
                backgroundColor: "#aaaaaa",
                padding: 3,
                borderRadius: 30,
                zIndex: 999999,
                position: "absolute",
                top: 60,
                right: 16,
                display: this.state.isShow === true ? "none" : "flex",
              }}
              onPress={() =>
                this.setState({ isModalVisible: !this.state.isModalVisible })
              }
            />

            <ProfilePic pic={item.profilePic} />

            <View
              style={{
                justifyContent: "center",
                alignSelf: "stretch",
                alignItems: "center",
                opacity: this.state.isVisible ? 0.5 : 1,
                backgroundColor: this.state.isVisible ? "#171919" : "#fff",
                marginTop: -240,
                borderRadius: 32,
              }}
            >
              <View style={{ marginTop: 60 }}>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.labell,
                      { fontSize: 16, fontFamily: "Futura" },
                    ]}
                  >
                    {" "}
                    {item.userName}{" "}
                  </Text>
                </View>

                <Text
                  allowFontScaling={false}
                  style={[styles.label, { textAlign: "center" }]}
                >
                  {" "}
                  {item.occupation}{" "}
                </Text>
                <Text
                  allowFontScaling={false}
                  numberOfLines={4}
                  style={[
                    styles.labell,
                    {
                      padding: 16,
                      display: item.about !== null ? "flex" : "none",
                    },
                  ]}
                >
                  {item.about}
                  
                </Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                {/* <Ionicons name="md-ribbon" size={24} color= {item.userType === 3 ? "#faa000" : "#e80"} style={{marginTop:10}} /> */}

                <View
                  style={{
                    width: widthPercentageToDP(35),
                    marginRight: item.userType == 3 ? 30 : 40,
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.btn,
                      {
                        display:
                          this.state.hasFollowStatus === false
                            ? "flex"
                            : "none",
                      },
                    ]}
                    onPress={() => this.addFollower()}
                  >
                    <Text allowFontScaling={false} style={styles.btntxt}>
                      FOLLOW
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.btn,
                      {
                        display:
                          this.state.hasFollowStatus === true ? "flex" : "none",
                      },
                    ]}
                    onPress={() => this.removeFollower()}
                  >
                    <Text allowFontScaling={false} style={styles.btntxt}>
                      FOLLOWING
                    </Text>
                  </TouchableOpacity>
                </View>
                {item.userType == 3 ? (
                  <View>
                    <TouchableOpacity
                      style={[
                        styles.btn,
                        {
                          backgroundColor: "#efefef",
                          width: widthPercentageToDP(35),
                          marginLeft: 30,
                        },
                      ]}
                      onPress={() =>
                        this.props.navigation.navigate("PostRequest", {
                          fkUserProfileId: this.state.userId,
                        })
                      }
                    >
                      <Text
                        allowFontScaling={false}
                        style={[styles.btntxt, { color: "#171919" }]}
                      >
                        CONTACT
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {/* {this.state.followingList.map(followItem => (
                                followItem.userProfileId !== this.state.userProfileId && followItem.isFollowing !== false ?
                                <View>
                                    <TouchableOpacity style={[styles.btn, {display: this.state.loggedInUserId !== this.state.userId ? "flex" : "none"}]} onPress={() => this.addFollower()}>
                                        <Text allowFontScaling={false} style={styles.btntxt}>FOLLOW</Text>
                                    </TouchableOpacity>
                                </View>
                                : followItem.userProfileId === this.state.userProfileId && followItem.isFollowing === false ?
                                <View>
                                    <TouchableOpacity style={[styles.btn, {display: this.state.loggedInUserId !== this.state.userId ? "flex" : "none"}]} onPress={() => this.props.navigation.navigate("QnA")} onPress={() => this.removeFollower()}>
                                        <Text allowFontScaling={false} style={styles.btntxt}>FOLLOWING</Text>
                                    </TouchableOpacity>
                                </View>
                                : null
                            ))} */}

                {/* <Ionicons name="md-share" size={24} color="#767676" style={{marginTop:10}} /> */}
              </View>

              <View style={{ flexDirection: "row", marginTop: 24, width: 200 }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.replace("Follow", {
                      userProfileId: this.state.userProfileId,
                    })
                  }
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      textAlign: "center",
                      fontFamily: "Futura",
                      fontSize: 18,
                      color: "#171919",
                    }}
                  >
                    {" "}
                    {item.followers}{" "}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      textAlign: "center",
                      fontFamily: "OpenSans",
                      color: "#aaaaaa",
                    }}
                  >
                    Followers
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.replace("Follow", {
                      userProfileId: this.state.userProfileId,
                    })
                  }
                  style={{
                    borderLeftWidth: 1,
                    borderLeftColor: "#efefef",
                    paddingLeft: 32,
                    marginLeft: 32,
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      textAlign: "center",
                      fontFamily: "Futura",
                      fontSize: 18,
                      color: "#171919",
                    }}
                  >
                    {" "}
                    {item.following}{" "}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      textAlign: "center",
                      fontFamily: "OpenSans",
                      color: "#aaaaaa",
                    }}
                  >
                    Followings
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  borderTopWidth: 10,
                  borderColor: "#efefef",
                  marginTop: 16,
                  paddingTop: 16,
                  flexDirection: "row",
                  alignSelf: "stretch",
                  justifyContent: "space-around",
                }}
              >
                {/* POST */}
                {item.userType == 3 ? (
                  <TouchableOpacity
                    onPress={() => this.getPosts(this.state.userProfileId)}
                  >
                    <Ionicons
                      name="ios-keypad"
                      size={24}
                      color={this.state.postExpanded ? "#f56" : "#767676"}
                    />
                  </TouchableOpacity>
                ) : null}

                {/* INFO */}


                
                <TouchableOpacity onPress={() => this.getInfo()}>
                  {
                    item.userType == 3 ?
                    <Ionicons
                    name="ios-school"
                    size={24}
                    color={this.state.infoExpanded ? "#f56" : "#767676"}
                  />
                    :
                    <View style={{}}>
                  <Text style={{color:this.state.infoExpanded ? "#f56" : "#767676",fontWeight:"bold",fontFamily:"Futura",fontSize:22}}>Info</Text>
                  </View>
                  }
                 
                </TouchableOpacity>


                {/* GALLERY */}
                {/* <TouchableOpacity onPress={() => this.getGallery()}>
                                <Ionicons name="ios-images" size={24} color={this.state.galleryExpanded ? "#f56" : "#767676"} />
                            </TouchableOpacity> */}

                {/* EXPERTIZE */}
                {/* <TouchableOpacity style={{ display: this.state.userType === "3" ? "flex" : "none" }} onPress={() => this.setState({
                                infoExpanded: false,
                                postExpanded: false,
                                expertizeExpanded: true,
                                galleryExpanded: false,
    
                            })}>
                                <Ionicons name="ios-rocket" size={24} color={this.state.expertizeExpanded ? "#f56" : "#767676"} />
                            </TouchableOpacity> */}
              </View>

              {item.userType == 3 ? (
                this.state.posts.length > 0 ? (
                  <View
                    style={{
                      marginBottom: 16,
                      alignSelf: "stretch",
                      marginTop: 6,
                      display:
                        this.state.postExpanded === true ? "flex" : "none",
                    }}
                  >
                    {this.state.posts.map((item, index) => {
                      const date = item.postDate.split("T");
                      const imageURL = item.imageURL.split("~");
                      const videoURL =
                        imageURL[1] !== undefined ? imageURL[1].split(".") : "";

                      return (
                        <View key={item.id + index}>
                          <View style={{ flexDirection: "row" }}>
                            <Image
                              style={{
                                width: 45,
                                height: 45,
                                borderRadius: 60,
                                margin: 16,
                                marginBottom: 10,
                                marginRight: 10,
                              }}
                              source={{
                                uri:
                                  item.profilePic === null
                                    ? "http://demo.wiraa.com/Images/Profile.png"
                                    : "http://demo.wiraa.com" + item.profilePic,
                              }}
                            />
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <TouchableOpacity
                                onPress={() =>
                                  item.fkUserProfileId !==
                                  this.state.userProfileId
                                    ? this.props.navigation.navigate(
                                        "Profile",
                                        {
                                          fkUserProfileId: item.fkUserProfileId,
                                        }
                                      )
                                    : this.props.navigation.navigate("Profile")
                                }
                                style={{ marginTop: 8 }}
                              >
                                <Text
                                  allowFontScaling={false}
                                  style={{
                                    fontFamily: "Futura",
                                    color: "#171919",
                                    fontSize: 16,
                                    paddingTop: 10,
                                  }}
                                >
                                  {item.userName}
                                </Text>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.label}
                                >
                                  {item.occupation}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <Text
                            allowFontScaling={false}
                            style={[
                              styles.label,
                              { marginHorizontal: 16, color: "#171919" },
                            ]}
                          >
                            {item.desc}
                          </Text>
                          <View
                            style={{
                              display: item.imageURL !== "" ? "flex" : "none",
                            }}
                          >
                            <Image
                              style={{
                                alignSelf: "center",
                                width: 360,
                                height: 360,
                                borderRadius: 15,
                                marginTop: 10,
                                display:
                                  videoURL[1] !== undefined &&
                                  videoURL[1] === "mp4"
                                    ? "none"
                                    : "flex",
                              }}
                              source={{
                                uri:
                                  imageURL[0] !== undefined
                                    ? "http://demo.wiraa.com" + imageURL[0]
                                    : "",
                              }}
                            />
                            <Video
                              source={{
                                uri:
                                  videoURL[0] !== undefined &&
                                  videoURL[1] === "mp4"
                                    ? "http://demo.wiraa.com" +
                                      videoURL[0] +
                                      "." +
                                      videoURL[1]
                                    : "",
                              }}
                              rate={1.0}
                              volume={1.0}
                              isMuted={false}
                              resizeMode="cover"
                              useNativeControls={true}
                              style={{
                                alignSelf: "center",
                                width: 360,
                                height: 360,
                                borderRadius: 15,
                                marginTop: 10,
                                display:
                                  videoURL[1] !== undefined &&
                                  videoURL[1] === "mp4"
                                    ? "flex"
                                    : "none",
                              }}
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginLeft: 12,
                              marginTop: 10,
                              marginBottom: 10,
                            }}
                          >
                            <TouchableOpacity
                              style={{ flexDirection: "row" }}
                              onPress={() => this.addLike(item.postId)}
                            >
                              <Ionicons
                                name="md-heart"
                                size={24}
                                color={item.isPostLiked ? "#f56" : "#767676"}
                                style={{ paddingLeft: 16, paddingRight: 6 }}
                              />
                              <Text
                                allowFontScaling={false}
                                style={[
                                  styles.labell,
                                  {
                                    paddingLeft: 6,
                                    paddingTop: 3,
                                    paddingRight: 16,
                                  },
                                ]}
                              >
                                {item.likesCount}
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={{ flexDirection: "row" }}
                              onPress={() =>
                                this.setState({
                                  postId: item.postId,
                                  isVisible: !this.state.isVisible,
                                })
                              }
                            >
                              <Ionicons
                                name="chatbox-ellipses"
                                size={22}
                                color="#767676"
                              />
                              <Text
                                allowFontScaling={false}
                                style={[
                                  styles.labell,
                                  {
                                    paddingLeft: 6,
                                    paddingTop: 3,
                                    paddingRight: 16,
                                  },
                                ]}
                              >
                                {item.commentsCount}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View
                    style={{
                      paddingVertical: 32,
                      height: 300,
                      alignSelf: "center",
                      justifyContent: "center",
                      display:
                        this.state.postExpanded === true ? "flex" : "none",
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={[styles.heading, { color: "#f56" }]}
                    >
                      No New Posts!
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
                )
              ) : null}

              {/* <View style={{flex:1}}> */}
              <View
                style={{
                  borderColor: "#efefef",
                  alignSelf: "stretch",
                  marginTop: 16,
                  borderBottomWidth: 10,
                  paddingBottom: 16,
                  display: this.state.infoExpanded === true ? "flex" : "none",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginRight: 16,
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={[styles.label, { marginTop: 0, marginLeft: 16 }]}
                  >
                    Experience
                  </Text>
                </View>
                <View style={{ paddingLeft: 6 }}>
                  {this.state.experiences.map((expItem) => (
                    <View key={expItem.id} style={{ marginLeft: 16 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginRight: 16,
                        }}
                      >
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: "Futura",
                            color: "#171919",
                            fontSize: 16,
                            paddingTop: 10,
                            width: 250,
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {expItem.expTitle}
                        </Text>
                      </View>
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.labell,
                          {
                            lineHeight: 16,
                            paddingTop: 6,
                            paddingRight: 24,
                            color: "#767676",
                          },
                        ]}
                      >
                        {expItem.expDesc}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View
                style={{
                  borderColor: "#efefef",
                  marginTop: 16,
                  borderBottomWidth: 10,
                  paddingBottom: 16,
                  alignSelf: "stretch",
                  display: this.state.infoExpanded === true ? "flex" : "none",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginRight: 16,
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={[styles.label, { marginTop: 0, marginLeft: 16 }]}
                  >
                    Education
                  </Text>
                </View>
                <View style={{ paddingLeft: 6 }}>
                  <View
                    style={{
                      marginLeft: 16,
                      display: item.qual === null ? "none" : "flex",
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontFamily: "Futura",
                        color: "#171919",
                        fontSize: 16,
                        paddingTop: 10,
                      }}
                    >
                      Qualification
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.labell,
                        {
                          lineHeight: 16,
                          paddingTop: 6,
                          paddingRight: 24,
                          color: "#767676",
                        },
                      ]}
                    >
                      {item.qual}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginLeft: 16,
                      display: item.uni === null ? "none" : "flex",
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontFamily: "Futura",
                        color: "#171919",
                        fontSize: 16,
                        paddingTop: 10,
                      }}
                    >
                      University
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.labell,
                        {
                          lineHeight: 16,
                          paddingTop: 6,
                          paddingRight: 24,
                          color: "#767676",
                        },
                      ]}
                    >
                      {item.uni}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginLeft: 16,
                      display: item.school === null ? "none" : "flex",
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontFamily: "Futura",
                        color: "#171919",
                        fontSize: 16,
                        paddingTop: 10,
                      }}
                    >
                      School
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.labell,
                        {
                          lineHeight: 16,
                          paddingTop: 6,
                          paddingRight: 24,
                          color: "#767676",
                        },
                      ]}
                    >
                      {item.school}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  borderColor: "#efefef",
                  marginTop: 16,
                  borderBottomWidth: 10,
                  paddingBottom: 16,
                  alignSelf: "stretch",
                  display: this.state.infoExpanded === true ? "flex" : "none",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginRight: 16,
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={[styles.label, { marginTop: 0, marginLeft: 16 }]}
                  >
                    Location
                  </Text>
                </View>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: "Futura",
                    color: "#171919",
                    fontSize: 16,
                    paddingTop: 10,
                    paddingLeft: 24,
                  }}
                >
                  {item.city}, {item.country}
                </Text>
              </View>

              {/*  onPress={() => this.props.navigation.navigate("Interests", {
                                        interests: this.state.interests,
                                    })} */}

              {/* INTERESTSS */}

              {/* <View style={{ borderColor:"#efefef", marginTop:16, borderBottomWidth:10, paddingBottom:0, display: this.state.infoExpanded === true ? "flex" : "none"}}>
                                <View style={{flexDirection:"row", justifyContent:"space-between" , marginRight:16}}>
                                    <Text allowFontScaling={false} style={[styles.label, {marginTop: 0, marginLeft:16}]}>Interests</Text>
                                    <TouchableOpacity style={{backgroundColor:"#f56", padding:6, borderRadius:30, paddingHorizontal:8}}>
                                        <Ionicons name="md-create" size={13} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={{ height:600, marginTop:10, paddingBottom:0}}>
                                    <ScrollView nestedScrollEnabled={true} contentContainerStyle={{flexDirection:"row", flexWrap:"wrap", paddingLeft:16}}>
                                        {this.state.interests.map(interest => (
                                            <Text key={interest.id} allowFontScaling={false} style={[styles.active, {alignSelf:"flex-start"}]}>{interest.name}</Text>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View> */}

              {/* </View> */}

              <View
                style={{
                  alignSelf: "stretch",
                  height: 600,
                  justifyContent: "flex-start",
                  display:
                    this.state.galleryExpanded === true ? "flex" : "none",
                }}
              >
                {/* <Text allowFontScaling={false} style={[styles.label, {marginTop:16}]}>Gallery</Text> */}

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    paddingLeft: 16,
                    marginTop: 16,
                  }}
                >
                  {this.state.galleryPics.map((item) => {
                    const videoURL = item.imageURL[0].split("~");
                    return (
                      <View>
                        <TouchableOpacity
                          style={{ marginVertical: 3, marginHorizontal: 6 }}
                        >
                          <Image
                            style={{
                              width: 108,
                              height: 100,
                              borderRadius: 6,
                              display:
                                item.imageURL[1] !== undefined &&
                                item.imageURL[1] === "mp4"
                                  ? "none"
                                  : "flex",
                            }}
                            source={{
                              uri:
                                item.imageURL[0] !== undefined
                                  ? "http://demo.wiraa.com" +
                                    item.imageURL[0] +
                                    "." +
                                    item.imageURL[1]
                                  : "",
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ marginBottom: 10, marginHorizontal: 6 }}
                        >
                          <Video
                            source={{
                              uri:
                                videoURL[1] !== undefined
                                  ? "http://demo.wiraa.com" +
                                    videoURL[1] +
                                    "." +
                                    item.imageURL[1]
                                  : "",
                            }}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            style={{
                              width: 108,
                              height: 100,
                              borderRadius: 6,
                              display:
                                item.imageURL[1] !== undefined &&
                                item.imageURL[1] === "mp4"
                                  ? "flex"
                                  : "none",
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
              {item.userType == 3 ? (
                <View
                  style={{
                    marginTop: 16,
                    alignSelf: "stretch",
                    display:
                      this.state.expertizeExpanded === true ? "flex" : "none",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginRight: 16,
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={[styles.label, { marginTop: 0, marginLeft: 16 }]}
                    >
                      Expertize
                    </Text>
                  </View>

                  <View
                    style={{ height: "auto", marginTop: 10, paddingBottom: 0 }}
                  >
                    <ScrollView
                      nestedScrollEnabled={true}
                      contentContainerStyle={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        paddingLeft: 16,
                      }}
                    >
                      {this.state.expertize.map((expt) => (
                        <Text
                          key={expt.id}
                          allowFontScaling={false}
                          style={[styles.active, { alignSelf: "flex-start" }]}
                        >
                          {expt.name}
                        </Text>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              ) : null}

              {/* COMMENT MODAL */}

              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.isVisible}
                onRequestClose={() => {
                  this.setState({ isVisible: !this.state.isVisible });
                }}
              >
                <View
                  style={{
                    flex: 1,
                    marginTop: 300,
                    backgroundColor: "#fff",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      backgroundColor: "#f56",
                      elevation: 3,
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={[styles.name, { paddingBottom: 16, fontSize: 18 }]}
                    >
                      Comments
                    </Text>
                    <TouchableOpacity
                      style={{ paddingRight: 16, paddingTop: 16 }}
                      onPress={() => this.setState({ isVisible: false })}
                    >
                      <Ionicons name="md-close" size={24} color="#171919" />
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#efefef",
                      paddingBottom: 16,
                      flexDirection: "row",
                      marginTop: 16,
                      justifyContent: "space-evenly",
                    }}
                  >
                    <TextInput
                      allowFontScaling={false}
                      style={[
                        styles.commentBox,
                        { flex: 1, marginHorizontal: 16 },
                      ]}
                      onChangeText={(text) => this.setState({ comment: text })}
                      value={this.state.comment}
                      multiline={true}
                      numberOfLines={6}
                      placeholder="Your comments"
                    />
                    <TouchableOpacity onPress={() => this.postComment()}>
                      <Ionicons
                        name="ios-send"
                        size={24}
                        color="#767676"
                        style={{ marginTop: 14, paddingRight: 16 }}
                      />
                    </TouchableOpacity>
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false}>
                    {this.state.comments.map((item, index) => {
                      const cmtDate = item.commentDate[0].split("-");
                      if (item.postId === this.state.postId) {
                        return (
                          <View
                            key={item.id + index}
                            style={{
                              backgroundColor: "#fff",
                              padding: 16,
                              borderRadius: 10,
                              paddingBottom: 10,
                              paddingTop: 10,
                              borderBottomWidth: 1,
                              borderBottomColor: "#efefef",
                            }}
                          >
                            <View style={styles.comment}>
                              <Image
                                style={{
                                  width: 35,
                                  height: 35,
                                  borderRadius: 30,
                                }}
                                source={{
                                  uri:
                                    item.ProfilePic === null
                                      ? "http://demo.wiraa.com/Images/Profile.png"
                                      : "http://demo.wiraa.com" +
                                        item.profilePic,
                                }}
                              />
                              <View style={{ paddingLeft: 10 }}>
                                <Text
                                  allowFontScaling={false}
                                  style={{
                                    fontFamily: "Futura",
                                    fontSize: 14,
                                    color: "#171919",
                                  }}
                                >
                                  {item.userName}
                                </Text>
                                <Text
                                  allowFontScaling={false}
                                  style={{
                                    fontFamily: "OpenSans",
                                    fontSize: 12,
                                    color: "#767676",
                                  }}
                                >
                                  {cmtDate[2] +
                                    "/" +
                                    cmtDate[1] +
                                    "/" +
                                    cmtDate[0]}
                                </Text>
                              </View>
                            </View>
                            <View>
                              <Text
                                allowFontScaling={false}
                                style={{
                                  fontFamily: "OpenSans",
                                  fontSize: 14,
                                  color: "#171919",
                                  display:
                                    item.commentDesc !== null ? "flex" : "none",
                                }}
                              >
                                {item.commentDesc}
                              </Text>
                              {/* <Image style={{width:360, height:240, borderRadius:10, marginTop:10, display: item.ansImg !== null ? "flex" :"none"}} source={{uri: "http://demo.wiraa.com/"+item.ansImg}} /> */}
                            </View>
                          </View>
                        );
                      }
                    })}
                  </ScrollView>
                </View>
              </Modal>
            </View>
          </ScrollView>
        </View>
      ));
    }
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontFamily: "Futura",
    fontSize: 22,
    marginTop: 6,
    textAlign: "center",
    color: "#171919",
  },
  headerr: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    borderBottomColor: "#efefef",
    paddingHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 170,
    paddingTop: 16,
    borderRadius: 16,
  },
  txtipt: {
    borderRadius: 6,
    paddingHorizontal: 6,
    marginVertical: 6,
    fontFamily: "OpenSans",
    marginHorizontal: 16,
    backgroundColor: "#efefef",
    height: 50,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#f56",
    borderRadius: 10,
    padding: widthPercentageToDP(5),
    paddingVertical: 14,
    width: widthPercentageToDP(45),
    elevation: 6,
justifyContent:'space-around'
  },
  btntxt: {
    textAlign: "center",
    fontSize: widthPercentageToDP(3.5),
    color: "#fff",
    fontFamily: "Futura",
  },
  label: {
    color: "#767676",
    fontFamily: "OpenSans",
    fontSize: 14,
  },
  labell: {
    color: "#171919",
    fontFamily: "OpenSans",
    fontSize: 14,
  },
  active: {
    padding: 10,
    backgroundColor: "#efefef",
    borderRadius: 6,
    color: "#171919",
    margin: 6,
    fontFamily: "OpenSans",
    fontSize: 12,
  },
  mt: {
    marginTop: 16,
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
});
