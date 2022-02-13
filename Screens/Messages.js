import React from 'react'
import { View, Text, StyleSheet, ScrollView, Image, FlatList, Dimensions, ActivityIndicator,TouchableOpacity } from 'react-native'
import { FontAwesome, Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const window = Dimensions.get("window");

export default class Messages extends React.Component{

    state = {
        orderActive: false,
        projectActive: true,
        userId:"",
        projects:[],
        orders:[],
        userType:"",
        isLoadingProjects: true,
        isLoadingOrders: true,
        userProfileId:"",
        parseData:'',
        fkUserProfileId:""
    }

    componentDidMount = async() => {

        const userInfo = await AsyncStorage.getItem('userData');
        var parseData = await JSON.parse(userInfo);
        this.setState({ parseData: parseData })

        const userProfileId = await AsyncStorage.getItem('userPrfileId')
        if(userProfileId !== null){
            this.setState({ userProfileId })
        }

        const userId = await AsyncStorage.getItem('userId')
        if(userId !== null) {
            this.setState({ userId })
        }else{
            console.log("null")
        }

        const userType = await AsyncStorage.getItem('userType')
        if(userType !== null){
            this.setState({ userType })
        }

        console.log(userType);

        if(userType !== "4"){
            this.getMyProjects(userId);
        }else{
            this.getMyOrders(userId);
        }
        this.viewProfile(userId)
    }

    getMyProjects = (userId) => {

        this.setState({orderActive : false, projectActive: true , orders:[]} );
        
        fetch("http://demo.wiraa.com/api/Users/GetProjectMessages?userProfileId="+userId, {
            method: "GET"
        })
        .then(response => response.json())
        .then(responseJson => {
            // console.log('response json for get my project---',responseJson)
            let projects = [];
            responseJson.map(item => {
                projects.push({
                    userId: item.acceptedUserId,
                    id: item.id,
                    reqId: item.postreqID,
                    userName: item.userName,
                    occupation: item.designation,
                    desc: item.pR_Description,
                    profilePic: item.profilePic,
                    status: item.applyStatus,
                    response: item.responseNo,
                    isRead: item.isRead,
                })
                this.setState({ projects, isLoadingProjects: false })
                     console.log("==============>>>>>>>>>>>xxxxxxxxx", this.state.projects);
            })
            this.setState({isLoadingProjects: false})
        })
        .catch((error)=>{
            this.setState({isLoadingProjects: false})
            console.log(error)
        })
    }

    getMyOrders = (userId) => {

        this.setState({orderActive : true, projectActive: false , projects:[]});

        fetch("http://demo.wiraa.com/api/Users/GetOrderMessages?userProfileId="+userId, {
            method: "GET"
        })
        .then(response => response.json())
        .then(responseJson => {
            // console.log('response json for get my order',responseJson)
            let orders = [];
            responseJson.map(item => {
                orders.push({
                    userId: item.acceptedUserId,
                    id: item.id,
                    reqId: item.postreqID,
                    userName: item.userName,
                    occupation: item.designation,
                    desc: item.pR_Description,
                    profilePic: item.profilePic,
                    status: item.applyStatus,
                    response: item.responseNo,
                    isRead: item.isRead,
                })
                this.setState({ orders, isLoadingOrders: false })
            })
            this.setState({isLoadingOrders: false})
        })
        .catch((error)=>{
            this.setState({isLoadingOrders:false})
            console.log('error get order',error)
        })
    }

    viewProfile = (userId) => {

        fetch("http://demo.wiraa.com/api/Users/GetUsers?Id="+userId)
        .then(respone => respone.json())
        .then(responseJson => {
           this.setState({fkUserProfileId: responseJson.usersProfile.usersProfileID})
        })
    }

    // onPress={() => this.viewProfile(item.userId) } 

    renderProjects = (item, index) => {
        // console.log('items projects-----00000',item.userId)
   
        return(
            <View style={{width: window.width}}>
                <TouchableOpacity style={{backgroundColor: item.isRead ? "#fff" : "#efefef", borderBottomWidth:1,borderBottomColor: item.isRead ? "#efefef" : "#fff",}}
                 onPress={() => this.props.navigation.navigate("Conversation",
                  {id: item.reqId, senderUserId: item.userId, response: item.respone,
                   userName: item.userName,profilePic: item.profilePic, screenName:"Projects"
                    ,parseData:this.state.parseData , status:item.status, desc:item.desc, fkUserProfileId:this.state.fkUserProfileId})}>
                    <View style={{flexDirection:"row"}}>
                        <Image style={{width:50, height:50, borderRadius:10, margin:16, marginBottom:10, marginRight:10, marginTop:20}} source={{uri: item.profilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com/"+item.profilePic}} />
                        <View style={{flexDirection:"row", marginTop:8,flex:1, justifyContent:"space-between" }}>
                            <TouchableOpacity  >
                                <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={{fontFamily:"Futura", color:"#171919", fontSize:16, paddingTop:14, width:220}}>{item.userName}</Text>
                                <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {width:220, } ]}>{item.occupation}</Text>
                            </TouchableOpacity>
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color: item.status === "Running" ? "#f56" : "#aaaaaa", fontSize:12, paddingTop:18, paddingRight:20, fontStyle:"italic"}}>{item.status}</Text>
                        </View>
                    </View>
                    <Text allowFontScaling={false} numberOfLines={2} ellipsizeMode="tail" style={[styles.label, {color:"#171919", lineHeight: 15, paddingTop:2, marginHorizontal:16, marginBottom:16, marginRight:20}]}>{item.desc}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderOrders = (item, index) => {
        
        return(
            <View style={{width: window.width}}>
                <TouchableOpacity style={{backgroundColor: item.isRead ? "#fff" : "#efefef", borderBottomWidth:1, borderBottomColor: item.isRead ? "#efefef" : "#fff", marginTop:16}} onPress={() => this.props.navigation.navigate("Conversation", {id: item.reqId, senderUserId: item.userId, response: item.response,userName: item.userName, profilePic: item.profilePic,status:item.status,fkUserProfileId:this.state.fkUserProfileId})}>
                    <View style={{flexDirection:"row"}}>
                        <Image style={{width:50, height:50, borderRadius:10, margin:16, marginBottom:10, marginRight:10, marginTop:16}} source={{uri: item.profilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com/"+item.profilePic}} />
                        <View style={{flexDirection:"row", marginTop:8,flex:1, justifyContent:"space-between" }}>
                            <TouchableOpacity style={{zIndex:9999}}>
                                <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#171919", fontSize:16, paddingTop:14, width:200}}>{item.userName}</Text>
                                <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {width:200}]}>{item.occupation}</Text>
                            </TouchableOpacity>
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color: item.status === "Running" ? "#f56" : "#aaaaaa", fontSize:12, paddingTop:14, paddingRight:20, fontStyle:"italic"}}>{item.status}</Text>
                        </View>
                    </View>
                    <Text allowFontScaling={false} numberOfLines={2} ellipsizeMode="tail" style={[styles.label, {color:"#171919", lineHeight: 15, paddingTop:2, marginHorizontal:16, paddingBottom:10, marginRight:20}]}>{item.desc}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render(){

        if( this.state.projectActive && this.state.isLoadingProjects){
            return(
                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <ActivityIndicator size="large" color="#f56"/>
                </View>
            )
        }else if( this.state.orderActive && this.state.isLoadingOrders){
            return(
                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <ActivityIndicator size="large" color="#f56"/>
                </View>
            )
        }else{
            return(
                <View style={{flex:1}}>
                    <ScrollView contentContainerStyle={styles.container}>
                        <View style={styles.headerr}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{paddingTop:4}}>
                            <Feather name="chevron-left" size={24} color="#767676" style={{zIndex: 999999, padding:0}}/>
                            </TouchableOpacity>   
                            <Text allowFontScaling={false} style={styles.heading}>Messages</Text>
                            <Ionicons name="md-mail" size={24} color="#f56" style={{paddingTop:10, paddingLeft:0}} />
                        </View>
    
                        <View style={{flexDirection:"row", justifyContent:"space-evenly", alignSelf:"stretch", paddingBottom:10, display: this.state.userType === "3" ? "flex" : "none"}}>
                            <TouchableOpacity style={{borderBottomWidth: this.state.projectActive === true ? 3 : 0, borderBottomColor:"#f56", padding:10, paddingTop:0}} onPress={() => this.getMyProjects(this.state.userId)}>
                                <Text allowFontScaling={false} style={[styles.name, {fontFamily:"OpenSans", fontSize:18}]}>My Projects</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{borderBottomWidth: this.state.orderActive === true ? 3 : 0, borderBottomColor:"#f56",padding:10, paddingTop:0}} onPress={() => this.getMyOrders(this.state.userId)}>
                                <Text allowFontScaling={false} style={[styles.name, {fontFamily:"OpenSans", fontSize:18}]}>My Orders</Text>
                            </TouchableOpacity>
                        </View>
    
                        {this.state.projects.length > 0 && this.state.orders.length > 0 ?
                            <View>
                                <View style={{flex:1, display: this.state.projectActive === true ? "flex" : "none", paddingBottom:6}}>
                                    <FlatList 
                                        data={this.state.projects}
                                        keyExtractor={item => item.id}
                                        renderItem={({item, index}) => this.renderProjects(item, index)}
                                    />
                                </View>
    
                                <View style={{flex:1, display: this.state.orderActive === true ? "flex" : "none", paddingBottom:6}}>
                                    <FlatList 
                                        data={this.state.orders}
                                        keyExtractor={item => item.id}
                                        renderItem={({item, index}) => this.renderOrders(item, index)}
                                    />
                                </View>
                            </View>
    
                        :   this.state.projects.length > 0 && this.state.orders.length <= 0 ?
                                <View style={{flex:1, display: this.state.projectActive === true ? "flex" : "none", paddingBottom:6}}>
                                    <FlatList 
                                        data={this.state.projects}
                                        keyExtractor={item => item.id}
                                        renderItem={({item, index}) => this.renderProjects(item, index)}
                                    />
                                </View>
    
                        :   this.state.orders.length > 0 && this.state.projects.length <= 0 ?
                                <View style={{flex:1, display: this.state.orderActive === true ? "flex" : "none", paddingBottom:6}}>
                                    <FlatList 
                                        data={this.state.orders}
                                        keyExtractor={item => item.id}
                                        renderItem={({item, index}) => this.renderOrders(item, index)}
                                    />
                                </View>
                        
                        :
                            <View style={{ flex:1, justifyContent:"center", alignSelf:"center"}}  >
                                <Text allowFontScaling={false} style={[styles.heading, {color:"#f56"}]}>No New Messages!</Text>
                                <Text allowFontScaling={false} style={{color:"#767676", fontFamily:"OpenSans", paddingHorizontal:16, textAlign:"center", paddingTop:10}}>Check this section for future updates.</Text>
                            </View>
                        }
        
                    </ScrollView>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    headerr:{
        flexDirection:"row",
        paddingTop:40, 
        alignSelf:"stretch", 
        justifyContent:"space-between", 
        paddingBottom:6,
        borderBottomWidth:1,
        borderBottomColor:"#efefef",
        paddingHorizontal:16,
    },
    heading:{
        fontFamily:"Futura",
        fontSize:22,
        marginTop:6,
        textAlign:"center",
        color:"#171919",
    },
    name:{
        fontFamily:"Futura",
        color:"#171919",
        padding:16,
        paddingBottom:0,
        fontSize:20,
    },
    label:{
        color:"#767676",
        fontFamily:"OpenSans",
        fontSize:14,
        fontWeight:"normal"
    },
    labell:{
        color:"#767676",
        fontFamily:"OpenSans",
        fontSize:12,
    },

})