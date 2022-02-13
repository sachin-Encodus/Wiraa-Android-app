import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, ToastAndroid, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import {Picker} from '@react-native-community/picker';
export default class ResetPassword extends React.Component{

    state = {
        email:"",
        otp:"",
        Eotp:"",
        err:"",
        password:"",
        modalVisible: false,
        cCode:"",
        isLoading: false,
        otpSent: false,
        acceptedModal: false,
        occupationName:'Please Select Country',
        Cvalue:'Please Select Country',
        dataSource:[],
        seacharry:[],
    }



  componentDidMount(){
    fetch("http://demo.wiraa.com/api/profile/GetCountryName")  // **Api for fetching**
    .then(response => response.json())
    .then((responseJson)=> {
      this.setState({
       loading: false,
       dataSource: responseJson,
       seacharry:responseJson
      })
     console.log("=========>>>>>>>>>>>>>>>>>", this.state.dataSource);
    })
    .catch(error=>console.log(error))
    
   
  
    
    
    //to catch the errors if any
    }

searchUser(textToSearch){
   this.setState({
       seacharry:this.state.dataSource.filter(i=>
        i.countryName.toLowerCase().includes(textToSearch.toLowerCase())
        ),
   });
  

}


    sendOtp = () => {
 if(isNaN(this.state.email) === false){
     this.setState({acceptedModal:true})

  if(this.state.occupationName !== "Please Select Country"){

        // this.setState({ isLoading: true })

        fetch("http://demo.wiraa.com/api/UserAccount/SentOtpForReset?contactEmail="+this.state.email+"&c_code="+this.state.occupationName, {
            method: "POST"
        })
        .then(response => response.json())
        .then(responseJson => {
            console.log(responseJson);
            if(responseJson.message === "Sucess"){
                this.setState({ otp: responseJson.otp, isLoading: false, otpSent: true , acceptedModal:false})
            }else{
                this.setState({ err: responseJson.message , })
            }
        })
    }

 }else{


//    this.setState({ isLoading: true })

        fetch("http://demo.wiraa.com/api/UserAccount/SentOtpForReset?contactEmail="+this.state.email+"&c_code="+this.state.cCode, {
            method: "POST"
        })
        .then(response => response.json())
        .then(responseJson => {
            console.log(responseJson);
            if(responseJson.message === "Sucess"){
                this.setState({ otp: responseJson.otp, isLoading: false, otpSent: true , acceptedModal:false})
            }else{
                this.setState({ err: responseJson.message ,  })
            }
        })

 }









    }










    verifyOtp = () => {

        fetch("http://demo.wiraa.com/api/UserAccount/GetVerifyMobileOTP?contact="+this.state.email+"&otp="+this.state.Eotp+"&c_code="+this.state.cCode, {
                method: "GET"
            })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);

                if(responseJson === true){
                    this.setState({ modalVisible: true })

                }else if(this.state.otp === this.state.Eotp){
                    this.setState({ modalVisible: true })
                }
                else{
                    this.setState({ err: "Wrong OTP. Please try again" })
                }
            })

        // if(isNaN(this.state.email) === false){
        //     fetch("http://demo.wiraa.com/api/UserAccount/GetVerifyMobileOTP?contact="+this.state.email+"&otp="+this.state.Eotp+"&c_code="+this.state.cCode, {
        //         method: "GET"
        //     })
        //     .then(response => response.json())
        //     .then(responseJson => {
        //         console.log(responseJson);
        //         if(responseJson === true){
        //             this.setState({ modalVisible: true })
        //         }else{
        //             this.setState({ err: "Wrong OTP. Please try again" })
        //         }
        //     })
        // }else{
        //     if(this.state.otp === this.state.Eotp){
        //         fetch("http://demo.wiraa.com/api/UserAccount/GetVerifyMobileOTP?contact="+this.state.email+"&otp="+this.state.Eotp+"&c_code="+this.state.cCode, {
        //         method: "GET"
        //         })
        //         .then(response => response.json())
        //         .then(responseJson => {
        //             console.log(responseJson);
        //             if(responseJson === true){
        //                 this.setState({ modalVisible: true })
        //             }else{
        //                 this.setState({ err: "Wrong OTP. Please try again" })
        //             }
        //         })
        //     }
        // }
        
    }

    resetPassword = () => {
        fetch("http://demo.wiraa.com/api/UserAccount/PasswordReset?contactEmail="+this.state.email+"&password="+this.state.password, {
            method: "POST"
        })
        .then(response => response.json())
        .then(responseJson => {
            ToastAndroid.showWithGravity(
                responseJson,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
            );

            this.setState({ modalVisible: false })
        })
    }

    render(){
            return(
                <View style={styles.container}>
                    <Text allowFontScaling={false} style={styles.name} >Generate Password</Text>
                    <Text allowFontScaling={false} style={styles.heading}>Let's find your account</Text>

                    <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.err ? "none" : "flex"}]}> {this.state.err} </Text>

                    <Text allowFontScaling={false} style={styles.label}>Registered Email or Phone Number </Text>
                    <View style={{flexDirection:"row"}}>
                        <TextInput style={[styles.txtipt,{width:290,}]} placeholder="Email or Phone Number" onChangeText={(text) => this.setState({ email: text })} />
                        <TouchableOpacity  disabled={this.state.email === "" ? true : false} style={[styles.submit, {borderRadius:8, paddingVertical:10 }]} onPress={() => this.sendOtp()}>
                            <Ionicons name="ios-send" size={24} color="#171919" />
                        </TouchableOpacity>
                    </View>

                    {this.state.isLoading ?
                        <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                            <ActivityIndicator size="large" color="#f56"/>
                        </View>
                    
                    :

                        <View style={{alignSelf:"stretch", display: this.state.otpSent ? "flex" : "none"}}>
                            <TextInput style={[styles.txtipt, {marginRight:16}]} placeholder="Enter OTP" onChangeText={(text) => this.setState({ Eotp: text })} />
                            <TouchableOpacity style={styles.submit} onPress={() => this.verifyOtp()}>
                                <Text allowFontScaling={false} style={styles.submittxt}>VERIFY OTP</Text>
                            </TouchableOpacity>
                        </View>

                    }            
    
                    <Text allowFontScaling={false} style={[styles.label,{color:"#f56"}]} onPress={() => this.props.navigation.navigate("LoginScreen")} >Back to Login</Text>
    

                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={this.state.acceptedModal}
                        // onRequestClose={() => this.setState({acceptedModal:!this.state.acceptedModal})}
                    >

                          <View style={[styles.modalContainer]}>
                          <View style={{backgroundColor:"#fff" , paddingVertical:10, borderRadius:16,  marginHorizontal:10,  }} >

                              <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"black", textAlign:"center", fontWeight:'bold', paddingVertical:10, fontSize:18}}>Please Select Country</Text> 
                         <View style={{   alignSelf:'stretch', }}>

                                 <TextInput style={[styles.txtipt1, {marginTop:25}]} placeholder="search country" onChangeText={text => {this.searchUser(text)}} />
                     <View
                            style={{
                              backgroundColor: "#efefef",
                           marginHorizontal:16,
                              marginTop: 6,
                            //   width:widthPercentageToDP(90),
                              borderRadius: 10,
                              alignSelf:'stretch',
                            }}
                          >
                            <Picker
                              mode="dropdown"
                               containerStyle={{height: 40, }}
                            maxHeight={44}
                              style={{
                                marginHorizontal: 10,
                                backgroundColor: "#efefef",
                                
                              }}
                              // selectedValue={
                              //   item.occupation
                              //     ? item.occupation
                              //     : this.state.occupationName
                              // }
                              selectedValue={this.state.occupationName}
                              onValueChange={(itemValue, itemIndex) =>
                                this.setState({ occupationName: itemValue })
                              }
                            >
  {/* <TextInput style={[styles.txtipt, { marginTop:32,   width:widthPercentageToDP(75) ,padding:10}]}
   placeholder="search here." onChangeText={text =>{ this.searchUser(text);}} /> */}

                              <Picker.Item 
                            label={this.state.Cvalue} 
                            value="Please Select Country"
                            style={{fontSize:50, height:20}} />
                           
                               {this.state.seacharry.map((item) => (
                                <Picker.Item
                               
                               
                                  key={item.id}
                                  label={item.countryName}
                                  value={item.countryCode}
                                />
                              ))}


                            </Picker>
                          </View>
                
                 
                </View>
   <View style={{flexDirection:'row', justifyContent:'space-between' , marginTop:25,  marginHorizontal:16 , paddingVertical:10}} >
   <TouchableOpacity style={[styles.btn, {backgroundColor:"#f56", width:100,  elevation:6,}]}
     >
                                <Text allowFontScaling={false}  onPress={() =>  this.setState({acceptedModal:false})}  style={{fontFamily:"Futura", color:"#fff", textAlign:"center", 
                                  fontSize:14}}>cancle</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={this.state.occupationName === "Please Select Country" ? true : false}   style={[styles.btn, {backgroundColor:"#f56", width:100}]}
                            onPress={() =>  this.sendOtp()}>
                                <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#fff", textAlign:"center", fontSize:14}}>Done</Text>
                            </TouchableOpacity>
</View>
       
                        </View>
                        </View>
                        </Modal>





                    <Modal
                        transparent={false}
                        animationType="fade"
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                           this.setState({  modalVisible: false })
                        }}
                    >
    
                       <KeyboardAvoidingView behavior="height" style={[styles.modalContainer, {backgroundColor:"#fefefe"}]}>
                            <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:64}]}>Update Password</Text>
                            
                            <View>
                                <View>
                                    <Text allowFontScaling={false} style={styles.label}>Please enter new password</Text>
                                    <TextInput secureTextEntry={true} style={[styles.txtipt, {marginRight:16}]} onChangeText={(text) => this.setState({password: text})} placeholder="Enter new password" />
                                </View>
                            </View>
    
                            <TouchableOpacity style={styles.submit} onPress={() => this.resetPassword()}>
                                <Text allowFontScaling={false} style={styles.submittxt}>RESET</Text>
                            </TouchableOpacity>
    
                       </KeyboardAvoidingView>
    
                    </Modal>
    
                </View>
            )
        
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"flex-start",
        alignItems:"center",
        backgroundColor:"#fff"
    },
    heading:{
        fontFamily:"Futura",
        fontSize:30,
        padding:32,
        paddingBottom:6,
        alignSelf:"center",
        color:"#171919",
        paddingTop:48,
    },
    name:{
        fontFamily:"Futura",
        color:"#171919",
        padding:16,
        paddingBottom:0,
        fontSize:22,
        marginTop:32
    },


      modalContainer:{
        flex:1,
        alignItems:"stretch",
        justifyContent:'center',
       backgroundColor: 'rgba(0,0,0,0.5)',
       
       
      
    },
    label:{
        fontFamily:"OpenSans",
        color:"#767676",
        fontSize:14,
        paddingHorizontal:16,
        textAlign:"center"
    },
    txtipt:{
        borderRadius:10,
        paddingHorizontal:16,
        marginVertical:6,
        alignSelf:"stretch",
        fontFamily:"OpenSans",
        marginHorizontal:16,
        marginRight:0,
        backgroundColor:"#efefef",
        height:50,
        marginTop:32,
        
    },
        txtipt1:{
        borderRadius:10,
        paddingHorizontal:16,
        marginVertical:6,
        alignSelf:"stretch",
        fontFamily:"OpenSans",
        marginHorizontal:16,
        backgroundColor:"#f2f2f2",
        height:50,
    },
       btn:{
        // backgroundColor:"#d9534f",
        borderRadius:10,
        padding:16,
        paddingVertical:14,
        width:300,
        elevation:6,
       
    },
    submit:{
        backgroundColor:"#f56",
        padding:20,
        marginVertical:5,
        borderRadius:10,
        elevation:6,
        marginBottom:32,
        alignSelf:"stretch",
        marginHorizontal:16,
        marginTop:32
    },
    submittxt:{
        textAlign:"center",
        fontSize:16,
        color:"#fff",
        fontFamily:"OpenSans",
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