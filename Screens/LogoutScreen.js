import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View ,ActivityIndicator} from 'react-native'


import AsyncStorage from '@react-native-async-storage/async-storage'
const Logout = ({navigation}) => {

useEffect(() => {
 clear()
}, [])

const clear = async()=> {

    try {
        await AsyncStorage.clear() 
        await AsyncStorage.removeItem('userData');
        console.log("remove data");
        navigation.replace("LandingScreen")
        return true;
    }
    catch(exception) {
        return false;
    }
    
}


    return (
        <View style={styles.container}>
                    <ActivityIndicator size="large" color="#f56"/>
                </View>
    )
}

export default Logout

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})
