import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';
export default function PostComponent(props) {
  const [userProfileId, setUserProfileId] = useState(props.userProfileId);
  const [count, setCount] = useState(props.count);
  const [paused, setPaused] = useState(false);

 console.log('post componet props--->>>>>>>///>>>>>>>>',props.item)

  return (
    <View
      key={props.index}
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
              props.item.profilePic === null
                ? "http://demo.wiraa.com/Images/Profile.png"
                : "http://demo.wiraa.com/" + props.item.profilePic,
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
              props.item.fkUserProfileID !== props.userProfileId
                ? props.navigation.navigate("UserProfile", {
                    fkUserProfileId: props.item.fkUserProfileID,
                  })
                : props.navigation.navigate("Profile")
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
              {props.item.userName}
            </Text>
            <Text allowFontScaling={false} style={styles.label}>
              {props.item.occupation}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <View> */}
      <View style={{ display: props.item.imageURL !== "" ? "flex" : "none" }}>
        <Image
          style={{
            alignSelf: "center",
            width: widthPercentageToDP(85),
            height: heightPercentageToDP(45),
            marginTop: 10,
            marginHorizontal:widthPercentageToDP(10),
            display:
              props.videoURL[1] !== undefined && props.videoURL[1] === "mp4"
                ? "none"
                : "flex",
          }}
          source={{
            uri:
              props.imageURL[0] !== undefined
                ? "http://demo.wiraa.com" + props.imageURL[0]
                : "",
          }}
        />

        <Video
          source={{
            uri:
              props.videoURL[0] !== undefined && props.videoURL[1] === "mp4"
                ? "http://demo.wiraa.com" +
                  props.videoURL[0] +
                  "." +
                  props.videoURL[1]
                : "",
          }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          useNativeControls
          isLooping
          usePoster
          posterSource={require("../assets/imgs/playbutton.png")}
          posterStyle={{
            height: 70,
            width: 70,
            borderRadius: 20,
            position: "absolute",
            top: "40%",
            left: "40%",
            alignSelf: "center",
          }}
          onPlaybackStatusUpdate={() => setPaused(true)}
          style={{
            alignSelf: "center",
                     width: widthPercentageToDP(85),
               height: heightPercentageToDP(45),
            zIndex: 9999999,
            marginTop: 10,
            display:
              props.videoURL[1] !== undefined && props.videoURL[1] === "mp4"
                ? "flex"
                : "none",
          }}
        />
      </View>
       { props.item.desc ? <View style={{marginTop:"2%"}}></View> : <View></View> } 
      <Text
        allowFontScaling={false}
        numberOfLines={2}
        style={[
          styles.label,
          { marginHorizontal: 16, color: "#171919", paddingVertical: "0.2%" },
        ]}
      >
        {props.item.desc}
      </Text>

      <View style={{ flexDirection: "row", marginLeft: 12, marginBottom: 10 }}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => props.addLike(props.item.postID)}
        >
          <Ionicons
            name="md-heart"
            size={24}
            color={props.item.isPostLiked ? "#f56" : "#767676"}
            style={{ paddingLeft: 16, paddingRight: 6 }}
          />
          <Text
            allowFontScaling={false}
            style={[styles.labell, { paddingTop: 3, paddingRight: 16 }]}
          >
            {props.item.likesCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() =>
            props.navigation.navigate("Comment", {
              id: props.item.postID,
              userProfileId: props.userProfileId,
              postData: props.item,
              imageurl:props.imageURL[0]
            })
          }
        >
          <Ionicons name="chatbox-ellipses" size={22} color="#767676" />
          <Text
            allowFontScaling={false}
            style={[
              styles.labell,
              { paddingLeft: 6, paddingTop: 3, paddingRight: 16 },
            ]}
          >
            {props.item.commentsCount}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
