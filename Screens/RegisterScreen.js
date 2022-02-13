import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Picker} from '@react-native-community/picker';
export default class RegisterScreen extends React.Component{

    state = {
        email: "",
        password:"",
        fName:"",
        lName:"",
        err:"",
        modalVisible: false,
        acceptedModal: false,
        otp:"",
        Eotp:"",
        cCode:"",
        errPassword:"",
        errFname:"",
        errLname:"",
        errEmail:"",
        errorPassword:"",
        errAlready:"",
        errFailed:"",
        dataSource:[],
        seacharry:[],
        occupationName:'Please Select Country',
        Cvalue:'Please Select Country'
        
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



    validation=()=>{
        if (this.state.fName === "" || this.state.lName === "" || this.state.email === "" || this.state.password === ""){
                this.setState({errFname:"Please enter first name!",errLname:"Please enter last name!",errEmail:"Please enter contact detail!" , errPassword:"Please enter password!"})            
        }else if (this.state.password.length < 6){
            this.setState({errorPassword:"Please enter minimum 6 characters password!"})
        }else{
         this.register()
        } 

    }




searchUser(textToSearch){
   this.setState({
       seacharry:this.state.dataSource.filter(i=>
        i.countryName.toLowerCase().includes(textToSearch.toLowerCase())
        ),
   });
  

}


    
    register = () => {

  


        this.setState({isLoading:true})

        if( isNaN(this.state.email) === false ){

this.setState({acceptedModal:true})

if(this.state.occupationName !== "Please Select Country"){

 fetch("http://demo.wiraa.com/api/Profile/SendOtpOnContact?mobile="+this.state.email+"&c_code="+ this.state.occupationName,{
                method: "POST"
            })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({isLoading:false})
                console.log("registered response -->>",responseJson)
                    if (responseJson === "Contact no. already exist.") {
                        this.setState({errAlready:responseJson})
                        this.setState({acceptedModal:false})
                    }else if (responseJson === "Failed"){
                        this.setState({errFailed : "Failed to send OTP. Please try again!"})
                          this.setState({acceptedModal:false})
                    }else{
                        this.setState({ modalVisible: !this.state.modalVisible, otp: responseJson , acceptedModal:false})
                        console.log("mobile otp",this.state.otp);
                    }


                // console.log('registration with mobile response-->>',responseJson)
                // if(responseJson === "Contact no. already exist."){
                //     this.setState({ err: responseJson })
                // }else{
                //     if(this.state.fName !== "" && this.state.lName !== "" && this.state.password !== ""){
                //         if(this.state.password.length < 6){
                //             this.setState({err : "Please enter minimum 6 characters password! "})
                //         }else if(responseJson === "Failed"){
                //             this.setState({err : "Failed to send OTP. Please try again!"})
                //         }
                //         else{
                //             console.log(responseJson);
                //             this.setState({ modalVisible: !this.state.modalVisible, otp: responseJson })
                //         }
                //     }
                //     else{
                //         this.setState({err : "Please enter the following details correctly!"})
                //     }
                // }

            })
}
        }else{
            this.setState({isLoading:true})
            fetch("http://demo.wiraa.com/api/Profile/SendOtpOnMail?email="+this.state.email,{
                method: "POST"
            })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({isLoading:false})
                console.log("emaiul---reponse--",responseJson)
                if(responseJson === "Email already exist."){
                    this.setState({ errAlready: responseJson })
                }else{
                    this.setState({ modalVisible: !this.state.modalVisible, otp : responseJson })
                }
            })
        }
    }



    verifyNewUser = () => {
        this.setState({isLoading:true})
            if(isNaN(this.state.email) === false){
                fetch("http://demo.wiraa.com/api/UserAccount/GetVerifyMobileOTP?contact="+this.state.email+"&otp="+this.state.Eotp +"&c_code="+this.state.occupationName, {
                    method: 'GET'
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({isLoading:false})
                    console.log('verify--response --get>>',responseJson);
                    if (responseJson === true) {
                        this.saveUserData()
                    }
                    else{
                        alert("Please enter valid OTP!")
                    }

                })
                .catch((error) => {
                    //Error 
                    console.error(error);
                    this.setState({isLoading:false})
                });

            }else{
                
                if(this.state.otp === this.state.Eotp){
                   this.saveUserData()
                 console.log("success");
                }else{
                     alert("Please enter valid OTP")
                }
                
            }
    }

    saveUserData=()=>{
        this.setState({isLoading:true})
        fetch("http://demo.wiraa.com/api/Users/Signup", {
                method:"POST",
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    "firstName": this.state.fName,
                    "lastName": this.state.lName,
                    "loginEmail": isNaN(this.state.email) === true ? this.state.email : "",
                    "password": this.state.password,
                    "contactNumber": isNaN(this.state.email) === false ? this.state.email : "",
                    "isEmailVerified": 0
                })
            })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({isLoading:false})
                this.setState({ modalVisible : false })
                console.log('verify- response post-->22222>>',responseJson);

                if(responseJson === "Email Address already Exist."){
                    this.setState({ errAlready: "Email Address already Exist!" })
                }else{
                   this.storeData(responseJson.userInfo.userID)
                   this.props.navigation.navigate("Dashboard")
                }
            })

    }


   storeData = async(userID) => {
        try{
            const userId = userID.toString();
            await AsyncStorage.setItem('userId', userId);
            this.props.navigation.navigate("Dashboard")
        }catch (e) {
            // saving error
            console.log(e)
        }
 }


    render(){
        return(
            <View style={[styles.container, {backgroundColor: this.state.modalVisible ? "#000" : "#fff", opacity:this.state.modalVisible ? 0.2 : 1}]}>
                {/* <Text allowFontScaling={false} style={styles.name} >Register</Text> */}
                <Text allowFontScaling={false} style={styles.heading}>Join Now</Text>
                <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.errFailed ? "none" : "flex"}]}> {this.state.errFailed} </Text>
                <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.errAlready ? "none" : "flex"}]}> {this.state.errAlready} </Text>

                <TextInput style={[styles.txtipt, {marginTop:24}]} onChangeText={(text) => this.setState({ fName: text }) } placeholder="First Name" />
                {
                    this.state.fName === "" ? 
                    <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.errFname ? "none" : "flex"}]}> {this.state.errFname} </Text>
                    :
                    null
                }
                <TextInput style={styles.txtipt}  onChangeText={(text) => this.setState({ lName: text }) } placeholder="Last Name" />
                {
                    this.state.lName === "" ? 
                    <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.errLname ? "none" : "flex"}]}> {this.state.errLname} </Text>
                    :
                    null
                }
                <TextInput style={styles.txtipt}  onChangeText={(text) => this.setState({ email: text }) } placeholder="Email / Phone No." />
                {
                    this.state.email === "" ? 
                    <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.errEmail ? "none" : "flex"}]}> {this.state.errEmail} </Text>
                    :
                    null
                }
                {/* <TextInput style={styles.txtipt}  onChangeText={(text) => this.setState({ phNo: text }) } placeholder="Phone No." /> */}
                <TextInput style={styles.txtipt} secureTextEntry={true} onChangeText={(text) => this.setState({ password: text }) }  placeholder="Password" />
                {
                    this.state.password === "" ? 
                    <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.errPassword ? "none" : "flex"}]}> {this.state.errPassword} </Text>
                    : this.state.password.length < 6 ? <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.errorPassword ? "none" : "flex"}]}> {this.state.errorPassword} </Text>
                    :
                    null
                }
                <TouchableOpacity style={styles.submit} onPress={() => this.validation()}>
                    <Text allowFontScaling={false} style={styles.submittxt}>CREATE ACCOUNT</Text>

                </TouchableOpacity>
                <Text allowFontScaling={false} style={styles.label}>Already a member? &nbsp; <Text allowFontScaling={false} style={{color:"#f56"}} onPress={() => this.props.navigation.navigate("LoginScreen")}>LogIn</Text> </Text>
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                       this.setState({  modalVisible: false })
                    }}
                >

                   <KeyboardAvoidingView behavior="height" style={[styles.modalContainer, {backgroundColor:"#fefefe"}]}>
                        <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:64}]}>Verification</Text>
                        <View>
                         
                            <Text  allowFontScaling={false} style={styles.label}>Verification code has been sent to <Text style={{fontFamily:"Futura", fontWeight:"bold", fontSize:18}}>{this.state.email}</Text> </Text>
                            <View>
                                <Text allowFontScaling={false} style={styles.name}>Enter OTP</Text>
                                <TextInput style={styles.txtipt} onChangeText={(text) => this.setState({Eotp: text})} />
                            </View>
                        </View>
                        {/* onPress={() => this.register()} */}
                        <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:16, marginTop:6}}>
                            <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676"}]} > 
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>Resend Otp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn} onPress={() => this.verifyNewUser()}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>Verify OTP</Text>
                            </TouchableOpacity>
                        </View>
                   </KeyboardAvoidingView>

                </Modal>
                  <Modal
                        transparent={true}
                        animationType="slide"
                        visible={this.state.acceptedModal}
                        // onRequestClose={() => this.setState({acceptedModal:!this.state.acceptedModal})}
                    >

                          <View style={[styles.modalContainer1]}>
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
   <TouchableOpacity style={[styles.btn1, {backgroundColor:"#f56", width:100,  elevation:6,}]}
     >
                                <Text allowFontScaling={false}  onPress={() =>  this.setState({acceptedModal:false})}  style={{fontFamily:"Futura", color:"#fff", textAlign:"center", 
                                  fontSize:14}}>cancle</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={this.state.occupationName === "Please Select Country" ? true : false}   style={[styles.btn1, {backgroundColor:"#f56", width:100}]}
                            onPress={() =>  this.sendOtp()}>
                                <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#fff", textAlign:"center", fontSize:14}}>Done</Text>
                            </TouchableOpacity>
</View>
       
                        </View>
                        </View>
                        </Modal>


            </View>
        );
      }
    }
      
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"flex-start",
        alignItems:"center",
        backgroundColor:"#fff"
    },
    modalContainer:{
        flex:1,
        alignItems:"stretch", 
        justifyContent:"flex-start", 
        backgroundColor:"#fff",
        marginHorizontal:16,
        marginTop:100,
        marginVertical:240,
        borderRadius:16,
    },
       modalContainer1:{
        flex:1,
        alignItems:"stretch",
        justifyContent:'center',
       backgroundColor: 'rgba(0,0,0,0.5)',
       
       
      
    },

        btn1:{
        // backgroundColor:"#d9534f",
        borderRadius:10,
        padding:16,
        paddingVertical:14,
        width:300,
        elevation:6,
       
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
    name:{
        fontFamily:"Futura",
        color:"#171919",
        padding:16,
        paddingBottom:0,
        fontSize:18,
        marginTop:16
    },
    label:{
        fontFamily:"OpenSans",
        color:"#767676",
        fontSize:16,
        paddingHorizontal:16,
        textAlign:"center"
    },
    txtipt:{
        borderRadius:10,
        paddingHorizontal:16,
        marginVertical:6,
        alignSelf:"stretch",
        fontFamily:"OpenSans",
        marginHorizontal:20,
        backgroundColor:"#efefef",
        height:50,
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
    btn:{
        backgroundColor:"#f56",
        borderRadius:32,
        padding:16,
        width:150,
        marginTop:16,
        alignSelf:"center"
    },
})