import React from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native'
import { Feather, Ionicons, AntDesign,MaterialIcons,Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ProjectDetails extends React.Component{

    state = {
        isModalVisible:false,
        details:[],
        month:"",
        year:"",
        day:"",
        contacted:[],
        userId:"",
        acceptedModal: false,
        userProfileId:"",
        userType:"",
        acceptedModal1:false,
        isLoading:false,
    
    }

    componentDidMount = async() => {

    const userType = await AsyncStorage.getItem('userType')
            if(userType !== null){
                this.setState({ userType })
                }
        this.getUserId();
        this.getProjectDetail()
    }

    

    getProjectDetail = () =>{
        this.setState({isLoading:true})
        const { id ,date } = this.props.route.params;
        // alert(id)
        fetch("http://demo.wiraa.com/API/Project/GetProjectDetail?Id="+id,{
            method: 'GET'
            //Request Type 
        })
        .then((response) => response.json())
        //If response is in json then in success
        .then((responseJson) => {
            //Success 
            let details = [];
            responseJson.map(item => {
                  console.log('post status ---',item.postStatus,item.postreqID) 
                details.push({
                    status:item.postStatus,
                    startDate: item.serviceStartDate === "null/null/null"
                    ? date[0].split(" ")
                    : item.serviceStartDate.split(" "),
                    dueDate: item.postExpireDate.split("T"),
                    orderNum: item.postreqID,
                    desc: item.pR_Description,
                    mode: item.serviceMode,
                    loc: item.city,
                    preferred : item.preferService,
                    budget: item.budget,
                    workType: item.workType,
                    res: item.responseNo,
                    firstName:item.firstName,
                    lastName:item.lastName,
                    Email:item.loginEmail,
                    contactNo:item.contactNo,
                    id: id,
                    
                })
            })
            this.setState({isLoading:false})
            this.setState({ details })
        })
        //If response is not in json then in error
        .catch((error) => {
            //Error 
            console.log(error);
            this.setState({isLoading:false})
        });
    }

    getUserId = async() => {
        const userId = await AsyncStorage.getItem('userId')
        if(userId !== null) {
            this.setState({ userId })
        }else{
            console.log("null")
        }

        const userProfileId = await AsyncStorage.getItem('userPrfileId')
        if(userProfileId !== null){
            this.setState({ userProfileId })
        }
    }

    acceptProject = (userId) => {
        console.log("======>>>>>>>>>>>>>>>>");
        const { id } = this.props.route.params;
        console.log('id---',userId)
        fetch("http://demo.wiraa.com/api/post/AcceptOrder?userId="+userId+"&projectId="+id,{
            method: "POST"
        })
        .then(response => response.json())
        .then(responseJson => {
            console.log('accept project response---',responseJson)
            this.setState({ 
                        acceptedModal: false,  
                        details: this.state.details.map((item)=>
                        item.id === id ? {...item, status : responseJson.applyStatus , res:item.res + 1}  
                    :
                        item 
                        )}) 


            this.props.route.params.onRefresh({     
                refresh: true,
                detail: {
                    id: id,
                    status: this.state.details.map(item => item.id === id ? responseJson.applyStatus : "" ),
                      response: this.state.details.map(item => item.id === id ? item.res + 1 : "" ),
                    mode: this.state.details.map(item => item.id === id ? item.mode : "" ),
                }
            });


            console.log("=====>>>>>>>>>>>>>> hello");
            this.props.navigation.goBack()
        //       this.getUserId();
        // this.getProjectDetail()
        })   
        .catch((error)=>{
            console.log('error accept project---',error)
        })
    }

    converse = () => {
        const { id, senderUserId, userName, profilePic, status} = this.props.route.params;
        
        this.props.navigation.navigate("Conversation", {id: id, senderUserId: senderUserId, screenName: "Projects" , userName, profilePic, status ,userData:this.state.details});    
        this.setState({isModalVisible: false})
            
    }

    becomePro =() =>{
        this.props.navigation.navigate("BusinessUser")
        this.setState({acceptedModal1: false})
    }

    render(){
        const {status,params,date} = this.props.route.params;
        console.log('params project details--->>>>',this.props.route.params)
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
                    <Feather name="chevron-left" size={24} color="#767676" style={{zIndex: 999999, paddingTop:6}} onPress={() => this.props.navigation.goBack()} />
                    <Text allowFontScaling={false} style={[styles.heading, {}]}>Project Details</Text>
                    <Feather name="info" size={24} color="#fff" style={{zIndex: 999999, padding:6}} onPress={() => this.props.navigation.goBack()} />
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor:this.state.acceptedModal1 && this.state.acceptedModal ? "#000" : "#fff", opacity:this.state.acceptedModal1 && this.state.acceptedModal ? 0.2 : 1}}>
                    <View style={{ borderBottomWidth:3, borderBottomColor:"#efefef", paddingBottom:16   }}>

                        {this.state.details.map(item => {
                        
                      return(
                           <View style={[styles.topcard, { backgroundColor:"#efefef", margin:16, padding:10, paddingHorizontal:0, borderRadius:10,}]}>
                                <View>
                                    <View style={{flexDirection:"row", justifyContent:"space-between", padding:10, paddingHorizontal:0}}>
                                        <View style={{flexDirection:"row", justifyContent:"space-between", marginLeft:10}}>
                                            <Ionicons name="md-disc" size={20} color="#767676" />
                                            <Text allowFontScaling={false} style={[styles.label, {paddingLeft:6}]}>Status:</Text>
                                        </View>
                                        <Text allowFontScaling={false} style={[styles.name, {fontSize:16, paddingTop:0, color: status === "Active" ? "#449d44" : status === "Running" ? "#f56" : "#aaaaaa" }]}>{status}</Text>
                                    </View>
                                    <View style={{flexDirection:"row", justifyContent:"space-between", padding:10, paddingHorizontal:0}}>
                                        <View style={{flexDirection:"row", justifyContent:"space-between", marginLeft:10}}>
                                            <Feather name="user" size={20} color="#767676" />
                                            <Text allowFontScaling={false} style={[styles.label, {paddingLeft:6}]}>Name:</Text>
                                        </View>
                                        <Text allowFontScaling={false} style={[styles.name, {fontSize:14, paddingTop:0, fontFamily:"OpenSans"}]}>{status === "Active" ? '---' : item.firstName +' '+ item.lastName }</Text>
                                    </View>
                                    {
                                        item.Email !==null ?
                                        <View style={{flexDirection:"row", justifyContent:"space-between", padding:10, paddingHorizontal:0}}>
                                        <View style={{flexDirection:"row", justifyContent:"space-between", marginLeft:10}}>
                                             <MaterialIcons name="email" size={20} color="#767676" />
                                            <Text allowFontScaling={false} style={[styles.label, {paddingLeft:6}]}>Email:</Text>
                                        </View>
                                        <Text allowFontScaling={false} style={[styles.name, {fontSize:14, paddingTop:0, fontFamily:"OpenSans"}]}>{ status === "Active" ? '---' : item.Email !== null ? item.Email : '---'}</Text>
                                    </View>
                                    :
                                    null
                                    }
                                    {
                                        item.contactNo !== null ?
                                        <View style={{flexDirection:"row", justifyContent:"space-between", padding:10, paddingHorizontal:0}}>
                                        <View style={{flexDirection:"row", justifyContent:"space-between", marginLeft:10}}>
                                            <Entypo name="mobile" size={20} color="#767676" />
                                            <Text allowFontScaling={false} style={[styles.label, {paddingLeft:6}]}>Contact no:</Text>
                                        </View>
                                        <Text allowFontScaling={false} style={[styles.name, {fontSize:14, paddingTop:0, fontFamily:"OpenSans"}]}>{status === "Active" ? '---' : item.contactNo !== null ? item.contactNo : '---' }</Text>
                                    </View>
                                    :
                                    null
                                    }
                                    <View style={{flexDirection:"row", justifyContent:"space-between", padding:10, paddingHorizontal:0}}>
                                        <View style={{flexDirection:"row", justifyContent:"space-between", marginLeft:10}}>
                                            <Ionicons name="md-calendar" size={20} color="#767676" />
                                            <Text allowFontScaling={false} style={[styles.label, {paddingLeft:6}]}>Order Date:</Text>
                                        </View>
                                        <Text allowFontScaling={false} style={[styles.name, {fontSize:14, paddingTop:0, fontFamily:"OpenSans"}]}>{item.startDate[0]}</Text>
                                    </View>
                                    <View style={{flexDirection:"row", justifyContent:"space-between", padding:10, paddingHorizontal:0}}>
                                        <View style={{flexDirection:"row", justifyContent:"space-between", marginLeft:10}}>
                                            <Ionicons name="md-calendar" size={20} color="#767676" />
                                            <Text allowFontScaling={false} style={[styles.label, {paddingLeft:6}]}>Due On:</Text>
                                        </View>
                                        <Text allowFontScaling={false} style={[styles.name, {fontSize:14, paddingTop:0, fontFamily:"OpenSans"}]}>{item.dueDate[0]}</Text>
                                    </View>
                                    <View style={{flexDirection:"row", justifyContent:"space-between", padding:10, paddingHorizontal:0}}>
                                        <View style={{flexDirection:"row", justifyContent:"space-between", marginLeft:10}}>
                                            {/* <Ionicons name="md-contacts" size={20} color="#767676" /> */}
                                            <AntDesign name="contacts" size={20} color="#767676" />
                                            <Text allowFontScaling={false} style={[styles.label, {paddingLeft:6}]}>Response:</Text>
                                        </View>
                                        <Text allowFontScaling={false} style={[styles.name, {fontSize:14, paddingTop:0, fontFamily:"OpenSans"}]}>{item.res}/7</Text>
                                    </View>
                                    <View style={{flexDirection:"row", justifyContent:"space-between", padding:10, paddingHorizontal:0}}>
                                        <View style={{flexDirection:"row", justifyContent:"space-between", marginLeft:10}}>
                                            {/* <Ionicons name="md-filing" size={20} color="#767676" /> */}
                                            <MaterialIcons name="confirmation-number" size={20} color="#767676"/>
                                            <Text allowFontScaling={false} style={[styles.label, {paddingLeft:6}]}>Order Number:</Text>
                                        </View>
                                        <Text allowFontScaling={false} style={[styles.name, {fontSize:14, paddingTop:0, fontFamily:"OpenSans"}]}>#OrNo{item.id}</Text>
                                    </View>
                                </View>


                                {this.state.userType === "3" ?
                                
                                    <View>
                                        {/* <TouchableOpacity style={[styles.btn, {display: item.status === "Active" ? "none" : "flex", borderRadius:10, alignSelf:"center", marginVertical:16, backgroundColor: item.status === "Closed" ? "#aaaaaa" : "#d9534f" }]}>
                                            <Text allowFontScaling={false} style={styles.btntxt}> {item.status === "Closed" ? "CLOSED" : "CLOSE" } </Text>
                                        </TouchableOpacity> */}
                                        <TouchableOpacity onPress={() => this.setState({ acceptedModal: true })} style={[styles.btn, { display: status === "Active" ? "flex" : "none", borderRadius:10, alignSelf:"center", marginTop:16, marginBottom:6, backgroundColor: "#78C07B" }]}>
                                            <Text allowFontScaling={false} style={styles.btntxt}> ACCEPT </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[styles.btn, {display: status === "Active" ? "flex" : "none", borderRadius:10, alignSelf:"center", marginTop:6, marginBottom:16, backgroundColor: "#d9534f" }]}>
                                            <Text allowFontScaling={false} style={styles.btntxt}> REJECT </Text>
                                        </TouchableOpacity>

                                        {/* <View style={[styles.btn, {display: status === "Running" ? "flex" : "none", alignSelf:"center", marginTop:6, marginBottom:16, backgroundColor: "#449d44"  }]}>
                                            <Text allowFontScaling={false} style={styles.btntxt}> ACCEPTED </Text>
                                        </View> */}
                                         <TouchableOpacity style={[styles.btn, {display: status === "Running" ? "flex" : "none", alignSelf:"center", marginTop:6, marginBottom:16, backgroundColor: "#449d44"  }]} onPress={() => this.converse()}>
                                            <Text allowFontScaling={false} style={styles.btntxt}>
                                                LET'S CHAT
                                            </Text>   
                                         </TouchableOpacity>

                                        <View style={[styles.btn, {display: status === "Closed" ? "flex" : "none", borderRadius:10, alignSelf:"center", marginTop:6, marginBottom:16, backgroundColor: "#aaaaaa"  }]}>
                                            <Text allowFontScaling={false} style={styles.btntxt}> CLOSED </Text>
                                        </View>
                                        <TouchableOpacity style={[styles.btn, {display: status === "Closed" ? "flex" : "none", alignSelf:"center", marginTop:6, marginBottom:16, backgroundColor: "#449d44"  }]} onPress={() => this.converse()}>
                                        <Text allowFontScaling={false} style={styles.btntxt}>LET'S CHAT</Text>
                                        </TouchableOpacity>
        
                                    </View>

                                :

                                <View>
                                {/* <TouchableOpacity style={[styles.btn, {display: item.status === "Active" ? "none" : "flex", borderRadius:10, alignSelf:"center", marginVertical:16, backgroundColor: item.status === "Closed" ? "#aaaaaa" : "#d9534f" }]}>
                                    <Text allowFontScaling={false} style={styles.btntxt}> {item.status === "Closed" ? "CLOSED" : "CLOSE" } </Text>
                                </TouchableOpacity> */}

                                <TouchableOpacity onPress={() => this.setState({ acceptedModal1: true })} style={[styles.btn, { display: status === "Active" ? "flex" : "none", borderRadius:10, alignSelf:"center", marginTop:16, marginBottom:6, backgroundColor: "#78C07B" }]}>
                                    <Text allowFontScaling={false} style={styles.btntxt}> ACCEPT </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[styles.btn, {display: status === "Active" ? "flex" : "none", borderRadius:10, alignSelf:"center", marginTop:6, marginBottom:16, backgroundColor: "#d9534f" }]}>
                                    <Text allowFontScaling={false} style={styles.btntxt}> REJECT </Text>
                                </TouchableOpacity>

                                {/* <View style={[styles.btn, {display: status === "Running" ? "flex" : "none", alignSelf:"center", marginTop:6, marginBottom:16, backgroundColor: "#449d44"  }]}>
                                    <Text allowFontScaling={false} style={styles.btntxt}> ACCEPTED </Text>
                                </View> */}
                                 {/* <TouchableOpacity style={[styles.btn, {display: item.status === "Running" ? "flex" : "none", alignSelf:"center", marginTop:6, marginBottom:16, backgroundColor: "#449d44"  }]} onPress={() => this.converse()}>
                                    <Text allowFontScaling={false} style={styles.btntxt}>
                                        LET'S CHAT
                                    </Text>   
                                 </TouchableOpacity>

                                <View style={[styles.btn, {display: item.status === "Closed" ? "flex" : "none", borderRadius:10, alignSelf:"center", marginTop:6, marginBottom:16, backgroundColor: "#aaaaaa"  }]}>
                                    <Text allowFontScaling={false} style={styles.btntxt}> CLOSED </Text>
                                </View>
                                <TouchableOpacity style={[styles.btn, {display: item.status === "Closed" ? "flex" : "none", alignSelf:"center", marginTop:6, marginBottom:16, backgroundColor: "#449d44"  }]} onPress={() => this.converse()}>
                                <Text allowFontScaling={false} style={styles.btntxt}>LET'S CHAT</Text>
                                </TouchableOpacity> */}

                            </View>

                                }
                                
                            </View>
                            )
                        }
                            
                        )}
                    </View>

                    <Text allowFontScaling={false} style={[styles.name, {alignSelf:"flex-start", marginLeft:16, paddingHorizontal:0, fontSize:20}]}>Requirements</Text>

                    {this.state.details.map(item => (
                        <View style={[styles.topcard, {marginHorizontal:0, paddingHorizontal:0, margin:16}]}>
                            <View style={{borderBottomWidth:1, borderBottomColor:"#efefef", paddingBottom:10}}>
                                <Text allowFontScaling={false} style={styles.name}>Description</Text>
                                <Text allowFontScaling={false} style={[styles.label, {paddingLeft:24, marginRight:10}]}>{item.desc}</Text>
                            </View>
                            <View style={{borderBottomWidth:1, borderBottomColor:"#efefef", paddingBottom:10}}>
                                <Text allowFontScaling={false} style={styles.name}>Selected Category</Text>
                                <Text allowFontScaling={false} style={[styles.label, {paddingLeft:24, marginRight:10}]}>Legal - Business Consultant</Text>
                            </View>
                            <View style={{borderBottomWidth:1, borderBottomColor:"#efefef", paddingBottom:10}}>
                                <Text allowFontScaling={false} style={styles.name}>Mode of Service</Text>
                                <Text allowFontScaling={false} style={[styles.label, {paddingLeft:24, marginRight:10}]}>{item.mode}</Text>
                            </View>
                            <View style={{borderBottomWidth:1, borderBottomColor:"#efefef", paddingBottom:10, display: item.loc !== "" ? "flex" : "none"}}>
                                <Text allowFontScaling={false} style={styles.name}>Preferred Location</Text>
                                <Text allowFontScaling={false} style={[styles.label, {paddingLeft:24, marginRight:10}]}>{item.loc}</Text>
                            </View>
                            <View style={{borderBottomWidth:1, borderBottomColor:"#efefef", paddingBottom:10}}>
                                <Text allowFontScaling={false} style={styles.name}>Preferred Starting Date</Text>
                                <Text allowFontScaling={false} style={[styles.label, {paddingLeft:24, marginRight:10}]}>{item.startDate}</Text>
                            </View>
                            <View style={{borderBottomWidth:1, borderBottomColor:"#efefef", paddingBottom:10}}>
                                <Text allowFontScaling={false} style={styles.name}>Preferred Budget</Text>
                                <Text allowFontScaling={false} style={[styles.label, {paddingLeft:24, marginRight:10}]}>{item.budget}/{item.workType}</Text>
                            </View>
                        </View>
                    ))}


                    <View style={[styles.topcard]}>
                        <Text allowFontScaling={false} style={styles.label}>Have any issues with your Order? Visit the <Text allowFontScaling={false} style={{color:"#f56"}}>Resolution Center</Text>.</Text>
                    </View>

                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={this.state.acceptedModal}
                        onRequestClose={() => this.setState({acceptedModal:!this.state.acceptedModal})}
                    >

                    <View style={[styles.modalContainer]}>
                        <View style={{backgroundColor:"#fff" , marginHorizontal:10,   paddingVertical:30, borderRadius:16,   elevation:6  }} >
                        <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:6, fontWeight:'bold', fontSize:18}]}>{this.state.status} Accept Project Request</Text>
                        <Text allowFontScaling={false} style={[styles.label, {color:"#171919" ,paddingVertical:16, textAlign:"center", paddingLeft:0}]}>Are you sure you want to accept the project ?</Text>

                        <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:32, paddingTop:6}}>
                            <TouchableOpacity style={[styles.btn, {backgroundColor:"#f56", width:100}]} onPress={() => this.acceptProject(this.state.userId)}>
                                <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#fff", textAlign:"center", fontSize:14}}>YES</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676", width:100}]} onPress={() => this.setState({acceptedModal: false})}>
                                <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#fff", textAlign:"center", fontSize:14}}>NO</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    </Modal>




                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={this.state.acceptedModal1}
                        onRequestClose={() => this.setState({acceptedModal1:!this.state.acceptedModal1})}
                    >

                    <View style={[styles.modalContainer]}>
                          <View style={{backgroundColor:"#fff" ,   paddingTop:16,
        borderRadius:16,
        elevation:6,  marginHorizontal:10}}   >
                        <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:6, fontSize:18}]}>{this.state.status} Become a Professional</Text>
                        <Text allowFontScaling={false} style={[styles.label, {paddingVertical:16, textAlign:"center", paddingLeft:0}]}>You are not a Professional user</Text>

                        <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:32, marginVertical:20, paddingTop:6}}>
                            <TouchableOpacity style={[styles.btn, {backgroundColor:"#f56", width:100}]} onPress={() =>this.becomePro()}>
                                <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#fff", textAlign:"center", fontSize:14}}>OK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676", width:100}]} onPress={() => this.setState({acceptedModal1: false})}>
                                <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#fff", textAlign:"center", fontSize:14}}>CANCEL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
</View>
                    </Modal>

                </ScrollView>
{/* 
                {this.state.userType === "3" ?

                    <TouchableOpacity style={styles.fltbtn} onPress={() => this.converse()}>
                        <Feather name="message-circle" size={24} color="#fff" />
                    </TouchableOpacity>
                
                :

                    null

                } */}

                {/* {
                    this.props.route.params.status === "Closed" ?
                    null
                    :
                    <TouchableOpacity style={styles.fltbtn} onPress={() => this.converse()}>
                    <Feather name="message-circle" size={24} color="#fff" />
                </TouchableOpacity>

                } */}


            </View>
        )
            
    }
}
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
       alignItems:'center',
        backgroundColor:"#fff"
    },
    modalContainer:{
        flex:1,
        alignItems:"stretch",
        justifyContent:'center',
      
       
       
      
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
    topcard:{
        backgroundColor:"#fff",
        borderRadius:6,
        padding:0,
        margin:0,
        alignSelf:"stretch",
        marginVertical:6
    },
    card:{
        padding:6,
        marginHorizontal:14,
        marginTop:6,
        borderRadius:10,
        backgroundColor:"#f9f9f9"
    },
    name:{
        fontFamily:"Futura",
        color:"#171919",
        padding:16,
        paddingBottom:0,
        fontSize:16,
    },
    label:{
        fontFamily:"OpenSans",
        color:"#767676",
        fontSize:14,
        paddingLeft:16
    },
    fltbtn:{
        backgroundColor:"#f56",
        borderRadius:10,
        padding:16,
        marginTop:16,
        alignSelf:"center",
        position:"absolute",
        bottom:16,
        right:16,
        elevation:6
    },
    btn:{
        // backgroundColor:"#d9534f",
        borderRadius:10,
        padding:16,
        paddingVertical:14,
        width:300,
        elevation:6,
    },
    btntxt:{
        textAlign:"center",
        fontSize:14,
        color:"#fff",
        fontFamily:"Futura",
    },
})