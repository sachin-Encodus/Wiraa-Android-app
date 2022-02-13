import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ToastAndroid, Animated } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Foundation, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { TextInput, RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

export default class QuestionDetails extends React.Component{

    state={
        user:[],
        quesDetail:[],
        answers:[],
        image: null,
        comment:"",
        quesId:"",
        userProfileId:"",
    }

    componentDidMount(){
        this.getAsyncPermissions();

        const {userId, userProfileId, quesId} = this.props.route.params;

        this.setState({ quesId })

        fetch("http://demo.wiraa.com/api/Users/GetUsers?Id="+userId,{
            method:"GET"
        })
        .then(response => response.json())
        .then((responseJson) => {
            let user = [];
            
            user.push({
                profilePic: responseJson.usersProfile.profilePic,
                userName: responseJson.firstName+" "+responseJson.lastName,
                occupation: responseJson.usersProfile.occupations.occupationName
            })

            let userProfileId = responseJson.usersProfile.usersProfileID

            this.setState({ user, userProfileId });

        })
        .catch(error => {
            console.log(error);
        })

        this.getAnswers(quesId);

    }

    getAnswers = (quesId) => {
        //Question Details
        fetch("http://demo.wiraa.com/api/Question/QuestionDetails?Id="+quesId,{
            method: "POST"
        })
        .then(response => response.json())
        .then((responseJson) => {
            // let quesDetail = [];

            // quesDetail.push({
            //     quesTitle: responseJson.title,
            //     quesDate: responseJson.questionDate,
            //     quesDesc: responseJson.questionDetail,
            //     ansCount: responseJson.answerCount,
            //     category: responseJson.gradeName,
            // })

            let answers = [];
            responseJson.answers.map(ans => {
                answers.push({
                    id: ans.answerId,
                    answeredById: ans.answeredBy,
                    ansName: ans.name,
                    ansProfilePic: ans.profilePic,
                    ansDate: ans.ansTime,
                    ansImg: ans.imagePath,
                    ansDesc: ans.description,
                })

                this.setState({ answers })
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

    renderRightActions = (progress, dragX, id) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [5, 10, 20, 20],
        });

        return(
            <RectButton style={{marginLeft:10}} onPress={this.close}>
                <Animated.Text
                style={[
                    styles.actionText,
                    {
                    transform: [{ translateX: trans }],
                    },
                ]}>
                    <TouchableOpacity onPress={() => this.deleteAnswers(id)}>
                        <Ionicons name="md-trash" size={24} color="#f56"  />
                    </TouchableOpacity>
                
                </Animated.Text>
            </RectButton>
        );
    }

    deleteAnswers = (id) => {

        console.log(id)

        fetch("http://demo.wiraa.com/api/Question/DeleteAnswer?AnswerId="+id)
        .then(response => response.json())
        .then(responseJson => {

            this.setState({
                answers: this.state.answers.filter(item => item.id !== id)
            })

            ToastAndroid.showWithGravityAndOffset(
                "Deleted Successfully",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );

        })
        .catch(err => {
            ToastAndroid.showWithGravityAndOffset(
                err,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        })
    }

    postAns = () => {

        const model = new FormData();

        model.append("questionId", this.state.quesId);
        model.append("description", this.state.comment );
        model.append("answeredBy", this.state.userProfileId);


        if(this.state.image !== null){
            model.append("image", {
                name: this.state.image,
                type: "image/jpg",
                uri: this.state.image
            })
        }

        fetch("http://demo.wiraa.com/api/Question/AddAnswer", {
            method : "POST",
            body: model
        })
        .then(response => response.json())
        .then(responseJson => {
            console.log("Uploaded Successfully "+ responseJson);
            this.setState({ comment: "" })
            this.getAnswers(this.state.quesId);
        })
        .catch(err => {
            console.log("Error Uploading "+ err)
        })
    }

    render(){

        const { title, desc, count, quesDate, cat, img } = this.props.route.params;

        return(
            <View style={styles.container}>
                <LinearGradient
                    colors={['#ff5566', '#ff5566']}
                    style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height:850,
                    }}
                >
                   
                   <View style={[styles.headerr, {paddingTop: 0}]}>
                        <Feather name="chevron-left" size={24} color="#ffff" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} onPress={() => this.props.navigation.goBack()} />
                        <Text allowFontScaling={false} style={[styles.heading]}>Question Details</Text>
                        <Feather name="chevron-right" size={24} color="transparent" style={{zIndex: 999999, padding:6, paddingHorizontal:0}} onPress={() => this.props.navigation.goBack()} />
                    </View>


                    <View style={{flex:1}}>
                        <ScrollView showsVerticalScrollIndicator={false} style={styles.card}>
                                                    
                            <View>
                                {this.state.user.map(item => (
                                    <View>
                                        <View style={{flexDirection:"row", padding:16, paddingBottom:10}}>
                                            <Image style={{width:45, height:45, borderRadius:60, marginTop:2}} source={{uri: item.profilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com/"+item.profilePic}} />
                                            <TouchableOpacity onPress={() => item.fkUserProfileId !== this.state.userProfileId ? this.props.navigation.navigate("Profile",{fkUserProfileId: item.fkUserProfileId}) : this.props.navigation.navigate("Profile") } >
                                                <Text allowFontScaling={false} style={{fontFamily:"Futura", fontSize:16, paddingTop:6, paddingLeft:10}}>{item.userName}</Text>
                                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", fontSize:14, color:"#767676", paddingLeft:10}}>{item.occupation}</Text>
                                            </TouchableOpacity >
                                        </View>
                                        <View style={{paddingHorizontal:16}}>
                                            <Text allowFontScaling={false} style={[styles.label, {paddingTop:10}]}>{title}</Text>
                                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", fontSize:14, color:"#767676",lineHeight:20, paddingVertical:10}}>{desc}</Text>
                                            <Image style={{width:360, height:240, borderRadius:10, marginTop:0, display: img !== null ? "flex" :"none"}} source={{uri: "http://demo.wiraa.com/"+img}} />
                                        </View>    
                                    </View>
                                ))}
                                
                                <View style={styles.cardContainer}>
                                    <View style={{flexDirection:"row", width:160, justifyContent:"space-between"}}>
                                        <View style={{flexDirection:"row",}}>
                                            <Ionicons name="md-repeat" size={18} color="#767676" />
                                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", paddingLeft:6,color:"#171919", fontSize:12 }}>{count}</Text>
                                        </View>
                                        <View style={{flexDirection:"row", marginLeft:16}}>
                                            <Ionicons name="md-calendar" size={18} color="#767676" />
                                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", paddingLeft:6,color:"#171919", fontSize:12 }}>{quesDate}</Text>
                                        </View>
                                    </View>
                                    <Text allowFontScaling={false} style={[styles.tags, {width:125, textAlign:"right"}]} numberOfLines={1} ellipsizeMode="tail">{cat}</Text>
                                </View>
                            </View>
    
                            <View style={{borderBottomWidth:1, borderBottomColor:"#efefef", paddingBottom:16, flexDirection:"row", marginTop:0, justifyContent:"space-evenly"}}>
                                <TouchableOpacity onPress={() => this.uploadImage()}>
                                    <Ionicons name="md-image" size={24} color="#767676" style={{marginTop:14, paddingLeft:16}} />
                                </TouchableOpacity>
                                <TextInput style={[styles.commentBox, {flex:1, marginHorizontal:16, paddingRight:40}]} multiline={true} numberOfLines={6} placeholder="Post Your Answer" onChangeText={(text) => this.setState({ comment : text })} value={this.state.comment} />
                                <TouchableOpacity onPress={() => this.postAns()}>
                                    <Ionicons name="ios-send" size={24} color="#767676" style={{margin:14, marginLeft:0}} />
                                </TouchableOpacity>
                            </View>
    
                            <Text style={{fontFamily:"Futura", fontSize:16, paddingVertical:10, paddingLeft:10}}>Thread Reply</Text>
    
                            {this.state.answers.map(ans => (
                                this.state.userProfileId === ans.answeredById ?
                                <Swipeable renderRightActions={(progress, dragX) => this.renderRightActions(progress, dragX, ans.id)}>
                                    <View style={styles.ansContainer}>
                                        <View style={styles.comment}>
                                            <Image style={{width:35, height:35, borderRadius:30}} source={{uri: ans.ansProfilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com/"+ans.ansProfilePic}} />
                                            <View style={{paddingLeft:10, paddingTop:2}}>
                                                <Text allowFontScaling={false} style={{fontFamily:"Futura", fontSize:14, color:"#171919"}}>{ans.ansName}</Text>
                                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", fontSize:12, color:"#767676", paddingBottom:6}}>{ans.ansDate}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", fontSize:14, color:"#171919", display: ans.ansDesc !== null ? "flex" : "none"}}>{ans.ansDesc}</Text>
                                            <Image style={{width:360, height:240, borderRadius:10, marginTop:10, display: ans.ansImg !== null ? "flex" :"none"}} source={{uri: "http://demo.wiraa.com/"+ans.ansImg}} />
                                        </View>
                                    </View>
                                </Swipeable>
                                :
                                <View style={styles.ansContainer}>
                                    <View style={styles.comment}>
                                        <Image style={{width:35, height:35, borderRadius:30}} source={{uri: ans.ansProfilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com/"+ans.ansProfilePic}} />
                                        <View style={{paddingLeft:10, paddingTop:2}}>
                                            <Text allowFontScaling={false} style={{fontFamily:"Futura", fontSize:14, color:"#171919"}}>{ans.ansName}</Text>
                                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", fontSize:12, color:"#767676", paddingBottom:6}}>{ans.ansDate}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Text allowFontScaling={false} style={{fontFamily:"OpenSans", fontSize:14, color:"#171919", display: ans.ansDesc !== null ? "flex" : "none"}}>{ans.ansDesc}</Text>
                                        <Image style={{width:360, height:240, borderRadius:10, marginTop:10, display: ans.ansImg !== null ? "flex" :"none"}} source={{uri: "http://demo.wiraa.com/"+ans.ansImg}} />
                                    </View>
                                </View>
                            ))}
    
                        </ScrollView>
                    </View>
                    
                </LinearGradient>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    headerr:{
        flexDirection:"row",
        marginVertical:16,
        alignSelf:"stretch", 
        justifyContent:"space-between", 
        paddingBottom:6,
        paddingHorizontal:16,
        paddingBottom:0,
        marginTop:40,
    },
    heading:{
        fontFamily:"Futura",
        fontSize:22,
        marginTop:6,
        textAlign:"center",
        color:"#fff"
    },
    tags:{
        fontFamily:"OpenSans",
        fontSize:12,
        color:"#f56",
    },
    label:{
        fontFamily:"Futura",
        color: "#171919",
        fontSize:16,
        lineHeight:20,
    },
    card:{
        backgroundColor:"#fff",
        borderRadius:24,
        marginTop:0,
        marginBottom:32
    },
    cardContainer:{
        flexDirection:"row", 
        width:360, 
        justifyContent:"space-between", 
        paddingTop:10,
        paddingBottom:16,
        marginHorizontal:16,
    },
    commentBox:{
        backgroundColor:"#efefef",
        color:"#171919",
        paddingHorizontal:16,
        marginHorizontal:0,
        borderRadius:10,
        height:50,
        fontFamily:"OpenSans"
    },
    comment:{
        flexDirection:"row",
        margin:10,
        marginLeft:0,
        marginTop:5,
        marginBottom:5
    },
    ansContainer:{
        backgroundColor:"#f9f9f9", 
        marginTop:5, 
        padding:16, 
        borderRadius:10, 
        paddingBottom:10, 
        paddingTop:10, 
        borderBottomWidth:1, 
        borderBottomColor:"#efefef"
    },
    actionText:{
        fontFamily:"Futura",
        color:"#f56",
        backgroundColor:"#fff",
        marginTop:20,
        padding:20,
    }
})