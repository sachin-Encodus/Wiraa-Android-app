import React from 'react'
import { View, Text, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import {Picker} from '@react-native-community/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP } from 'react-native-responsive-screen';

export default class PostRequest extends React.Component{
    constructor(props){
        super(props);
    this.state = {
            service:"",
            cat:[],
            subCat:[],
            expertise:[],
            mode:"",
            city:"",
            prefDate:"",
            budget:"",
            budgetType:"",
            userId:  this.props.route.params && this.props.route.params.fkUserProfileId  ?  this.props.route.params.fkUserProfileId : 0 ,
            catTexts: "Select Category",
            catText: "Select Category",
            subCatTexts:"Select Sub Category",
            subCatText:"Select Sub Category",
            isActive: [],
            selectedOnline: false,
            selectedF2F: false,
            selectedImd: false,
            selectedDate: false,
            isDatePickerVisible: false,
            month:null,
            day:null,
            year:null,
            cirId: null,
            gradeId: null,
            selected:"",
            msg:"",
            errBudget:"",
            errBudgetType:"",
            errCatText:"",
            errDate:"",
            errMode:"",
            errService:"",
            errSubCatText:"",
            valueOfSubcat:"",
            valueOfCat:"",
            cityName:"",
            allCity:[]
        };
    
    }
   
    componentDidMount(){    
         //GET CATEGORY
         console.log("===>>>>>>>>>>>", this.state.userId);
         fetch(this.state.userId === 0 ? 
            "http://demo.wiraa.com/api/Users/GetCategory" :
             "http://demo.wiraa.com/api/profile/GetUserCurriculum?userId="+ this.state.userId)
        //   fetch("http://demo.wiraa.com/api/Users/GetCategory")
         .then(response => response.json())
         .then(responseJson => {
            let cat = [];
            responseJson.map(item => {
                cat.push({
                    id: item.curriculumID, 
                    name: item.curriculumName,
                })
                console.log("response-->>",responseJson)
                this.setState({ cat })
            })
         })

    //    if (this.props.route.params) {
    //        this.setState({ catText : this.props.route.params.id })
    //    }

            // this.setState({})
        // if(this.props.route.params){
        //     const { catText, cirId, subCatText, gradeId } = this.props.route.params;
        //     this.setState({ catText, cirId, subCatText, gradeId })
        //     this.getSpeciality(gradeId)
        // }
        // this.getCity()

    }

    getSubCategory = (itemValue) => {
console.log("========================>>>>>>>>>>>>xxxxxxxxx", this.state.cirId);
        this.setState({valueOfCat:itemValue})
        
        if(this.state.cirId === null ){
            this.setState({
                catText: itemValue
            })
        }else{
            this.setState({
                catText
            })  
        }

        console.log(itemValue);

         //GET SUB CATEGORY
        fetch("http://demo.wiraa.com/api/Users/GetSubCategory?catId="+ itemValue)
    //  fetch("http://demo.wiraa.com/api/Users/GetSubCategory?catId="+ itemValue )
        .then(response => response.json())
        .then(responseJson => {

            let subCat = [];
            responseJson.map(item => {
            subCat.push({
                catId: item.curriculum.curriculumID,
                id: item.gradeID,
                name: item.gradeName,
            })
            
                this.setState({ subCat })
            })
        })

    }

    getSpeciality = (itemValue, ) => {
        this.setState({valueOfSubcat:itemValue})
        console.log('88888888888888888**',itemValue);
            this.setState({
                subCatText: itemValue
            });
         //GET SPECIALITY
         fetch( "http://demo.wiraa.com/api/Users/GetExpertise?subCatId="+itemValue)
         .then(response => response.json())
         .then(responseJson => {
             let expertise = [];
             responseJson.map(item => {
                 expertise.push({
                    catId: item.fkCurriculumID,
                    id: item.subjectID,
                    name: item.subjectName,
                 })
                    this.setState({ expertise })
              })
         })
    }

      onChange = (date) => {
        var mdate = new Date(date);

        var day = mdate.getDate();
        var month = mdate.getMonth()+1;
        var year = mdate.getFullYear();

        this.setState({
            day: day,
            month: month,
            year: year,
        })

          this.hideDatepicker();
      }

      showDatepicker = () => {
        this.setState({
            isDatePickerVisible: true,
            selectedDate: true, 
            selectedImd: false
        })
      };

      hideDatepicker = () => {
        this.setState({
            isDatePickerVisible: false,
        })
      };

    changeIsActive = (id) => {

        let isActive = [...this.state.isActive];

        isActive.includes(id) ? isActive.filter(s=> s !== id) : isActive.push(id);

        this.setState({isActive});

    }

    validation=()=>{
        if (this.state.service === "" || this.state.catText === "" || this.state.subCatText === "" ||  
        this.state.selected === "" || this.state.selectedDate === "" || this.state.budget === "" || this.state.budgetType === "" || 
        this.state.service.length <=25
        ){
            this.setState({errService:"Please describe service!",errCatText:"Please choose catergory!", 
            errSubCatText:"Please choose sub category!",errMode:"Please select mode of service!", 
            errDate:"Please select starting service date!",errBudget:"Please enter your project budget!",errBudgetType:"Please select budget type!",msg:"Please enter minimum 25 words"})
        }else{
            this.postRequest()
        }
    }

    getCity=(text)=>{

     const searchText = text.toLowerCase();

    if (searchText !== "" && searchText.length > 3) {
      fetch("http://demo.wiraa.com/api/Profile/GetCity")
        .then((respone) => respone.json())
        .then((responseJson) => {
          const city = responseJson.filter((item) =>
            item.cityName.toLowerCase().match(searchText)
          );
          this.setState({city:city });
          console.log('44444444444',this.state.city)
        });
    } else {
      console.log("nothing to show");
    }

    }

    cityChange=(cityName)=>{
        console.log('qqqqqqqqqqq',cityName)
        this.setState({cityName: cityName})
    }


    postRequest = async() => {
        console.log('enter post request ---->>>')
        const userId = await AsyncStorage.getItem('userId')
        if(userId !== null) {

        }else{
            console.log("null")
        }
        var currentDate = new Date()
        var day = currentDate.getDate()
        var month = currentDate.getMonth() + 1
        var year = currentDate.getFullYear()
        try{   
            var data ={
                "postreqID": Math.floor(Math.random() * 100),
                "pR_Description" : this.state.service,
                "pR_FKCatID" : this.state.catText,
                "pR_FKSubCategoryID": this.state.subCatText,
                "expertise": this.state.isActive.join(","),
                "serviceMode": this.state.selectedOnline === true ? "Online" : "Face-2-Face",
                "city": this.state.cityName,
                "budget": this.state.budget,
                "workType": this.state.budgetType,
                "postStatus": "Active",
                "postValidity": 7,
                "validityStatus": false,
                "userid": userId,
                "serviceStartDate": this.state.day+"/"+this.state.month+"/"+this.state.year  ? this.state.day+"/"+this.state.month+"/"+this.state.year : day+"/"+month+"/"+year,
                "applyDate": day+"/"+month+"/"+year,
                "preferService": this.state.selectedImd === true ? "As soon as possible" : "",
                "directUserId": this.state.userId

            }            

        //    console.log("data---111----->>",data)
           
            fetch("http://demo.wiraa.com/api/Users/SavePostRequirement",{
                method: "POST",
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(responseJson => {
                console.log('==================>>>',responseJson)
                   if (responseJson === "success" ) {
                     ToastAndroid.showWithGravity(
                        'Post Sucessfully',
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                    );
                    this.props.navigation.navigate('Manage', {myOrder:"MYORDER" });
                    // this.props.navigation.navigate('Dashboard', { screen: 'Manage' });
                   }else if(responseJson.message){
                    ToastAndroid.showWithGravity(
                        `${responseJson.message}`,
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                    );                    
                  } 

                console.log('body------------->',responseJson)

                // alert(responseJson.message)

            })
        
    } catch(error){
        alert(error)
        console.log("----->>>catch",error)
    }
        
    }

    render(){
        console.log("props request page 11111111111---==>>",this.props)
        this.state.isActive.map(item => {
            console.log('item request page',item)
        })

        return(
            
            <View style={styles.container}>
                <View style={[styles.headerr]}>
                 
                    <Ionicons name="md-close" size={24} color="#767676" style={{zIndex: 999999, padding:6, paddingHorizontal:0}} onPress={() => this.props.navigation.goBack()} />
                    <Text allowFontScaling={false} style={[styles.heading]}>Post a Request</Text>
                    {/* <Ionicons name="send" size={24} color="#f56" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} onPress={() => this.props.navigation.goBack()} /> */}
                     {/* <Ionicons name="md-close" size={24} color="#767676" style={{zIndex: 999999, padding:6,   paddingHorizontal:0}} onPress={() => this.props.navigation.goBack()} /> */}
                    <Ionicons name="md-info" size={24} color="transparent" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} onPress={() => this.props.navigation.goBack()} />
                </View>
                <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                
                    <Text allowFontScaling={false} style={styles.label}>Describe the service you are looking for.. <Text style={{fontSize:10, color:"#171919"}}>(Min 25 words)</Text>  <Text style={{color:"#f56"}}>*</Text></Text>
                    <View style={{marginHorizontal:widthPercentageToDP("1%")}}>
                    <TextInput selectionColor="#efefef" underlineColor="#efefef" style={[styles.txtipt,{marginTop:10,backgroundColor:"#efefef",elevation:5}]} multiline={true} onChangeText={(text) => this.setState({service: text})} numberOfLines={6} placeholder="I am looking for..." />
                    </View>
                    {/* <Text style={{color:"red"}}>min 25 words required*</Text> */}
                    {
                       this.state.service === "" ?      
                       <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.errService ? "none" : "flex",marginTop:"2%"}]}>{this.state.errService}</Text>   
                       :    this.state.service.length <=25
                       ? <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.msg ? "none" : "flex",marginTop:"2%"}]}>{this.state.msg}</Text>
                        :
                       null
                    }

                    {/* <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.msg ? "none" : "flex",marginTop:"2%"}]}>{this.state.msg}</Text>    */}
                    <Text allowFontScaling={false} style={styles.label}>Choose a Category: <Text style={{color:"#f56"}}>*</Text></Text>
                    
    
                    <View style={{alignSelf:"stretch", backgroundColor:"#efefef", marginTop:10, borderRadius:6,elevation:2,marginHorizontal:"1%"}}>
                        <Picker
                            mode="dropdown"
                            selectedValue={this.state.catText}
                            style={{height: 50, fontSize:5}}
                            onValueChange={(itemValue, itemIndex) => { this.state.cirId !== null ? this.getSubCategory( this.state.cirId) :
                                 this.getSubCategory(itemValue,this.state.userId) } }
                        >
                            <Picker.Item 
                            label={this.state.catTexts} 
                            style={{fontSize:5}} />
                            {this.state.cat.map(item => (
                                <Picker.Item key={item.id} label={item.name} value={item.id} />
                            ))}
                        </Picker>
                        
                    </View>

                    {
                        this.state.valueOfCat === "" ? 
                        <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.errCatText ? "none" : "flex",marginTop:"2%"}]}>{this.state.errCatText}</Text>                
                        :
                        null

                    }
                   
                    <Text allowFontScaling={false} style={styles.label}>Choose a Sub Category: <Text style={{color:"#f56"}}>*</Text></Text>
                    
                    <View style={{alignSelf:"stretch", backgroundColor:"#efefef", marginTop:10, borderRadius:6,elevation:2,marginHorizontal:"1%"}}>
                        <Picker
                            mode="dropdown"
                            selectedValue={this.state.subCatText}
                            style={{height: 50}}
                            itemStyle={{ fontSize:3 }}
                            onValueChange={(itemValue, itemIndex) =>{this.state.gradeId !== null ? this.getSpeciality(this.state.gradeId) : this.getSpeciality(itemValue) } }
                        >
                            <Picker.Item label={this.state.subCatTexts} />
                            {this.state.subCat.map(item => (
                                <Picker.Item key={item.id} label={item.name} value={item.id} />
                            ))}
                        </Picker>
                    </View>
                    {
                        this.state.valueOfSubcat === "" ? 
                        <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.errSubCatText ? "none" : "flex",marginTop:"2%"}]}>{this.state.errSubCatText}</Text> 
                        :   
                        null
                    }
                    
                    <View style={{height:200, display: this.state.subCatText === "Select Sub Category" ? "none" : "flex" }}> 
                        <Text allowFontScaling={false} style={styles.label}>Select Expertise(optional)</Text>
                        <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ paddingTop:6, flexDirection:"row", flexWrap:"wrap", justifyContent:'center', }}>
                            {this.state.expertise.map(item => (
                                <TouchableOpacity key={item.id} onPress={() => this.changeIsActive(item.id)} style={{}}>
                                    <Text allowFontScaling={false} style={[styles.active, {alignSelf:"flex-start", backgroundColor: this.state.isActive.includes(item.id) ? "#f56" : "#efefef",color:this.state.isActive.includes(item.id) ? "#fff" : "black" ,elevation:5}]}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                  

                    <Text allowFontScaling={false} style={styles.label}>Choose your mode of service: <Text style={{color:"#f56"}}>*</Text></Text>
                    <View style={{flexDirection:"row", flex:1,justifyContent:"center"}}>
                        <TouchableOpacity style={[styles.card, {backgroundColor: this.state.selectedOnline ? "#f56" : "#efefef",elevation:7}]}  onPress={() => this.setState({selectedOnline: true, selectedF2F: false, selected: "Online"})}>
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", textAlign:"center", color: this.state.selectedOnline ? "#fff" : "black"}}>Globally</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.card, {backgroundColor: this.state.selectedF2F ? "#f56" : "#efefef",elevation:7}]} onPress={() => this.setState({selectedOnline: false, selectedF2F: true, selected: "Face2Face"})}>
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", textAlign:"center",color: this.state.selectedF2F ? "#fff" : "black"}}>Locally</Text>
                        </TouchableOpacity>
                    </View>

                    {
                        this.state.selected === "" ? 
                        <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.errMode ? "none" : "flex",marginTop:"2%"}]}>{this.state.errMode}</Text> 
                        :
                        null

                    }
                    
                    <View style={{display: this.state.selectedF2F === true ? "flex" : "none"}}>
                        <Text allowFontScaling={false} style={[styles.label,{marginBottom:"2%"}]}>City</Text>
                        <View style={{marginHorizontal:"1%",backgroundColor:"#efefef",borderRadius:6,elevation:7}}>
                        {/* <Picker
                            mode="dropdown"
                            selectedValue={this.state.cityName}
                            style={{height: 50}}
                            onValueChange={(itemValue, itemIndex) => {this.setState({city:itemValue}),this.getCity()} }
                        >
                            <Picker.Item label={this.state.cityName} />
                            
                            {this.state.cat.map(item => (
                                <Picker.Item key={item.id} label={item.name} value={item.id} />
                            ))}
                        </Picker> */}
                         <TextInput selectionColor="#efefef" underlineColor="#efefef" style={[styles.txtipt, {height:50, display:"flex",backgroundColor:"#fff",elevation:5,paddingLeft:8}]} 
                         onChangeText={(text) => this.getCity(text)} placeholder={this.state.cityName} />
                        </View>
                        <ScrollView>
                        {
                        this.state.city?
                        this.state.city.map((item, index) => (

                      <TouchableOpacity
                        key={index}
                        style={{ backgroundColor: "#f9f9f9", marginTop: 6 }}
                        onPress={()=>this.cityChange(item.cityName)}
                      >
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: "Futura",
                            color: "#171919",
                            fontSize: 16,
                            padding: 14,
                          }}
                        >
                          {item.cityName}
                        </Text>
                      </TouchableOpacity>
                    ))
                    :
                    null
                        }
                        </ScrollView>
                    </View>              
                    <Text allowFontScaling={false} style={styles.label}>Preferred service starting date: <Text style={{color:"#f56"}}>*</Text></Text>
                    <View style={{flexDirection:"row",justifyContent:"center"}}>
                        <TouchableOpacity style={[styles.card, {backgroundColor: this.state.selectedImd ? "#f56" : "#efefef",elevation:7}]} onPress={() => this.setState({selectedImd: true, selectedDate: false})}>
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", textAlign:"center",elevation:7,color: this.state.selectedImd ? "#fff" : "black"}}>Immediate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.card, {backgroundColor: this.state.selectedDate ? "#f56" : "#efefef",elevation:7}]} onPress={this.showDatepicker}>
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", textAlign:"center",color: this.state.selectedDate ? "#fff" : "black"}}> {this.state.day !== null ? this.state.day+"/"+this.state.month+"/"+this.state.year : "Pick Date"} </Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.selectedDate === false && this.state.selectedImd === false ?
                        <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.errDate ? "none" : "flex",marginTop:"2%"}]}>{this.state.errDate}</Text> 
                        :
                        null

                    }
                    
                    <DateTimePickerModal
                        isVisible={this.state.isDatePickerVisible}
                        mode="date"
                        onConfirm={this.onChange}
                        onCancel={this.hideDatepicker}
                    />

                    {/* <Text allowFontScaling={false} style={{fontFamily:"OpenSans", textAlign:"center"}}>Pick Date</Text> */}
                    
                    <Text allowFontScaling={false} style={styles.label}>Preferred Project Budget: <Text style={{color:"#f56"}}>*</Text></Text>
                    <View style={{marginHorizontal:"1%"}}>
                    <TextInput selectionColor="#efefef"   keyboardType='phone-pad'  underlineColor="#efefef" style={[styles.txtipt, {height:50, marginTop:10,elevation:2,backgroundColor:"#efefef"}]} onChangeText={(text) => this.setState({budget: text})} placeholder="₹" />
                    </View>
                    {
                        this.state.budget  === "" ?
                        <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.errBudget ? "none" : "flex",marginTop:"2%"}]}>{this.state.errBudget}</Text> 
                        :
                        null

                    }
                    
                    <View style={{flexDirection:"row",justifyContent:"center"}}>
                        <TouchableOpacity style={[styles.card, {backgroundColor: this.state.budgetType === "Per Hour" ? "#f56" : "#efefef", elevation:7}]} onPress={() => this.setState({budgetType: "Per Hour"})}>
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", textAlign:"center",color:this.state.budgetType === "Per Hour" ? "#fff" : "black"  }}>Per Hour</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.card, {backgroundColor: this.state.budgetType === "Per Day" ? "#f56" : "#efefef",elevation:7}]} onPress={() => this.setState({budgetType: "Per Day"})}>
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", textAlign:"center",color:this.state.budgetType === "Per Day" ? "#fff" : "black"}}>Per Day</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"center"}}>
                        <TouchableOpacity style={[styles.card, {backgroundColor: this.state.budgetType === "Per Month" ? "#f56" : "#efefef",elevation:7}]} onPress={() => this.setState({budgetType: "Per Month"})}>
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", textAlign:"center",color:this.state.budgetType === "Per Month" ? "#fff" : "black"}}>Per Month</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.card, {backgroundColor: this.state.budgetType === "Complete Work" ? "#f56" : "#efefef",elevation:7}]} onPress={() => this.setState({budgetType: "Complete Work"})}>
                            <Text allowFontScaling={false} style={{fontFamily:"OpenSans", textAlign:"center",color:this.state.budgetType === "Complete Work" ? "#fff" : "black"}}>Complete Work</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.budgetType === "" ?
                        <Text allowFontScaling={false} style={[styles.errorMessage, {display: !this.state.errBudgetType ? "none" : "flex",marginTop:"2%"}]}>{this.state.errBudgetType}</Text> 
                        :
                        null
                    }
                    
                    <View style={{alignSelf:"stretch"}}>
                        <TouchableOpacity style={[styles.btn]} onPress={() => this.validation()}>
                            <Text allowFontScaling={false} style={styles.btntxt}>SUBMIT</Text>
                        </TouchableOpacity>
                    </View>
                    
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#fff",
        paddingHorizontal:16
    },
    headerr:{
        flexDirection:"row",
        paddingTop:30, 
        alignSelf:"stretch", 
        justifyContent:"space-between", 
     
        paddingBottom:6,
        paddingBottom:0,
        borderBottomWidth:1,
        borderBottomColor:"#efefef"
    },
    heading:{
        fontFamily:"Futura",
        fontSize:22,
        marginTop:10,
        textAlign:"center",
        color:"#171919",
        paddingBottom:10,
    },
    label:{
        alignSelf:"flex-start",
        fontSize:16,
        paddingLeft:0,
        paddingTop:16,
        color:"black",
        fontFamily:"Futura",
    },
    txtipt:{
        borderRadius:10,
        paddingHorizontal:8,
        alignSelf:"stretch",
        fontFamily:"OpenSans",
        fontSize:widthPercentageToDP("4%"),
    },
    card:{
        margin:6,
        padding:24,
        paddingVertical:14, 
        borderRadius:10,
        backgroundColor:"#efefef",
        marginTop:10,
        width:widthPercentageToDP("40%"),
    },
    btn:{
        backgroundColor:"#f56",
        borderRadius:10,
        padding:16,
        paddingVertical:14,
        elevation:6,
        // height:55,
        marginTop:16,
        marginBottom:16

    },
    btntxt:{
        textAlign:"center",
        fontSize:widthPercentageToDP("4%"),
        color:"#fff",
        fontFamily:"Futura",
        // paddingTop:6
    },
    active:{
        padding:10, 
        backgroundColor:"#efefef",
        borderRadius:6, 
        color:"#171919",
        margin:3,
        fontFamily:"OpenSans",
        fontSize:12,
    },
    inActive:{
        padding:10, 
        backgroundColor:"#f9f9f9",
        borderRadius:6, 
        color:"#171919",
        margin:6,
        fontFamily:"OpenSans",
        fontSize:12,
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