import React, {useState} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
export default function ProfilePic(props){

    const {pic} = props; 

    return(
        <View style={styles.img}>
            <Image style={{width:80, height:80, borderRadius:60}} source={{uri: pic === null ? "http://demo.wiraa.com/Content/img/boys-avtar.jpg" : "http://demo.wiraa.com/"+pic}} />
         
        </View>
    )
}

const styles = StyleSheet.create({
    img: {
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        borderRadius: 60,
        backgroundColor: "#f56",
        position:"absolute",
        top:120,
        marginLeft: -25,
        zIndex:9999,
        backgroundColor:"#fff",
        padding:45
    },
})