import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal,TextInput, KeyboardAvoidingView, ScrollView } from 'react-native'
import { FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class Settings extends React.Component{

   state={
       modalVisible: false,
       modalVisible1: false,
       modalVisible2: false,
       modalVisible3: false,
       modalVisible4:false,
       userProfileId:"",
       userId:"",
       email:"",
       newEmail:"",
       otp:"",
       phoneNum:"",
       newPhoneNum:"",
       blockedProfile:[],
       msg: "",
       currPass:"",
       newPass:"",
       confNewPass:"",
       checkOtp:"",
   }

   componentDidMount = async() => {
        const userProfileId = await AsyncStorage.getItem('userPrfileId')
        if(userProfileId !== null) {
            this.setState({userProfileId});
        }else{
            console.log("null")
        }

        const userId = await AsyncStorage.getItem('userId')
        if(userId !== null) {
            this.setState({userId});
        }else{
            console.log("null")
        }

        
        await fetch("http://demo.wiraa.com/api/Profile/GetSetting?userProfileId="+userProfileId)
        .then(response => response.json())
        .then(responseJson => {
            this.setState({ email: responseJson.email });
            this.setState({ phoneNum: responseJson.contactNo })

            let blockedProfile = [];
            responseJson.blockedProfiles.map(item => {
                blockedProfile.push({
                    userProfileId: item.userProfileID,
                    name: item.name,
                    profilePic: item.profilePic
                })

                this.setState({blockedProfile})
            })

        })
   }

   changeEmail = () => {
        if(this.state.newEmail !== ""){
            fetch("http://demo.wiraa.com/api/UserAccount/RequestChangeEmail?email="+this.state.email+"&newEmail="+this.state.newEmail,{
                method: "POST"
            })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson)
                this.setState({checkOtp: responseJson.otp, msg: responseJson.message})
            })
        }

   }

   saveEmailChanges = () => {
        if(this.state.msg === "Success" && this.state.otp === this.state.checkOtp ){
            fetch("http://demo.wiraa.com/api/UserAccount/ChangeEmail?email="+this.state.email+"&newEmail="+this.state.newEmail, {
                method: "POST"
            })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
                this.setState({checkOtp: "", msg: "", otp: ""})
            })
        }
   }

   changeMobile = () => {
       fetch("http://demo.wiraa.com/api/UserAccount/RequestChangeMobile?contact="+this.state.phoneNum+"&newContact="+this.state.newPhoneNum+"&c_code=IN", {
           method: "POST"
       }) 
       .then(response => response.json())
       .then(responseJson => {
        this.setState({checkOtp: responseJson.otp, msg: responseJson.message})
       })
   }

   saveChangeMobile = () => {
        if(this.state.msg === "Success" && this.state.otp === this.state.checkOtp){
            fetch("api/UserAccount/ChangeMobile?contact="+this.state.phoneNum+"&newContact="+this.state.newPhoneNum+"&otp="+this.state.checkOtp+"&c_code=IN", {
                method: "POST"
             })
             .then(response => response.json())
             .then(responseJson => {
                console.log(responseJson);
                this.setState({checkOtp: "", msg: "", otp: ""})
             })
        }
   }

   changePass = () => {
       if(this.state.newPass === this.state.confNewPass){
            fetch("http://demo.wiraa.com/api/Profile/ChangePassword?UserId="+this.state.userId+"&NewPassword="+this.state.newPass+"&OldPassword="+this.state.currPass, {
                method: "POST"
            })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
            })
       }
   }

   unblock = (id) => {
       fetch("http://demo.wiraa.com/api/Profile/UnblockUserProfile?UserProfileID="+this.state.userProfileId+"&BlockedUserProfileId="+id, {
           method: "POST"
       })
       .then(response => response.json())
       .then(responseJson => {
           console.log(responseJson);
       })
   }

   deleteAcc = () => {
       fetch("http://demo.wiraa.com/api/Profile/PermanentDeleteAccount?UserProfileID="+this.state.userProfileId)
       .then(response => response.json())
       .then(responseJson => {
           if(responseJson === true){
               this.props.navigation.navigate("LandingScreen");
           }
       })
   }

   render(){
    return(
        <View style={[styles.container, {backgroundColor: this.state.modalVisible || this.state.modalVisible1 || this.state.modalVisible2 || this.state.modalVisible3 || this.state.modalVisible4 ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,1)"}]}>
            <View style={styles.headerr}>
                <Feather name="chevron-left" size={24} color="#767676" style={{zIndex: 999999, paddingTop:6}} onPress={() => this.props.navigation.goBack()} />
                <Text allowFontScaling={false} style={styles.heading}>Settings</Text>
                <Feather name="chevron-left" size={24} color="transparent" style={{zIndex: 999999, paddingTop:6}} onPress={() => this.props.navigation.goBack()} />
            </View>
            <View style={{ marginHorizontal:0, borderRadius:16, marginTop:16}}>
                    <View style={{paddingLeft:0}}>

                        <TouchableOpacity style={styles.card} onPress={() => this.setState({modalVisible:!this.state.modalVisible})}>
                            <Feather name="mail" size={24} color="#767676" />
                            <Text allowFontScaling={false} style={[styles.name,{color:"#171919"}]}>Change Email</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.card} onPress={() => this.setState({modalVisible1:!this.state.modalVisible1})}>
                            <Feather name="phone" size={24} color="#767676" />
                            <Text allowFontScaling={false} style={[styles.name,{color:"#171919"}]}>Change Phone Number</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.card} onPress={() => this.setState({modalVisible2:!this.state.modalVisible2})}>
                            <Feather name="lock" size={24} color="#767676" />
                            <Text allowFontScaling={false} style={[styles.name,{color:"#171919"}]}>Change Password</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.card} onPress={() => this.setState({modalVisible3:!this.state.modalVisible3})}>
                            <Feather name="slash" size={24} color="#767676" />
                            <Text allowFontScaling={false} style={[styles.name,{color:"#171919"}]}>Blocked Accounts</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{flexDirection:"row", padding:32}} onPress={() => this.setState({modalVisible4:!this.state.modalVisible4})}>
                            <Feather name="delete" size={24} color="#f56" />
                            <Text allowFontScaling={false} style={[styles.name,{color:"#f56"}]}>Delete Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            {/* MODALS */}

            <Modal
                transparent={true}
                animationType="fade"
                visible={this.state.modalVisible}
                onRequestClose={() => this.setState({modalVisible:!this.state.modalVisible})}>
                <KeyboardAvoidingView behavior="height" style={[styles.modalContainer, {marginVertical:170}]}>
                    <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:6}]}>Update Email</Text>
                    <View>
                        <View style={{paddingVertical:16}}>
                            <Text allowFontScaling={false} style={styles.label}>Current Email Address</Text>
                            <Text allowFontScaling={false} style={styles.name}>{this.state.email}</Text>
                        </View>

                        <View style={{marginTop:6}}>
                            <Text allowFontScaling={false} style={styles.label}>New Email Address</Text>
                            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                <TextInput style={[styles.txtipt, {width:280}]} placeholder="Enter New Email" onChangeText={(text) => this.setState({newEmail: text})} />
                                
                                <Ionicons style={{marginTop:20, marginRight:24}} name="ios-send" size={22} color="#f56" onPress={() => this.changeEmail()}  />
                                
                            </View>
                        </View>

                        <View style={{paddingVertical:16}}>
                            <Text allowFontScaling={false} style={styles.label}>Enter OTP</Text>
                            <TextInput style={[styles.txtipt, {width:330}]} onChangeText={(text) => this.setState({otp: text})} />
                        </View>

                        <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:16, marginTop:6}}>
                            <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676"}]} onPress={() => this.setState({modalVisible: false})}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn} onPress={() => this.saveEmailChanges()}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>SAVE</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Modal
                transparent={true}
                animationType="fade"
                visible={this.state.modalVisible1}
                onRequestClose={() => this.setState({modalVisible1:!this.state.modalVisible1})}>
                <KeyboardAvoidingView behavior="height" style={[styles.modalContainer, {marginVertical:170}]}>
                    <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:6}]}>Update Phone Number</Text>
                    <View>
                        <View style={{paddingVertical:16}}>
                            <Text allowFontScaling={false} style={styles.label}>Current Phone Number</Text>
                            <Text allowFontScaling={false} style={styles.name}>{this.state.phoneNum}</Text>
                        </View>

                        <View style={{marginTop:6}}>
                            <Text allowFontScaling={false} style={styles.label}>New Phone Number</Text>
                            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                <TextInput style={[styles.txtipt, {width:280}]} placeholder="Enter New Phone Number" onChangeText={(text) => this.setState({newPhoneNum: text})} />
                                
                                <Ionicons style={{marginTop:20, marginRight:24}} name="ios-send" size={22} color="#f56" onPress={() => this.changeMobile()}  />
                                
                            </View>
                        </View>

                        <View style={{paddingVertical:16}}>
                            <Text allowFontScaling={false} style={styles.label}>Enter OTP</Text>
                            <TextInput style={[styles.txtipt, {width:330}]} onChangeText={(text) => this.setState({otp: text})} />
                        </View>

                        <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:16, marginTop:6}}>
                            <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676"}]} onPress={() => this.setState({modalVisible1: false})}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn} onPress={() => this.saveChangeMobile()}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>SAVE</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Modal
                transparent={true}
                animationType="fade"
                visible={this.state.modalVisible2}
                onRequestClose={() => this.setState({modalVisible2:!this.state.modalVisible2})}>
                <KeyboardAvoidingView behavior="height" style={styles.modalContainer}>
                    <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:6, paddingBottom:6}]}>Update Password</Text>
                    <View>
                        <View style={{paddingVertical:16}}>
                            <Text allowFontScaling={false} style={styles.label}>Current Password</Text>
                            <TextInput style={styles.txtipt} placeholder="Enter Current Password" onChangeText={(text) => this.setState({currPass : text})} />
                        </View>

                        <View style={{marginTop:6}}>
                            <Text allowFontScaling={false} style={styles.label}>New Password</Text>
                            <TextInput style={styles.txtipt} placeholder="Enter New Password" onChangeText={(text) => this.setState({newPass : text})} />
                        </View>

                        <View style={{marginTop:6}}>
                            <Text allowFontScaling={false} style={styles.label}>Confirm Password</Text>
                            <TextInput style={styles.txtipt} placeholder="Confirm Password" onChangeText={(text) => this.setState({confNewPass : text})} />
                        </View>
                    </View>
                    <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:16, marginTop:6}}>
                        <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676"}]} onPress={() => this.setState({modalVisible2: false})}>
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={ () => this.changePass()}>
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>SAVE</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Modal
                transparent={true}
                animationType="fade"
                visible={this.state.modalVisible3}
                onRequestClose={() => this.setState({modalVisible3:!this.state.modalVisible3})}>
                <KeyboardAvoidingView behavior="height" style={[styles.modalContainer]}>

                    <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:6}]}>Blocked Accounts</Text>

                    {this.state.blockedProfile.map(item => (
                        <View>
                            <View style={{flexDirection:"row", justifyContent:"flex-start", paddingVertical:16}}>
                                <Image style={{width:45, height:45, borderRadius:10, margin:16, marginBottom:10, marginRight:0, marginTop:0}} source={{uri: item.profilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com/"+item.profilePic}} />
                                <Text allowFontScaling={false} style={[styles.name, {fontSize:16, paddingTop:10}]}>{item.name}</Text>
                                <TouchableOpacity style={{paddingTop:10, marginLeft:54}} onPress={ () => this.unblock(item.userProfileId)}>
                                    <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#f56", fontWeight:"bold"}}>Unblock</Text>
                                </TouchableOpacity>
                            </View>
                           
                        </View>
                    ))}

                </KeyboardAvoidingView>
            </Modal>

            <Modal
                transparent={true}
                animationType="fade"
                visible={this.state.modalVisible4}
                onRequestClose={() => this.setState({modalVisible4:!this.state.modalVisible4})}>
                <KeyboardAvoidingView behavior="height" style={[styles.modalContainer, {paddingVertical:299}]}>

                    <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:6}]}>Delete Account</Text>
                    <View style={{paddingVertical:16}}>
                        <Text allowFontScaling={false} style={[styles.name, {fontWeight:"bold", paddingBottom:10, color:"#f56"}]}>Permanently Delete Account</Text>
                        <Text allowFontScaling={false} style={styles.label}>When you delete your Wiraa account, you won't be able to retrieve the information you've shared on Wiraa. Your chats and session requests will also be deleted.</Text>
                    </View>

                    <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:16, marginTop:6}}>
                        <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676"}]} onPress={() => this.setState({modalVisible4: false})}>
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={() => this.deleteAcc()}>
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>DELETE</Text>
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            </Modal>

        </View>
    )
   }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        zIndex:-999,
        backgroundColor:"#fff",
    },
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
    modalContainer:{
        flex:1,
        alignItems:"stretch",
        justifyContent:"flex-start",
        backgroundColor:"#fff",
        marginHorizontal:16,
        marginVertical:170,
        paddingTop:16,
        borderRadius:16,
    },
    heading:{
        fontFamily:"Futura",
        fontSize:22,
        marginTop:6,
        textAlign:"center",
        color:"#171919",
    },
    card:{
        flexDirection:"row",
        padding:32,
        borderBottomWidth:1,
        borderBottomColor:"#efefef"
    },
    txtipt:{
        borderRadius:6,
        paddingHorizontal:6,
        marginVertical:6,
        fontFamily:"OpenSans",
        marginHorizontal:16,
        backgroundColor:"#efefef",
        height:50,
        fontSize:16,
    },

    name:{
        fontFamily:"Futura",
        color:"#171919",
        paddingLeft:16,
        paddingBottom:0,
        fontSize:20,
    },
    label:{
        fontFamily:"OpenSans",
        color:"#767676",
        fontSize:14,
        paddingLeft:16
    },
    btn:{
        backgroundColor:"#f56",
        borderRadius:32,
        padding:16,
        width:150,
        marginTop:16,
        alignSelf:"center"
    },
})