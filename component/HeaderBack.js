import React, { Component } from 'react'
import { Text, View,StyleSheet,TouchableOpacity } from 'react-native'
import {Feather} from "@expo/vector-icons";
import { heightPercentageToDP } from 'react-native-responsive-screen';

export default class HeaderBack extends Component {
    constructor(props){
      super(props);

    }
    render() {
      // console.log('header navigation',this.props)
        return (
            <View style={styles.container}>
            <Feather name="chevron-left" size={24} color="#767676" style={{zIndex: 999999}}  onPress={() => this.props.navigation.goBack()} />
            <Text allowFontScaling={false} style={styles.heading}>
              {this.props.headerName}
            </Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        marginTop: heightPercentageToDP(5),  
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
        marginLeft:"auto",
        marginRight:"auto",
      
      },
})

