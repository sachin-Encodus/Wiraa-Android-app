import React from 'react'
import { View, Text, StyleSheet, ScrollView, Image  } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import {Picker} from '@react-native-community/picker';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class PostQuestion extends React.Component{

    state = {
        catText: [],
        title:"",
        quesText:"",
        image:null,
        category:[],
        userProfileId:"",
        msg:"",
      };

    componentDidMount = async() =>{
        this.getAsyncPermissions();

        const userProfileId = await AsyncStorage.getItem('userPrfileId')
        if(userProfileId !== null) {
            this.setState({ userProfileId })
        }else{
            console.log("null")
        }

        fetch("http://demo.wiraa.com/api/Profile/GetUserInterests?userProfileId="+userProfileId, {
            method: "GET"
        })
        .then(response => response.json())
        .then(responseJson => {
            let category = [...this.state.category];
            responseJson.map(item => {
                category.push({
                    id: item.gradeId,
                    name: item.gradeName,
                })

                this.setState({ category })
            })
        })
    }

    getAsyncPermissions = async() => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    uploadImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
          aspect: [3, 2],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          this.setState({ image : result.uri })
        }
    };

    postQuestion = () => {

        if(this.state.title.length > 25){

            const model = new FormData();

            model.append("title", this.state.title);
            model.append("category", "["+this.state.catText+"]");
            model.append("questionDetail", this.state.quesText);
            model.append("userProfileID", this.state.userProfileId);
    
            if(this.state.image !== null){
                model.append("image", {
                    name: this.state.image,
                    type: "image/jpg",
                    uri: this.state.image
                })
            }
    
            fetch("http://demo.wiraa.com/api/Question/PostQuestion", {
                method : "POST",
                body: model
            })
            .then(response => response.json())
            .then(responseJson => {
                console.log("Uploaded Successfully "+ responseJson);
            })
            .catch(err => {
                console.log("Error Uploading "+ err)
            })

            this.props.navigation.navigate("QnA")
        }else{
            this.setState({ msg: "Please Enter minimum 25 words" })
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={[styles.headerr]}>
                    <Ionicons name="md-close" size={24} color="#767676" style={{zIndex: 999999, padding:6, paddingHorizontal:0}} onPress={() => this.props.navigation.goBack()} />
                    <Text allowFontScaling={false} style={[styles.heading]}>Post a Question</Text>
                    {/* <Ionicons name="send" size={24} color="#f56" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} onPress={() => this.props.navigation.goBack()} /> */}
                    <TouchableOpacity onPress={() => this.uploadImage()}>
                        <Ionicons name="md-camera" size={24} color="#767676" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{marginHorizontal:16}} showsVerticalScrollIndicator={false}>

                    <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.msg ? "none" : "flex", marginBottom:10}]}>{this.state.msg}</Text>

                    <Text allowFontScaling={false} style={styles.label}>Choose a Category:</Text> 
                    
                    {/* Select Speciality */}
                    <View style={{alignSelf:"stretch", backgroundColor:"#efefef", marginTop:10, borderRadius:6}}>
                        <Picker
                            mode="dropdown"
                            selectedValue={this.state.catText}
                            style={{height: 50}}
                            onValueChange={(itemValue, itemIndex) =>  this.setState({ catText: itemValue })
                        }>
                            <Picker.Item label="Select Category" />
                            {this.state.category.map(item => (
                                <Picker.Item id={item.id} label={item.name} value={item.id} />
                            ))}
                        </Picker>
                    </View>

                    <Text allowFontScaling={false} style={styles.label}>Question Title</Text>
                    <TextInput selectionColor="#767676" underlineColor="#efefef" numberOfLines={1} autoFocus={true} style={[styles.txtipt]} onChangeText={(text) => this.setState({ title: text })} multiline={true} placeholder="Start your question with What, How, Why etc..." />

                    <Text allowFontScaling={false} style={styles.label}>Question Details</Text>
                    <TextInput selectionColor="#efefef" underlineColor="#efefef" style={styles.txtipt} onChangeText={(text) => this.setState({ quesText: text })} multiline={true} numberOfLines={6} placeholder="Post your question details..." />
                    {this.state.image && <Image source={{ uri: this.state.image }} style={{ width: 360, height: 240, marginVertical:16, borderRadius:10 }} />}
                    <View style={{alignSelf:"stretch"}}>
                        <TouchableOpacity style={[styles.btn]} onPress={() => this.postQuestion()}>
                            <Text allowFontScaling={false} style={styles.btntxt}>POST</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"stretch",
        backgroundColor:"#fff"
    },
    headerr:{
        flexDirection:"row",
        paddingTop:40, 
        alignSelf:"stretch", 
        justifyContent:"space-between", 
        paddingBottom:6,
        paddingHorizontal:16,
        paddingBottom:0,
        borderBottomWidth:1,
        borderBottomColor:"#efefef"
    },
    heading:{
        fontFamily:"Futura",
        fontSize:22,
        marginTop:6,
        textAlign:"center",
        color:"#171919",
        paddingBottom:10,
    },
    label:{
        alignSelf:"flex-start",
        fontSize:16,
        paddingLeft:0,
        paddingTop:16,
        color:"#767676",
        fontFamily:"Futura",
    },
    txtipt:{
        borderRadius:6,
        paddingHorizontal:8,
        marginVertical:6,
        alignSelf:"stretch",
        fontFamily:"OpenSans",
        fontSize:14,
    },
    card:{
        margin:6, 
        padding:24,
        paddingVertical:14, 
        borderRadius:30,
        backgroundColor:"#efefef",
        marginTop:16,
        width:170,
    },
    btn:{
        backgroundColor:"#f56",
        borderRadius:10,
        padding:16,
        paddingVertical:14,
        elevation:6,
        height:55,
        marginTop:16,
        marginBottom:16
    },
    btntxt:{
        textAlign:"center",
        fontSize:14,
        color:"#fff",
        fontFamily:"Futura",
        paddingTop:6
    },
    errorMessage:{
        backgroundColor:"#FDF4F5", 
        alignSelf:"stretch", 
        textAlign:"center", 
        marginHorizontal:32, 
        borderRadius:6, 
        color:"#EA5165", 
        borderColor:"#EA5165", 
        borderWidth:1, 
        padding:6, 
        fontWeight:"bold",
    },
})