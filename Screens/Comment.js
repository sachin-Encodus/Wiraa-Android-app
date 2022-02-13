import React, { Component } from "react";
import {
  View,
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ToastAndroid,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

export default class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      comment: "",
      postId: this.props.route.params.id,
      userProfileId: this.props.route.params.userProfileId,
      count: 0,
      posts: [],
      comments: [],
    };
  }

  componentDidMount() {
    this.getPosts(this.state.userProfileId, this.state.count);
  }

  getPosts = (userProfileId, count) => {
    // console.log(userProfileId, "==============", count);
    this.setState({ isLoading: true });

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
        let posts = [...this.state.posts];
        let comments = [];
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
          });

          item.postComments.map((comment) => {
            comments.push({
              id: comment.$id,
              postId: item.postID,
              userName: comment.commentedByName,
              profilePic: comment.profilePic,
              commentDesc: comment.comment,
              commentDate: comment.commentDate.split("T"),
            });
          });
        });
        this.setState({ posts, comments, isLoading: false });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isLoading: false });
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
        // console.log("aaaaaaaaaaaa--", responseJson);
        this.setState({ comment: "", isLoading: false });
        this.getPosts(this.state.userProfileId, this.state.count);
      })

      .catch((err) => {
        console.log("errr", err);
        ToastAndroid.showWithGravity(
          err,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { postData , imageurl } = this.props.route.params;
    console.log("=======>>>>",imageurl);
    // console.log("navigation-+++-->>", this.props.route.params.postData);
    if (this.state.isLoading === true) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#f56" />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              marginVertical: "3%",
            }}
          >
            <Feather
              name="chevron-left"
              size={30}
              color="#767676"
              style={{ zIndex: 999999, paddingTop: "10%", marginLeft: "3%" }}
              onPress={() => this.props.navigation.goBack()}
            />
            <Text allowFontScaling={false} style={styles.heading}>
              Comment
            </Text>
          </View>
          <ScrollView>
            <View>
              <Image
                style={{
                  elevation: 6,
                    width: widthPercentageToDP(90),
               height: heightPercentageToDP(45),
                  marginLeft: "auto",
                  marginRight: "auto",
              
                }}
                source={{
                  uri:imageurl
                    ? "http://demo.wiraa.com/" + imageurl
                    : "http://demo.wiraa.com/Images/Profile.png",
                }}
              />
            </View>

            {/* {
                                this.state.posts ? 
                                this.state.posts.map((item,index)=>(
                                        // console.log('item2222',item)
                                    <Text allowFontScaling={false} style={[styles.label,{marginHorizontal:16,marginVertical:15, color:"#171919", paddingVertical:16}]}>{item.desc || ""}</Text>
                                )
                                
                                )
                                :
                                <Text>sdkhsjgdj</Text>
                            } */}
            <Text
              allowFontScaling={false}
              style={[
                styles.label,
                {
                  marginHorizontal: 16,
                  marginVertical: 15,
                  color: "#171919",
                  paddingVertical: 16,
                },
              ]}
            >
              {postData.desc}
            </Text>

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
                style={[styles.commentBox, { flex: 1, marginHorizontal: 16 }]}
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
            {this.state.comments.length > 0 ? (
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
                            style={{ width: 35, height: 35, borderRadius: 30 }}
                            source={{
                              uri:
                                item.ProfilePic === null ||
                                item.ProfilePic === undefined
                                  ? "http://demo.wiraa.com/Images/Profile.png"
                                  : "http://demo.wiraa.com" + item.profilePic,
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
                              {cmtDate[2] + "/" + cmtDate[1] + "/" + cmtDate[0]}
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
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.label}>No Comments Available</Text>
              </View>
            )}
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
    justifyContent: "center",
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
  heading: {
    fontFamily: "Futura",
    fontSize: 22,
    marginTop: "10%",
    color: "#171919",
    width: "80%",
    textAlign: "center",
  },
  comment: {
    flexDirection: "row",
    margin: 10,
    marginLeft: 0,
  },
});
