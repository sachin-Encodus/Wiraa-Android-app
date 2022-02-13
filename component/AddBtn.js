import React, {useState} from 'react'
import { View, Text, StyleSheet, Animated, TouchableHighlight, Image, Modal} from 'react-native'
import { Feather, Ionicons,AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

export default function AddBtn({navigation}) {

    const mode = new Animated.Value(0);
    const buttonSize = new Animated.Value(1);

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(buttonSize, {
                toValue: 0.1,
                duration: 1,
            }),
            Animated.timing(buttonSize, {
                toValue: 1,
                duration:1,
            }),
            Animated.timing(mode, {
                toValue: mode._value === 0 ? 1 : 0,
            })
        ]).start();

        navigation.navigate("Categories")
    };

        const thermometerX = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-40, 60]
        });

        const thermometerY = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, -250]
        });

        const timeX = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-40, -51]
        });

        const timeY = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, -250]
        });

        const pulseX = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-40, -160]
        });

        const pulseY = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, -250]
        });

        const rotation = mode.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "180deg"]
        });

        const sizeStyle = {
            transform: [{ scale: buttonSize }]
        };
        

        return(
            <View style={{ position: "absolute", alignItems: "center" }}>

                {/* <Animated.View style={{position: "absolute", transform: [{ translateX: pulseX }, { translateY: pulseY }] }}>
                    <View style={styles.secondaryButton}>
                        <TouchableOpacity onPress={() => {navigation.navigate("PostArticle")}} >
                            <Ionicons name="ios-create" size={24} style={{alignSelf:"center"}} color="#fff" />
                            <Text allowFontScaling={false} style={styles.label}>Post Article</Text>
                        </TouchableOpacity>   
                    </View>
                </Animated.View> */}
                {/* <Animated.View style={{position: "absolute", transform: [{ translateX: pulseX }, { translateY: pulseY }] }}>
                    <View style={styles.secondaryButton}>
                        <TouchableOpacity onPress={() => {navigation.navigate("PostRequest")}}>
                            <Ionicons name="ios-jet" size={24} style={{alignSelf:"center"}} color="#fff" />
                            <Text allowFontScaling={false} style={styles.label}>Post Request</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <Animated.View style={{position: "absolute", transform: [{ translateX: thermometerX }, { translateY: thermometerY }] }}>
                    <View style={styles.secondaryButton}>
                        <TouchableOpacity onPress={() => {navigation.navigate("PostQuestion")}} >
                            <Ionicons name="ios-bulb" size={24} style={{alignSelf:"center"}} color="#fff" />
                            <Text allowFontScaling={false} style={styles.label}>Post Question</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View> */}
                
                <Animated.View style={[styles.button, sizeStyle]}>
                    <TouchableOpacity onPress={() => handlePress()}>
                        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                            {/* <Ionicons name="md-bonfire" size={28} color="#fff" /> */}
                            <Ionicons name="md-menu" size={28} color="#fff" />
                            {/* <Image source={require("../assets/Logo/W-01.png")} style={{width:36, height:36}} /> */}
                        </Animated.View>
                    </TouchableOpacity>
                </Animated.View>


                {/* <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <View style={styles.secondaryButton}>
                        <TouchableOpacity style={styles.tabs} onPress={() => navigation.navigate(PostQuestion)}>
                            <Feather name="help-circle" size={24} style={{textAlign:"center", }} color="#171919" />
                            <Text allowFontScaling={false} style={styles.name} > Post Question </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.tabs} onPress={() => navigation.navigate(PostRequest)} >
                            <Feather name="file-text" size={24} style={{textAlign:"center"}} color="#171919" />
                            <Text allowFontScaling={false}  style={styles.name}> Post Request </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.tabs} onPress={() => navigation.navigate(PostArticle)}>
                            <Feather name="message-square" size={24} style={{textAlign:"center"}} color="#171919" />
                            <Text allowFontScaling={false}  style={styles.name}> Post Article </Text>
                        </TouchableOpacity>
                    </View>


                </Modal> */}
            </View>
        )
    
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: "#f56",
        position: "absolute",
        marginTop: -40,
        marginLeft: -25,
        elevation:6,
        zIndex:9999
    },
    secondaryButton: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        height: 64,
        borderRadius: 10,
        backgroundColor: "#f56",
        elevation:3,
        zIndex:9999,
        marginTop: 100,
        borderWidth:1,
        borderColor:"#f56",
    },
    label:{
        color:"#fff",
        fontFamily:"Futura",
        fontSize:12,
        textAlign:"center",
        lineHeight:12,
        paddingTop:8
    },
})