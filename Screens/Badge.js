import React, { Component } from 'react';
import { View, Text , Image,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
class Badge extends Component {
  state = {
    notifications: [],
    profilePic: null,
    userProfileId: "",
    indicator:false
  };

  componentDidMount() {
    this.getNotifications();
  }

  getNotifications = async () => {
     console.log("hello world");
    const userProfileId = await AsyncStorage.getItem("userPrfileId");
    if (userProfileId !== null) {
      this.setState({ userProfileId });
    }

    const profilePic = await AsyncStorage.getItem("profilePic");
    if (profilePic !== null) {
      this.setState({ profilePic });
    }

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
         item.isSeen === true ? console.log("no message ") : this.setState({indicator:true})
        });
      })
      .catch((error) => {
        //Error
        console.error(error);
      });
  };

  
  render() {
       
    return (
      <View>
          <View>
              {
               this.state.indicator === true ?
                <View style={{width:5, height:5, borderRadius:50, marginLeft:10, backgroundColor:'red'}}></View> :
                <View></View>
              }
            </View>
             <Ionicons name="notifications" size={this.props.size} color={this.props.color} />
      </View>
    );
  }
}

export default Badge;