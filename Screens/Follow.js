import React from 'react'
import { View, Text, StyleSheet, ScrollView, Image, FlatList, Dimensions, ActivityIndicator,TouchableOpacity } from 'react-native'
import { FontAwesome, Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const window = Dimensions.get("window");

export default class Follow extends React.Component{

    state = {
        followActive: false,
        followingActive: true,
        userId:"",
        follower:[],
        following:[],
        userType:"",
        isFollowLoading: true,
        isFollowingLoading: true,
        userProfileId:"",
        count:0,
        Auth:""
    }

    componentDidMount = async() => {

 
//! User Auth 

       const myUserProfileId = await AsyncStorage.getItem('userPrfileId')
       if(myUserProfileId !== null) {
              this.setState({Auth :myUserProfileId })
       //  console.log("123456xxx",this.state.Auth);
             }else{
          console.log("no data found");   
        }

        const {userProfileId} = this.props.route.params;
        if(userProfileId !== null){
            this.setState({ userProfileId })
        }

        const userId = await AsyncStorage.getItem('userId')
        if(userId !== null) {
            this.setState({ userId })
        }else{
            console.log("null")
        }

        const userType = await AsyncStorage.getItem('userType')
        if(userType !== null){
            this.setState({ userType })
        }

        // console.log(userType);

        if(userType !== "4"){
            this.getFollow();
        }else{
            this.getFollowing();
        }
    }

    getFollow = () => {

        this.setState({followingActive : false, followActive: true  , following:[]});
        
        fetch("http://demo.wiraa.com/api/Network/GetfollowerList?Id="+this.state.userProfileId, {
            method: "GET"
        })
        .then(response => response.json())
        .then(responseJson => {
            let follower = [];
            responseJson.map(item => {
                follower.push({
                    userProfileId: item.fkUserProfileID,
                    id: item.$id,
                    fName: item.firstName,
                    lName: item.lastName,
                    occupation: item.occupation,
                    profilePic: item.profilePic,
                    isFollowing: item.isFollowing,
                })
                this.setState({ follower })
            })
            this.setState({isFollowLoading: false})
        })
    }

    getFollowing = () => {

        this.setState({followingActive : true, followActive: false  , follower:[]});

        fetch("http://demo.wiraa.com/api/Network/GetfollowingList?Id="+this.state.userProfileId, {
            method: "GET"
        })
        .then(response => response.json())
        .then(responseJson => {
            let following = [];
            responseJson.map(item => {
                following.push({
                    userProfileId: item.fkUserProfileID,
                    id: item.$id,
                    fName: item.firstName,
                    lName: item.lastName,
                    occupation: item.occupation,
                    profilePic: item.profilePic,
                    isFollowing: item.isFollowing,
                })
                this.setState({ following })
                // console.log("1",item.fkUserProfileID);
                // console.log("2" ,this.state.userProfileId);
                //  console.log("3" ,this.state.userId);
                //    console.log("4" ,this.state.userType);

            })
            this.setState({ isFollowingLoading: false})
        })
    }

    addFollower = (myUserProfileId) => {

        // console.log(myUserProfileId);
        // console.log(this.state.userProfileId);

        fetch("http://demo.wiraa.com/api/Network/AddFollower?FollowerId="+myUserProfileId+"&UserId="+this.state.userProfileId, {
            method: "POST"
        })
        .then(response => response.json())
        .then(responseJson => {
            this.setState({ follower: this.state.follower.map(item => item.userProfileId === myUserProfileId ? {...item, isFollowing: true} : item ), count: this.state.count + 1 })
        })
    }

    removeFollower = (myUserProfileId) => {
        fetch("http://demo.wiraa.com/api/Network/RemoveFollower?FollowerId="+myUserProfileId+"&UserId="+this.state.userProfileId, {
            method: "POST"
        })
        .then(response => response.json())
        .then(responseJson => {
            if(this.state.followActive === true){
                this.setState({ follower: this.state.follower.map(item => item.userProfileId === myUserProfileId ? {...item, isFollowing: false} : item ), count: this.state.count - 1 })
            }else{
                this.setState({ following: this.state.following.filter(item => item.userProfileId !== myUserProfileId) })
            }
        })
    }

    goBack = () => {
        this.props.navigation.goBack();
        this.props.route.params.onRefresh({ refresh: true, count: this.state.count });
    }




 renderFollower = (item, index) => {
        return(
            <View style={{width: window.width}}>
                <TouchableOpacity style={{backgroundColor: "#fff", borderBottomWidth:1, borderBottomColor: "#efefef",}} >
                    <View style={{flexDirection:"row"}}>
                        <Image style={{width:50, height:50, borderRadius:10, margin:16, marginBottom:10, marginRight:10, marginTop:20}} source={{uri: item.profilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com/"+item.profilePic}} />
                        <View style={{flexDirection:"row", marginTop:8,flex:1, justifyContent:"space-between" }}>
                            <TouchableOpacity onPress={() => item.userProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.userProfileId}) : this.props.navigation.navigate("Profile") } >
                                <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={{fontFamily:"Futura", color:"#171919", fontSize:16, paddingTop:14, width:180}}>{item.fName+" "+item.lName}</Text>
                                <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {width:180, } ]}>{item.occupation}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:32, marginTop:14}}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", backgroundColor: "#f56", borderRadius:20, paddingHorizontal:16, color:"#fff", padding:10, fontSize:12, display: item.isFollowing ? "flex" : "none"}} onPress={() => this.removeFollower(item.userProfileId)}>Following</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginRight:10, marginTop:14}}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", backgroundColor: "#aaaaaa", marginRight:6, paddingHorizontal:24, borderRadius:20, color:"#fff",padding:10, fontSize:12, display: item.isFollowing ? "none" : "flex"}}
                                 onPress={() =>   this.addFollower(item.userProfileId)}>Follow</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

renderFollowing = (item, index) => {
        return(
            <View style={{width: window.width}}>
                <TouchableOpacity style={{backgroundColor: "#fff", borderBottomWidth:1, borderBottomColor: "#efefef",}} >
                    <View style={{flexDirection:"row"}}>
                        <Image style={{width:50, height:50, borderRadius:10, margin:16, marginBottom:10, marginRight:10, marginTop:20}} source={{uri: item.profilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com/"+item.profilePic}} />
                        <View style={{flexDirection:"row", marginTop:8,flex:1, justifyContent:"space-between" }}>
                            <TouchableOpacity onPress={() => item.userProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.userProfileId}) : this.props.navigation.navigate("Profile") } >
                                <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={{fontFamily:"Futura", color:"#171919", fontSize:16, paddingTop:14, width:180}}>{item.fName+" "+item.lName}</Text>
                                <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {width:180, } ]}>{item.occupation}</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={{marginLeft:32, marginTop:14}}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", backgroundColor: "#f56", borderRadius:20, paddingHorizontal:16, color:"#fff", padding:10, fontSize:12, display: item.isFollowing ? "flex" : "none"}} onPress={() => this.removeFollower(item.userProfileId)}>Following</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginRight:10, marginTop:14}}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", backgroundColor: "#aaaaaa", marginRight:6, paddingHorizontal:24, borderRadius:20, color:"#fff",padding:10, fontSize:12, display: item.isFollowing ? "none" : "flex"}}
                                 onPress={() =>   this.addFollower(item.userProfileId)}>Follow</Text>
                          </TouchableOpacity> */}
                            <TouchableOpacity style={{marginRight:16, marginTop:14}} onPress={() => this.state.Auth !== this.state.userProfileId ? 
                                 console.log("!Sorry you can not Unfollow  other users followers") : this.removeFollower(item.userProfileId)}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", backgroundColor: "#f56", borderRadius:20, paddingHorizontal:16, color:"#fff", padding:10, fontSize:12, display: item.isFollowing ? "none" : "flex"}}>UnFollow</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render(){

        // console.log(this.state.followActive)

        if( this.state.followActive && this.state.isFollowLoading){
            return(
                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <ActivityIndicator size="large" color="#f56"/>
                </View>
            )
        }else if( this.state.followingActive && this.state.isFollowingLoading){
            return(
                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <ActivityIndicator size="large" color="#f56"/>
                </View>
            )
        }else{
            return(
                <View style={{flex:1}}>
                    <ScrollView contentContainerStyle={styles.container}>
                        <View style={styles.headerr}>
                            <TouchableOpacity onPress={() => this.goBack()} style={{paddingTop:4}}>
                            <Feather name="chevron-left" size={24} color="#767676" style={{zIndex: 999999, padding:0}}/>
                            </TouchableOpacity>   
                            <Text allowFontScaling={false} style={styles.heading}>Connections</Text>
                            <Ionicons name="chevron-left" size={24} color="transparent" style={{paddingTop:10, paddingLeft:0}} />
                        </View>
    
                        <View style={{flexDirection:"row", justifyContent:"space-evenly", alignSelf:"stretch", paddingBottom:10}}>
                            <TouchableOpacity style={{ padding:10, paddingTop:0}} onPress={() => this.getFollow()}>
                                <Text allowFontScaling={false} style={[styles.name, {fontFamily:"OpenSans", fontSize:18,color:this.state.followActive === true ? "#f56" : "#171919",}]}>Followers</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{padding:10, paddingTop:0}} onPress={() => this.getFollowing()}>
                                <Text allowFontScaling={false} style={[styles.name, {fontFamily:"OpenSans", fontSize:18, color:this.state.followingActive === true ? "#f56" : "#171919"}]}>Following</Text>
                            </TouchableOpacity>
                        </View>
    
                        {this.state.follower.length > 0 && this.state.following.length > 0 ?
                            <View>
                                <View style={{height:700, display: this.state.followActive === true ? "flex" : "none", paddingBottom:32}}>
                                    <FlatList 
                                        data={this.state.follower}
                                        keyExtractor={item => item.id}
                                        renderItem={({item, index}) => this.renderFollower(item, index)}
                                    />
                                </View>
    
                                <View style={{height:700, display: this.state.followingActive === true ? "flex" : "none", paddingBottom:32}}>
                                    <FlatList 
                                        data={this.state.following}
                                        keyExtractor={item => item.id}
                                        renderItem={({item, index}) => this.renderFollowing(item, index)}
                                    />
                                </View>
                            </View>
    
                        :   this.state.follower.length > 0 && this.state.following.length <= 0 ?
                                <View style={{height:700, display: this.state.followActive === true ? "flex" : "none", paddingBottom:32}}>
                                    <FlatList 
                                        data={this.state.follower}
                                        keyExtractor={item => item.id}
                                        renderItem={({item, index}) => this.renderFollower(item, index)}
                                    />
                                </View>
    
                        :   this.state.following.length > 0 && this.state.follower.length <= 0 ?
                                <View style={{height:700, display: this.state.followingActive === true ? "flex" : "none", paddingBottom:32}}>
                                    <FlatList 
                                        data={this.state.following}
                                        keyExtractor={item => item.id}
                                        renderItem={({item, index}) => this.renderFollowing(item, index)}
                                    />
                                </View>
                        
                        :
                            <View style={{ flex:1, justifyContent:"center", alignSelf:"center"}}>
                                <Text allowFontScaling={false} style={[styles.heading, {color:"#f56"}]}>No data yet!</Text>
                                <Text allowFontScaling={false} style={{color:"#767676", fontFamily:"OpenSans", paddingHorizontal:16, textAlign:"center", paddingTop:10}}>Check this section for future updates.</Text>
                            </View>
                        }
        
                    </ScrollView>
                </View>
            )
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
    name:{
        fontFamily:"Futura",
        color:"#171919",
        padding:16,
        paddingBottom:0,
        fontSize:20,
    },
    label:{
        color:"#767676",
        fontFamily:"OpenSans",
        fontSize:14,
        fontWeight:"normal"
    },
    labell:{
        color:"#767676",
        fontFamily:"OpenSans",
        fontSize:12,
    },

})


// import React from 'react'
// import { View, Text, StyleSheet, ScrollView, Image, FlatList, Dimensions, ActivityIndicator,TouchableOpacity } from 'react-native'
// import { FontAwesome, Feather, AntDesign, Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const window = Dimensions.get("window");

// export default class Follow extends React.Component{

//     state = {
//         followActive: false,
//         followingActive: true,
//         userId:"",
//         follower:[],
//         following:[],
//         userType:"",
//         isFollowLoading: true,
//         isFollowingLoading: true,
//         userProfileId:"",
//         count:0,
//     }

//     componentDidMount = async() => {

//         const {userProfileId} = this.props.route.params;
//         if(userProfileId !== null){
//             this.setState({ userProfileId })
//         }

//         const userId = await AsyncStorage.getItem('userId')
//         if(userId !== null) {
//             this.setState({ userId })
//         }else{
//             console.log("null")
//         }

//         const userType = await AsyncStorage.getItem('userType')
//         if(userType !== null){
//             this.setState({ userType })
//         }

//         console.log(userType);

//         if(userType !== "4"){
//             this.getFollow();
//         }else{
//             this.getFollowing();
//         }
//     }

//     getFollow = () => {

//         this.setState({followingActive : false, followActive: true});
        
//         fetch("http://demo.wiraa.com/api/Network/GetfollowerList?Id="+this.state.userProfileId, {
//             method: "GET"
//         })
//         .then(response => response.json())
//         .then(responseJson => {
//             let follower = [];
//             responseJson.map(item => {
//                 follower.push({
//                     userProfileId: item.fkUserProfileID,
//                     id: item.$id,
//                     fName: item.firstName,
//                     lName: item.lastName,
//                     occupation: item.occupation,
//                     profilePic: item.profilePic,
//                     isFollowing: item.isFollowing,
//                 })
//                 this.setState({ follower })
//             })
//             this.setState({isFollowLoading: false})
//         })
//     }

//     getFollowing = () => {

//         this.setState({followingActive : true, followActive: false});

//         fetch("http://demo.wiraa.com/api/Network/GetfollowingList?Id="+this.state.userProfileId, {
//             method: "GET"
//         })
//         .then(response => response.json())
//         .then(responseJson => {
//             let following = [];
//             responseJson.map(item => {
//                 following.push({
//                     userProfileId: item.fkUserProfileID,
//                     id: item.$id,
//                     fName: item.firstName,
//                     lName: item.lastName,
//                     occupation: item.occupation,
//                     profilePic: item.profilePic,
//                     isFollowing: item.isFollowing,
//                 })
//                 this.setState({ following })
//             })
//             this.setState({ isFollowingLoading: false})
//         })
//     }

//     addFollower = (myUserProfileId) => {

//         console.log(myUserProfileId);
//         console.log(this.state.userProfileId);

//         fetch("http://demo.wiraa.com/api/Network/AddFollower?FollowerId="+myUserProfileId+"&UserId="+this.state.userProfileId, {
//             method: "POST"
//         })
//         .then(response => response.json())
//         .then(responseJson => {
//             this.setState({ follower: this.state.follower.map(item => item.userProfileId === myUserProfileId ? {...item, isFollowing: true} : item ), count: this.state.count + 1 })
//         })
//     }

//     removeFollower = (myUserProfileId) => {
//         fetch("http://demo.wiraa.com/api/Network/RemoveFollower?FollowerId="+myUserProfileId+"&UserId="+this.state.userProfileId, {
//             method: "POST"
//         })
//         .then(response => response.json())
//         .then(responseJson => {
//             if(this.state.followActive === true){
//                 this.setState({ follower: this.state.follower.map(item => item.userProfileId === myUserProfileId ? {...item, isFollowing: false} : item ), count: this.state.count - 1 })
//             }else{
//                 this.setState({ following: this.state.following.filter(item => item.userProfileId !== myUserProfileId) })
//             }
//         })
//     }

//     goBack = () => {
//         this.props.navigation.goBack();
//         this.props.route.params.onRefresh({ refresh: true, count: this.state.count });
//     }

//     renderFollower = (item, index) => {

//         return(
//             <View style={{width: window.width}}>
//                 <TouchableOpacity style={{backgroundColor: "#fff", borderBottomWidth:1, borderBottomColor: "#efefef",}} >
//                     <View style={{flexDirection:"row"}}>
//                         <Image style={{width:50, height:50, borderRadius:10, margin:16, marginBottom:10, marginRight:10, marginTop:20}} source={{uri: item.profilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com/"+item.profilePic}} />
//                         <View style={{flexDirection:"row", marginTop:8,flex:1, justifyContent:"space-between" }}>
//                             <TouchableOpacity onPress={() => item.userProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.userProfileId}) : this.props.navigation.navigate("Profile") } >
//                                 <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={{fontFamily:"Futura", color:"#171919", fontSize:16, paddingTop:14, width:180}}>{item.fName+" "+item.lName}</Text>
//                                 <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {width:180, } ]}>{item.occupation}</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={{marginLeft:32, marginTop:14}}>
//                                 <Text allowFontScaling={false} style={{fontFamily:"OpenSans", backgroundColor: "#f56", borderRadius:20, paddingHorizontal:16, color:"#fff", padding:10, fontSize:12, display: item.isFollowing ? "flex" : "none"}} onPress={() => this.removeFollower(item.userProfileId)} >Following</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={{marginRight:10, marginTop:14}}>
//                                 <Text allowFontScaling={false} style={{fontFamily:"OpenSans", backgroundColor: "#aaaaaa", marginRight:6, paddingHorizontal:24, borderRadius:20, color:"#fff",padding:10, fontSize:12, display: item.isFollowing ? "none" : "flex"}} onPress={() => this.addFollower(item.userProfileId)}>Follow</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </TouchableOpacity>
//             </View>
//         )
//     }

//     renderFollowing = (item, index) => {
//         return(
//             <View style={{width: window.width}}>
//                 <TouchableOpacity style={{backgroundColor: "#fff", borderBottomWidth:1, borderBottomColor: "#efefef",}} >
//                     <View style={{flexDirection:"row"}}>
//                         <Image style={{width:50, height:50, borderRadius:10, margin:16, marginBottom:10, marginRight:10, marginTop:20}} source={{uri: item.profilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com/"+item.profilePic}} />
//                         <View style={{flexDirection:"row", marginTop:8,flex:1, justifyContent:"space-between" }}>
//                             <TouchableOpacity onPress={() => item.userProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.userProfileId}) : this.props.navigation.navigate("Profile") } >
//                                 <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={{fontFamily:"Futura", color:"#171919", fontSize:16, paddingTop:14, width:180}}>{item.fName+" "+item.lName}</Text>
//                                 <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {width:180, } ]}>{item.occupation}</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={{marginRight:16, marginTop:14}}>
//                                 <Text allowFontScaling={false} style={{fontFamily:"OpenSans", backgroundColor: "#f56", borderRadius:20, paddingHorizontal:16, color:"#fff", padding:10, fontSize:12, display: item.isFollowing ? "none" : "flex"}} onPress={() => this.removeFollower(item.userProfileId)} >UnFollow</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </TouchableOpacity>
//             </View>
//         )
//     }

//     render(){

//         console.log(this.state.followActive)

//         if( this.state.followActive && this.state.isFollowLoading){
//             return(
//                 <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
//                     <ActivityIndicator size="large" color="#f56"/>
//                 </View>
//             )
//         }else if( this.state.followingActive && this.state.isFollowingLoading){
//             return(
//                 <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
//                     <ActivityIndicator size="large" color="#f56"/>
//                 </View>
//             )
//         }else{
//             return(
//                 <View style={{flex:1}}>
//                     <ScrollView contentContainerStyle={styles.container}>
//                         <View style={styles.headerr}>
//                             <TouchableOpacity onPress={() => this.goBack()} style={{paddingTop:4}}>
//                             <Feather name="chevron-left" size={24} color="#767676" style={{zIndex: 999999, padding:0}}/>
//                             </TouchableOpacity>   
//                             <Text allowFontScaling={false} style={styles.heading}>Connections</Text>
//                             <Ionicons name="chevron-left" size={24} color="transparent" style={{paddingTop:10, paddingLeft:0}} />
//                         </View>
    
//                         <View style={{flexDirection:"row", justifyContent:"space-evenly", alignSelf:"stretch", paddingBottom:10}}>
//                             <TouchableOpacity style={{ padding:10, paddingTop:0}} onPress={() => this.getFollow()}>
//                                 <Text allowFontScaling={false} style={[styles.name, {fontFamily:"OpenSans", fontSize:18,color:this.state.followActive === true ? "#f56" : "#171919",}]}>Followers</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={{padding:10, paddingTop:0}} onPress={() => this.getFollowing()}>
//                                 <Text allowFontScaling={false} style={[styles.name, {fontFamily:"OpenSans", fontSize:18, color:this.state.followingActive === true ? "#f56" : "#171919"}]}>Following</Text>
//                             </TouchableOpacity>
//                         </View>
    
//                         {this.state.follower.length > 0 && this.state.following.length > 0 ?
//                             <View>
//                                 <View style={{height:700, display: this.state.followActive === true ? "flex" : "none", paddingBottom:32}}>
//                                     <FlatList 
//                                         data={this.state.follower}
//                                         keyExtractor={item => item.id}
//                                         renderItem={({item, index}) => this.renderFollower(item, index)}
//                                     />
//                                 </View>
    
//                                 <View style={{height:700, display: this.state.followingActive === true ? "flex" : "none", paddingBottom:32}}>
//                                     <FlatList 
//                                         data={this.state.following}
//                                         keyExtractor={item => item.id}
//                                         renderItem={({item, index}) => this.renderFollowing(item, index)}
//                                     />
//                                 </View>
//                             </View>
    
//                         :   this.state.follower.length > 0 && this.state.following.length <= 0 ?
//                                 <View style={{height:700, display: this.state.followActive === true ? "flex" : "none", paddingBottom:32}}>
//                                     <FlatList 
//                                         data={this.state.follower}
//                                         keyExtractor={item => item.id}
//                                         renderItem={({item, index}) => this.renderFollower(item, index)}
//                                     />
//                                 </View>
    
//                         :   this.state.following.length > 0 && this.state.follower.length <= 0 ?
//                                 <View style={{height:700, display: this.state.followingActive === true ? "flex" : "none", paddingBottom:32}}>
//                                     <FlatList 
//                                         data={this.state.following}
//                                         keyExtractor={item => item.id}
//                                         renderItem={({item, index}) => this.renderFollowing(item, index)}
//                                     />
//                                 </View>
                        
//                         :
//                             <View style={{ flex:1, justifyContent:"center", alignSelf:"center"}}>
//                                 <Text allowFontScaling={false} style={[styles.heading, {color:"#f56"}]}>No data yet!</Text>
//                                 <Text allowFontScaling={false} style={{color:"#767676", fontFamily:"OpenSans", paddingHorizontal:16, textAlign:"center", paddingTop:10}}>Check this section for future updates.</Text>
//                             </View>
//                         }
        
//                     </ScrollView>
//                 </View>
//             )
//         }
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'flex-start',
//         justifyContent: 'flex-start',
//     },
//     headerr:{
//         flexDirection:"row",
//         paddingTop:40, 
//         alignSelf:"stretch", 
//         justifyContent:"space-between", 
//         paddingBottom:6,
//         borderBottomWidth:1,
//         borderBottomColor:"#efefef",
//         paddingHorizontal:16,
//     },
//     heading:{
//         fontFamily:"Futura",
//         fontSize:22,
//         marginTop:6,
//         textAlign:"center",
//         color:"#171919",
//     },
//     name:{
//         fontFamily:"Futura",
//         color:"#171919",
//         padding:16,
//         paddingBottom:0,
//         fontSize:20,
//     },
//     label:{
//         color:"#767676",
//         fontFamily:"OpenSans",
//         fontSize:14,
//         fontWeight:"normal"
//     },
//     labell:{
//         color:"#767676",
//         fontFamily:"OpenSans",
//         fontSize:12,
//     },

// })