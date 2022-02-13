import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { Feather, Ionicons, AntDesign,MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-community/picker";
import { widthPercentageToDP } from "react-native-responsive-screen";

export default class OrderDetails extends React.Component {
  state = {
    isModalVisible: false,
    details: [],
    month: "",
    year: "",
    day: "",
    contacted: [],
    userId: "",
    closeModal: false,
    userProfileId: "",
  };

  componentDidMount() {
    const { id, response, date } = this.props.route.params;
    console.log('date of params--',date)
    fetch("http://demo.wiraa.com/Api/Project/GetOrderDetail?PId=" + id, {
      method: "GET",
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        console.log(
          "response orderdetails----->>",
          responseJson.serviceStartDate
        );
        let details = [...this.state.details];
        details.push({
          status: responseJson.postStatus,
          startDate:
            responseJson.serviceStartDate === "null/null/null"
              ? date[0].split(" ")
              : responseJson.serviceStartDate.split(" "),
          dueDate: responseJson.postExpireDate.split("T"),
          orderNum: responseJson.postreqID,
          desc: responseJson.pR_Description,
          mode: responseJson.serviceMode,
          loc: responseJson.city,
          preferred: responseJson.preferService,
          budget: responseJson.budget,
          workType: responseJson.workType,
          res: response,
          id: id,
        });

        this.setState({
          details,
        });
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        console.error(error);
      });

    this.state.details.map((item) => {
      const dueDate = item.dueDate[0].split("-");
      this.setState({
        day: dueDate[2],
        month: dueDate[1],
        year: dueDate[0],
      });
    });

    this.getUserId();
    this.getContacted();
  }

  getUserId = async () => {
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
  };

  closeOrder = () => {
    const { id } = this.props.route.params;

    fetch(
      "http://demo.wiraa.com/api/post/CloseOrder?userId=" +
        this.state.userProfileId +
        "&projectId=" +
        id,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          details: this.state.details.map((item) =>
            item.id === id ? { ...item, status: "Closed" } : item
          ),
          closeModal: false,
        });
      });
  };

  converse = (senderUserId, status, name, profilePic) => {
    console.log("ccccccccccc", senderUserId, status, name, profilePic);
    const { id } = this.props.route.params;

    this.props.navigation.navigate("Conversation", {
      id: id,
      senderUserId: senderUserId,
      screenName: "Orders",
      status,
      userName: name,
      profilePic,
    });
    this.setState({ isModalVisible: false });
  };

  getContacted = () => {
    const { id } = this.props.route.params;

    // this.setState({isModalVisible: true})

    fetch("http://demo.wiraa.com/api/Users/GetPostApplyUser?projectId=" + id)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("----", responseJson);
        let contacted = [];
        responseJson.map((item) => {
          contacted.push({
            id: item.$id,
            userName: item.fullName,
            profilePic: item.profilePic,
            status: item.applyStatus,
            date: item.praDate,
            senderUserId: item.userid,
          });

          this.setState({ contacted });
        });
      });
  };

  renderContacts = (item, index) => {
    const ctDate = item.date.split("T");

    return (
      // <Text>bdjgzjdgjszgdj</Text>
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          this.converse(
            item.senderUserId,
            item.status,
            item.userName,
            item.profilePic
          )
        }
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              margin: 16,
              marginBottom: 16,
              marginRight: 10,
              marginLeft: 10,
            }}
            source={{
              uri:
                item.profilePic === null
                  ? "http://demo.wiraa.com/Images/Profile.png"
                  : "http://demo.wiraa.com/" + item.profilePic,
            }}
          />
          <View>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: "Futura",
                color: "#171919",
                fontSize: 16,
                paddingTop: 20,
              }}
            >
              {item.userName}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "stretch",
                justifyContent: "flex-start",
                paddingTop: 3,
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Ionicons name="md-repeat" size={18} color="#767676" />
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.label,
                    { fontSize: 12, paddingLeft: 6, color: "#171919" },
                  ]}
                >
                  {ctDate[0]}
                </Text>
              </View>
              <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
                <Ionicons
                  name="md-disc"
                  size={18}
                  color={item.status === "Running" ? "#f56" : "#aaaaaa"}
                />
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.label,
                    {
                      fontSize: 12,
                      paddingLeft: 6,
                      color: item.status === "Running" ? "#f56" : "#aaaaaa",
                    },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    console.log("okokok", this.state.contacted);
    return (
      <View style={styles.container}>
        <View style={styles.headerr}>
          <Feather
            name="chevron-left"
            size={24}
            color="#767676"
            style={{ zIndex: 999999, paddingTop: 6 }}
            onPress={() => this.props.navigation.goBack()}
          />
          <Text allowFontScaling={false} style={[styles.heading, {}]}>
            Order Details
          </Text>
          <Feather
            name="info"
            size={24}
            color="#767676"
            style={{ zIndex: 999999, padding: 6 }}
            onPress={() => this.props.navigation.goBack()}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: this.state.closeModal ? "#000" : "#fff",
            opacity: this.state.closeModal ? 0.2 : 1,
          }}
        >
          <View
            style={{
              borderBottomWidth: 3,
              borderBottomColor: "#efefef",
              paddingBottom: 16,
            }}
          >
            {this.state.details.map((item) => (
              <View
                style={[
                  styles.topcard,
                  {
                    backgroundColor: "#efefef",
                    margin: 16,
                    padding: 10,
                    paddingHorizontal: 0,
                    borderRadius: 10,
                  },
                ]}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 10,
                      paddingHorizontal: 0,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginLeft: 10,
                      }}
                    >
                      <Ionicons name="md-disc" size={20} color="#767676" />
                      <Text
                        allowFontScaling={false}
                        style={[styles.label, { paddingLeft: 6 }]}
                      >
                        Status:
                      </Text>
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.name,
                        {
                          fontSize: 16,
                          paddingTop: 0,
                          color:
                            item.status === "Closed"
                              ? "#aaaaaa"
                              : item.status === "Running"
                              ? "#f56"
                              : "#449d44",
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 10,
                      paddingHorizontal: 0,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginLeft: 10,
                      }}
                    >
                      <Ionicons name="md-calendar" size={20} color="#767676" />
                      <Text
                        allowFontScaling={false}
                        style={[styles.label, { paddingLeft: 6 }]}
                      >
                        Order Date:
                      </Text>
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.name,
                        { fontSize: 14, paddingTop: 0, fontFamily: "OpenSans" },
                      ]}
                    >
                      {item.startDate[0]}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 10,
                      paddingHorizontal: 0,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginLeft: 10,
                      }}
                    >
                      <Ionicons name="md-calendar" size={20} color="#767676" />
                      <Text
                        allowFontScaling={false}
                        style={[styles.label, { paddingLeft: 6 }]}
                      >
                        Due On:
                      </Text>
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.name,
                        { fontSize: 14, paddingTop: 0, fontFamily: "OpenSans" },
                      ]}
                    >
                      {item.dueDate[0]}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 10,
                      paddingHorizontal: 0,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginLeft: 10,
                      }}
                    >
                      {/* <Ionicons name="md-contacts" size={20} color="#767676" /> */}
                      <AntDesign name="contacts" size={20} color="#767676" />
                      <Text
                        allowFontScaling={false}
                        style={[styles.label, { paddingLeft: 6 }]}
                      >
                        Response:
                      </Text>
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.name,
                        { fontSize: 14, paddingTop: 0, fontFamily: "OpenSans" },
                      ]}
                    >
                      {item.res}/7
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 10,
                      paddingHorizontal: 0,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginLeft: 10,
                      }}
                    >
                      {/* <Ionicons name="md-filing" size={20} color="#767676" /> */}
                      <MaterialIcons name="confirmation-number" size={20} color="#767676"/>
                      <Text
                        allowFontScaling={false}
                        style={[styles.label, { paddingLeft: 6 }]}
                      >
                        Order Number:
                      </Text>
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.name,
                        { fontSize: 14, paddingTop: 0, fontFamily: "OpenSans" },
                      ]}
                    >
                      #OrNo{item.id}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => this.setState({ closeModal: true })}
                  style={[
                    styles.btn,
                    {
                      borderRadius: 10,
                      alignSelf: "center",
                      marginVertical: 16,
                      backgroundColor: "#d9534f",
                      display:
                        item.status === "Running" || item.status === "Active"
                          ? "flex"
                          : "none",
                    },
                  ]}
                >
                  <Text allowFontScaling={false} style={styles.btntxt}>
                    {" "}
                    CLOSE{" "}
                  </Text>
                </TouchableOpacity>

                <View
                  style={[
                    styles.btn,
                    {
                      borderRadius: 10,
                      alignSelf: "center",
                      marginVertical: 16,
                      backgroundColor: "#aaaaaa",
                      display: item.status === "Closed" ? "flex" : "none",
                    },
                  ]}
                >
                  <Text allowFontScaling={false} style={styles.btntxt}>
                    {" "}
                    CLOSED{" "}
                  </Text>
                </View>

                {/* <TouchableOpacity onPress={()=>this.getContacted()} style={{borderRadius:10,width:"82%",marginTop:"3%",alignSelf:"center",backgroundColor:"#f56",elevation:7}} >
                                <Text style={{textAlign:"center",fontWeight:"bold",padding:12,color:"#fff"}}>CONTACTED</Text>
                    </TouchableOpacity> */}
              </View>
            ))}
          </View>
          <View
            style={{ backgroundColor: "#fff", elevation: 5, width: "100%" }}
          >
            <Text
              style={{
                textAlign: "center",
                 fontSize:widthPercentageToDP(5),
                fontWeight: "bold",
                padding: 10,
              }}
            >
              CONTACTED
            </Text>
          </View>
          {this.state.contacted.length ? (
            <View>
              <FlatList
                data={this.state.contacted}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) =>
                  this.renderContacts(item, index)
                }
              />
            </View>
          ) : (
            <View
              style={{
                alignSelf: "center",
                backgroundColor: "#fff",
                width: "100%",
                padding: 10,
              }}
            >
              <Text
                allowFontScaling={false}
                style={[styles.heading, { color: "#f56" }]}
              >
                No responses, yet!
              </Text>
            </View>
          )}

          {/* <View
            style={{
              alignSelf: "stretch",
              backgroundColor: "#efefef",
              marginTop: 10,
              borderRadius: 6,
            }}
          >
            <Picker
              mode="dropdown"
              selectedValue={this.state.contacted}
              style={{ height: 60,elevation:7,borderWidth:1,borderColor:"red"}}
              onValueChange={(itemValue, itemIndex) => {
                this.converse();
              }}
            >
              <Picker.Item label="CONTACTED" />

              {
                this.state.contacted.length > 0 ? (
                  this.state.contacted.map((item) => {
                    
                    return (
                      <Picker.Item
                        key={item.id}
                        label={item.userName}
                        value={item.userName}

                      />

                    );
                  })
                ) : (
                  // <View style={{height:700}}>
                  //     <FlatList
                  //         data={this.state.contacted}
                  //         keyExtractor={(item, index) => item.id}
                  //         renderItem={({item, index}) => this.renderContacts(item, index)}
                  //     />
                  // </View>
                  <Picker.Item
                    key={""}
                    label={"No responses, yet!"}
                    value={""}
                  />
                )
                // <View style={{position:"absolute", top:300, alignSelf:"center"}} >
                //     <Text allowFontScaling={false} style={[styles.heading, {color:"#f56"}]}>No responses, yet!</Text>
                // </View>
              }
            </Picker>
          </View> */}
          <Text
            allowFontScaling={false}
            style={[
              styles.name,
              {
                alignSelf: "flex-start",
                marginLeft: 16,
                paddingHorizontal: 0,
                fontSize: 20,
              },
            ]}
          >
            Requirements
          </Text>

          {this.state.details.map((item) => (
            <View
              style={[
                styles.topcard,
                { marginHorizontal: 0, paddingHorizontal: 0, margin: 16 },
              ]}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#efefef",
                  paddingBottom: 10,
                }}
              >
                <Text allowFontScaling={false} style={styles.name}>
                  Description
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[styles.label, { paddingLeft: 24, marginRight: 10 }]}
                >
                  {item.desc}
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#efefef",
                  paddingBottom: 10,
                }}
              >
                <Text allowFontScaling={false} style={styles.name}>
                  Selected Category
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[styles.label, { paddingLeft: 24, marginRight: 10 }]}
                >
                  Legal - Business Consultant
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#efefef",
                  paddingBottom: 10,
                }}
              >
                <Text allowFontScaling={false} style={styles.name}>
                  Mode of Service
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[styles.label, { paddingLeft: 24, marginRight: 10 }]}
                >
                  {item.mode}
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#efefef",
                  paddingBottom: 10,
                  display: item.loc !== "" ? "flex" : "none",
                }}
              >
                <Text allowFontScaling={false} style={styles.name}>
                  Preferred Location
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[styles.label, { paddingLeft: 24, marginRight: 10 }]}
                >
                  {item.loc}
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#efefef",
                  paddingBottom: 10,
                }}
              >
                <Text allowFontScaling={false} style={styles.name}>
                  Preferred Starting Date
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[styles.label, { paddingLeft: 24, marginRight: 10 }]}
                >
                  {item.startDate[0]}
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#efefef",
                  paddingBottom: 10,
                }}
              >
                <Text allowFontScaling={false} style={styles.name}>
                  Preferred Budget
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[styles.label, { paddingLeft: 24, marginRight: 10 }]}
                >
                  {item.budget}/{item.workType}
                </Text>
              </View>
            </View>
          ))}

          <View style={[styles.topcard]}>
            <Text allowFontScaling={false} style={styles.label}>
              Have any issues with your Order? Visit the{" "}
              <Text allowFontScaling={false} style={{ color: "#f56" }}>
                Resolution Center
              </Text>
              .
            </Text>
          </View>
        </ScrollView>

        {/* <TouchableOpacity style={styles.fltbtn} onPress={() => this.getContacted()}>
                    <Feather name="message-circle" size={24} color="#fff" />
                </TouchableOpacity> */}

        {/* CONTACTED */}

        {/* <Modal
          animationType="fade"
          visible={this.state.isModalVisible}
          onRequestClose={() => {
            this.setState({
              isModalVisible: !this.state.isModalVisible,
            });
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#fff",
                paddingVertical: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => this.setState({ isModalVisible: false })}
              >
                <Feather
                  name="chevron-left"
                  size={24}
                  color="#767676"
                  style={{ padding: 16, paddingVertical: 10 }}
                />
              </TouchableOpacity>

              <Text
                allowFontScaling={false}
                style={[styles.heading, { color: "black" }]}
              >
                Contacted
              </Text>

              <TouchableOpacity
                onPress={() => this.setState({ isModalVisible: false })}
              >
                <Feather
                  name="chevron-right"
                  size={24}
                  color="#fff"
                  style={{ padding: 16, paddingVertical: 10 }}
                />
              </TouchableOpacity>
            </View>

            {this.state.contacted.length > 0 ? (
              <View style={{ height: 700 }}>
                <FlatList
                  data={this.state.contacted}
                  keyExtractor={(item, index) => item.id}
                  renderItem={({ item, index }) =>
                    this.renderContacts(item, index)
                  }
                />
              </View>
            ) : (
              <View
                style={{ position: "absolute", top: 300, alignSelf: "center" }}
              >
                <Text
                  allowFontScaling={false}
                  style={[styles.heading, { color: "#f56" }]}
                >
                  No responses, yet!
                </Text>
              </View>
            )}
          </View>
        </Modal> */}

        <Modal
          transparent={true}
          animationType="fade"
          visible={this.state.closeModal}
          onRequestClose={() =>
            this.setState({ closeModal: !this.state.closeModal })
          }
        >
          <View style={[styles.modalContainer]}>
            <Text
              allowFontScaling={false}
              style={[
                styles.heading,
                { color: "#171919", paddingTop: 6, fontSize: 18 },
              ]}
            >
              {this.state.status}Close Order
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.label,
                {
                  paddingTop: 6,
                  paddingBottom: 10,
                  textAlign: "center",
                  paddingLeft: 0,
                },
              ]}
            >
              You are about to close this order, you cannot undo this action.
            </Text>

            <Text
              allowFontScaling={false}
              style={[
                styles.name,
                { paddingVertical: 10, textAlign: "center", paddingLeft: 0 },
              ]}
            >
              Are you sure you want to continue?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 32,
                paddingTop: 28,
              }}
            >
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#f56", width: 100 }]}
                onPress={() => this.closeOrder()}
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
                style={[styles.btn, { backgroundColor: "#767676", width: 100 }]}
                onPress={() => this.setState({ closeModal: false })}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 270,
    paddingTop: 16,
    borderRadius: 16,
    elevation: 6,
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
  topcard: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 0,
    margin: 0,
    alignSelf: "stretch",
    marginVertical: 6,
  },
  card: {
    padding: 6,
    marginHorizontal: 14,
    marginTop: 6,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 7,
    marginVertical: "1.5%",
  },
  name: {
    fontFamily: "Futura",
    color: "#171919",
    padding: 16,
    paddingBottom: 0,
    fontSize: 16,
  },
  label: {
    fontFamily: "OpenSans",
    color: "#767676",
    fontSize: 14,
    paddingLeft: 16,
  },
  fltbtn: {
    backgroundColor: "#f56",
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    alignSelf: "center",
    position: "absolute",
    bottom: 16,
    right: 16,
    elevation: 6,
  },
  btn: {
    // backgroundColor:"#d9534f",
    borderRadius: 10,
    padding: 16,
    paddingVertical: 14,
    width: 300,
    elevation: 6,
  },
  btntxt: {
    textAlign: "center",
    fontSize: 14,
    color: "#fff",
    fontFamily: "Futura",
  },
});
