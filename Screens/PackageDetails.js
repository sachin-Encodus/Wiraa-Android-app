import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView,AsyncStorage } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// import RazorpayCheckout from 'react-native-razorpay';


export default class PackageDetails extends React.Component{
constructor(props){
    super(props);
    this.state = {
        email: "",
        password:"",
        fName:"",
        mobile:"",
        err:"",
        modalVisible: false,
        parseData:'',
        validOneMonth:""
        
    }

}
   
async componentDidMount() {

    const userInfo = await AsyncStorage.getItem('userData');
        var parseData = await JSON.parse(userInfo);
        this.setState({ parseData: parseData })
        console.log("userData-->",parseData)

        
        var newDate = new Date
        console.log("newDate",newDate)
        var addOneMonth  = newDate.setMonth(newDate.getMonth()+1);

        this.setState({validOneMonth : addOneMonth})

}


    register = async () =>{
                    
        



    //   try{
    //     var options = {
    //         description: 'Credits towards consultation',
    //         image: 'https://i.imgur.com/3g7nmJC.png',
    //         currency: 'INR',
    //         key: 'OECHxolrjbfnhDo03PprX81D',
    //         amount: '5',
    //         name: 'foo',
    //         prefill: {
    //           email: 'void@razorpay.com',
    //           contact: '7746817860',
    //           name: 'Razorpay Software'
    //         },
    //         theme: {color: '#F37254'}
    //       }
    //      await RazorpayCheckout.open(options)
    //      .then((data) => {
    //         // handle success
    //         alert(`Success: ${data.razorpay_payment_id}`);
    //         console.log('razor pay response--->>',data)
    //       }).catch((error) => {
    //         // handle failure
            
    //         console.log('razor pay error--->>',error)
    //       });
    //   }
    //   catch(err){
    //       alert(err)
    //   }
        
    }


    render(){
        console.log("props package details--->>",this.props.route.params.packageDetails)
        const {params} = this.props.route.params
        return(
            <View style={[styles.container, {backgroundColor: this.state.modalVisible ? "#000" : "#fff", opacity:this.state.modalVisible ? 0.2 : 1}]}>
               <View style={[styles.headerr]}>
                    <Text allowFontScaling={false} style={[styles.heading, {fontSize:24, paddingLeft:16}]}>Package Confirmation</Text>
                    {/* <Ionicons name="send" size={24} color="#f56" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} onPress={() => this.props.navigation.goBack()} /> */}
                    <Ionicons name="md-close" size={24} color="#767676" style={{zIndex: 999999, position:"absolute", top:50, right:16}} onPress={() => this.props.navigation.goBack()} />
                </View>
                <View style={{width:"92%",marginLeft:"auto",marginRight:"auto"}}>

                <LinearGradient
                      // Button Linear Gradient
                      start={[0.4, 0.3]}
                      colors={["#EF4845", "#A22DB3"]}
                      style={{backgroundColor:"#efefef",borderRadius:10,paddingBottom:"5%"}}
                    >
                            {/* <View style={{ backgroundColor:"#efefef", paddingBottom:16, alignSelf:"stretch"}}> */}

                            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingHorizontal:16}}>
                                <Text style={[styles.name,{color:"#fff"}]}>{this.props.route.params.packageDetails.name}{" "}{"Plan"}</Text>
                                <Text style={[styles.name,{color:"#fff"}]}>₹ {this.props.route.params.packageDetails.price}</Text>
                            </View>

                            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center",paddingHorizontal:16}}>
                                <Text style={[styles.name,{color:"#fff"}]}>Connects:{this.props.route.params.packageDetails.connects}</Text>
                                <Text style={[styles.name,{color:"#fff"}]}>{this.state.validOneMonth}</Text>
                            </View>

                            {/* </View> */}


                    </LinearGradient>
                    </View>

                <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.err ? "none" : "flex"}]}> {this.state.err} </Text>
                <Text style={styles.name}>Username</Text>
                <TextInput style={[styles.txtipt]} editable={false} onChangeText={(text) => this.setState({ fName: text }) } placeholder={this.state.parseData.userInfo ? this.state.parseData.userInfo.userName : "name"} />
                <Text style={styles.name}>Email Id</Text>
                <TextInput style={styles.txtipt} editable={this.state.parseData.userInfo && this.state.parseData.userInfo.loginEmail !==null ? false : true}  onChangeText={(text) => this.setState({ email: text }) } placeholder={this.state.parseData.userInfo && this.state.parseData.userInfo.loginEmail ? this.state.parseData.userInfo.loginEmail : "Email"} />
                <Text style={styles.name}>Phone No.</Text>
                <TextInput style={styles.txtipt}  editable={this.state.parseData.userInfo && this.state.parseData.userInfo.contactNo !==null ? false : true} onChangeText={(text) => this.setState({ mobile: text }) } placeholder={this.state.parseData.userInfo && this.state.parseData.userInfo.contactNo !==null ? this.state.parseData.userInfo.contactNo  : "Contact No."} />
                <TouchableOpacity style={styles.submit} onPress={() => this.register()}>
                    <Text allowFontScaling={false} style={styles.submittxt}>SUBMIT</Text>
                </TouchableOpacity>

            </View>
        );
      }
    }
      
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"flex-start",
        alignItems:"flex-start",
        backgroundColor:"#fff"
    },
    headerr:{
        flexDirection:"row",
        paddingTop:0, 
        alignSelf:"stretch", 
        justifyContent:"space-between", 
        paddingBottom:6,
        paddingBottom:0,
        borderBottomWidth:0,
        borderBottomColor:"#efefef"
    },
    heading:{
        fontFamily:"Futura",
        fontSize:22,
        marginTop:6,
        textAlign:"center",
        color:"#171919",
        paddingBottom:10,
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
        fontSize:18,
        marginTop:0
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