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
  Animated,
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
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RectButton } from "react-native-gesture-handler";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

export default class Profile extends React.Component {
  state = {
    editableMode: false,
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
    subjects: [],
    isBasicProfile: false,
    fName: "",
    lName: "",
    userName: "",
    selectedMale: false,
    selectedFemale: false,
    selectedOthers: false,
    selected: "",
    bio: "",
    comment: "",
    expModalVisible: false,
    addExpModal: false,
    expTitle: "",
    expDesc: "",
    expId: "",
    eduModalVisible: false,
    qualification: [],
    qual: "",
    uni: "",
    school: "",
    allInterests: [],
    interstModalVisible: false,
    occupation: [],
    occupationName: "",
    isShow: false,
    isLoading: false,
    dp: null,
    cityModal: false,
    postId: "",
    city: [],
    userType: "",
    refresh: false,
  };

  componentDidMount = async () => {
    const fkUserProfileId =
      this.props.route.params !== undefined
        ? this.props.route.params.fkUserProfileId
        : "";
    const myUserProfileId = await AsyncStorage.getItem("userPrfileId");

    const userId = await AsyncStorage.getItem("userId");
    if (userId !== null) {
      this.setState({ loggedInUserId: userId });
    }

    if (fkUserProfileId !== "") {
      await fetch(
        "http://demo.wiraa.com/Api/Users/GetUserId?userProfileId=" +
          fkUserProfileId
      )
        .then((response) => response.json())
        .then((responseJson) => {
          // alert('ok')
          console.log("responseJson get user id ------>>", responseJson);
          this.setState({
            userId: responseJson,
            userProfileId: fkUserProfileId,
            myUserProfileId: myUserProfileId,
          });
          this.getProfileBasicInfo(responseJson);
        })
        .catch((error) => {
          // alert(error)
          console.log("errors---", error);
        });
    } else {
      const userId = await AsyncStorage.getItem("userId");
      if (myUserProfileId !== null && userId !== null) {
        this.setState({ userProfileId: myUserProfileId, userId });
      }
      this.getProfileBasicInfo(userId);
    }

    // fetch("http://demo.wiraa.com/api/Profile/GetUserInterests?userProfileId="+userProfileId)
    // .then(response => response.json())
    // .then(responseJson => {
    //     let interests = [...this.state.interests];
    //     responseJson.map(item => {
    //         interests.push({
    //             id: item.$id,
    //             gradeId : item.gradeId,
    //             name: item.gradeName,
    //         })

    //         this.setState({ interests, isLoading: false })
    //     })
    // })

    const userType = await AsyncStorage.getItem("userType");
    if (userType !== null) {
      this.setState({ userType });
    }

    if (this.state.userType === "3") {
      this.getPosts(this.state.userProfileId);
    } else {
      this.getInfo();
    }

    // this.willFocusSubscription = this.props.navigation.addListener(
    //   'focus',
    //   () => {
    //     this.getInfo();
    //   },
    // );
  };

  // componentWillUnmount() {
  //   this.willFocusSubscription;
  //   this.setState({});
  // }

  onRefresh = (data, count) => {
    // console.log(data.count);
    this.setState({
      userInfo: this.state.userInfo.map((item) =>
        item.following !== data.count
          ? { ...item, following: item.following + data.count }
          : item
      ),
    });
  };

  getProfileBasicInfo = (userId) => {
    //GET PROFILE INFO
    this.setState({ isLoading: true });
    this.setState({ isBasicProfile: false });
    fetch("http://demo.wiraa.com/api/Profile/GetProfile?userId=" + userId)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log("-------", responseJson);
        let userInfo = [];
        userInfo.push({
          id: responseJson.$id,
          userProfileId: responseJson.usersProfileID,
          fName: responseJson.name,
          lName: responseJson.lName,
          registeredName: responseJson.userName,
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
          city: responseJson.userCity.cityName,
          country: responseJson.userCity.countryName,
          userType: responseJson.userType,
        });

        let experiences = [...this.state.experiences];
        responseJson.experiences.map((item) => {
          experiences.push({
            id: item.$id,
            expTitle: item.title,
            expDesc: item.description,
          });
        });

        let expertize = [...this.state.expertize];
        responseJson.userGradeList.map((expt) => {
          expertize.push({
            id: expt.gradeID,
            cirId: expt.fkCurriculumID,
            name: expt.gradeName,
            isActive: expt.isActive,
          });
        });

        let subjects = [...this.state.subjects];
        responseJson.userSubjectList.map((subList) => {
          subjects.push({
            id: subList.$id,
            subId: subList.subjectId,
            gradeId: subList.gradeId,
          });
        });

        this.setState({
          userInfo,
          experiences,
          expertize,
          subjects,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isLoading: false });
      });
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
        this.setState({ isLoading: false });
        if (responseJson.length > 0) {
          let posts = [...this.state.posts];
          let comments = [];
          responseJson.map((item) => {
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
      })
      .catch((e) => {
        this.setState({ isLoading: false });
        console.log(e);
      });
  };

  getInfo = () => {
    this.setState({
      infoExpanded: true,
      postExpanded: false,
      expertizeExpanded: true,
      galleryExpanded: false,
      isLoading: false,
    });
  };

  getGallery = () => {
    this.setState({
      infoExpanded: false,
      postExpanded: false,
      expertizeExpanded: false,
      galleryExpanded: true,
      isLoading: true,
    });

    fetch(
      "http://demo.wiraa.com/api/Profile/GetUserGallery?userProfileId=" +
        this.state.userProfileId
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ isLoading: false });
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

  getGender = (val) => {
    if (val === 1) {
      this.setState({
        selectedMale: true,
        selectedFemale: false,
        selectedOthers: false,
        selected: "Male",
      });
    } else if (val === 2) {
      this.setState({
        selectedMale: false,
        selectedFemale: true,
        selectedOthers: false,
        selected: "Female",
      });
    } else {
      this.setState({
        selectedMale: false,
        selectedFemale: false,
        selectedOthers: true,
        selected: "Others",
      });
    }
  };

  updateProfile = (item) => {
    this.setState({ isLoading: true });
    fetch("http://demo.wiraa.com/api/Profile/UpdateProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: this.state.userId,
        firstName: this.state.fName,
        lastName: this.state.lName,
        userName: item.registeredName,
        email: "",
        gender: this.state.selected,
        dateOfBirth: 15021998,
        aboutMe: this.state.bio,
        occupation: this.state.occupationName,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("===>>>>", responseJson);
        this.setState({ isLoading: false });
        if (responseJson.status === true) {
          this.setState({ isBasicProfile: false });
          ToastAndroid.showWithGravity(
            "Profile Update Successfully",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM
          );
        } else {
          this.getProfileBasicInfo(this.state.userId);

          ToastAndroid.showWithGravity(
            responseJson.message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM
          );
        }
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  };

  addExp = (id) => {
    if (id !== undefined || id !== null) {
      fetch("http://demo.wiraa.com/api/Profile/AddEditExperiance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.state.userId,
          description: this.state.expDesc,
          title: this.state.expTitle,
          id: id,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("reponse of edit experience", responseJson);
          this.setState({ expModalVisible: false });
          ToastAndroid.showWithGravity(
            "Experience Updated",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM
          );
        })
        .catch((err) => {
          console.log("error--->", err);
        });
    } else {
      fetch("http://demo.wiraa.com/api/Profile/AddEditExperiance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.state.userId,
          description: this.state.expDesc,
          title: this.state.expTitle,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("reponse of Add experience", responseJson);
          this.setState({ expModalVisible: false });
          ToastAndroid.showWithGravity(
            "Experience Added",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM
          );
        });
    }
  };

  deleteExp = (id) => {
    console.log("id", id);
    fetch(
      "http://demo.wiraa.com/api/Profile/DeleteExperiance?experianceId=" + id,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("delete response", responseJson);
        this.setState({ expModalVisible: false });
        ToastAndroid.showWithGravity(
          "Experience Deleted",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      });
  };

  changeEducation = () => {
    fetch("http://demo.wiraa.com/api/Profile/FillQualification", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let qualification = [...this.state.qualification];

        responseJson.map((item) => {
          qualification.push({
            id: item.qualificationID,
            name: item.qualificationName,
          });
          this.setState({ qualification });
        });

        this.setState({ eduModalVisible: true });
      });
  };

  updateEducation = () => {
    fetch("http://demo.wiraa.com/api/Profile/UpdateUserEducation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: this.state.userId,
        highestQualification: this.state.uni,
        school: this.state.school,
        fkQualificationID: this.state.qual,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("update eduxaion reponse=", responseJson);
        ToastAndroid.showWithGravity(
          responseJson.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );

        this.setState({ eduModalVisible: false });
        this.getProfileBasicInfo(this.state.userId);
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

  deletePost = (id) => {
    fetch(
      "http://demo.wiraa.com/Api/Post/DeletePost?userProfileId=" +
        this.state.userProfileId +
        "&postId=" +
        id
    )
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        this.setState({
          posts: this.state.posts.filter((item) => item.postId !== id),
        });
        ToastAndroid.showWithGravityAndOffset(
          "Deleted Successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );

        this.getPosts(this.state.myUserProfileId);
      });
  };

  changeDP = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.cancelled) {
      this.setState({ dp: result.uri });

      const model = new FormData();

      model.append("userId", this.state.userId);
      model.append("image", {
        name: this.state.dp,
        type: "image/jpg",
        uri: this.state.dp,
      });

      fetch("http://demo.wiraa.com/api/Profile/ChangeProfileDP", {
        method: "POST",
        body: model,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log(responseJson);
          this.getProfileBasicInfo(this.state.userId);
          // this.setState({ userInfo: this.state.userInfo.map(item => item.profilePic !== item.profilePic ? {...item, profilePic: result.uri} : item) })
        });
    }
  };

  changeBannerImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.cancelled) {
      this.setState({ dp: result.uri });

      const model = new FormData();

      model.append("userId", this.state.userId);
      model.append("image", {
        name: this.state.dp,
        type: "image/jpg",
        uri: this.state.dp,
      });

      fetch("http://demo.wiraa.com/api/Profile/ChangeBannerImage", {
        method: "POST",
        body: model,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log(responseJson);
          this.getProfileBasicInfo(this.state.userId);
        });
    }
  };

  editProfile = () => {
    this.setState({ isBasicProfile: !this.state.isBasicProfile });

    fetch("http://demo.wiraa.com/api/Profile/FillOccupations", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let occupation = [];
        responseJson.map((item) => {
          occupation.push({
            id: item.occupationID,
            name: item.occupationName,
          });
        });
        this.setState({ occupation });
      });
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

  changeCity = (cityId) => {
    // console.log('////\\\\||',cityId);
    this.setState({ isLoading: true });
    fetch("http://demo.wiraa.com/api/Profile/UpdateLocation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: this.state.loggedInUserId,
        cityId: cityId,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log('responseJsonresponseJsonresponseJson----',responseJson);
        this.setState({ isLoading: false });
        this.setState({ cityModal: false });
      });
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
          <TouchableOpacity onPress={() => this.deletePost(id)}>
            <Ionicons name="md-trash" size={24} color="#f56" />
          </TouchableOpacity>
        </Animated.Text>
      </RectButton>
    );
  };

  render() {
    // console.log("sadsdsfsdf", this.state.userInfo);
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
            alignSelf: "stretch",
            opacity:
              this.state.eduModalVisible ||
              this.state.expModalVisible ||
              this.state.isBasicProfile ||
              this.state.addExpModal ||
              this.state.cityModal
                ? 0.2
                : 1,
            backgroundColor:
              this.state.eduModalVisible ||
              this.state.expModalVisible ||
              this.state.isBasicProfile ||
              this.state.addExpModal ||
              this.state.cityModal
                ? "#000"
                : "#efefef",
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
                    textAlign: "left",
                  },
                ]}
              >
                {item.fName + " " + item.lName}
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
              size={24}
              color="#fff"
              style={{
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
              size={24}
              color="#fff"
              style={{
                zIndex: 999999,
                position: "absolute",
                top: 60,
                right: 16,
                display:
                  this.state.isShow === true && this.state.editableMode === true
                    ? "none"
                    : "flex",
              }}
              onPress={() =>
                this.setState({ isModalVisible: !this.state.isModalVisible })
              }
            />
            {this.state.editableMode ? (
              <TouchableOpacity
                style={{
                  backgroundColor: "#f56",
                  borderRadius: 30,
                  paddingHorizontal: 8,
                  padding: 6,
                  position: "absolute",
                  top: 60,
                  right: 15,
                  zIndex: 9999999,
                }}
                onPress={() => this.changeBannerImage()}
              >
                <Ionicons name="md-create" size={12} color="#fff" />
              </TouchableOpacity>
            ) : null}

            <ProfilePic pic={item.profilePic} />
            {this.state.editableMode ? (
              <TouchableOpacity
                onPress={() => this.changeDP()}
                style={{
                  backgroundColor: "#f56",
                  borderRadius: 30,
                  position: "absolute",
                  paddingHorizontal: 8,
                  padding: 6,
                  top: 120,
                  right: 150,
                  zIndex: 9999,
                }}
              >
                <Ionicons name="md-create" size={12} color="#fff" />
              </TouchableOpacity>
            ) : null}

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
                      { fontSize: 16, fontFamily: "Futura" , textAlign:'center',  width:widthPercentageToDP(60)},
                    ]}
                  >
                    {" "}
                    {item.fName + " " + item.lName}{" "}
                
                  </Text>
                  <View  >
                    {this.state.editableMode ? (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#f56",
                          borderRadius: 30,
                          paddingHorizontal: 8,
                          padding: 6,
                          position: "absolute",
                          marginLeft:widthPercentageToDP(10),
                     
                          // right: this.state.userType === "3" ? -150 : -86,
                        }}
                        onPress={() => this.editProfile()}
                      >
                        <Ionicons name="md-create" size={12} color="#fff" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

                <Text
                  allowFontScaling={false}
                  style={[styles.label, { textAlign: "center" }]}
                >
                  {" "}
                  {item.occupation}{" "}
                </Text>
                {/* change */}

                {item.about === null ? (
                  <Text></Text>
                ) : (
                  <Text
                    allowFontScaling={false}
                    numberOfLines={4}
                    style={[styles.labell, { padding: 16 }]}
                  >
                    {item.about}
                  </Text>
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  justifyContent: "center",
                  width: 300,
                }}
              >
                {/* <Ionicons name="md-ribbon" size={24} color= {item.userType === 3 ? "#faa000" : "#e80"} style={{marginTop:10}} /> */}

                <TouchableOpacity
                  style={[
                    styles.btn,
                    {
                      display:
                        this.state.loggedInUserId === this.state.userId &&
                        !item.followStatus
                          ? "flex"
                          : "none",
                    },
                  ]}
                  onPress={() =>
                    this.setState({ editableMode: !this.state.editableMode })
                  }
                >
                  <Text allowFontScaling={false} style={styles.btntxt}>
                    {this.state.editableMode ? "DONE" : "EDIT PROFILE"}
                  </Text>
                </TouchableOpacity>
                {/* <Ionicons name="md-share" size={24} color="#767676" style={{marginTop:10}} /> */}
              </View>

              <View style={{ flexDirection: "row", marginTop: 24, width: 200 }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("Follow", {
                      userProfileId: this.state.userProfileId,
                      onRefresh: this.onRefresh,
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
                    this.props.navigation.navigate("Follow", {
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

              {this.state.userType === "3" ? (
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
                  <TouchableOpacity
                    onPress={() => this.getPosts(this.state.userProfileId)}
                  >
                    <Ionicons
                      name="ios-keypad"
                      size={24}
                      color={this.state.postExpanded ? "#f56" : "#767676"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.getInfo()}>
                    <Ionicons
                      name="ios-school"
                      size={24}
                      color={this.state.infoExpanded ? "#f56" : "#767676"}
                    />
                  </TouchableOpacity>

                  {/* <TouchableOpacity onPress={() => this.getGallery()}>
                                    <Ionicons name="ios-images" size={24} color={this.state.galleryExpanded ? "#f56" : "#767676"} />
                                </TouchableOpacity> */}

                  {/* <TouchableOpacity style={{ display: this.state.userType === "3" ? "flex" : "none" }} onPress={() => this.setState({
                                    infoExpanded: false,
                                    postExpanded: false,
                                    expertizeExpanded: true,
                                    galleryExpanded: false,

                                })}>
                                    <Ionicons name="ios-rocket" size={24} color={this.state.expertizeExpanded ? "#f56" : "#767676"} />
                                </TouchableOpacity> */}
                </View>
              ) : null}

              {this.state.posts.length > 0 ? (
                <View
                  style={{
                    alignSelf: "stretch",
                    marginBottom: 16,
                    marginTop: 6,
                    display: this.state.postExpanded === true ? "flex" : "none",
                  }}
                >
                  {this.state.posts.map((item, index) => {
                    const date = item.postDate.split("T");
                    const imageURL = item.imageURL.split("~");
                    const videoURL =
                      imageURL[1] !== undefined ? imageURL[1].split(".") : "";

                    return (
                      <Swipeable
                        key={item.id + index}
                        renderRightActions={(progress, dragX) =>
                          this.renderRightActions(progress, dragX, item.postId)
                        }
                      >
                        <View
                          style={{
                            backgroundColor: "#fafafa",
                            marginHorizontal: 16,
                            borderRadius: 16,
                            marginBottom: 16,
                            elevation: 6,
                          }}
                        >
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
                              {
                                marginHorizontal: 16,
                                color: "#171919",
                                display: item.desc === "" ? "none" : "flex",
                              },
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
                               width: widthPercentageToDP(85),
               height: heightPercentageToDP(42),
                                // borderRadius: 15,
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
                                 width: widthPercentageToDP(85),
               height: heightPercentageToDP(42),
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
                      </Swipeable>
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
                    display: this.state.postExpanded === true ? "flex" : "none",
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
              )}

              {/* <View style={{flex:1}}> */}
              <View
                style={{
                  alignSelf: "stretch",
                  borderColor: "#efefef",
                  marginTop: 16,
                  borderBottomWidth: 10,
                  paddingBottom: 16,
                  display: this.state.infoExpanded === true ? "flex" : "none",
                  borderTopWidth: 10,
                  borderTopColor: "#efefef",
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
                    style={[styles.label, { marginTop: 16, marginLeft: 16 }]}
                  >
                    Experience
                  </Text>
                  <TouchableOpacity
                    style={{
                      marginBottom: 10,
                      display: !this.state.editableMode ? "none" : "flex",
                    }}
                    onPress={() => this.setState({ addExpModal: true })}
                  >
                    <Ionicons name="ios-add-circle" size={30} color="#f56" />
                  </TouchableOpacity>
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
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#f56",
                            padding: 6,
                            borderRadius: 30,
                            paddingHorizontal: 8,
                            marginTop: 4,
                            display: !this.state.editableMode ? "none" : "flex",
                          }}
                          onPress={() => {
                            this.setState({
                              expModalVisible: true,
                              expId: expItem.id,
                            });
                          }}
                        >
                          <Ionicons name="md-create" size={12} color="#fff" />
                        </TouchableOpacity>
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
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#f56",
                      padding: 6,
                      borderRadius: 30,
                      paddingHorizontal: 8,
                      display: !this.state.editableMode ? "none" : "flex",
                    }}
                    onPress={() => this.changeEducation()}
                  >
                    <Ionicons name="md-create" size={12} color="#fff" />
                  </TouchableOpacity>
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
                  justifyContent: "flex-start",
                  display:
                    this.state.galleryExpanded === true ? "flex" : "none",
                }}
              >
                {/* <Text allowFontScaling={false} style={[styles.label, {marginTop:16}]}>Gallery</Text> */}

                <View
                  style={{
                    height: 400,
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
              {this.state.userType == 3 ? (
                <View
                  style={{
                    paddingBottom: 24,
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
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("Expertise", {
                          userId: this.state.userId,
                          expt: this.state.expertize,
                          subjects: this.state.subjects,
                        })
                      }
                      style={{
                        backgroundColor: "#f56",
                        padding: 6,
                        borderRadius: 30,
                        paddingHorizontal: 8,
                        display: !this.state.editableMode ? "none" : "flex",
                      }}
                    >
                      <Ionicons name="md-create" size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      height: "auto",
                      marginTop: 10,
                      paddingBottom: 0,
                      borderColor: "#efefef",
                      marginTop: 16,
                      borderBottomWidth: 10,
                    }}
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
                          style={[
                            styles.active,
                            { alignSelf: "flex-start", marginBottom: 20 },
                          ]}
                        >
                          {expt.name}
                        </Text>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              ) : null}

              <View
                style={{
                  borderColor: "#efefef",
                  marginTop: "auto",
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
                    style={[styles.label, { marginBottom: 8, marginLeft: 16 }]}
                  >
                    Location
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#f56",
                      padding: 6,
                      borderRadius: 30,
                      paddingHorizontal: 8,
                      display: !this.state.editableMode ? "none" : "flex",
                    }}
                    onPress={() => this.setState({ cityModal: true })}
                  >
                    <Ionicons name="md-create" size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: "Futura",
                    color: "#171919",
                    fontSize: 16,
                    paddingTop: 10,
                    paddingLeft: 24,
                    display: item.city === null ? "none" : "flex",
                  }}
                >
                  {item.city}, {item.country}
                </Text>
              </View>

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

              {/* ADD EXPERIENCE */}

              <Modal
                transparent={true}
                animationType="fade"
                visible={this.state.addExpModal}
                onRequestClose={() =>
                  this.setState({ addExpModal: !this.state.addExpModal })
                }
              >
                <KeyboardAvoidingView
                  behavior="height"
                  style={styles.modalContainer}
                >
                  <View style={{backgroundColor:"#fff" , borderRadius:16  }}   >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.heading,
                      { color: "#171919", paddingTop: 8 },
                    ]}
                  >
                    Add Experience
                  </Text>

                  <View style={{ paddingVertical: 16 }}>
                    <Text
                      allowFontScaling={false}
                      style={[styles.label, { paddingLeft: 16 }]}
                    >
                      Title
                    </Text>
                    <TextInput
                      style={styles.txtipt}
                      placeholder="Enter Title"
                      onChangeText={(text) => this.setState({ expTitle: text })}
                    />
                  </View>

                  <View style={{ marginTop: 6 }}>
                    <Text
                      allowFontScaling={false}
                      style={[styles.label, { paddingLeft: 16 }]}
                    >
                      Description
                    </Text>
                    <TextInput
                      multiline={true}
                      numberOfLines={6}
                      placeholder="Enter Description"
                      style={[
                        styles.txtipt,
                        {
                          height: 150,
                          textAlignVertical: "top",
                          paddingTop: 16,
                        },
                      ]}
                      onChangeText={(text) => this.setState({ expDesc: text })}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 16,
                      marginTop: 12,
                      marginBottom:12
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.btn,
                        { backgroundColor: "#767676",  width: widthPercentageToDP(30) },
                      ]}
                      onPress={() => this.setState({ addExpModal: false })}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: "OpenSans",
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        CANCEL
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btn, { width: widthPercentageToDP(30) }]}
                      onPress={() => this.addExp()}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: "OpenSans",
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        ADD
                      </Text>
                    </TouchableOpacity>
                  </View>
                  </View>
                </KeyboardAvoidingView>
              </Modal>

              {/* EDIT EXPERIENCE */}

              <Modal
                transparent={true}
                animationType="fade"
                visible={this.state.expModalVisible}
                onRequestClose={() =>
                  this.setState({
                    expModalVisible: !this.state.expModalVisible,
                  })
                }
              >
                <KeyboardAvoidingView
                  behavior="height"
                  style={styles.modalContainer}
                >
                  {this.state.experiences.map((item) => {
                    if (item.id === this.state.expId) {
                      return (
                        <View key={item.id}>
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              right: 16,
                              top: 0,
                              zIndex: 9999,
                            }}
                            onPress={() =>
                              this.setState({ expModalVisible: false })
                            }
                          >
                            <Ionicons
                              name="md-close"
                              size={24}
                              color="#767676"
                            />
                          </TouchableOpacity>
                          <Text
                            allowFontScaling={false}
                            style={[
                              styles.heading,
                              { color: "#171919", paddingTop: 6 },
                            ]}
                          >
                            Edit Experience
                          </Text>
                          <View style={{ paddingVertical: 16 }}>
                            <Text
                              allowFontScaling={false}
                              style={[styles.label, { paddingLeft: 16 }]}
                            >
                              Title
                            </Text>
                            <TextInput
                              style={styles.txtipt}
                              defaultValue={item.expTitle}
                              onChangeText={(text) =>
                                this.setState({ expTitle: text })
                              }
                            />
                          </View>

                          <View style={{ marginTop: 6 }}>
                            <Text
                              allowFontScaling={false}
                              style={[styles.label, { paddingLeft: 16 }]}
                            >
                              Description
                            </Text>
                            <TextInput
                              style={styles.txtipt}
                              defaultValue={item.expDesc}
                              onChangeText={(text) =>
                                this.setState({ expDesc: text })
                              }
                            />
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginHorizontal: 16,
                              marginTop: 16,
                            }}
                          >
                            <TouchableOpacity
                              style={[
                                styles.btn,
                                { backgroundColor: "#767676", width: 150 },
                              ]}
                              onPress={() => this.deleteExp(item.id)}
                            >
                              <Text
                                allowFontScaling={false}
                                style={{
                                  fontFamily: "OpenSans",
                                  color: "#fff",
                                  textAlign: "center",
                                }}
                              >
                                DELETE
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.btn, { width: 150 }]}
                              onPress={() => this.addExp(item.id)}
                            >
                              <Text
                                allowFontScaling={false}
                                style={{
                                  fontFamily: "OpenSans",
                                  color: "#fff",
                                  textAlign: "center",
                                }}
                              >
                                DONE
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }
                  })}
                </KeyboardAvoidingView>
              </Modal>

              {/* EDIT EDUCATION */}

              <Modal
                transparent={true}
                animationType="fade"
                visible={this.state.eduModalVisible}
                onRequestClose={() =>
                  this.setState({
                    eduModalVisible: !this.state.eduModalVisible,
                  })
                }
              >
                <KeyboardAvoidingView
                  behavior="height"
                  style={styles.modalContainer}
                >
                  <View style={{backgroundColor:'#fff' , borderRadius:16}}   >
                  {this.state.userInfo.map((item) => (
                    <View key={item.id}   >
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.heading,
                          { color: "#171919", paddingTop: 6 },
                        ]}
                      >
                        Education
                      </Text>

                      <View style={{ marginTop: 10 }}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.label,
                            { paddingLeft: 16, paddingBottom: 6 },
                          ]}
                        >
                          Qualification
                        </Text>
                        <Picker
                          mode="dropdown"
                          itemStyle={{ paddingLeft: 16 }}
                          style={{
                            marginHorizontal: 16,
                            backgroundColor: "#efefef",
                            borderRadius: 10,
                          }}
                          selectedValue={this.state.qual}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({ qual: itemValue })
                          }
                        >
                          {this.state.qualification.map((item) => (
                            <Picker.Item
                              key={item.id}
                              label={item.name}
                              value={item.id}
                            />
                          ))}
                        </Picker>
                      </View>

                      <View style={{ marginTop: 10 }}>
                        <Text
                          allowFontScaling={false}
                          style={[styles.label, { paddingLeft: 10 }]}
                        >
                          University
                        </Text>
                        <TextInput
                          style={[styles.txtipt, { paddingLeft: 16 }]}
                          placeholder="Enter university name..."
                          defaultValue={item.uni}
                          onChangeText={(text) => this.setState({ uni: text })}
                        />
                      </View>

                      <View style={{ marginTop: 6 }}>
                        <Text
                          allowFontScaling={false}
                          style={[styles.label, { paddingLeft: 10 }]}
                        >
                          School
                        </Text>
                        <TextInput
                          style={[styles.txtipt, { paddingLeft: 16 }]}
                          placeholder="Enter school name..."
                          defaultValue={item.school}
                          onChangeText={(text) =>
                            this.setState({ school: text })
                          }
                        />
                      </View>
                    </View>
                  ))}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 16,
                      marginTop: 16,
                      marginBottom:12
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.btn,
                        { backgroundColor: "#767676", width: widthPercentageToDP(30) },
                      ]}
                      onPress={() => this.setState({ eduModalVisible: false })}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: "Futura",
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        CANCEL
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btn, { width:widthPercentageToDP(30)}]}
                      onPress={() => this.updateEducation()}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: "Futura",
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        DONE
                      </Text>
                    </TouchableOpacity>
                  </View>
                  </View>
                </KeyboardAvoidingView>
              </Modal>

              {/* EDIT PROFILE */}

              <Modal
                animationType="slide"
                visible={this.state.isBasicProfile}
                transparent={true}
                onRequestClose={() => {
                  this.setState({ isBasicProfile: !this.state.isBasicProfile });
                }}
              >
                <View style={styles.profilemodal}>
                  <View style={{backgroundColor:'#fff' , borderRadius:16 , marginVertical:20 }}   >
                  <ScrollView style={{marginBottom:12, marginTop:12}}  >  
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.heading,
                      { color: "#171919",  },
                    ]}
                  >
                    Edit Profile
                  </Text>

                  {this.state.userInfo.map((item) => (
                    <View key={item.id}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignSelf: "stretch",
                          marginTop: 16,
                          justifyContent: 'space-between',
                          marginHorizontal:5
                        }}
                      >
                        <View style={{ marginLeft: -6 }}>
                          <Text
                            allowFontScaling={false}
                            style={[styles.label, { paddingLeft: 20 }]}
                          >
                            First Name
                          </Text>
                          <TextInput
                            placeholder="Enter first name...."
                            style={[styles.txtipt, { width: widthPercentageToDP(40)}]}
                            defaultValue={item.fName}
                            onChangeText={(text) =>
                              this.setState({ fName: text })
                            }
                          />
                        </View>
                        <View style={{ marginLeft: -20 }}>
                          <Text
                            allowFontScaling={false}
                            style={[styles.label, { paddingLeft: 20 }]}
                          >
                            Last Name
                          </Text>
                          <TextInput
                            placeholder="Enter last name..."
                            style={[styles.txtipt, { width: widthPercentageToDP(40) }]}
                            defaultValue={item.lName}
                            onChangeText={(text) =>
                              this.setState({ lName: text })
                            }
                          />
                        </View>
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.label,
                            { paddingLeft: 20, marginTop: 16 },
                          ]}
                        >
                          Gender
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "stretch",
                            justifyContent:'space-around',
                            marginHorizontal:15
                          }}
                        >
                          <TouchableOpacity
                            style={[
                              styles.card,
                              {
                                backgroundColor: !this.state.selectedMale
                                  ? "#eaeaea"
                                  : "#f56",
                              },
                            ]}
                            onPress={() => this.getGender(1)}
                          >
                            <Text
                              allowFontScaling={false}
                              style={{
                                fontFamily: "OpenSans",
                                fontSize: 14,
                                color: !this.state.selectedMale
                                  ? "black"
                                  : "#fff",
                              }}
                            >
                              Male
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.card,
                              {
                                backgroundColor: !this.state.selectedFemale
                                  ? "#eaeaea"
                                  : "#f56",
                              },
                            ]}
                            onPress={() => this.getGender(2)}
                          >
                            <Text
                              allowFontScaling={false}
                              style={{
                                fontFamily: "OpenSans",
                                fontSize: 14,
                                color: !this.state.selectedFemale
                                  ? "black"
                                  : "#fff",
                              }}
                            >
                              Female
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.card,
                              {
                                backgroundColor: !this.state.selectedOthers
                                  ? "#eaeaea"
                                  : "#f56",
                              },
                            ]}
                            onPress={() => this.getGender(3)}
                          >
                            <Text
                              allowFontScaling={false}
                              style={{
                                fontFamily: "OpenSans",
                                fontSize: 14,
                                color: !this.state.selectedOthers
                                  ? "black"
                                  : "#fff",
                              }}
                            >
                              Others
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View
                        style={{
                          alignSelf: "stretch",
                          marginTop: 16,
                         
                        }}
                      >
                        <View style={{ marginLeft: 0 }}>
                          <Text
                            allowFontScaling={false}
                            style={[styles.label, {  paddingLeft: 18 }]}
                          >
                            Username
                          </Text>
                          <TextInput
                            placeholder="Username"
                            editable={false}
                            style={[styles.txtipt, ]}
                            defaultValue={item.registeredName}
                            value={item.registeredName}
                          />
                        </View>

                        <View style={{ marginLeft: 0, marginTop: 16 }}>
                          <Text
                            allowFontScaling={false}
                            style={[styles.label, {  paddingLeft: 18 }]}
                          >
                            Occupation
                          </Text>
                          <View
                            style={{
                              backgroundColor: "#efefef",
                           marginHorizontal:16,
                              marginTop: 6,
                              // width:widthPercentageToDP(100),
                              borderRadius: 6,
                            }}
                          >
                            <Picker
                              mode="dropdown"
                              itemStyle={{  paddingLeft: 18 }}
                              style={{
                                marginHorizontal: 10,
                                backgroundColor: "#efefef",
                              }}
                              // selectedValue={
                              //   item.occupation
                              //     ? item.occupation
                              //     : this.state.occupationName
                              // }
                              selectedValue={this.state.occupationName}
                              onValueChange={(itemValue, itemIndex) =>
                                this.setState({ occupationName: itemValue })
                              }
                            >
                              {this.state.occupation.map((item) => (
                                <Picker.Item
                                  key={item.id}
                                  label={item.name}
                                  value={item.id}
                                />
                              ))}
                            </Picker>
                          </View>
                        </View>
                      </View>

                      <View style={styles.mt}>
                        <Text
                          allowFontScaling={false}
                          style={[styles.label, { paddingLeft: 18 }]}
                        >
                          Bio
                        </Text>
                        <TextInput
                          multiline={true}
                          numberOfLines={6}
                          placeholder="Tell us about yourself"
                          defaultValue={item.about}
                          style={[
                            styles.txtipt,
                            {
                              height: 150,
                              textAlignVertical: "top",
                              paddingTop: 16,
                            },
                          ]}
                          onChangeText={(text) => this.setState({ bio: text })}
                        />
                      </View>
                    </View>
                  ))}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 16,
                      marginTop: 16,
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.btn,
                        { backgroundColor: "#767676", width:widthPercentageToDP(40) },
                      ]}
                      onPress={() => this.setState({ isBasicProfile: false })}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: "Futura",
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        CANCEL
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btn, { width: widthPercentageToDP(40) }]}
                      onPress={() => this.updateProfile(item)}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: "Futura",
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        DONE
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
                </View>
                </View>
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.cityModal}
                onRequestClose={() => {
                  this.setState({ cityModal: !this.state.cityModal });
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#fff",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      backgroundColor: "#fff",
                      elevation: 3,
                    }}
                  >
                    <TouchableOpacity
                      style={{ marginLeft: "3%", marginTop: "3%" }}
                      onPress={() => this.setState({ cityModal: false })}
                    >
                      <Feather
                        name="chevron-left"
                        size={24}
                        color="#767676"
                        style={{ zIndex: 999999 }}
                      />
                    </TouchableOpacity>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.name,
                        {
                          paddingBottom: 16,
                          fontSize: 18,
                          fontWeight: "bold",
                          marginRight: "auto",
                          marginLeft: "auto",
                        },
                      ]}
                    >
                      Search By City
                    </Text>
                  </View>

                  <View>
                    <TextInput
                      allowFontScaling={false}
                      placeholder="Search City..."
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
                        onPress={() => this.changeCity(item.cityId)}
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
    justifyContent: 'center',
    
    // backgroundColor: "#fff",
    marginHorizontal: 16,
    // marginVertical: 200,
   
    
  },
  profilemodal: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: 'center',
    
    marginHorizontal: 10,
    // marginVertical: heightPercentageToDP(8),
   
    
  },
  name: {
    fontFamily: "Futura",
    color: "#171919",
    padding: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  txtipt: {
    borderRadius: 6,
    paddingHorizontal: 10,
    marginVertical: 6,
    fontFamily: "OpenSans",
    marginHorizontal: 16,
    backgroundColor: "#efefef",
    height: 50,
    fontSize: 14,
  },
  btn: {
    backgroundColor: "#f56",
    borderRadius: 10,
    padding: 16,
    paddingVertical: 14,
    width: 200,
    elevation: 4,
    marginBottom:4
  },
  btntxt: {
    textAlign: "center",
    fontSize: 14,
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
  card: {
    margin: 6,
    padding: widthPercentageToDP(5),
    paddingVertical: 14,
    paddingHorizontal:30,
    borderRadius: 8,
    backgroundColor: "#eaeaea",
  
   
  },
  actionText: {
    fontFamily: "Futura",
    color: "#f56",
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 20,
  },
});
