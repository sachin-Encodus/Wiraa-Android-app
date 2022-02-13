import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

export default class PostArticle extends React.Component {
  state = {
    text: "",
    image: null,
    userProfileId: "",
    checkModal: this.props.checkModal,
    isLoading: false,
  };

  componentDidMount = async () => {
    this.getAsyncPermissions();

    const userProfileId = await AsyncStorage.getItem("userPrfileId");
    if (userProfileId !== null) {
      this.setState({ userProfileId });
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
      aspect: [3, 2],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  postArticle = () => {
    // this.props.navigation.push("Dashboard");
    this.setState({ isLoading: true });
    if (this.state.userProfileId !== null) {
      const model = new FormData();

      model.append("description", this.state.text);
      model.append("fkUserProfileID", this.state.userProfileId);

      if (this.props.image !== null) {
        model.append("images", {
          name: this.props.image,
          type: "image/jpg",
          uri: this.props.image,
        });
      }

      fetch("http://demo.wiraa.com/api/Post/AddPost", {
        method: "POST",
        body: model,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("Uploaded Successfully " + responseJson);
          this.setState({ isLoading: false });
          this.setState({ checkModal: false });
          this.props.navigation.replace("Dashboard");
        })
        .catch((err) => {
          console.log("Error Uploading " + err);
          this.setState({ isLoading: false });
        });
    }
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
    //   if (this.state.checkModal === true) {
        return (
          <View style={styles.container}>
            {/* <View style={[styles.headerr]}>
                    <Ionicons name="md-close" size={24} color="#767676" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} onPress={() => this.props.navigation.goBack()} />
                    <Text allowFontScaling={false} style={[styles.heading]}>New article</Text>
                    <Ionicons name="send" size={24} color="#f56" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} onPress={() => this.props.navigation.goBack()} />
                    <TouchableOpacity onPress={() => this.uploadImage()}>
                        <Ionicons name="md-camera" size={24} color="#171919" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} />
                    </TouchableOpacity>
                </View> */}
<ScrollView>
            <View style={{ flex: 1, alignSelf: "stretch" , }}>
              <TouchableOpacity
                style={{alignItems:'center',  marginTop: 0 }}
                onPress={() => Keyboard.dismiss()}
              >
                {this.props.image && (
                  <Image
                    source={{ uri: this.props.image }}
                    style={{
                      width: widthPercentageToDP(85),
                      height: heightPercentageToDP(42),
                   
                      borderRadius: 10,
                    }}
                  />
                )}
              </TouchableOpacity>
              <View style={{ flexDirection: "row", marginTop: 32 }}>
                <Image
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 60,
                    marginTop: 0,
                    marginLeft: 16,
                  }}
                  source={require("../assets/imgs/bg-img1.jpg")}
                />
                <TextInput
                  placeholder="Share your thoughts..."
                  onChangeText={(text) => this.setState({ text })}
                  defaultValue={this.state.text}
                  style={[styles.txtipt]}
                  multiline={true}
                />
              </View>

            </View>
            </ScrollView>
                          <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <TouchableOpacity
                  style={[styles.btn]}
                  onPress={() => this.postArticle()}
                >
                  <Text allowFontScaling={false} style={styles.btntxt}>
                    SHARE
                  </Text>
                </TouchableOpacity>
              </View>
          </View>
        );
    //   } else {
    //     return this.props.navigation.navigate("Dashboard");
    //   }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    backgroundColor: "#fff",
  
  },
  modalContainer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    marginHorizontal: 16,
   
    borderRadius: 16,
  },
  headerr: {
    flexDirection: "row",
    paddingTop: 10,
    alignSelf: "stretch",
    justifyContent: "space-between",
    paddingBottom: 6,
    paddingHorizontal: 16,
    paddingBottom: 0,
    // borderBottomWidth:1,
    // borderBottomColor:"#efefef"
    backgroundColor: "#f56",
  },
  heading: {
    fontFamily: "Futura",
    fontSize: 22,
    marginTop: 6,
    textAlign: "center",
    color: "#171919",
    paddingBottom: 10,
    paddingLeft: 32,
  },
  label: {
    fontFamily: "OpenSans",
    color: "#767676",
    fontSize: 16,
    lineHeight: 30,
    paddingTop: 6,
  },
  card: {
    borderWidth: 1,
    margin: 10,
    padding: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  txtipt: {
      backgroundColor:"#f2f2f2",
    borderRadius: 6,
    paddingHorizontal: 6,
    marginVertical: 0,
    width: widthPercentageToDP(70),
    height: 150,
    fontFamily: "OpenSans",
    marginHorizontal: 10,
    paddingTop: 0,
    paddingLeft: 10,
    textAlignVertical: "top",
    marginTop: 10,
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
    marginBottom: 16,
  },
  btntxt: {
    textAlign: "center",
    fontSize: 14,
    color: "#fff",
    fontFamily: "Futura",
    paddingTop: 6,
  },
  mt: {
    marginTop: 16,
  },
  xprtcard: {
    fontSize: 16,
    color: "#767676",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  subject: {
    borderWidth: 1,
    margin: 10,
    padding: 24,
    paddingHorizontal: 25,
    borderRadius: 6,
  },
});







//  <ScrollView
//               contentContainerStyle={{
//                 flex: 1,
//                 elevation: 6,
//                 paddingBottom: 16,
//                 backgroundColor: "#fff",
//                 borderTopLeftRadius: 10,
//                 borderTopRightRadius: 10,
//               }}
//             >
//               <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
//                 <TouchableOpacity
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                     paddingRight: 16,
//                     paddingTop: 16,
//                   }}
//                   onPress={() => this.setState({ openArticleModal: false })}
//                 >
//                      <Ionicons name="md-close" size={24} color="#171919" />
//                   <Text style={[styles.heading, { paddingLeft: 16 }]}>
//                     Post Article
//                   </Text>
//                  <Ionicons name="md-info" size={24} color="transparent" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} onPress={() => this.props.navigation.goBack()} />
//                 </TouchableOpacity>
//                 <PostArticle
//                   navigation={navigation}
//                   image={this.state.image}
//                   checkModal={this.state.openArticleModal}
//                 />
//               </KeyboardAvoidingView>
//             </ScrollView>