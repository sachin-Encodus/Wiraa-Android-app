import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, Keyboard, ToastAndroid, ActivityIndicator, Animated } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialCommunityIcons, Foundation, Feather, Ionicons } from '@expo/vector-icons';
import { TextInput,RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from 'react-native-gesture-handler/Swipeable';

export default class QnA extends React.Component{

    state = {
        allQuestions:[],
        myQuestions:[],
        myAnswers:[],
        Qactive:true,
        Aactive:false,
        Mactive:false,
        userProfileId:"",
        quesProfileId:"",
        userId:"",
        searchText:"",
        filteredData:[],
    }

    componentDidMount = async() => {
        const userProfileId = await AsyncStorage.getItem('userPrfileId')
        if(userProfileId !== null) {
        this.setState({userProfileId})
        }else{
            console.log("null")
        }

        const userId = await AsyncStorage.getItem('userId')
        if(userId !== null) {
        this.setState({userId})
        }else{
            console.log("null")
        }


        this.getAllQuestions(userProfileId)
    }

    getAllQuestions = (userProfileId) => {
        this.setState({ Qactive:true, Aactive:false, Mactive:false });

        fetch("http://demo.wiraa.com/api/Question/GetAllQuestion?userId="+userProfileId)
        .then(response => response.json())
        .then((responseJson) => {
            let allQuestions = [];
            responseJson.map(item => {
                allQuestions.push({
                    quesProfileId: item.userProfileID,
                    quesId: item.questionId,
                    title: item.title,
                    profilePic: item.profilePic,
                    category: item.category[0],
                    ansCount: item.answerCount,
                    quesDate: item.questionDate,
                    description: item.questionDetail,
                    img:item.imagePath
                })
                this.setState({ allQuestions });
            })
        })
        .catch(error => {
            console.log(error);
        })
    }

    getMyQuestions = (userProfileId) => {
        this.setState({ Qactive:false, Aactive:false, Mactive:true });

        fetch("http://demo.wiraa.com/api/Question/GetMyQuestion?userId="+userProfileId)
        .then(response => response.json())
        .then((responseJson) => {
            let myQuestions = [];
            responseJson.map(item => {
                myQuestions.push({
                    quesProfileId: item.userProfileID,
                    quesId: item.questionId,
                    title: item.title,
                    profilePic: item.profilePic,
                    category: item.category[0],
                    ansCount: item.answerCount,
                    quesDate: item.questionDate,
                    description: item.questionDetail,
                    img:item.imagePath
                })
                this.setState({ myQuestions });
            })
        })
        .catch(error => {
            console.log(error);
        })
    }

    getMyAnswers = (userProfileId) => {
        this.setState({ Qactive:false, Aactive:true, Mactive:false });

        fetch("http://demo.wiraa.com/api/Question/GetMyAnswer?userId="+userProfileId)
        .then(response => response.json())
        .then((responseJson) => {
            let myAnswers = [];
            responseJson.map(item => {
                myAnswers.push({
                    quesProfileId: item.userProfileID,
                    quesId: item.questionId,
                    title: item.title,
                    profilePic: item.profilePic,
                    category: item.category[0],
                    ansCount: item.answerCount,
                    quesDate: item.questionDate,
                    description: item.questionDetail,
                    img:item.imagePath
                })
                this.setState({ myAnswers });
            })
        })
        .catch(error => {
            console.log(error);
        })
    }

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
                    <TouchableOpacity onPress={() => this.deleteQuestion(id)}>
                        <Ionicons name="md-trash" size={24} color="#f56"  />
                    </TouchableOpacity>
                
                </Animated.Text>
            </RectButton>
        );
    }

    deleteQuestion = (id) => {

        fetch("http://demo.wiraa.com/Api/Question/DeleteQuestion?QuestionId="+id)
        .then(response => response.json())
        .then(responseJson => {
            console.log(responseJson);
            this.setState({
                myQuestions: this.state.myQuestions.filter(item => item.quesId !== id)
            })
            ToastAndroid.showWithGravityAndOffset(
                "Deleted Successfully",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        })

    }

    renderAllQuestions = (item, index) => {

        const showDate = item.quesDate.split("T");
        console.log("qqqqqqqq",item)
        return(
            <TouchableOpacity style={{backgroundColor:"#f9f9f9", marginTop:5,paddingRight:12}} onPress={() => this.props.navigation.navigate("QuestionDetails", {
                userId: this.state.userId,
                userProfileId: this.state.quesProfileId,
                quesId: item.quesId,
                title: item.title,
                desc: item.description,
                count: item.ansCount,
                quesDate: showDate[0],
                cat: item.category,
                img: item.img
            })}>                            
                <View style={{flexDirection:"row", padding:16, paddingBottom:4, marginRight:24}}>
                    <TouchableOpacity style={{zIndex:9999}} onPress={() => item.quesProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.quesProfileId}) : this.props.navigation.navigate("Profile") }>
                        <Image style={{width:45, height:45, borderRadius:60, marginTop:2}} source={{uri: item.profilePic === null ? "http://demo.wiraa.com/Content/img/boys-avtar.jpg" : "http://demo.wiraa.com/"+item.profilePic}} />
                    </TouchableOpacity>
                    <Text allowFontScaling={false} style={styles.label}>{item.title}</Text>
                </View>
                <Text numberOfLines={2} ellipsizeMode="tail" allowFontScaling={false} style={[styles.label, {color:"#767676",fontSize:14, fontFamily:"OpenSans",paddingTop:0, paddingVertical:10,marginLeft:64, marginRight:24, display: item.description !== null ? "flex" : "none"}]}>{item.description}</Text>
                <View style={styles.cardContainer}>
                    <View style={{flexDirection:"row", width:150, justifyContent:"space-between"}}>
                        <View style={{flexDirection:"row"}}>
                            <Ionicons name="md-repeat" size={18} color="#767676" />
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", paddingLeft:6,color:"#171919", fontSize:12 }}>{item.ansCount}</Text>
                        </View>
                        <View style={{flexDirection:"row", marginLeft:16}}>
                            <Ionicons name="md-calendar" size={18} color="#767676" />
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", paddingLeft:4,color:"#171919", fontSize:12 }}>{showDate[0]}</Text>
                        </View>
                    </View>
                    <Text allowFontScaling={false} style={[styles.tags, {width:135, textAlign:"right"}]} numberOfLines={1} ellipsizeMode="tail">{item.category}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderMyQuestions = (item, index) => {

        const showDate = item.quesDate.split("T");

        return(
            <Swipeable renderRightActions={(progress, dragX) => this.renderRightActions(progress, dragX, item.quesId)}>
                <TouchableOpacity style={{backgroundColor:"#f9f9f9", marginTop:5,paddingRight:12}} onPress={() => this.props.navigation.navigate("QuestionDetails",{
                    userId: this.state.userId,
                    userProfileId: this.state.quesProfileId,
                    quesId: item.quesId,
                    title: item.title,
                    desc: item.description,
                    count: item.ansCount,
                    quesDate: showDate[0],
                    cat: item.category,
                    img: item.img
                })}>                            
                    <View style={{flexDirection:"row", padding:16, paddingBottom:4,marginRight:24}}>
                        <TouchableOpacity style={{zIndex:9999}} onPress={() => item.quesProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.quesProfileId}) : this.props.navigation.navigate("Profile") }>
                            <Image style={{width:45, height:45, borderRadius:60, marginTop:2}} source={{uri: item.profilePic === null ? "http://demo.wiraa.com/Content/img/boys-avtar.jpg" : "http://demo.wiraa.com/"+item.profilePic}} />
                        </TouchableOpacity>
                        <Text allowFontScaling={false} style={styles.label}>{item.title}</Text>
                    </View>
                    <Text numberOfLines={2} ellipsizeMode="tail" allowFontScaling={false} style={[styles.label, {color:"#767676",fontSize:14, fontFamily:"OpenSans",paddingTop:0, paddingVertical:10,marginLeft:64,marginRight:24, display: item.description !== null ? "flex" : "none"}]}>{item.description}</Text>
                    <View style={styles.cardContainer}>
                        <View style={{flexDirection:"row", width:150, justifyContent:"space-between"}}>
                            <View style={{flexDirection:"row"}}>
                                <Ionicons name="md-repeat" size={18} color="#767676" />
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", paddingLeft:6,color:"#171919", fontSize:12 }}>{item.ansCount}</Text>
                            </View>
                            <View style={{flexDirection:"row", marginLeft:16}}>
                                <Ionicons name="md-calendar" size={18} color="#767676" />
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", paddingLeft:4,color:"#171919", fontSize:12 }}>{showDate[0]}</Text>
                            </View>
                        </View>
                        <Text allowFontScaling={false} style={[styles.tags, {width:135, textAlign:"right"}]} numberOfLines={1} ellipsizeMode="tail">{item.category}</Text>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        )
    }

    renderMyAnswers = (item, index) => {

        const showDate = item.quesDate.split("T");

        return(
            <TouchableOpacity style={{backgroundColor:"#f9f9f9", marginTop:5,paddingRight:12}} onPress={() => this.props.navigation.navigate("QuestionDetails",{
                userId: this.state.userId,
                userProfileId: this.state.quesProfileId,
                quesId: item.quesId,
                title: item.title,
                desc: item.description,
                count: item.ansCount,
                quesDate: showDate[0],
                cat: item.category,
                img: item.img
            })}>                            
                <View style={{flexDirection:"row", padding:16, paddingBottom:4,marginRight:24}}>
                    <TouchableOpacity style={{zIndex:9999}} onPress={() => item.quesProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.quesProfileId}) : this.props.navigation.navigate("Profile") }>
                        <Image style={{width:45, height:45, borderRadius:60, marginTop:2}} source={{uri: item.profilePic === null ? "http://demo.wiraa.com/Content/img/boys-avtar.jpg" : "http://demo.wiraa.com/"+item.profilePic}} />
                    </TouchableOpacity>
                    <Text allowFontScaling={false} style={styles.label}>{item.title}</Text>
                </View>
                <Text numberOfLines={2} ellipsizeMode="tail" allowFontScaling={false} style={[styles.label, {color:"#767676", fontSize:14, fontFamily:"OpenSans",paddingTop:0, paddingVertical:10,marginLeft:64,marginRight:24, display: item.description !== null ? "flex" : "none"}]}>{item.description}</Text>
                <View style={styles.cardContainer}>
                    <View style={{flexDirection:"row", width:150, justifyContent:"space-between"}}>
                        <View style={{flexDirection:"row"}}>
                            <Ionicons name="md-repeat" size={18} color="#767676" />
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", paddingLeft:6,color:"#171919", fontSize:12 }}>{item.ansCount}</Text>
                        </View>
                        <View style={{flexDirection:"row", marginLeft:16}}>
                            <Ionicons name="md-calendar" size={18} color="#767676" />
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", paddingLeft:4,color:"#171919", fontSize:12 }}>{showDate[0]}</Text>
                        </View>
                    </View>
                    <Text allowFontScaling={false} style={[styles.tags, {width:135, textAlign:"right"}]} numberOfLines={1} ellipsizeMode="tail">{item.category}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    search = (text) => {
        
        if(this.state.Qactive === true){
            const searchText = text.toLowerCase();
            let Ques = this.state.allQuestions;

            if( searchText !== "" && searchText.length > 1){
                this.setState({
                    allQuestions: Ques.filter(item => console.log('444444444',item.description && item.description.toLowerCase().match(searchText))),
                })
            }else{
                this.getAllQuestions(this.state.userProfileId)
            }
        }else if(this.state.Mactive === true){
            const searchText = text.toLowerCase();
            let Ques = this.state.allQuestions;
            
            if( searchText !== "" && searchText.length > 1){
                this.setState({
                    allQuestions: Ques.filter(item => item.description && item.description.toLowerCase().match(searchText)),
                })
            }else{
                this.getMyQuestions(this.state.userProfileId)
            }
        }else if(this.state.Aactive === true){
            const searchText = text.toLowerCase();
            let Ques = this.state.allQuestions;
            
            if( searchText !== "" && searchText.length > 1){
                this.setState({
                    allQuestions: Ques.filter(item => item.description && item.description.toLowerCase().match(searchText)),
                })
            }else{
                this.getMyAnswers(this.state.userProfileId)
            }
        }
        console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiii---------',this.state.allQuestions)
    }

    render(){
        return(
            <View style={styles.container}>
                <LinearGradient
                    colors={['#ff5566', '#ff5566']}
                    style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height:1000,
                    }}
                >
                    <View style={[styles.headerr, {paddingTop: 0}]}>
                        <Feather name="chevron-left" size={24} color="#ffff" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} onPress={() => this.props.navigation.navigate("Home")} />
                        <Text allowFontScaling={false} style={[styles.heading]}>Community</Text>
                        <Feather name="edit" size={24} color="#fff" style={{zIndex: 999999, padding:6, paddingHorizontal:0}} onPress={() => this.props.navigation.navigate("PostQuestion")}/>
                    </View>

                    <View style={[styles.card]}>
                    
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{flexDirection:"row", justifyContent:"space-evenly", marginTop:16}}>
                                <TouchableOpacity style={!this.state.Qactive ? styles.inActive : styles.active} onPress={() => this.getAllQuestions(this.state.userProfileId)}>
                                    <Ionicons name="ios-browsers" size={24} color= {!this.state.Qactive ? "#767676" : "#f56"} />
                                    <Text allowFontScaling={false} style={{fontFamily:"Futura", paddingLeft:6, color:"#f56", paddingTop:3, display:!this.state.Qactive ? "none" : "flex"}}>Questions</Text>
                                </TouchableOpacity>


                                <TouchableOpacity style={!this.state.Mactive ? styles.inActive : styles.active} onPress={() => this.getMyQuestions(this.state.userProfileId)}>
                                    <Ionicons name="ios-cube" size={24} color= {!this.state.Mactive ? "#767676" : "#f56"} />
                                    <Text allowFontScaling={false} style={{fontFamily:"Futura", paddingLeft:6, color:"#f56", paddingTop:3,display:!this.state.Mactive ? "none" : "flex"}}>My Questions</Text>
                                </TouchableOpacity>


                                <TouchableOpacity style={!this.state.Aactive ? styles.inActive : styles.active} onPress={() => this.getMyAnswers(this.state.userProfileId)}>
                                    <Ionicons name="ios-chatboxes" size={24} color= {!this.state.Aactive ? "#767676" : "#f56"} />
                                    <Text allowFontScaling={false} style={{fontFamily:"Futura", paddingLeft:6, color:"#f56", paddingTop:3, display:!this.state.Aactive ? "none" : "flex"}}>Answers</Text>
                                </TouchableOpacity>
                                
                            </View>

                            <View style={{ paddingBottom:16}}>
                                <TextInput placeholder="Search Questions...." style={styles.search} onChangeText={(text) => this.search(text)} />
                                <TouchableOpacity>
                                    <Feather name="search" size={24} color="#171919" style={{position:"absolute", right:30, top:-40}} />
                                </TouchableOpacity>
                            </View>

                            <View style={{height:600, display: this.state.Qactive ? "flex" : "none" }}>
                                
                                <FlatList 
                                    style={{marginBottom:20}}
                                    data={this.state.allQuestions}
                                    keyExtractor={item => item.fkUserProfileID}
                                    renderItem={({item, index}) => this.renderAllQuestions(item, index)}
                                    />
                            </View>

                            <View style={{height:600, display: this.state.Mactive ? "flex" : "none" }}>

                                {this.state.myQuestions.length > 0 ?

                                    <FlatList 
                                        style={{marginBottom:20}}
                                        data={this.state.myQuestions}
                                        keyExtractor={item => item.fkUserProfileID}
                                        renderItem={({item, index}) => this.renderMyQuestions(item, index)}
                                    />
                                :
                                    <View style={{flex:1, justifyContent:"flex-start", alignItems:"center", marginTop:100}}>
                                        <Text allowFontScaling={false} style={{color:"#767676", fontFamily:"OpenSans", paddingHorizontal:16, textAlign:"center", paddingTop:10, fontSize:16}}>You haven't posted anything yet.</Text>
                                    </View>
                                }
                            </View>

                            <View style={{height:600, display: this.state.Aactive ? "flex" : "none" }}>

                                {this.state.myAnswers.length > 0 ?

                                    <FlatList 
                                        style={{marginBottom:20}}
                                        data={this.state.myAnswers}
                                        keyExtractor={item => item.fkUserProfileID}
                                        renderItem={({item, index}) => this.renderMyAnswers(item, index)}
                                    />
                                :
                                    <View style={{flex:1, justifyContent:"flex-start", alignItems:"center", marginTop:100}}>
                                        <Text allowFontScaling={false} style={{color:"#767676", fontFamily:"OpenSans", paddingHorizontal:16, textAlign:"center", paddingTop:10, fontSize:16}}>You haven't answered any questions yet.</Text>
                                    </View>
                                }
                            </View>

                            
                        </ScrollView>
                      
                        {/* <TouchableOpacity onPress={() => this.props.navigation.navigate("QuestionDetails")}>                            
                            <View style={{flexDirection:"row", padding:16, paddingBottom:8}}>
                                <Image style={{width:45, height:45, borderRadius:60, marginTop:2}} source={require('../assets/imgs/img2.jpg')} />
                                <Text allowFontScaling={false} style={styles.label}>Why is Good UI/UX Design so hard? Why is Good UI/UX Design so hard</Text>
                            </View>

                            <View style={styles.cardContainer}>
                                <View style={{flexDirection:"row", width:150, justifyContent:"space-between"}}>
                                    <View style={{flexDirection:"row"}}>
                                        <MaterialCommunityIcons name="comment-text-outline" size={20} color="#767676" />
                                        <Text allowFontScaling={false} style={{fontFamily:"OpenSans", paddingLeft:6,color:"#171919" }}>12</Text>
                                    </View>
                                    <View style={{flexDirection:"row", marginLeft:16}}>
                                        <MaterialCommunityIcons name="calendar-blank-outline" size={20} color="#767676" />
                                        <Text allowFontScaling={false} style={{fontFamily:"OpenSans", paddingLeft:4,color:"#171919" }}>02/12/2020</Text>
                                    </View>
                                </View>
                                <Text allowFontScaling={false} style={[styles.tags, {width:125, textAlign:"right"}]} numberOfLines={1} ellipsizeMode="tail">Design</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <View style={{flexDirection:"row", padding:16, marginTop:2, paddingBottom:8}}>
                                <Image style={{width:45, height:45, borderRadius:60}} source={require('../assets/imgs/bg-img1.jpg')} />
                                <Text allowFontScaling={false} style={styles.label}>What things should I not try in?</Text>
                            </View>

                            <View style={styles.cardContainer}>
                                <View style={{flexDirection:"row", width:150, justifyContent:"space-between"}}>
                                    <View style={{flexDirection:"row"}}>
                                        <MaterialCommunityIcons name="comment-text-outline" size={20} color="#171919" />
                                        <Text allowFontScaling={false} style={{fontFamily:"OpenSans", paddingLeft:6,color:"#767676" }}>30</Text>
                                    </View>
                                    <View style={{flexDirection:"row", marginLeft:16}}>
                                        <MaterialCommunityIcons name="calendar-blank-outline" size={20} color="#171919" />
                                        <Text allowFontScaling={false} style={{fontFamily:"OpenSans", paddingLeft:4,color:"#767676" }}>02/12/2020</Text>
                                    </View>
                                </View>
                                <Text allowFontScaling={false} style={styles.tags}>Transcription</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity>                
                            <View style={{flexDirection:"row", padding:16, marginTop:2, paddingBottom:8}}>
                                <Image style={{width:45, height:45, borderRadius:60}} source={require('../assets/imgs/bg-img1.jpg')} />
                                <Text allowFontScaling={false} style={styles.label}>Why is Good UI/UX Design so hard?</Text>
                            </View>

                            <View style={styles.cardContainer}>
                                <View style={{flexDirection:"row", width:150, justifyContent:"space-between"}}>
                                    <View style={{flexDirection:"row"}}>
                                        <MaterialCommunityIcons name="comment-text-outline" size={20} color="#171919" />
                                        <Text allowFontScaling={false} style={{fontFamily:"OpenSans", paddingLeft:6,color:"#767676" }}>12</Text>
                                    </View>
                                    <View style={{flexDirection:"row", marginLeft:16}}>
                                        <MaterialCommunityIcons name="calendar-blank-outline" size={20} color="#171919" />
                                        <Text allowFontScaling={false} style={{fontFamily:"OpenSans", paddingLeft:4,color:"#767676" }}>02/12/2020</Text>
                                    </View>
                                </View>
                                <Text allowFontScaling={false} style={styles.tags}>Design</Text>
                            </View>
                        </TouchableOpacity> */}

                        

                    </View>
                </LinearGradient>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
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
        lineHeight:18,
        paddingHorizontal:10,
        textAlignVertical:"center"
    },
    card:{
        backgroundColor:"#fff",
        borderRadius:24,
        marginTop:0,
        height:1000
    },
    cardContainer:{
        flexDirection:"row", 
        width:360, 
        justifyContent:"space-between", 
        paddingTop:0,
        borderBottomWidth:1, 
        borderBottomColor:"#efefef",
        paddingBottom:16,
        marginHorizontal:16,
        paddingLeft:56
    },
    active:{
        backgroundColor:"#fff",
        paddingHorizontal:16,
        paddingVertical:10,
        borderRadius:6,
        flexDirection:"row"
    },
    inActive:{
        flexDirection:"row",
        paddingTop:10,
    },
    search:{
        backgroundColor:"#efefef",
        color:"#171919",
        paddingLeft:16,
        marginHorizontal:16,
        borderRadius:10,
        height:50,
        marginTop:0,
        fontFamily:"OpenSans",
        marginTop:16
    },
    actionText:{
        fontFamily:"Futura",
        color:"#f56",
        backgroundColor:"#fff",
        marginTop:30,
        padding:30,
    }
})