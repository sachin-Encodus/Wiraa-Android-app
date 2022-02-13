import React, { Component } from 'react'
import { Text, View,StyleSheet,TouchableOpacity } from 'react-native'
import {

    Feather,
    Ionicons,
    
  } from "@expo/vector-icons";

export default class CommonHeader extends Component {
    constructor(props){
      super(props);

    }
    render() {
        return (
            <View style={styles.container}>
            <Feather name="chevron-left" size={24} color="#767676" style={{zIndex: 999999}} onPress={() => this.props.navigation.goBack()} />
            <Text allowFontScaling={false} style={styles.heading}>
              {this.props.headerName}
            </Text>

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
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        marginTop:'12%', 
        alignSelf:"stretch", 
        justifyContent:"space-between", 
        paddingBottom:"1%",
        borderBottomWidth:1,
        borderBottomColor:"#efefef",
        marginHorizontal:'3%'
    },
    heading: {
        fontFamily: "Futura",
        fontSize: 22,
        textAlign: "center",
        color: "#171919",
      },
})

