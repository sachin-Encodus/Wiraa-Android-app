import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, Keyboard, ToastAndroid, ActivityIndicator, Animated } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialCommunityIcons, Foundation, Feather, Ionicons } from '@expo/vector-icons';
import { TextInput,RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { widthPercentageToDP  ,heightPercentageToDP } from 'react-native-responsive-screen';

export default class Admin extends React.Component{

    state = {
        profilePic: null,
        userType:"",
        packageName:'',
        packageConnects:'',
        isMonthly:'',
        packagePrice:'',
        validUpTo:'',
        proStatus:'',
        isLoading: false,
    }

    componentDidMount = async() => {
         this.setState({isLoading:true})
        const userType = await AsyncStorage.getItem('userType')
        if(userType !== null){
            this.setState({ userType })
        }

        const userId = await AsyncStorage.getItem('userId')

        this.getUserPackage(userId)
        this.getProRequestStatus(userId)
       
    }
    
    getProRequestStatus=async(userId)=>{
     
        fetch("http://demo.wiraa.com/api/post/CheckProRequestStatus?userId=" + userId, {
         method: "GET",
       })
       .then((respone)=>respone.json())
       .then((responseJson)=>{
         console.log('response get pro-----------------------',responseJson)
         if (responseJson === null){
             console.log('response get pro',responseJson)
         } else  {
           this.setState({proStatus:responseJson.status})
         }
       })
       .catch((error)=>{
         alert(error)
         console.log('error get pro request status--->>>',error)
       })  
     }


    getUserPackage=async(userId)=>{
        fetch("http://demo.wiraa.com/api/users/GetUserPackages?UserId="+userId,{

        })
        .then((response) => response.json())
        .then((response)=>{
            response.map((item)=>{
                this.setState({ 
                    packageName:item.pac.name,
                    packageConnects:item.up.connects,
                    isMonthly:item.up.isMonthly,
                    packagePrice:item.up.price,
                    validUpTo:item.up.endDate.slice(0,10)            
                 })
            })
              this.setState({isLoading:false})
        })
        .catch((error)=>{
            console.log('error package',error)
        })
    }





    render(){
// console.log("Admin console--->>>",this.props.navigation)
        if(this.state.isLoading === true){
            return(
                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <ActivityIndicator size="large" color="#f56"/>
                </View>
            )
        }else{
            return(
                <View style={styles.container}>
                   
                    <View style={styles.headerr}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} style={{paddingTop:4}}>
                            <Image style={{width:32, height:32, borderRadius:30}} source={{uri: this.state.profilePic !== null ? "http://demo.wiraa.com"+this.state.profilePic : "http://demo.wiraa.com/Content/img/boys-avtar.jpg"}} />
                        </TouchableOpacity>   
                        <Text allowFontScaling={false} style={styles.heading}>Dashboard</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Messages")}>
                            <Ionicons name="md-mail" size={24} color="#767676" style={{paddingTop:10, paddingLeft:0}} />
                        </TouchableOpacity>
                    </View>

                    {/* <View style={{flexDirection:"row", justifyContent:"center", alignSelf:"center"}}>
                        <Image style={{width:60, height:60, borderRadius:30, marginTop:16}} source={{uri: this.state.profilePic !== null ? "http://demo.wiraa.com"+this.state.profilePic : "http://demo.wiraa.com/Content/img/boys-avtar.jpg"}} />
                        <View style={{padding:10, paddingTop:24}}>
                            <Text style={styles.name}>Micro IT Solutions</Text>
                            <Text style={styles.label}>IT Company</Text>
                        </View>
                    </View> */}
                <ScrollView>
                    <TouchableOpacity style={{ width:widthPercentageToDP(90), marginBottom:16, display: this.state.userType === "3" ? "none" : "flex", paddingBottom:10, backgroundColor:"#f56", marginHorizontal:widthPercentageToDP(5), borderRadius:10, marginTop:16}} onPress={() => this.state.proStatus === "PENDING" ? alert('Congratulations. \n Your account has been sent for approval. \n Please Wait!') : this.props.navigation.navigate("BusinessUser") }>
                            <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:0, height:150}}>
                                <View style={{marginTop:20}}>
                                    <Text allowFontScaling={false} style={[styles.name, {color:"#fff", fontSize:28, paddingTop:0, lineHeight:30}]}> Become a {"\n"} Professional</Text>
                                    <TouchableOpacity style={{backgroundColor:"#00203f", padding: 10, paddingHorizontal:24, borderRadius:6, alignSelf:"flex-start", elevation:10, marginTop:16, marginLeft:32}}  onPress={() => this.state.proStatus === "PENDING" ? alert('Congratulations. \n Your account has been sent for approval. \n Please Wait!') : this.props.navigation.navigate("BusinessUser") }>
                                        <Text allowFontScaling={false} style={[styles.label, {color:"#fff", fontFamily:"OpenSans"}]}>APPLY</Text>
                                    </TouchableOpacity>
                                </View>
                                <Image source={require('../assets/imgs/img.png')} style={{ width:widthPercentageToDP(45.5), height:heightPercentageToDP(16), position:"absolute", bottom:-50, right:0}} />
                            </View>
                        </TouchableOpacity>
                    <View style={{ display: this.state.userType === "4" ? "none" : "flex"}}>
                        <Text style={[styles.heading, {padding:16, paddingBottom:0, fontSize:18, textAlign:"left"}]}>Current Plan</Text>
                        <View style={{flexDirection:"row", justifyContent:"space-evenly", flexWrap:"wrap"}}>
                        <View style={{marginTop:"3%",overflow:'hidden'}}>
                        <LinearGradient
                                    // Button Linear Gradient
                                    colors={
                                        this.state.packageName === "Basic"
                                          ? ["#F4A3F1", "#FC5B87"]
                                          : this.state.packageName === "Plus"
                                          ? ["#fc4a1a", "#f7b733"]
                                          : this.state.packageName === "Premium"
                                          ? ["#00c6ff", "#0072ff"]
                                          : ["#F4A3F1", "#FC5B87"]
                                      }
                                      start={{ x: -1, y: 3 }}
                                      end={{ x: 1, y: 0 }}
                                    style={{backgroundColor:"#efefef",width:170,padding:'10%',borderRadius:10,}}
                                    >

                                
                                <Text style={[styles.name, {color:"#fff", textAlign:"center"}]}>{this.state.packageName}</Text>
                                <Text style={[styles.label, {color:"#fff", textAlign:"center"}]}>Plan</Text>
                            

                             </LinearGradient>
                             </View>


                            <View style={{backgroundColor:"#efefef", width:170, padding:16, borderRadius:10, marginTop:10,elevation:10}}>
                                <Text style={[styles.name, {color:"#171919", textAlign:"center"}]}>{this.state.packageConnects}</Text>
                                <Text style={[styles.label, {color:"#767676", textAlign:"center"}]}>Connects</Text>
                            </View>
                            <View style={{backgroundColor:"#efefef", width:170, padding:16, borderRadius:10, marginTop:16,elevation:10}}>
                                <Text style={[styles.name, {color:"#171919", textAlign:"center"}]}>{this.state.validUpTo}</Text>
                                <Text style={[styles.label, {color:"#767676", textAlign:"center"}]}>Due On</Text>
                            </View>
                            <View style={{backgroundColor:"#efefef", width:170, padding:16, borderRadius:10, marginTop:16,elevation:10}}>
                                <Text style={[styles.name, {color:"#171919", textAlign:"center"}]}>{this.state.isMonthly == true ? `${"Monthly"}` : `${"Quarterly"}`}</Text>
                                <Text style={[styles.label, {color:"#767676", textAlign:"center"}]}>Validity</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={{alignSelf:"stretch",marginBottom:"4%"}} onPress={() => this.props.navigation.navigate("Pricing")}>
                        <LinearGradient
                      // Button Linear Gradient
                      start={[0.4, 0.3]}
                      colors={["#EF4845", "#A22DB3"]}
                      style={styles.btn}
                    >
                            <Text style={styles.btntxt}>UPGRADE</Text>
                    </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={{width:widthPercentageToDP(90),alignSelf:"center", display: this.state.userType === "4" ? "flex" : "none"}}>
                        <Text style={[styles.heading, {padding:16, paddingBottom:0, fontSize: widthPercentageToDP(5), textAlign:"left"}]}>Manage Orders</Text>
                        <View style={{paddingTop:10}}>
                            <TouchableOpacity style={{flexDirection:"row",backgroundColor:"#fff",height:90,justifyContent:"space-between",padding:30,marginVertical:"2%",elevation:5,borderRadius:10}} onPress={()=>this.props.navigation.push("Manage",{myOrder:"MYORDER"})}>
                                <Text style={styles.labell}>My Orders</Text>
                                <Ionicons style={{justifyContent:'center'}} name="ios-arrow-forward" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection:"row",backgroundColor:"#fff",height:90,justifyContent:"space-between",padding:30,marginVertical:"2%",elevation:5,borderRadius:10}} onPress={() => this.props.navigation.navigate("PostRequest")}>
                                <Text style={styles.labell}>Post a Request</Text>
                                <Ionicons style={{justifyContent:'center'}} name="ios-arrow-forward" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{width:widthPercentageToDP(90), alignSelf:"center"}}>
                        <Text style={[styles.heading, {padding:16, paddingBottom:0, fontSize:widthPercentageToDP(5), textAlign:"left"}]}>Manage Projects</Text>
                        <View style={{paddingTop:10,}}>
                            <TouchableOpacity style={{flexDirection:"row",backgroundColor:"#fff",height:90,justifyContent:"space-between",padding:30,marginVertical:"2%",elevation:5,borderRadius:10}} onPress={()=>this.props.navigation.push("Manage",{projectType:"ONLINE"})}>
                                <Text style={styles.labell}>Global Projects</Text>
                                <Ionicons style={{justifyContent:'center'}} name="ios-arrow-forward" style={{marginLeft:"auto"}} size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection:"row",backgroundColor:"#fff",height:90,justifyContent:"space-between",padding:30,marginVertical:"2%",elevation:5,borderRadius:10}} onPress={()=>this.props.navigation.push("Manage",{projectType:"FACE2FACE"})}>
                                <Text style={styles.labell}>Local Projects</Text>
                                <Ionicons style={{justifyContent:'center'}} name="ios-arrow-forward" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={{width:widthPercentageToDP(90), alignSelf:"center", display: this.state.userType === "4" ? "none" : "flex"}}>
                        <Text style={[styles.heading, {padding:16, paddingBottom:0, fontSize:widthPercentageToDP(5), textAlign:"left"}]}>Manage Orders</Text>
                        <View style={{paddingTop:10}}>
                            <TouchableOpacity style={{flexDirection:"row",backgroundColor:"#fff",height:90,justifyContent:"space-between",padding:30,marginVertical:"2%",elevation:5,borderRadius:10}} onPress={()=>this.props.navigation.push("Manage",{myOrder:"MYORDER"})}>
                                <Text style={styles.labell}>My Orders</Text>
                                <Ionicons name="ios-arrow-forward" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection:"row",backgroundColor:"#fff",height:90,justifyContent:"space-between",padding:30,marginVertical:"2%",elevation:5,borderRadius:10}} onPress={() => this.props.navigation.navigate("PostRequest")}>
                                <Text style={styles.labell}>Post a Request</Text>
                                <Ionicons name="ios-arrow-forward" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{marginBottom:"8%"}}></View>
                    </ScrollView>
                </View>
            )
        // }
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
        paddingTop:45, 
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
      
        textAlign:"center",
        color:"#171919",
    },
    name:{
        color:"#171919",
        fontFamily:"Futura",
        fontSize:16,
    },
    label:{
        color:"#767676",
        fontFamily:"OpenSans",
        fontSize:widthPercentageToDP(4),
    },
    labell:{
        color:"black",
        fontFamily:"OpenSans",
        fontSize:widthPercentageToDP(4),
        justifyContent:'center',
        fontWeight:"bold",
        marginTop:5
    },
    
    card:{
        flexDirection:"row",
        marginHorizontal:0,
        paddingVertical:6,
        borderBottomWidth:1,
    },
    
    actionText:{
        fontFamily:"Futura",
        color:"#f56",
        backgroundColor:"#fff",
        marginTop:10,
        padding:20,
    },
    btn:{
        // backgroundColor:"#171919",
        borderRadius:10,
        padding:16,
        elevation:6,
        marginHorizontal:16,
        marginBottom:0
    },
    btntxt:{
        textAlign:"center",
        fontSize:18,
        fontWeight:"bold",
        color:"#fff",
        fontFamily:"Futura",

    },
})