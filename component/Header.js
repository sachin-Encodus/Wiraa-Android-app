import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons';

export default function Header({val}) {
    
    // const Drawer = createDrawerNavigator();

    // const drawerNavigation = () => {
    //     return(
    //         <NavigationContainer>
    //             <Drawer.Navigator>
    //                 <Drawer.Screen name="Profile" component={Profile} />
    //                 <Drawer.Screen name="Community" component={QnA} />
    //                 <Drawer.Screen name="Settings" component={Settings} />
    //                 <Drawer.Screen name="Logout" component={LandingScreen} />
    //             </Drawer.Navigator>
    //         </NavigationContainer>
    //     );
    // }

    return (
        <View style={styles.headerr}>
            <TouchableOpacity  style={{paddingTop:4}}>
                <Image style={{width:30, height:30, borderRadius:30}} source={require('../assets/imgs/bg-img1.jpg')} />
            </TouchableOpacity>
            <Text style={[styles.heading, {display:val.isDashboard ? "none" : "flex"}]}> {val.title} </Text>
            <Image style={{width:90, height:19, marginTop:12, justifyContent:"center", display:val.isDashboard ? "flex" : "none"}} source={require('../assets/Logo/logow.png')} />
            <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
                <Feather name="mail" size={24} color="#171919" style={{paddingTop:10, paddingLeft:6}} />
            </TouchableOpacity>
            {/* <FontAwesome name="envelope-o" size={22} color="#171919" style={{paddingTop:10, paddingLeft:6}} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    headerr:{
        flexDirection:"row",
        marginTop:40, 
        alignSelf:"stretch", 
        justifyContent:"space-between", 
        paddingBottom:6,
        borderBottomWidth:1,
        borderBottomColor:"#efefef",
        marginHorizontal:16
    },
    heading:{
        fontFamily:"Futura",
        fontSize:22,
        marginTop:6,
        textAlign:"center",
        color:"#171919",
    },
})
