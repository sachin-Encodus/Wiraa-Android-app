import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,FlatList, Modal } from 'react-native'
import { Feather, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

export default function Interests(props,{navigation}){

    const [allInterests, setAllInterests] = useState([]);
    const [val, setVal] = useState("");

    const {interests} = props.route.params; 


    useEffect(() => {
        fetch("http://demo.wiraa.com/api/Profile/GetAllInterests")
        .then(response => response.json())
        .then(responseJson => {
            responseJson.map(item => {
                setAllInterests(allInterests => [
                    ...allInterests,{
                        id : item.$id,
                        gradeId: item.gradeID,
                        gradeName: item.gradeName,
                        cirId: item.curriculumID,
                        cirName: item.curriculumName
                    }
                ])
            })
        })
        // console.log("Working");
    }, []);

    const updateInterest = () => {
        console.log("Working")
    }

    const Interest = () => {

        if(val !== undefined || val !== null){
            return(
                <View style={{flexDirection:"row", flexWrap:"wrap", paddingLeft:16}}>
                    {allInterests.map(item => item.cirName === val ? (
                        <TouchableOpacity key={item.id}>
                            <Text key={item.id} allowFontScaling={false} style={[styles.active, {alignSelf:"flex-start"}]}>{item.gradeName}</Text>
                        </TouchableOpacity>
                    ) : null )}
                </View>
            )
        }
    }

    return(
        <View style={styles.container}>
            <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:6}]}>Interests</Text>

            <View style={{flexDirection:"row", paddingLeft:16, margin:32, marginBottom:0}}>
                <TouchableOpacity onPress={() => { Interests; setVal("Business") }}>
                    <Text allowFontScaling={false} style={[styles.label, {marginTop: 0, marginLeft:16}]}>Business</Text>    
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Interests; setVal("Design") }}>
                    <Text allowFontScaling={false} style={[styles.label, {marginTop: 0, marginLeft:16}]}>Design</Text>    
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Interests; setVal("Health") }}>
                    <Text allowFontScaling={false} style={[styles.label, {marginTop: 0, marginLeft:16}]}>Health</Text>    
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Interests; setVal("IT") }}>
                    <Text allowFontScaling={false} style={[styles.label, {marginTop: 0, marginLeft:16}]}>IT</Text>    
                </TouchableOpacity>
            </View>
            
            <View style={{flexDirection:"row", paddingLeft:16, margin:32, marginTop:0}}>
                <TouchableOpacity onPress={() => { Interests; setVal("LifeStyle") }}>
                    <Text allowFontScaling={false} style={[styles.label, {marginTop: 0, marginLeft:16}]}>LifeStyle</Text>    
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Interests; setVal("Marketing") }}>
                    <Text allowFontScaling={false} style={[styles.label, {marginTop: 0, marginLeft:16}]}>Marketing</Text>    
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Interests; setVal("Study") }}>
                    <Text allowFontScaling={false} style={[styles.label, {marginTop: 0, marginLeft:16}]}>Study</Text>    
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Interests; setVal("Writing") }}>
                    <Text allowFontScaling={false} style={[styles.label, {marginTop: 0, marginLeft:16}]}>Writing</Text>    
                </TouchableOpacity>
            </View>
        
            <ScrollView>

                <Interest />

                <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:16, marginTop:6}}>
                    <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676", width:150}]} onPress={() => navigation.goBack() }>
                        <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, {width:150}]} onPress={() => updateInterest}>
                        <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>DONE</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"flex-start",
        alignItems:"flex-start",
        backgroundColor:"#fff",
    },
    heading:{
        fontFamily:"Futura",
        fontSize:22,
        marginTop:40,
        color:"#171919",
        alignSelf:"center"
    },
    btn:{
        backgroundColor:"#f56",
        borderRadius:10,
        padding:16,
        paddingVertical:14,
        width:200,
        elevation:6,
    },
    label:{
        color:"#767676",
        fontFamily:"OpenSans",
        fontSize:14, 
    },
    active:{
        padding:10, 
        backgroundColor:"#efefef",
        borderRadius:6, 
        color:"#171919",
        margin:6,
        fontFamily:"OpenSans",
        fontSize:12,
    },
})