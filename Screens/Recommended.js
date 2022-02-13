import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native'
import { FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class Recommended extends React.Component{

    state={
        recommendations:[],
        userProfileId:"",
        subCat:[],
    }

    componentDidMount = async() => {

        const userProfileId = await AsyncStorage.getItem('userPrfileId')
        if(userProfileId !== null) {
            this.setState({userProfileId})
        console.log(userProfileId);
        }else{
            console.log("null")
        }

        const {cat, catId} = this.props.route.params;

        fetch("http://demo.wiraa.com/api/Network/ExploreRecommendedUser?userProfileId="+userProfileId+"&CatName="+cat, {
            method:"POST"
        })
        .then(response => response.json())
        .then((responseJson) => {
            let recommendations = [...this.state.recommendations];
            responseJson.map(item => {
                recommendations.push({
                    fkUserProfileId: item.fkUserProfileID,
                    userName: item.firstName+" "+item.lastName,
                    occupation: item.occupation,
                    profilePic: item.profilePic,
                    isFollow: item.isFollow,
                })
                this.setState({ recommendations });
            })
        })
        .catch(error => {
            console.log(error);
        })

        fetch("http://demo.wiraa.com/api/Users/GetSubCategory?catId="+catId)
        .then(response => response.json())
        .then(responseJson => {
            let subCat = [];
            responseJson.map(item => {
                subCat.push({
                    id: item.$id,
                    cirId:item.fkCurriculumID,
                    cirName: item.curriculum.curriculumName,
                    gradeId:item.gradeID,
                    gradeName: item.gradeName,
                })
            })
            this.setState({ subCat })
        })
    }

    renderRecommendations = (item, index) => {
        return(
            <View style={{flex:1, alignItems:"center", justifyContent:"center", marginTop:16, borderRightWidth:1, borderRightColor:"#efefef", width:150, backgroundColor:"#efefef", borderRadius:10, marginLeft:10}}>
                {/* <Ionicons name="ios-close" size={30} color="#171919" style={{position:"absolute", top:0, right:15}} /> */}
                <TouchableOpacity onPress={() => item.fkUserProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.fkUserProfileId}) : this.props.navigation.navigate("Profile") } >
                    <Image style={{width:60, height:60, borderRadius:60}} source={{uri: item.profilePic === null ? "http://demo.wiraa.com/Content/img/boys-avtar.jpg" : "http://demo.wiraa.com"+item.profilePic}} />
                </TouchableOpacity>

                <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.name, {fontSize:14}]}> {item.userName} </Text>
                <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {fontSize:12}]}> {item.occupation} </Text>
                <TouchableOpacity onPress={() => this.addFollower(item.fkUserProfileId)} style={[styles.follow, {display: item.isFollow ? "none" : "flex", backgroundColor:"#f56"}]}>
                    <Text allowFontScaling={false} style={styles.followTxt}>Follow</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.removeFollower(item.fkUserProfileId)} style={[styles.follow, {display: !item.isFollow ? "none" : "flex", backgroundColor:"#aaaaaa"}]}>
                    <Text allowFontScaling={false} style={styles.followTxt}>Following</Text>
                </TouchableOpacity>
            </View>
        )
    }

    addFollower = (fkUserProfileId) => {
        
        fetch("http://demo.wiraa.com/api/Network/AddFollower?FollowerId="+fkUserProfileId+"&UserId="+this.state.userProfileId,{
            method: "POST"
        })
        .then(response => response.json())
        .then(responseJson => {
            console.log(responseJson);
            this.setState({ recommendations: this.state.recommendations.map(item => item.fkUserProfileId === fkUserProfileId ? {...item, isFollow: !item.isFollow} : item) })
        })
    }

    removeFollower = (fkUserProfileId) => {
        
        fetch("http://demo.wiraa.com/api/Network/RemoveFollower?FollowerId="+fkUserProfileId+"&UserId="+this.state.userProfileId,{
            method: "POST"
        })
        .then(response => response.json())
        .then(responseJson => {
            console.log(responseJson)
            this.setState({ recommendations: this.state.recommendations.map(item => item.fkUserProfileId === fkUserProfileId ? {...item, isFollow: !item.isFollow} : item) })
        })
    }

    goToPostReq = (catText, cirId, subCatText, gradeId) => {
        this.props.navigation.navigate("PostRequest", {
            catText, cirId, subCatText, gradeId
        })
    }

    render(){
        const { cat, catId } = this.props.route.params;

        this.state.subCat.map((item, index) => {
            console.log(item)
        })

        return(
            <View style={styles.container}>
                <View style={styles.headerr}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Feather name="chevron-left" size={24} color="#767676" style={{paddingTop:10, paddingLeft:6}} />
                    </TouchableOpacity>
                    <Text allowFontScaling={false} style={styles.heading}>{cat}</Text>
                    
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Feather name="info" size={24} color="transparent" style={{paddingTop:10, paddingLeft:6}} />
                    </TouchableOpacity>
        
                </View>
                {/* <Header val={{title: "Explore", isDashboard: false}} /> */}
                
                <ScrollView>
                    <View style={{flex:1, paddingBottom:10}}>
                        <Text allowFontScaling={false} style={[styles.name,{marginTop:10, fontSize:20}]}>Recommended</Text>

                        <View style={{height:200}}>
                            <FlatList 
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                data={this.state.recommendations}
                                maxToRenderPerBatch={5}
                                keyExtractor={item => item.fkUserProfileID}
                                renderItem={({item, index}) => this.renderRecommendations(item, index)}
                            />
                        </View>

                    </View>

                    <View style={{marginBottom:32, borderTopWidth:3, borderTopColor:"#efefef"}}>
                        <Text allowFontScaling={false} style={[styles.name,{marginTop:10, fontSize:20}]}>Select Expertise</Text>
                        
                        <View style={{flexDirection:"row", alignItems:"flex-start", justifyContent:"flex-start", flexWrap:"wrap"}}>

                            {this.state.subCat.map((item, index) => (
                                item.cirId === 1 ?
                                    
                                    
                                        <TouchableOpacity key={item.id} style={{marginHorizontal:4, marginLeft:20, width:100}} onPress={() => this.goToPostReq(cat, item.cirId, item.gradeName, item.gradeId)}>
                                            <Image source={{
                                                uri: 
                                                    item.gradeId === 1 ? "http://demo.wiraa.com/Content/img/commerce/Accounting.jpg" :
                                                    item.gradeId === 2 ? "http://demo.wiraa.com/Content/img/commerce/BusinessC.jpg" :
                                                    item.gradeId === 3 ? "http://demo.wiraa.com/Content/img/commerce/DataEntry.jpg" :
                                                    item.gradeId === 4 ? "http://demo.wiraa.com/Content/img/commerce/HRConsult.jpg" :
                                                    item.gradeId === 5 ? "http://demo.wiraa.com/Content/img/commerce/Industryspecific.jpg" :
                                                    item.gradeId === 6 ? "http://demo.wiraa.com/Content/img/commerce/Legal.jpg" :
                                                    item.gradeId === 7 ? "http://demo.wiraa.com/Content/img/commerce/Microsoftoffice.jpg" :
                                                    item.gradeId === 8 ? "http://demo.wiraa.com/Content/img/commerce/Personalvirtual.jpg" : null
                                            }} style={styles.img} />
                                            <Text style={styles.labell}>{item.gradeName}</Text>
                                        </TouchableOpacity>
                                    :
                                    item.cirId === 2 ?
                               
                                        <TouchableOpacity key={item.id} style={{marginHorizontal:4, marginLeft:20, width:100}} onPress={() => this.goToPostReq(cat, item.cirId, item.gradeName, item.gradeId)}>
                                            <Image source={{
                                                uri: 
                                                    item.gradeId === 9 ? "http://demo.wiraa.com/Content/img/Design/Animation.jpg" : 
                                                    item.gradeId === 10 ? "http://demo.wiraa.com/Content/img/Design/ArchitectureD.jpg" :
                                                    item.gradeId === 11 ? "http://demo.wiraa.com/Content/img/Design/ConceptsD.jpg" :
                                                    item.gradeId === 12 ? "http://demo.wiraa.com/Content/img/Design/EngineeringD.jpg" :
                                                    item.gradeId === 13 ? "http://demo.wiraa.com/Content/img/Design/FashionD.jpg" :
                                                    item.gradeId === 14 ? "http://demo.wiraa.com/Content/img/Design/GraphicD.jpg" :
                                                    item.gradeId === 15 ? "http://demo.wiraa.com/Content/img/Design/Illustration.jpg" :
                                                    item.gradeId === 16 ?  "http://demo.wiraa.com/Content/img/Design/InteriorD.jpg" :
                                                    item.gradeId === 17 ? "http://demo.wiraa.com/Content/img/Design/PhotoE.jpg" :
                                                    item.gradeId === 18 ? "http://demo.wiraa.com/Content/img/Development/WebDesign.jpg" : null
                                                    
                                            }} style={styles.img} />
                                            <Text style={styles.labell}>{item.gradeName}</Text>
                                        </TouchableOpacity>
                                    
                                    : 
                                    item.cirId === 3 ?

                                        <TouchableOpacity key={item.id} style={{marginHorizontal:4, marginLeft:20, width:100}} onPress={() => this.goToPostReq(cat, item.cirId, item.gradeName, item.gradeId)}>
                                            <Image source={{
                                                uri: 
                                                    item.gradeId === 19 ? "http://demo.wiraa.com/Content/img/Care/Babycare.jpg" : 
                                                    item.gradeId === 20 ? "http://demo.wiraa.com/Content/img/Fitness/Dance.jpg" :
                                                    item.gradeId === 21 ? "http://demo.wiraa.com/Content/img/Fitness/Workout.jpg" :
                                                    item.gradeId === 22 ? "http://demo.wiraa.com/Content/img/Care/Mentalcare.jpg" :
                                                    item.gradeId === 23 ? "http://demo.wiraa.com/Content/img/Fitness/Nutrition.jpg" :
                                                    item.gradeId === 24 ? "http://demo.wiraa.com/Content/img/Fitness/SelfD.jpg" :
                                                    item.gradeId === 25 ? "http://demo.wiraa.com/Content/img/Fitness/Sports.jpg" :
                                                    item.gradeId === 26 ? "http://demo.wiraa.com/Content/img/Fitness/Yoga.jpg" : null
                                                   
                                                    
                                            }} style={styles.img} />
                                            <Text style={styles.labell}>{item.gradeName}</Text>
                                        </TouchableOpacity>
                                   
                                    :
                                    item.cirId === 4 ?

                                        <TouchableOpacity key={item.id} style={{marginHorizontal:4, marginLeft:20, width:100}} onPress={() => this.goToPostReq(cat, item.cirId, item.gradeName, item.gradeId)}>
                                            <Image source={{
                                                uri: 
                                                    item.gradeId === 27 ? "http://demo.wiraa.com/Content/img/Development/App&Mobile.jpg" :
                                                    item.gradeId === 28 ? "http://demo.wiraa.com/Content/img/Development/Concepts&D.jpg" :
                                                    item.gradeId === 29 ? "http://demo.wiraa.com/Content/img/Development/DataScience&analytics.jpg" :
                                                    item.gradeId === 30 ? "http://demo.wiraa.com/Content/img/IT/Database.jpg" :
                                                    item.gradeId === 31 ? "http://demo.wiraa.com/Content/img/IT/ERP_CRM_SCM.jpg" :
                                                    item.gradeId === 32 ? "http://demo.wiraa.com/Content/img/Development/GameD.jpg" :
                                                    item.gradeId === 33 ? "http://demo.wiraa.com/Content/img/IT/InformationSecurity.jpg" :
                                                    item.gradeId === 34 ? "http://demo.wiraa.com/Content/img/IT/ITCertification.jpg" :
                                                    item.gradeId === 35 ? "http://demo.wiraa.com/Content/img/IT/Network&System.jpg" :
                                                    item.gradeId === 36 ? "http://demo.wiraa.com/Content/img/Development/ProgrammingS.jpg" :
                                                    item.gradeId === 37 ? "http://demo.wiraa.com/Content/img/Development/QA&testing.jpg" :
                                                    item.gradeId === 38 ? "http://demo.wiraa.com/Content/img/IT/SAP.jpg" :
                                                    item.gradeId === 39 ? "http://demo.wiraa.com/Content/img/IT/Telephony.jpg" :
                                                    item.gradeId === 40 ? "http://demo.wiraa.com/Content/img/Development/WebDevelopment.jpg" :null
                                                    
                                                
                                            }} style={styles.img} />
                                            <Text style={styles.labell}>{item.gradeName}</Text>
                                        </TouchableOpacity>
                                    :
                                    item.cirId === 5 ?
                                        <TouchableOpacity key={item.id} style={{marginHorizontal:4, marginLeft:20, width:100}} onPress={() => this.goToPostReq(cat, item.cirId, item.gradeName, item.gradeId)}>
                                            <Image source={{
                                                uri: 
                                                 
                                                    item.gradeId === 41 ? "http://demo.wiraa.com/Content/img/Lifestyle/ArtsC.jpg" : 
                                                    item.gradeId === 42 ? "http://demo.wiraa.com/Content/img/Lifestyle/BeautyM.jpg" : 
                                                    item.gradeId === 43 ? "http://demo.wiraa.com/Content/img/Lifestyle/FoodB.jpg" : 
                                                    item.gradeId === 44 ? "http://demo.wiraa.com/Content/img/Lifestyle/Gaming.jpg" : 
                                                    item.gradeId === 45 ? "http://demo.wiraa.com/Content/img/Lifestyle/HomeImp.jpg" : 
                                                    item.gradeId === 46 ? "http://demo.wiraa.com/Content/img/Lifestyle/Languages.jpg" : 
                                                    item.gradeId === 47 ? "http://demo.wiraa.com/Content/img/Lifestyle/Music&Audio.jpg" :
                                                    item.gradeId === 48 ? "http://demo.wiraa.com/Content/img/Lifestyle/Painting.jpg" : 
                                                    item.gradeId === 49 ? "http://demo.wiraa.com/Content/img/Lifestyle/PerformingA.jpg" : 
                                                    item.gradeId === 50 ? "http://demo.wiraa.com/Content/img/Lifestyle/PersonalDevelopment.jpg" : 
                                                    item.gradeId === 51 ? "http://demo.wiraa.com/Content/img/Lifestyle/PetC.jpg" : 
                                                    item.gradeId === 52 ? "http://demo.wiraa.com/Content/img/Lifestyle/Photography.jpg" : 
                                                    item.gradeId === 53 ? "http://demo.wiraa.com/Content/img/Lifestyle/SpiritualH.jpg" : 
                                                    item.gradeId === 54 ? "http://demo.wiraa.com/Content/img/Lifestyle/Travel.jpg" : 
                                                    item.gradeId === 55 ? "http://demo.wiraa.com/Content/img/Lifestyle/Videography.jpg" : null
                                                    
                                                
                                            }} style={styles.img} />
                                            <Text style={styles.labell}>{item.gradeName}</Text>
                                        </TouchableOpacity>
                                   :
                                   item.cirId === 6 ?
                                        <TouchableOpacity key={item.id} style={{marginHorizontal:4, marginLeft:20, width:100}} onPress={() => this.goToPostReq(cat, item.cirId, item.gradeName, item.gradeId)}>
                                            <Image source={{
                                                uri: 
                                                 
                                                   
                                                    item.gradeId === 56 ? "http://demo.wiraa.com/Content/img/Marketing/Advertising.jpg" :
                                                    item.gradeId === 57 ? "http://demo.wiraa.com/Content/img/Marketing/AffiliateM.jpg" :
                                                    item.gradeId === 58 ? "http://demo.wiraa.com/Content/img/Marketing/Branding.jpg" :
                                                    item.gradeId === 59 ? "http://demo.wiraa.com/Content/img/Marketing/CampaignM.jpg" :
                                                    item.gradeId === 60 ? "http://demo.wiraa.com/Content/img/Marketing/Communications.jpg" :
                                                    item.gradeId === 61 ? "http://demo.wiraa.com/Content/img/Marketing/ContentM.jpg" :
                                                    item.gradeId === 62 ? "http://demo.wiraa.com/Content/img/Marketing/CustomerRelations.jpg" :
                                                    item.gradeId === 63 ? "http://demo.wiraa.com/Content/img/Marketing/DigitalM.jpg" :
                                                    item.gradeId === 64 ? "http://demo.wiraa.com/Content/img/Marketing/GeneralM.jpg" :
                                                    item.gradeId === 65 ? "http://demo.wiraa.com/Content/img/Marketing/IndustrySpecific.jpg" :
                                                    item.gradeId === 66 ? "http://demo.wiraa.com/Content/img/Marketing/PublicR.jpg" :
                                                    item.gradeId === 67 ? "http://demo.wiraa.com/Content/img/Marketing/Sales.jpg" :
                                                    item.gradeId === 68 ? "http://demo.wiraa.com/Content/img/Marketing/MarketingAnalysis&Strategy.jpg" :
                                                    item.gradeId === 69 ? "http://demo.wiraa.com/Content/img/Marketing/Telemarketing.jpg" : null
                                                    
                                                
                                            }} style={styles.img} />
                                            <Text style={styles.labell}>{item.gradeName}</Text>
                                        </TouchableOpacity>
                                     :
                                     item.cirId === 7 ?
                                        <TouchableOpacity key={item.id} style={{marginHorizontal:4, marginLeft:20, width:100}} onPress={() => this.goToPostReq(cat, item.cirId, item.gradeName, item.gradeId)}>
                                            <Image source={{
                                                uri: 
                                                 
                                                   
                                                    item.gradeId === 70 ? "http://demo.wiraa.com/Content/img/School/Nursery%20-%20KG.jpg" :
                                                    item.gradeId === 71 ? "http://demo.wiraa.com/Content/img/School/Class1-5th.jpg" :
                                                    item.gradeId === 72 ? "http://demo.wiraa.com/Content/img/School/Class6th.jpg" :
                                                    item.gradeId === 73 ? "http://demo.wiraa.com/Content/img/School/Class7th.jpg" :
                                                    item.gradeId === 74 ? "http://demo.wiraa.com/Content/img/School/Class8th.jpg" :
                                                    item.gradeId === 75 ? "http://demo.wiraa.com/Content/img/School/Class9th.jpg" :
                                                    item.gradeId === 76 ? "http://demo.wiraa.com/Content/img/School/Class10th.jpg" :
                                                    item.gradeId === 77 ? "http://demo.wiraa.com/Content/img/School/Class11th.jpg" :
                                                    item.gradeId === 78 ? "http://demo.wiraa.com/Content/img/School/Class%2012th.jpg" :
                                                    item.gradeId === 79 ? "http://demo.wiraa.com/Content/img/Exams/Architectureexams.jpg" :
                                                    item.gradeId === 80 ? "http://demo.wiraa.com/Content/img/Exams/Banking.jpg" :
                                                    item.gradeId === 81 ? "http://demo.wiraa.com/Content/img/Exams/CharteredA.jpg" :
                                                    item.gradeId === 82 ? "http://demo.wiraa.com/Content/img/Exams/CivilS.jpg" :
                                                    item.gradeId === 83 ? "http://demo.wiraa.com/Content/img/Exams/CompanyS.jpg" :
                                                    item.gradeId === 84 ? "http://demo.wiraa.com/Content/img/Exams/DefenseCDS.jpg" :
                                                    item.gradeId === 85 ? "http://demo.wiraa.com/Content/img/Exams/DefenseCDS.jpg" :
                                                    item.gradeId === 86 ? "http://demo.wiraa.com/Content/img/Exams/Engineering.jpg" :
                                                    item.gradeId === 87 ? "http://demo.wiraa.com/Content/img/Exams/EngineeringPG.jpg" :
                                                    item.gradeId === 88 ? "http://demo.wiraa.com/Content/img/Exams/EngineeringSer.jpg" :
                                                    item.gradeId === 89 ? "http://demo.wiraa.com/Content/img/Exams/EnglishIELTS.jpg" :
                                                    item.gradeId === 90 ? "http://demo.wiraa.com/Content/img/Exams/EnglishIELTS.jpg" :
                                                    item.gradeId === 91 ? "http://demo.wiraa.com/Content/img/Exams/GraduateGRE.jpg" :
                                                    item.gradeId === 92 ? "http://demo.wiraa.com/Content/img/Exams/Law.jpg" :
                                                    item.gradeId === 93 ? "http://demo.wiraa.com/Content/img/Exams/ManagementCAT.jpg" :
                                                    item.gradeId === 94 ? "http://demo.wiraa.com/Content/img/Exams/ManagementCAT.jpg" :
                                                    item.gradeId === 95 ? "http://demo.wiraa.com/Content/img/Exams/Medical.jpg" :
                                                    item.gradeId === 96 ? "http://demo.wiraa.com/Content/img/Exams/MedicalPG.jpg" :
                                                    item.gradeId === 97 ? "http://demo.wiraa.com/Content/img/Exams/RailwayRRB.jpg" :
                                                    item.gradeId === 98 ? "http://demo.wiraa.com/Content/img/Exams/RailwayRRB.jpg" :
                                                    item.gradeId === 99 ? "http://demo.wiraa.com/Content/img/Exams/StaffSSC.jpg" :
                                                    item.gradeId === 100 ? "http://demo.wiraa.com/Content/img/Exams/StaffSSC.jpg" :
                                                    item.gradeId === 101 ? "http://demo.wiraa.com/Content/img/Exams/TeachingUGC.jpg" :
                                                    item.gradeId === 102 ? "http://demo.wiraa.com/Content/img/Exams/UndergraduateE.jpg" : null
                                                    
                                                
                                            }} style={styles.img} />
                                            <Text style={styles.labell}>{item.gradeName}</Text>
                                        </TouchableOpacity>
                                     :
                                     item.cirId === 8 ?
                                        <TouchableOpacity key={item.id} style={{marginHorizontal:4, marginLeft:20, width:100}} onPress={() => this.goToPostReq(cat, item.cirId, item.gradeName, item.gradeId)}>
                                            <Image source={{
                                                uri: 
                                                    item.gradeId === 103 ? "http://demo.wiraa.com/Content/img/Writing/Academic.jpg" :
                                                    item.gradeId === 104 ? "http://demo.wiraa.com/Content/img/Writing/Articles&Blogs.jpg" :
                                                    item.gradeId === 105 ? "http://demo.wiraa.com/Content/img/Writing/Books.jpg" :
                                                    item.gradeId === 106 ? "http://demo.wiraa.com/Content/img/Writing/Copywriting.jpg" :
                                                    item.gradeId === 107 ? "http://demo.wiraa.com/Content/img/Writing/Editing&Proofreading.jpg" :
                                                    item.gradeId === 108 ? "http://demo.wiraa.com/Content/img/Writing/GeneralWriting.jpg" :
                                                    item.gradeId === 109 ? "http://demo.wiraa.com/Content/img/Writing/Grants&Proposals.jpg" :
                                                    item.gradeId === 110 ? "http://demo.wiraa.com/Content/img/Writing/Research.jpg" :
                                                    item.gradeId === 111 ? "http://demo.wiraa.com/Content/img/Writing/Resumes&CoverLetters.jpg" :
                                                    item.gradeId === 112 ? "http://demo.wiraa.com/Content/img/Writing/Reviews&Testimonials.jpg" :
                                                    item.gradeId === 113 ? "http://demo.wiraa.com/Content/img/Writing/ScriptWriting.jpg" :
                                                    item.gradeId === 114 ? "http://demo.wiraa.com/Content/img/Writing/Technical.jpg" :
                                                    item.gradeId === 115 ? "http://demo.wiraa.com/Content/img/Writing/Transcription.jpg" :
                                                    item.gradeId === 116 ? "http://demo.wiraa.com/Content/img/Writing/Translation.jpg" :
                                                    item.gradeId === 117 ? "http://demo.wiraa.com/Content/img/Writing/WebContent.jpg" : null
                                                 
                                     
                                            }} style={styles.img} />
                                            <Text style={styles.labell}>{item.gradeName}</Text>
                                        </TouchableOpacity>
                                    : null
                                
                            ))}
                        </View>

                    </View>

                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        // alignItems:"center",
        // justifyContent:"center",
        backgroundColor:"#fff"
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
    heading:{
        fontFamily:"Futura",
        fontSize:22,
        marginTop:6,
        textAlign:"center",
        color:"#171919",
    },
    img:{
        width:100, 
        height:100, 
        borderRadius:10,
        alignSelf:"center",
        marginTop:16
    },
    name:{
        fontFamily:"Futura",
        color:"#171919",
        padding:14,
        paddingTop:6,
        paddingBottom:0,
        fontSize:16,
    },
    label:{
        fontFamily:"OpenSans",
        color:"#767676",
        fontSize:12,
        paddingHorizontal:16
      
    },
    labell:{
        fontFamily:"OpenSans",
        color:"#171919",
        fontSize:12,
        paddingTop:6,
        textAlign:"center",
        width:100
    },
    follow:{
        backgroundColor:"#f56",
        alignSelf:"stretch",
        padding:10,
        margin: 20,
        marginBottom:0,
        marginTop:10,
        marginVertical:5,
        borderRadius:6,
        elevation:4,
    },
    followTxt:{
        textAlign:"center",
        fontSize:14,
        color:"#fff",
        fontFamily:"Futura",
    },
    catTitle:{
        textAlign:"center",
        fontFamily:"Futura",
        fontSize:14,
        paddingTop:10,
        marginBottom:32
    },
    incom:{
        marginLeft:24
    }
})