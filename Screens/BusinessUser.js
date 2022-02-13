import React, {useState,useEffect} from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView,ToastAndroid ,ActivityIndicator } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons';
import Add from '../component/Add';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import {Picker} from '@react-native-community/picker';


export default function BusinessUser({navigation}){
 const [wait, setWait] = useState(false);
    const [next, setNext] = useState(false);
     const [work, setWork] = useState(false);
       const [isLoading, setIsLoading] = useState(false);
    const [selectedOnline, setSelectedOnline] = useState(false);
    const [selectedFace2Face, setSelectedFace2Face] = useState(false);
    const [selectedBoth, setSelectedBoth] = useState(false);
 const [acceptedModal, setAcceptedModal] = useState(false);
 const [occupationName, setOccupationName] = useState('Please Select Country');
  const [cvalue, setCvalue] = useState('Please Select Country');
   const [dataSource, setDataSource] = useState([]);        
 const [seacharry, setSeacharry] = useState([]); 

      



    //Values
    const [selected, setSelected] = useState("");
    const [education, setEducation] = useState("");
    const [experience, setExperience] = useState("");
    const [company, setCompany] = useState("");
    const [workURL, setWorkURL] = useState("");
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState("")
    const [msg25, setMsg25] = useState("")    
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [parseData, setParseData] = useState('')
    const [defaultEmail, setDefaultEmail] = useState('')
    const [defaultMobile, setDefaultMobile] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [verificationText, setVerificationText] = useState("")
    const [responseOtp, setResponseOtp] = useState("")
    const [inputOtp, setInputOtp] = useState("")
    const [userId,setUserId] = useState('')
    const category = [];
    const subCategory = [];
    const expertise = [];


// console.log("=================>>>>>>>>>>>>>", work);



 useEffect(() => {
    fetch("http://demo.wiraa.com/api/profile/GetCountryName")  // **Api for fetching**
    .then(response => response.json())
    .then((responseJson)=> {
      setDataSource( responseJson )
      setSeacharry(responseJson)
     console.log("=========>>>>>>>>>>>>>>>>>", dataSource);
    })
    .catch(error=>console.log(error))
 }, [])

const getdata = ( ) =>{
setWork(true);

}



 const  toastDuration = () => {
    ToastAndroid.show("Please select atleast one expertise", ToastAndroid.SHORT);
  }

 const  toastWait = () => {
    ToastAndroid.show("Please wait", ToastAndroid.SHORT);
  }



    const setLocalData = async() => {
        const userInfo = await AsyncStorage.getItem('userData');
        var parseData = await JSON.parse(userInfo);
        const userId = await AsyncStorage.getItem('userId')
        setUserId(userId)

        setParseData(parseData)
        setEmail(parseData.userInfo.loginEmail)
        setMobile(parseData.userInfo.contactNo)
        setDefaultEmail(parseData.userInfo.loginEmail)
        setDefaultMobile(parseData.userInfo.contactNo)

    }

    useEffect(() => { 
      (async () => setLocalData())();
    },[]);


    const getMode = (val) => {
        if(val === 1){
            setSelectedOnline(true);
            setSelectedFace2Face(false);
            setSelectedBoth(false);
            setSelected("Online");
        }else if(val === 2){
            setSelectedOnline(false);
            setSelectedFace2Face(true);
            setSelectedBoth(false);
            setSelected("Face2Face");
        }else{
            setSelectedOnline(false);
            setSelectedFace2Face(false);
            setSelectedBoth(true);
            setSelected("Both");
        }
    }

    const _pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: "application/pdf"
        });
        if (!result.cancelled) {
            console.log(result)
            setFile(result.uri)
        }
    }

    const createBusinessAccount = async() => {
        setWait(true);
        const userId = await AsyncStorage.getItem('userId')

        const createdDate = new Date().toLocaleDateString();

        const model = new FormData();

        const businessAcc = {
            "businessAccountId": 0,
            "userId": userId,
            "serviceMode": selected,
            "educationalBackground": education,
            "workingExperience": experience,
            "isCompany": false,
            "companyDescription": company,
            "companyUrl": workURL,
            "videoUrl": workURL,
            "createdDate": createdDate,
            "resumePath": file,
            "isActive": true,
            "status": 6
        }

        const CategoryList = category;
        const GradeList = subCategory;
        const SubjectList = expertise;

        model.append("businessAccount", JSON.stringify(businessAcc));
        model.append("CategoryList", JSON.stringify(CategoryList));
        model.append("GradeList", JSON.stringify(GradeList));
        model.append("SubjectList", JSON.stringify(SubjectList));
        
        if(file !== null){
            model.append("File", {
                name: file,
                type: "*/*",
                uri: file
            })
        }
        // console.log('model data ------->>',model)
        try{
            fetch("http://demo.wiraa.com/api/Profile/SaveBusinessAccount",{
            method: "POST",
            body: model
        })
        .then(response => response.json())
        .then(responseJson =>{
            // console.log("RESPONSE WORKING",responseJson);
            if (responseJson === true){
                ToastAndroid.showWithGravity(
                    "successfully",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                );
                navigation.navigate("Dashboard");
            }else{
                ToastAndroid.showWithGravity(
                    "Something went wrong!",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                );
            }
        })
        .catch( (err) => {
            // console.log("RESPONSE ERROR");
            console.log(err)
        } )

        }catch(error){
            console.log('error--->>',error)
        }

    }

    let val = 0;
    
    const Validation=()=>{
        if (education.length <= 25 || experience.length <= 25) {
            setMsg25("Please Enter minimum 25 words")
        }else if (education === "" || email === "" || email === null || email === undefined || mobile === "" || mobile === null || mobile === undefined) {
            alert("Please fill required fields.")//setMsg("required field")
        }else if( mobile && email ) sendVerification();
           // setNext(!next)
    }



 const  searchUser = (textToSearch) => {
   setSeacharry(
       dataSource.filter(i=>
        i.countryName.toLowerCase().includes(textToSearch.toLowerCase())
        ),
   );
  

}

    const sendVerification = () =>{
        if( defaultEmail ){
            setVerificationText(mobile);
            setAcceptedModal(true)

  if(occupationName !== "Please Select Country"){


            fetch("http://demo.wiraa.com/api/Profile/SendOtpOnContact?mobile="+mobile+"&c_code="+occupationName,{
                method: "POST"
            })
            .then(response => response.json())
            .then(responseJson => {
                // console.log("registered response sms-->>",responseJson)
                    if (responseJson === "Contact no. already exist.") {
                        alert("Contact no. already exist.");
                    }else if (responseJson === "Failed"){
                        alert("Failed to send OTP. Please try again!");
                    }else{
                        setModalVisible(true);
                        setResponseOtp(responseJson);
                        setAcceptedModal(true)
                    }
            })
            .catch((error)=>{
                // console.log("registered error -->>",error)
            })
        }
        }else{
            setVerificationText(email);
            fetch("http://demo.wiraa.com/api/Profile/SendOtpOnMail?email="+email,{
                method: "POST"
            })
            .then(response => response.json())
            .then(responseJson => {
                console.log("emaiul---reponse--",responseJson)
                    if(responseJson === "Email already exist."){
                        alert("Email already exist.");
                    }else if (responseJson === "Failed"){
                        alert("Failed to send OTP. Please try again!");
                    }else{
                        setModalVisible(true);
                        setResponseOtp(responseJson);
                    }
            })
            .catch((error)=>{
                console.log("registered---phone error -->>",error)
                })
        }


        
    }




    async function  verifyUser () {
        

        if(defaultEmail){
            setVerificationText(mobile);
            fetch("http://demo.wiraa.com/api/UserAccount/GetVerifyMobileOTP?contact="+mobile+"&otp="+inputOtp+"&c_code="+"IN", {
                method: 'GET'
            })
            .then((response) => response.json())
            .then((responseJson) => {

                // console.log('verify--response --get111111111>>',responseJson);
                if (responseJson === true) {
                    updateEmailMobile();
                    setModalVisible(false)
                    setNext(!next)
                    ToastAndroid.showWithGravity(
                        "OTP verify",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                    );
                }
                else{
                    alert("Please enter valid OTP!")
                }

            })
            .catch((error) => {
                //Error 
                console.error(error);
            });
        }else{
            if (responseOtp === inputOtp) {
                updateEmailMobile()
                setModalVisible(false)
                    setNext(!next)
                    ToastAndroid.showWithGravity(
                        "OTP verify",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                    );

            }else{
                alert("Please enter valid OTP!")
            }
            

        }



    } 

   const updateEmailMobile=()=>{
    

    if(defaultEmail){
      
        fetch( "http://demo.wiraa.com/api/Profile/UpdateContactno?contact="+mobile+"&userId="+userId,{
            method: 'POST',
            
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log('response mobile update',responseJson)

        })
        .catch((error) => {
            console.error('error mobile update',error);
        });
    }else{
       
       fetch("http://demo.wiraa.com/api/Profile/UpdateEmailAddress?email="+email+"&userId="+userId ,{
        method: 'POST',
       
       })
       .then((response) => response.json())
        .then((responseJson) => {
            console.log('response email update',responseJson)
        })
        .catch((error) => {
            console.error('error email update',error);
        });
        
    }

    }



    console.log("================>>>>>>>>>xxxxxxxxxx", work);
    return(
        <View style={styles.container}>

            <View style={[styles.mt,{flex:1, display: !next ? "flex": "none", alignSelf:"stretch"}]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.headerr}>
                             <Ionicons name="md-close" size={24} color="#767676" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} onPress={() => navigation.goBack()} />
                     <Text allowFontScaling={false} style={styles.heading}>Become an Professional</Text>
                       <Ionicons name="md-info" size={24} color="transparent" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} onPress={() => this.props.navigation.goBack()} />
                   
                        {/* <Feather name="chevron-right" size={24} color="transparent" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} onPress={() => this.props.navigation.goBack()} /> */}
                    </View>
                    <Text allowFontScaling={false} style={[styles.label, {fontSize:16, color:"#767676", textAlign:'center', marginBottom:16, lineHeight:20}]}>Join Our Professional Community</Text>
                    <View style={{paddingTop:5}} >
                        <Text allowFontScaling={false} style={styles.label}>Your mode of service: <Text style={{color:"#f56"}}>*</Text></Text>
                        <View style={{flexDirection:"row", alignItems:"stretch", justifyContent:'space-evenly',   }}>
                            <TouchableOpacity style={[styles.card, {backgroundColor: !selectedOnline ? "#fff" : "#f56",elevation:5}]} onPress={() => getMode(val=1)}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", fontSize:14, color:!selectedOnline ? "#171919" : "#fff", paddingHorizontal:13}}>Online</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.card, {backgroundColor: !selectedFace2Face ? "#fff" : "#f56",elevation:5}]} onPress={() => getMode(val=2)}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", fontSize:14, color:!selectedFace2Face ? "#171919" : "#fff", paddingHorizontal:13}}>Local</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.card, {backgroundColor: !selectedBoth ? "#fff" : "#f56",elevation:5}]} onPress={() => getMode(val=3)}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", fontSize:14, color:!selectedBoth ? "#171919" : "#fff", paddingHorizontal:13}}>Both</Text>
                            </TouchableOpacity>
                        </View>
                        <Text allowFontScaling={false} style={[styles.errorMessage, {display: !msg ? "none" : "flex",marginTop:"2%"}]}>{msg}</Text>
                    </View>
                    <View style={styles.mt}>
                        <Text allowFontScaling={false} style={styles.label}>Your Email: <Text style={{color:"#f56"}}>*</Text></Text>
                        <TextInput 
                            editable={defaultEmail ? false : true} 
                            value={email} 
                            onChangeText={(e)=>setEmail(e)}
                            placeholder={"Enter your Email"} 
                            multiline={true}
                            style={[styles.txtipt, {height:45, textAlignVertical:"top", paddingTop:10,elevation:5,backgroundColor:"#fff"}]}  />
                    </View>
                    {/* onChangeText={(text) => setEmail( parseData.userInfo && parseData.userInfo.loginEmail !== "" ? parseData.userInfo.loginEmail : text )} */}
                    <Text allowFontScaling={false} style={[styles.errorMessage, {display: !msg ? "none" : "flex",marginTop:"2%"}]}>{msg}</Text>
                    <View style={styles.mt}>
                        <Text allowFontScaling={false} style={styles.label}>Your Phone No.: <Text style={{color:"#f56"}}>*</Text></Text>
                        <TextInput 
                            editable={ defaultMobile ? false : true} 
                            value={mobile}
                            onChangeText={(e)=>setMobile(e)}
                            placeholder={"Enter your Phone No."} 
                            keyboardType="numeric" 
                            maxLength={10} 
                            multiline={true}
                            style={[styles.txtipt, {height:45, textAlignVertical:"top", paddingTop:10,elevation:5,backgroundColor:"#fff"}]}   />
                    </View>
                    {/* onChangeText={(text) => setMobile(parseData.userInfo && parseData.userInfo.contactNo !== "" && parseData.userInfo.contactNo !== null ? parseData.userInfo.contactNo : text)} */}
                    <Text allowFontScaling={false} style={[styles.errorMessage, {display: !msg ? "none" : "flex",marginTop:"2%"}]}>{msg}</Text>
                    <View style={styles.mt}>
                        <Text allowFontScaling={false} style={styles.label}>Your education background: <Text style={{fontSize:10, color:"#171919"}}>(Min 25 words)</Text> <Text style={{color:"#f56"}}>*</Text></Text>
                        <TextInput placeholder="Enter your education background" style={[styles.txtipt, {height:80, textAlignVertical:"top", paddingTop:10,elevation:5,backgroundColor:"#fff"}]} onChangeText={(text) => setEducation(text)} multiline={true} numberOfLines={6} />
                    </View>
                    {
                        education === "" ?
                        <Text allowFontScaling={false} style={[styles.errorMessage, {display: !msg25 ? "none" : "flex",marginTop:"2%"}]}>{msg25}</Text>
                        :
                        null
                    }
                    

                    <View style={styles.mt}>
                        <Text allowFontScaling={false} style={styles.label}>Your working experience: <Text style={{fontSize:10, color:"#171919"}}>(Min 25 words)</Text> <Text style={{color:"#f56"}}>*</Text></Text>
                        <TextInput placeholder="Enter your work experience" style={[styles.txtipt, {height:80, textAlignVertical:"top", paddingTop:10,elevation:5,backgroundColor:"#fff"}]} onChangeText={(text) => setExperience(text)} multiline={true} numberOfLines={6} />
                    </View>
                    {
                        experience === "" ?
                        <Text allowFontScaling={false} style={[styles.errorMessage, {display: !msg25 ? "none" : "flex",marginTop:"2%"}]}>{msg25}</Text>
                        :
                        null
                    }
                    
                    <View style={styles.mt}>
                        <Text allowFontScaling={false} style={styles.label}>Own a Company? (If any)</Text>
                        <TextInput placeholder="Tell us about your company" style={[styles.txtipt,{elevation:5,backgroundColor:"#fff"}]} onChangeText={(text) => setCompany(text)} />
                    </View>
                   
                    <View style={styles.mt}>
                        <Text allowFontScaling={false} style={styles.label}>Paste your work URL:</Text>
                        <TextInput placeholder="Paste work URL" style={[styles.txtipt,{elevation:5,backgroundColor:"#fff"}]} onChangeText={(text) => setWorkURL(text)} />
                    </View>

                    <View style={[{alignItems:"center"}, styles.mt ]}>
                        <TouchableOpacity style={[styles.btn, {backgroundColor:"#008489", borderRadius:30, width:150}]} onPress={() => _pickDocument()}>
                            <Text allowFontScaling={false} style={styles.btntxt}>Upload CV</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.mt,{alignItems:"flex-end", marginBottom:32, marginTop:48}]}>
                        <TouchableOpacity style={[styles.btn, {width:100}]} onPress={() => Validation()}>
                            <Text allowFontScaling={false} style={styles.btntxt}>NEXT</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
<View style={{justifyContent:'center', alignItems:'center' , marginLeft:-18}}   > 
            <View style={{display: next ? "flex" : "none", marginBottom:32}}>
                <Add 
                
            getdata={getdata}
                cat={category} subCat={subCategory} expt={expertise}  />

                <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:16, marginTop:6}}>
                    <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676", width:150}]} onPress={() => setNext(!next) }>
                        <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>PREVIOUS</Text>
                    </TouchableOpacity> 


  {/* if(this.state.isLoading === true){
            return(
                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <ActivityIndicator size="large" color="#f56"/>
                </View>
            )
        }else{ */}

         {    work ?
                  
                    <TouchableOpacity     style={[styles.btn, {width:150}]}
                    onPress={() =>  { wait ?  toastWait() :  createBusinessAccount()  ,    setIsLoading(true) }  }>
 
                   { 
                   
                   isLoading === true ?
                   <View style={{ justifyContent:"center", alignItems:"center"}}>
                    <ActivityIndicator size="small" color="#fff"/>
                    </View>   

                      : <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>FINISH</Text> 
                       
                       }
              
                    </TouchableOpacity>

        :


                     <TouchableOpacity   style={[styles.btn, {width:150}]}
                     onPress={() => { toastDuration() }  }>
 
                    <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>FINISH</Text> 
                    
                    </TouchableOpacity>




                     
                     }


                </View>
            </View>
</View>


     <Modal
                        transparent={true}
                        animationType="slide"
                        visible={acceptedModal}
                        // onRequestClose={() => this.setState({acceptedModal:!this.state.acceptedModal})}
                    >

                          <View style={[styles.modalContainer1]}>
                          <View style={{backgroundColor:"#fff" , paddingVertical:10, borderRadius:16,  marginHorizontal:10,  }} >

                              <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"black", textAlign:"center", fontWeight:'bold', paddingVertical:10, fontSize:18}}>Please Select Country</Text> 
                         <View style={{   alignSelf:'stretch', }}>

                                 <TextInput style={[styles.txtipt1, {marginTop:25}]} placeholder="search country"
                                  onChangeText={text => {searchUser(text)}} />
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
                              selectedValue={occupationName}
                              onValueChange={(itemValue, itemIndex) =>
                                setOccupationName(itemValue )
                              }
                            >
  {/* <TextInput style={[styles.txtipt, { marginTop:32,   width:widthPercentageToDP(75) ,padding:10}]}
   placeholder="search here." onChangeText={text =>{ this.searchUser(text);}} /> */}

                              <Picker.Item 
                            label={cvalue} 
                            value="Please Select Country"
                            style={{fontSize:50, height:20}} />
                           
                               {seacharry.map((item) => (
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
                                <Text allowFontScaling={false}  onPress={() =>  setAcceptedModal(false)}  style={{fontFamily:"Futura", color:"#fff", textAlign:"center", 
                                  fontSize:14}}>cancle</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={occupationName === "Please Select Country" ? true : false}   style={[styles.btn, {backgroundColor:"#f56", width:100}]}
                            onPress={() => sendVerification()}>
                                <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#fff", textAlign:"center", fontSize:14}}>Done</Text>
                            </TouchableOpacity>
</View>
       
                        </View>
                        </View>
                        </Modal>






                <Modal
                    transparent={false}
                    animationType="fade"
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible)
                    }}
                    >
               
                        <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:64,fontWeight:"bold"}]}>Verification</Text>
                        <View>
                         
                            <Text  allowFontScaling={false} style={styles.label}>Verification code has been sent to <Text style={{fontFamily:"Futura", fontWeight:"bold", fontSize:18}}>{verificationText}</Text> </Text>
                            
                                <Text allowFontScaling={false} style={styles.label}>Enter OTP</Text>
                                <TextInput style={styles.txtipt} onChangeText={(text) => setInputOtp(text)} />
                            
                        </View>
                        {/* onPress={() => this.register()} */}
                        <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:16, marginTop:6}}>
                            <TouchableOpacity style={[styles.btnModal, {backgroundColor:"#767676"}]} onPress={()=>setModalVisible(false)} > 
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>Resend Otp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnModal} onPress={() => verifyUser()}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>Verify OTP</Text>
                            </TouchableOpacity>
                        </View>
                    <TouchableOpacity style={[styles.btnModal,{backgroundColor:"#fff",alignSelf:"center"}]} onPress={() => setModalVisible(!modalVisible)}>
                        <Text allowFontScaling={false} style={{fontFamily:"OpenSans",color:"black", textAlign:"center",fontWeight:"bold"}}>Cancel</Text>
                    </TouchableOpacity>
                 

                </Modal>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"flex-start",
        justifyContent:"flex-start",
        backgroundColor:"#fff",
    },
    headerr:{
        flexDirection:"row",
        paddingTop:30, 
        alignSelf:"stretch", 
        justifyContent:"space-between", 
        paddingBottom:6,
        paddingHorizontal:10,
        paddingBottom:0,
    },
    heading:{
        fontFamily:"Futura",
        fontSize:22,
        marginTop:6,
        textAlign:"center",
        color:"#171919",
    },
    label:{
        fontFamily:"OpenSans",
        color: "#171919",
        fontSize:16,
        lineHeight:30,
        marginHorizontal:16,
    },
    card:{
        margin:6, 
        padding:widthPercentageToDP(5),
        paddingVertical:14, 
        borderRadius:10,
        backgroundColor:"#f56",
        
    },
    txtipt:{
        borderRadius:6,
        paddingHorizontal:6,
        marginVertical:6,
        alignSelf:"stretch",
        fontFamily:"OpenSans",
        marginHorizontal:0,
        backgroundColor:"#eaeaea",
        height:50,
        marginHorizontal:16,
        fontSize:widthPercentageToDP(4)
    },
    btn:{
        backgroundColor:"#f56",
        borderRadius:10,
        padding:16,
        paddingVertical:14,
        marginVertical:14,
        width:"45%",
        elevation:6,
        marginHorizontal:16
    },
    btnModal:{
        backgroundColor:"#f56",
        borderRadius:10,
        padding:16,
        paddingVertical:14,
        marginVertical:14,
        width:"45%",
        elevation:6,
    },
    btntxt:{
        textAlign:"center",
        fontSize:14,
        color:"#fff",
        fontFamily:"Futura",
    },
    mt:{
        marginTop:10,
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
    // heading:{
    //     fontFamily:"Futura",
    //     fontSize:30,
    //     padding:32,
    //     paddingBottom:6,
    //     alignSelf:"center",
    //     color:"#171919",
    //     paddingTop:48,
    // },

})