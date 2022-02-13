import React from 'react'
import { View, Text, StyleSheet,SafeAreaView, Image, TouchableOpacity, TextInput,ActivityIndicator ,Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { widthPercentageToDP } from 'react-native-responsive-screen';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import {Picker} from '@react-native-community/picker';
const myRef = React.createRef();

export default class LoginScreen extends React.Component{

    state = {
        email:"",
        password:"",
        users:[],
        err:"",
        otp:"",
        useOtp:false,
        otpSent: false,
        val: "",
        cCode:"",
        mNo:"",
        isActive:false,
        isLoading:false,
         acceptedModal: false,
         country:false,
         countryCode:"",
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

//  getData = async () => {
//   try {
//     const value = await AsyncStorage.getItem('userData')
//     if(value !== null) {
//      console.log(value);
//     }
//   } catch(e) {
//     console.log("no data");
//   }
// }


    Login = () => {
        
        if(this.state.password !== ""){

            fetch("http://demo.wiraa.com/api/UserAccount/GetLoginByPassword?contact="+this.state.email+"&pwd="+this.state.password, {
            method: 'GET'
            //Request Type 
            })
            .then((response) => response.json())
            //If response is in json then in success
            .then((responseJson) => {
            //    console.log('login email---',responseJson)
                //Success 
                if(responseJson.userInfo != null){
  this.setState({isLoading:true})
                    if(responseJson.userInfo.isDeleted === true){
                        // console.log("Working");
                        this.setState({ err: "Account doesn't exists" })
                    }else{
                      
                        let users = [...this.state.users];
                    
                        users.push({
                            userId: responseJson.userInfo.userID,
                            email: responseJson.userInfo.loginEmail,
                            password: responseJson.userInfo.password,
                        });
                
                        this.setState({
                            users,
                        });
                    
                        this.state.users.map(async(cred) => {
                         
                            this.storeUserDetails(cred.userId);

                        //  const userId = cred.userId.toString();
                        //  var items = [['email', this.state.email], ['pass', this.state.password], ["userId", userId]]
                        //  await AsyncStorage.multiSet(items, (err) => {console.log(err)})




                            this.storeData(cred.userId , responseJson);



                            //   const userId = cred.userId.toString();
                            //   await AsyncStorage.setItem('userId', userId);
            
            
                            //     const userInfo = JSON.stringify(responseJson)
                            //     await AsyncStorage.setItem('userData',userInfo);

this.setState({isLoading:false})
                                  this.props.navigation.replace("Dashboard")





                          
                        });
                    }
                }else{
                    this.setState({
                        err: responseJson.message,
                    })
                }
                
                
            })
            //If response is not in json then in error
            .catch((error) => {
                //Error 
                console.error(error);
            });
        }else{
            this.setState({
                err: "Please enter correct credentials",
            })
        }
    }

  storeUserDetails = async(userId) => {
        try{
            userId = userId.toString();
            var items = [['email', this.state.email], ['pass', this.state.password], ["userId", userId]]
            await AsyncStorage.multiSet(items, (err) => {console.log(err)})
        }catch(e){

        }
    }


    storeData = async(userID , userData) => {
        
        try{
            const userId = userID.toString();
            await AsyncStorage.setItem('userId', userId);
            
            
            const userInfo = JSON.stringify(userData)
            await AsyncStorage.setItem('userData',userInfo);
            
        //   console.log("userdata", userData);
        }catch (e) {
           console.log("error");
        }
    }

  

searchUser(textToSearch){
   this.setState({
       seacharry:this.state.dataSource.filter(i=>
        i.countryName.toLowerCase().includes(textToSearch.toLowerCase())
        ),
   });
  

}



    sendOtp = () => {

   if( isNaN(this.state.val) === false ){
   if(this.state.val !== ""){
   this.setState({acceptedModal:true})
    }
    

 console.log("country", this.state.occupationName);

  if(this.state.occupationName !== "Please Select Country"){
      
 



      


            fetch("http://demo.wiraa.com/api/UserAccount/GEtLoginByMobile?contact="+this.state.val+"&c_code="+this.state.occupationName, {
                method: 'GET'
            })
            .then((response) => response.json())
            .then(responseJson => {
                // console.log('response--->>',responseJson);
                this.setState({err: responseJson.message})

                if(responseJson.userInfo !== null){

                    if(responseJson.userInfo ? responseJson.userInfo.isDeleted : "" === true){
                        // console.log("Working ");
                        this.setState({ err: "Account doesn't exists" })
                    }else{

                

                  



                        let users = [...this.state.users];
                    
                        users.push({
                            userId: responseJson.userInfo.userID !==null  ?  responseJson.userInfo.userID : "" ,
                            email: responseJson.userInfo.loginEmail !==null ? responseJson.userInfo.loginEmail : "",
                            contactNo: responseJson.userInfo.contactNo !==null ? responseJson.userInfo.contactNo : "",
                            password: responseJson.userInfo.password !==null ? responseJson.userInfo.password : "",
                        });
                
                        this.setState({
                            users
                        });
                  
                    
               
                        this.state.users.map(cred => {
                            this.storeUserDetails(cred.userId);
                            this.storeData(cred.userId , responseJson);
                            // this.props.navigation.navigate("Dashboard")
                        });



                       
                    }
                }else{
                    this.setState({
                        err: responseJson.message,  acceptedModal:false,
                    })
                    // console.log('error--->>>',responseJson.message)
                    // alert(responseJson.message)
                }
                
    




                if(responseJson.userInfo.isActive === false){
                    this.setState({ err: "Mobile number does not exist!" })
                }else{
                  
                    this.setState({otpSent: true,  acceptedModal:false, isActive: responseJson.userInfo.isActive})
                }






 
                
            })
            .catch((error) => {
                //Error 
                console.error(error);
            });

        }else{
        console.log("==========???????????");
        }

        }else{
            console.log("hello");
            fetch("http://demo.wiraa.com/api/UserAccount/GetLoginByEmail?email="+this.state.val, {
                method: 'GET'
            })
            .then((response) => response.json())
            .then(responseJson => {
                // console.log(responseJson);

                if(responseJson.userInfo.isActive === false){
                    this.setState({ err: "Email does not exist!" })
                }else{
                    this.setState({otpSent: true, isActive: responseJson.userInfo.isActive})
                }
            })
            .catch((error) => {
                //Error 
                console.error(error);
            });
        }
    }

    LoginbyOTP = () => {

        fetch("http://demo.wiraa.com/api/UserAccount/GetVerifyMobileOTP?contact="+this.state.val+"&otp="+this.state.userOtp+"&c_code="+this.state.occupationName, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {

            // console.log('--->',responseJson);
                if (responseJson === true) {

                    this.props.navigation.navigate("Dashboard")
                }else{
                    alert("please enter valid OTP")
                }
            // if(responseJson.userInfo !== null){

            //     if(responseJson.userInfo ? responseJson.userInfo.isDeleted : "" === true){
            //         console.log("Working ");
            //         this.setState({ err: "Account doesn't exists" })
            //     }else{
            //         let users = [...this.state.users];
                
            //         users.push({
            //             userId: responseJson.userInfo  ?  responseJson.userInfo.userID : "" ,
            //             email: responseJson.userInfo ? responseJson.userInfo.loginEmail : "",
            //             contactNo: responseJson.userInfo ? responseJson.userInfo.contactNo : "",
            //             password: responseJson.userInfo ? responseJson.userInfo.password : "",
            //         });
            
            //         this.setState({
            //             users
            //         });
                
            //         this.state.users.map(cred => {
            //             this.storeUserDetails(cred.userId);
            //             this.storeData(cred.userId , responseJson);
            //             this.props.navigation.navigate("Dashboard")
            //         });
            //     }
            // }else{
            //     this.setState({
            //         err: responseJson.message,
            //     })
            //     console.log('error--->>>',responseJson.message)
            //     // alert(responseJson.message)
            // }
            
        })
        .catch((error) => {
            //Error 
            // alert(error)
            console.error('------=->>',error);
        });
    }

    render(){


        
         if(this.state.isLoading === true){
            return(
                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <ActivityIndicator size="large" color="#f56"/>
                </View>
            )
        }else{
        return(
            <View style={styles.container}>
                {/* <Text style={styles.name} >Login</Text> */}
                <Text allowFontScaling={false} style={styles.heading}>Welcome Back</Text>

                <View style={{flexDirection:"row", justifyContent:"space-evenly", alignSelf:"stretch", marginTop:32}}>
                    <TouchableOpacity style={{borderBottomWidth: !this.state.otp ? 3 : 0, borderBottomColor:"#f56", padding:10, paddingTop:0}} onPress={() => this.setState({otp: false})}>
                        <Text allowFontScaling={false} style={[styles.label, {color:"#171919"}]}>Login By Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{borderBottomWidth: this.state.otp ? 3 : 0, borderBottomColor:"#f56",padding:10, paddingTop:0}} onPress={() => this.setState({otp: true})}>
                        <Text allowFontScaling={false} style={[styles.label, {color:"#171919"}]}>Login By OTP</Text>
                    </TouchableOpacity>
                </View>

                <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.err ? "none" : "flex"}]}> {this.state.err} </Text>

                <TextInput style={[styles.txtipt, {marginTop:32,display: !this.state.otp ? "flex" : "none"}]} placeholder="Email / Phone No." onChangeText={(text) => this.setState({email: text})} />
                <TextInput secureTextEntry={true} style={[styles.txtipt, {display: !this.state.otp ? "flex" : "none"}]} placeholder="Password"  onChangeText={(text) => this.setState({password: text})} />




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

                                 <TextInput style={[styles.txtipt, {marginTop:25}]} placeholder="search country" onChangeText={text => {this.searchUser(text)}} />
                     <View
                            style={{
                              backgroundColor: "#efefef",
                           marginHorizontal:16,
                              marginTop: 6,
                            //   width:widthPercentageToDP(90),
                              borderRadius: 6,
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


















            
              {  this.state.otp ?
              
              <View style={{ flexDirection:"row" ,  alignSelf:'stretch', }}>
                
                    <TextInput style={[styles.txtipt, { marginTop:32,   width:widthPercentageToDP(75) ,padding:10}]} placeholder="Email / Phone Noererver." onChangeText={(text) => this.setState({val: text})} />
                   
                 
                    <TouchableOpacity style={[styles.submit1, {borderRadius:8, paddingVertical:10,  }]} onPress={() => this.sendOtp()}>
                        <Ionicons name="ios-send" size={24} color="#171919" />
                    </TouchableOpacity>
                </View>
                : null
                }

                

                {/* PASSWORD */}
                <TouchableOpacity style={[styles.submit, {display:!this.state.otp ? "flex" : "none"}]} onPress={() => this.Login() }>
                    
                    <Text allowFontScaling={false} style={styles.submittxt}>LOGIN</Text>
                </TouchableOpacity>


         
            {  this.state.otp && this.state.otpSent && this.state.isActive === true ?
              <View style={{ alignSelf:"stretch"}}>
                    <TextInput style={[styles.txtipt, ]} placeholder="OTP" onChangeText={(text) => this.setState({userOtp: text})} />
                
                    {/* OTP */}
                    <TouchableOpacity style={[styles.submit]} onPress={() => this.LoginbyOTP() }>
                        <Text allowFontScaling={false} style={styles.submittxt}>LOGIN</Text>
                    </TouchableOpacity>
                </View> 
                : null
                }

                
                <Text allowFontScaling={false} style={[styles.label,{color:"#f56",fontSize:16}]} onPress={() => this.props.navigation.navigate("ResetPassword")} >forgot password?</Text>
                <Text allowFontScaling={false} style={[styles.label, {marginTop:32}]}>Don't have an account?   <Text style={{color:"#f56",fontWeight:"bold",fontSize:13}} onPress={() => this.props.navigation.navigate("RegisterScreen")} >Join Now</Text> </Text>
            </View>
        );
      }
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
        marginHorizontal:20,
        backgroundColor:"#f2f2f2",
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
        marginTop:32,

        justifyContent:'center',
        paddingHorizontal:20
    },

submit1:{
    backgroundColor:"#f56",
        padding:20,
        marginVertical:5,
        borderRadius:10,
        elevation:6,
        marginBottom:32,
        alignSelf:"stretch",
      
        marginTop:32,

      
     
},
   modalContainer:{
        flex:1,
        alignItems:"stretch",
        justifyContent:'center',
       backgroundColor: 'rgba(0,0,0,0.5)',
       
       
      
    },
   btn:{
        // backgroundColor:"#d9534f",
        borderRadius:10,
        padding:16,
        paddingVertical:14,
        width:300,
        elevation:6,
       
    },
    submittxt:{
        textAlign:"center",
        fontSize:16,
        color:"#fff",
        fontFamily:"Futura",
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
        marginTop:16
    }
})