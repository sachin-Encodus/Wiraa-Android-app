import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native'
import { FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Header from '../component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import FollowComponent from './followComponent';

export default class Explore extends React.Component{

    state = {
        posts: [],
        profilePic: null,
        isFetching: false,
        userProfileId:"",
        business:[],
        creative:[],
        it:[],
        engg:[],
        lifestyle:[],
        marketing:[],
        study:[],
        writing:[],
        isLoading:false
    }

    componentDidMount = async() => {
        this.setState({isLoading:true})
        // this.getPost();
        const userProfileId = await AsyncStorage.getItem('userPrfileId')
        if(userProfileId !== null) {
            this.setState({userProfileId})
        console.log(userProfileId);
        }else{
            console.log("null")
        }

        
        //Business
        await fetch("http://demo.wiraa.com/api/Network/ExploreRecommendedUser?userProfileId="+userProfileId+"&CatName=Business", {
            method:"POST"
        })
        .then(response => response.json())
        .then((responseJson) => {
            // console.log("dat------->>>>>>",responseJson)
            let business = [...this.state.business];
            responseJson.map(item => {
                business.push({
                    fkUserProfileId: item.fkUserProfileID,
                    userName: item.firstName+" "+item.lastName,
                    occupation: item.occupation,
                    profilePic: item.profilePic,
                    isFollow: item.isFollow,
                })
                this.setState({ business });
            })
            // this.setState({isLoading:false})
        })
        .catch(error => {
            console.log(error);
            this.setState({isLoading:false})
        })

        //Creative
        await fetch("http://demo.wiraa.com/api/Network/ExploreRecommendedUser?userProfileId="+userProfileId+"&CatName=Creative", {
            method:"POST"
        })
        .then(response => response.json())
        .then((responseJson) => {
            let creative = [...this.state.creative];
            responseJson.map(item => {
                creative.push({
                    fkUserProfileId: item.fkUserProfileID,
                    userName: item.firstName+" "+item.lastName,
                    occupation: item.occupation,
                    profilePic: item.profilePic,
                    isFollow: item.isFollow,
                })
                this.setState({ creative });
            })
            // this.setState({isLoading:false})
        })
        .catch(error => {
            console.log(error);
            this.setState({isLoading:false})
        })

        //Engineering
        await fetch("http://demo.wiraa.com/api/Network/ExploreRecommendedUser?userProfileId="+userProfileId+"&CatName=Engineering", {
            method:"POST"
        })
        .then(response => response.json())
        .then((responseJson) => {
            let engg = [...this.state.engg];
            responseJson.map(item => {
                engg.push({
                    fkUserProfileId: item.fkUserProfileID,
                    userName: item.firstName+" "+item.lastName,
                    occupation: item.occupation,
                    profilePic: item.profilePic,
                    isFollow: item.isFollow,
                })
                this.setState({ engg });
            })
            // this.setState({isLoading:false})
        })
        .catch(error => {
            console.log(error);
        })

        //Engineering
        await fetch("http://demo.wiraa.com/api/Network/ExploreRecommendedUser?userProfileId="+userProfileId+"&CatName=IT", {
            method:"POST"
        })
        .then(response => response.json())
        .then((responseJson) => {
            let it = [...this.state.it];
            responseJson.map(item => {
                it.push({
                    fkUserProfileId: item.fkUserProfileID,
                    userName: item.firstName+" "+item.lastName,
                    occupation: item.occupation,
                    profilePic: item.profilePic,
                    isFollow: item.isFollow,
                })
                this.setState({ it });
            })
            // this.setState({isLoading:false})
        })
        .catch(error => {
            console.log(error);
            this.setState({isLoading:false})
        })

        //Engineering
        await fetch("http://demo.wiraa.com/api/Network/ExploreRecommendedUser?userProfileId="+userProfileId+"&CatName=Lifestyle", {
            method:"POST"
        })
        .then(response => response.json())
        .then((responseJson) => {
            let lifestyle = [...this.state.lifestyle];
            responseJson.map(item => {
                lifestyle.push({
                    fkUserProfileId: item.fkUserProfileID,
                    userName: item.firstName+" "+item.lastName,
                    occupation: item.occupation,
                    profilePic: item.profilePic,
                    isFollow: item.isFollow,
                })
                this.setState({ lifestyle });
            })
            // this.setState({isLoading:false})
        })
        .catch(error => {
            console.log(error);
            this.setState({isLoading:false})
        })

        //Engineering
        await fetch("http://demo.wiraa.com/api/Network/ExploreRecommendedUser?userProfileId="+userProfileId+"&CatName=Marketing", {
            method:"POST"
        })
        .then(response => response.json())
        .then((responseJson) => {
            let marketing = [...this.state.marketing];
            responseJson.map(item => {
                marketing.push({
                    fkUserProfileId: item.fkUserProfileID,
                    userName: item.firstName+" "+item.lastName,
                    occupation: item.occupation,
                    profilePic: item.profilePic,
                    isFollow: item.isFollow,
                })
                this.setState({ marketing });
            })
            // this.setState({isLoading:false})
        })
        .catch(error => {
            console.log(error);
            this.setState({isLoading:false})
        })

        //Engineering
        await fetch("http://demo.wiraa.com/api/Network/ExploreRecommendedUser?userProfileId="+userProfileId+"&CatName=Study", {
            method:"POST"
        })
        .then(response => response.json())
        .then((responseJson) => {
            let study = [...this.state.study];
            responseJson.map(item => {
                study.push({
                    fkUserProfileId: item.fkUserProfileID,
                    userName: item.firstName+" "+item.lastName,
                    occupation: item.occupation,
                    profilePic: item.profilePic,
                    isFollow: item.isFollow,
                })
                this.setState({ study });
            })
            // this.setState({isLoading:false})
        })
        .catch(error => {
            console.log(error);
            this.setState({isLoading:false})
        })

        //Engineering
        await fetch("http://demo.wiraa.com/api/Network/ExploreRecommendedUser?userProfileId="+userProfileId+"&CatName=Writing", {
            method:"POST"
        })
        .then(response => response.json())
        .then((responseJson) => {
            let writing = [...this.state.writing];
            responseJson.map(item => {
                writing.push({
                    fkUserProfileId: item.fkUserProfileID,
                    userName: item.firstName+" "+item.lastName,
                    occupation: item.occupation,
                    profilePic: item.profilePic,
                    isFollow: item.isFollow,
                })
                this.setState({ writing });
            })
            this.setState({isLoading:false})
        })
        .catch(error => {
            console.log(error);
            this.setState({isLoading:false})
        })

    }

    renderBusiness = (item, index) => {
        return(
            <FollowComponent 
                item={item} 
                key={item.index} 
                addFollower={this.addFollower} 
                removeFollower={this.removeFollower} 
                userProfileId={this.state.userProfileId} 
                navigation={this.props.navigation} />

            // <View style={{flex:1, alignItems:"center", justifyContent:"center", marginTop:6, width:150, height:180,   backgroundColor: "#fff", borderRadius:10, marginLeft:16,elevation: 7, marginBottom:'3%'}}>
            //     {/* <Ionicons name="ios-close" size={30} color="#171919" style={{position:"absolute", top:0, right:15}} /> */}
            //     <TouchableOpacity onPress={() => item.fkUserProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.fkUserProfileId}) : this.props.navigation.navigate("Profile") } >
            //         <Image style={{width:60, height:60, borderRadius:60}} source={{uri: item.profilePic === null ? "http://demo.wiraa.com/Content/img/boys-avtar.jpg" : "http://demo.wiraa.com"+item.profilePic}} />
            //     </TouchableOpacity>

            //     <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.name, {fontSize:14, paddingTop:6, paddingLeft:12}]}> {item.userName} </Text>
            //     <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {fontSize:12}]}> {item.occupation} </Text>
            //     <TouchableOpacity onPress={() => this.addFollower(item.fkUserProfileId)} style={[styles.follow,{display:item.isFollow ? "none" : "flex", backgroundColor:"#f56"}]}>
            //         <Text allowFontScaling={false} style={styles.followTxt}>Follow</Text>
            //     </TouchableOpacity>
            //     <TouchableOpacity onPress={() => this.removeFollower(item.fkUserProfileId)} style={[styles.follow, {display: !item.isFollow ? "none" : "flex", backgroundColor:"#aaaaaa"}]}>
            //         <Text allowFontScaling={false} style={styles.followTxt}>Following</Text>
            //     </TouchableOpacity>
            // </View>
        )
    }

    renderCreative = (item, index) => {
        return(
            <FollowComponent 
            item={item} 
            key={item.index} 
            addFollower={this.addFollower} 
            removeFollower={this.removeFollower} 
            userProfileId={this.state.userProfileId} 
            navigation={this.props.navigation} />
            // <View style={{flex:1, alignItems:"center", justifyContent:"center", marginTop:6, borderRightWidth:1, borderRightColor:"#fff", width:150, height:180, backgroundColor:"#fff", borderRadius:10, marginLeft:16,elevation:7,marginBottom:"3%"}}>
            //     {/* <Ionicons name="ios-close" size={30} color="#171919" style={{position:"absolute", top:0, right:15}} /> */}
            //     <TouchableOpacity onPress={() => item.fkUserProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.fkUserProfileId}) : this.props.navigation.navigate("Profile") } >
            //         <Image style={{width:60, height:60, borderRadius:60}} source={{uri: item.profilePic === null ? "http://demo.wiraa.com/Content/img/boys-avtar.jpg" : "http://demo.wiraa.com"+item.profilePic}} />
            //     </TouchableOpacity>

            //     <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.name, {fontSize:14, paddingTop:6, paddingLeft:12}]}> {item.userName} </Text>
            //     <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {fontSize:12}]}> {item.occupation} </Text>
            //     <TouchableOpacity onPress={() => this.addFollower(item.fkUserProfileId)} style={[styles.follow, {display: item.isFollow ? "none" : "flex", backgroundColor:"#f56"}]}>
            //         <Text allowFontScaling={false} style={styles.followTxt}>Follow</Text>
            //     </TouchableOpacity>
            //     <TouchableOpacity onPress={() => this.removeFollower(item.fkUserProfileId)} style={[styles.follow, {display: !item.isFollow ? "none" : "flex", backgroundColor:"#aaaaaa"}]}>
            //         <Text allowFontScaling={false} style={styles.followTxt}>Following</Text>
            //     </TouchableOpacity>
            // </View>
        )
    }

    renderEngg = (item, index) => {
        return(
            <FollowComponent 
            item={item} 
            key={item.index} 
            addFollower={this.addFollower} 
            removeFollower={this.removeFollower} 
            userProfileId={this.state.userProfileId} 
            navigation={this.props.navigation} />
            // <View style={{flex:1, alignItems:"center", justifyContent:"center", marginTop:6, borderRightWidth:1, borderRightColor:"#fff", width:150, height:180, backgroundColor:"#fff", borderRadius:10, marginLeft:16,elevation:7,marginBottom:"3%"}}>
            //     {/* <Ionicons name="ios-close" size={30} color="#171919" style={{position:"absolute", top:0, right:15}} /> */}
            //     <TouchableOpacity onPress={() => item.fkUserProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.fkUserProfileId}) : this.props.navigation.navigate("Profile") } >
            //         <Image style={{width:60, height:60, borderRadius:60}} source={{uri: item.profilePic === null ? "http://demo.wiraa.com/Content/img/boys-avtar.jpg" : "http://demo.wiraa.com"+item.profilePic}} />
            //     </TouchableOpacity>

            //     <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.name, {fontSize:14, paddingTop:6, paddingLeft:12}]}> {item.userName} </Text>
            //     <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {fontSize:12}]}> {item.occupation} </Text>
            //     <TouchableOpacity onPress={() => this.addFollower(item.fkUserProfileId)} style={[styles.follow, {display: item.isFollow ? "none" : "flex", backgroundColor:"#f56"}]}>
            //         <Text allowFontScaling={false} style={styles.followTxt}>Follow</Text>
            //     </TouchableOpacity>
            //     <TouchableOpacity onPress={() => this.removeFollower(item.fkUserProfileId)} style={[styles.follow, {display: !item.isFollow ? "none" : "flex", backgroundColor:"#aaaaaa"}]}>
            //         <Text allowFontScaling={false} style={styles.followTxt}>Following</Text>
            //     </TouchableOpacity>
            // </View>
        )
    }

    renderIT = (item, index) => {
        return(
            <FollowComponent 
            item={item} 
            key={item.index} 
            addFollower={this.addFollower} 
            removeFollower={this.removeFollower} 
            userProfileId={this.state.userProfileId} 
            navigation={this.props.navigation} />
            // <View style={{flex:1, alignItems:"center", justifyContent:"center", marginTop:6, borderRightWidth:1, borderRightColor:"#fff", width:150, height:180, backgroundColor:"#fff", borderRadius:10, marginLeft:16,elevation:7,marginBottom:"3%"}}>
            //     {/* <Ionicons name="ios-close" size={30} color="#171919" style={{position:"absolute", top:0, right:15}} /> */}
            //     <TouchableOpacity onPress={() => item.fkUserProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.fkUserProfileId}) : this.props.navigation.navigate("Profile") } >
            //         <Image style={{width:60, height:60, borderRadius:60}} source={{uri: item.profilePic === null ? "http://demo.wiraa.com/Content/img/boys-avtar.jpg" : "http://demo.wiraa.com"+item.profilePic}} />
            //     </TouchableOpacity>

            //     <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.name, {fontSize:14, paddingTop:6, paddingLeft:12}]}> {item.userName} </Text>
            //     <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {fontSize:12}]}> {item.occupation} </Text>
            //     <TouchableOpacity onPress={() => this.addFollower(item.fkUserProfileId)} style={[styles.follow, {display: item.isFollow ? "none" : "flex", backgroundColor:"#f56"}]}>
            //         <Text allowFontScaling={false} style={styles.followTxt}>Follow</Text>
            //     </TouchableOpacity>
            //     <TouchableOpacity onPress={() => this.removeFollower(item.fkUserProfileId)} style={[styles.follow, {display: !item.isFollow ? "none" : "flex", backgroundColor:"#aaaaaa"}]}>
            //         <Text allowFontScaling={false} style={styles.followTxt}>Following</Text>
            //     </TouchableOpacity>
            // </View>
        )
    }

    renderLifestyle = (item, index) => {
        return(
            <FollowComponent 
            item={item} 
            key={item.index} 
            addFollower={this.addFollower} 
            removeFollower={this.removeFollower} 
            userProfileId={this.state.userProfileId} 
            navigation={this.props.navigation} />
            // <View style={{flex:1, alignItems:"center", justifyContent:"center", marginTop:6, borderRightWidth:1, borderRightColor:"#fff", width:150, height:180, backgroundColor:"#fff", borderRadius:10, marginLeft:16,elevation:7,marginBottom:"3%"}}>
            //     {/* <Ionicons name="ios-close" size={30} color="#171919" style={{position:"absolute", top:0, right:15}} /> */}
            //     <TouchableOpacity onPress={() => item.fkUserProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.fkUserProfileId}) : this.props.navigation.navigate("Profile") } >
            //         <Image style={{width:60, height:60, borderRadius:60}} source={{uri: item.profilePic === null ? "http://demo.wiraa.com/Content/img/boys-avtar.jpg" : "http://demo.wiraa.com"+item.profilePic}} />
            //     </TouchableOpacity>

            //     <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.name, {fontSize:14, paddingTop:6, paddingLeft:12}]}> {item.userName} </Text>
            //     <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {fontSize:12}]}> {item.occupation} </Text>
            //     <TouchableOpacity onPress={() => this.addFollower(item.fkUserProfileId)} style={[styles.follow, {display: item.isFollow ? "none" : "flex", backgroundColor:"#f56"}]}>
            //         <Text allowFontScaling={false} style={styles.followTxt}>Follow</Text>
            //     </TouchableOpacity>
            //     <TouchableOpacity onPress={() => this.removeFollower(item.fkUserProfileId)} style={[styles.follow, {display: !item.isFollow ? "none" : "flex", backgroundColor:"#aaaaaa"}]}>
            //         <Text allowFontScaling={false} style={styles.followTxt}>Following</Text>
            //     </TouchableOpacity>
            // </View>
        )
    }

    renderStudy = (item, index) => {
        return(
            <FollowComponent 
            item={item} 
            key={item.index} 
            addFollower={this.addFollower} 
            removeFollower={this.removeFollower} 
            userProfileId={this.state.userProfileId} 
            navigation={this.props.navigation} />
            // <View style={{flex:1, alignItems:"center", justifyContent:"center", marginTop:6, borderRightWidth:1, borderRightColor:"#fff", width:150, height:180, backgroundColor:"#fff", borderRadius:10, marginLeft:16,elevation:7,marginBottom:"3%"}}>
            //     {/* <Ionicons name="ios-close" size={30} color="#171919" style={{position:"absolute", top:0, right:15}} /> */}
            //     <TouchableOpacity onPress={() => item.fkUserProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.fkUserProfileId}) : this.props.navigation.navigate("Profile") } >
            //         <Image style={{width:60, height:60, borderRadius:60}} source={{uri: item.profilePic === null ? "http://demo.wiraa.com/Content/img/boys-avtar.jpg" : "http://demo.wiraa.com"+item.profilePic}} />
            //     </TouchableOpacity>

            //     <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.name, {fontSize:14, paddingTop:6, paddingLeft:12}]}> {item.userName} </Text>
            //     <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {fontSize:12}]}> {item.occupation} </Text>
            //     <TouchableOpacity onPress={() => this.addFollower(item.fkUserProfileId)} style={[styles.follow, {display: item.isFollow ? "none" : "flex", backgroundColor:"#f56"}]}>
            //         <Text allowFontScaling={false} style={styles.followTxt}>Follow</Text>
            //     </TouchableOpacity>
            //     <TouchableOpacity onPress={() => this.removeFollower(item.fkUserProfileId)} style={[styles.follow, {display: !item.isFollow ? "none" : "flex", backgroundColor:"#aaaaaa"}]}>
            //         <Text allowFontScaling={false} style={styles.followTxt}>Following</Text>
            //     </TouchableOpacity>
            // </View>
        )
    }

    renderWriting = (item, index) => {
        return(
            <FollowComponent 
            item={item} 
            key={item.index} 
            addFollower={this.addFollower} 
            removeFollower={this.removeFollower} 
            userProfileId={this.state.userProfileId} 
            navigation={this.props.navigation} />
            // <View style={{flex:1, alignItems:"center", justifyContent:"center", marginTop:6, borderRightWidth:1, borderRightColor:"#fff", width:150, height:180, backgroundColor:"#fff", borderRadius:10, marginLeft:16,elevation:7,marginBottom:"3%"}}>
            //     {/* <Ionicons name="ios-close" size={30} color="#171919" style={{position:"absolute", top:0, right:15}} /> */}
            //     <TouchableOpacity onPress={() => item.fkUserProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.fkUserProfileId}) : this.props.navigation.navigate("Profile") } >
            //         <Image style={{width:60, height:60, borderRadius:60}} source={{uri: item.profilePic === null ? "http://demo.wiraa.com/Content/img/boys-avtar.jpg" : "http://demo.wiraa.com"+item.profilePic}} />
            //     </TouchableOpacity>

            //     <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.name, {fontSize:14, paddingTop:6, paddingLeft:12}]}> {item.userName} </Text>
            //     <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {fontSize:12}]}> {item.occupation} </Text>
            //     <TouchableOpacity onPress={() => this.addFollower(item.fkUserProfileId)} style={[styles.follow, {display: item.isFollow ? "none" : "flex", backgroundColor:"#f56"}]}>
            //         <Text allowFontScaling={false} style={styles.followTxt}>Follow</Text>
            //     </TouchableOpacity>
            //     <TouchableOpacity onPress={() => this.removeFollower(item.fkUserProfileId)} style={[styles.follow, {display: !item.isFollow ? "none" : "flex", backgroundColor:"#aaaaaa"}]}>
            //         <Text allowFontScaling={false} style={styles.followTxt}>Following</Text>
            //     </TouchableOpacity>
            // </View>
        )
    }




    addFollower = async(fkUserProfileId) => {
        let response = await fetch("http://demo.wiraa.com/api/Network/AddFollower?FollowerId="+fkUserProfileId+"&UserId="+this.state.userProfileId,{
            method: "POST"
        });
        let data = response.json();
        return data;
    }

    removeFollower = async(fkUserProfileId) => {
        let response = await fetch("http://demo.wiraa.com/api/Network/RemoveFollower?FollowerId="+fkUserProfileId+"&UserId="+this.state.userProfileId,{
            method: "POST"
        })
        let data = response.json();
        return data;

        // .then(response => response.json())
        // .then(responseJson => {
        //     console.log(responseJson)
        //     this.setState({isLoading:false})
        //     this.setState({ recommendations: this.state.recommendations.map(item => item.fkUserProfileId === fkUserProfileId ? {...item, isFollow: !item.isFollow} : item) })
        //     // this.setState({isLoading:false})
        // })
      
    }

    // getPost = async() => {

    //     this.setState({ isFetching: true })

    //     const userProfileId = await AsyncStorage.getItem('userPrfileId')
    //     if(userProfileId !== null){
    //         this.setState({ userProfileId })
    //     }
    //     const profilePic = await AsyncStorage.getItem('profilePic')
    //     if(profilePic !== null){
    //         this.setState({ profilePic })
    //     }

    //     console.log(profilePic);

    //     await fetch("http://demo.wiraa.com/api/Post/GetAllPost?Id="+userProfileId+"&pageNo=0", {
    //         method: 'GET'
    //         //Request Type 
    //     })
    //     .then(response => response.json())
    //     .then(responseJson => {
    //         let posts = [...this.state.posts];
    //         responseJson.map(item => {
    //             posts.push({
    //                 id: item.$id,
    //                 fkUserProfileId: item.fkUserProfileID,
    //                 userName: item.firstName,
    //                 occupation: item.occupation,
    //                 profilePic: item.profilePic,
    //                 desc: item.description,
    //                 likesCount: item.likesCount,
    //                 commentsCount: item.commentCount,
    //                 isPostLiked: item.isPostLiked,
    //                 imageURL: item.postImagesList[0] !== undefined ? item.postImagesList[0].imageURL : "",
    //                 postDate: item.postDate,
    //             })

    //             this.setState({ posts, isFetching: false });
    //         })
    //     })

    //     this.setState({isLoading: false})
    // }

    // renderPosts = (item, index) => {

    //     const imageURL = item.imageURL.split("~");
    //     const videoURL = imageURL[1] !== undefined ? imageURL[1].split(".") : "";

    //     return(
    //         <TouchableOpacity style={{borderBottomWidth:1, borderBottomColor:"#efefef", marginHorizontal:16,  }}>
    //             <View style={{flexDirection:"row", justifyContent:"space-between"}}>
    //                 <View style={{width: item.imageURL !== "" ? 260 : 360}}>
    //                     <View style={{flex:1, flexDirection:"row"}}>
    //                         <Image style={{width:35, height:35, borderRadius:60, marginTop:16, marginBottom:10, marginRight:10}} source={{uri: item.profilePic===null ? "http://demo.wiraa.com/Images/Profile.png" : "http://demo.wiraa.com/"+item.profilePic}}  />
    //                         <TouchableOpacity onPress={() => item.fkUserProfileId !== this.state.userProfileId ? this.props.navigation.navigate("UserProfile",{fkUserProfileId: item.fkUserProfileId}) : this.props.navigation.navigate("Profile") } style={{marginTop:6}}>
    //                             <Text allowFontScaling={false} style={{fontFamily:"Futura", color:"#171919", fontSize:14, paddingTop:10}}>{item.userName}</Text>
    //                             <Text numberOfLines={1} ellipsizeMode="tail" allowFontScaling={false} style={[styles.label, { width:200}]}>{item.occupation}</Text>
    //                         </TouchableOpacity >
    //                     </View>
    //                     <Text allowFontScaling={false} numberOfLines={2} ellipsizeMode="tail" style={[styles.labell, {paddingHorizontal:0, paddingBottom:16}]}>{item.desc}</Text>
    //                 </View>
                    
    //                 <View style={{display : item.imageURL !== "" ? "flex" : "none", paddingTop:10}}>
    //                     <Image style={{width: 85, height:85, borderRadius:10, marginTop:5, marginLeft:16, display: videoURL[1] !== undefined && videoURL[1] === "mp4" ? "none" : "flex"}} source={{uri: imageURL[0] !== undefined ? "http://demo.wiraa.com"+ imageURL[0] : ""}} />
    //                     <Video
    //                         source={{ uri: videoURL[0] !== undefined && videoURL[1] === "mp4" ? "http://demo.wiraa.com"+ videoURL[0]+"."+videoURL[1] : "" }}
    //                         rate={1.0}
    //                         volume={1.0}
    //                         isMuted={false}
    //                         resizeMode="cover"
    //                         style={{ width: 85, height: 85, borderRadius:10, marginTop:5, marginLeft:16, display: videoURL[1] !== undefined && videoURL[1] === "mp4" ? "flex" : "none" }}
    //                     />
    //                 </View>

    //             </View>
    //         </TouchableOpacity>
    //     )
    // }

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
                    <View style={styles.headerr}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} style={{paddingTop:4}}>
                            <Image style={{width:30, height:30, borderRadius:30}} source={{uri: this.state.profilePic !== null ? "http://demo.wiraa.com"+this.state.profilePic : "http://demo.wiraa.com/Content/img/boys-avtar.jpg"}} />
                        </TouchableOpacity>
                        <Text allowFontScaling={false} style={styles.heading}>Experts</Text>
                        
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Messages")}>
                            <Ionicons name="md-mail" size={24} color="#767676" style={{paddingTop:10, paddingLeft:0}} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        <View style={styles.cards}>
                            <Text allowFontScaling={false} style={[styles.name,{fontSize:18}]}>Business</Text>
                            <FlatList 
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                data={this.state.business}
                                keyExtractor={item => item.fkUserProfileID}
                                renderItem={({item, index}) => this.renderBusiness(item, index)}
                            />
                        </View>
                        <View style={styles.cards}>
                            <Text allowFontScaling={false} style={[styles.name,{fontSize:18}]}>Creative</Text>
                            <FlatList 
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                data={this.state.creative}
                                keyExtractor={item => item.fkUserProfileID}
                                renderItem={({item, index}) => this.renderCreative(item, index)}
                            />
                        </View>
                        <View style={styles.cards}>
                            <Text allowFontScaling={false} style={[styles.name,{fontSize:18}]}>Engineering</Text>
                            <FlatList 
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                data={this.state.engg}
                                keyExtractor={item => item.fkUserProfileID}
                                renderItem={({item, index}) => this.renderEngg(item, index)}
                            />
                        </View>
                        <View style={styles.cards}>
                            <Text allowFontScaling={false} style={[styles.name,{fontSize:18}]}>IT</Text>
                            <FlatList 
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                data={this.state.it}
                                keyExtractor={item => item.fkUserProfileID}
                                renderItem={({item, index}) => this.renderIT(item, index)}
                            />
                        </View>
                        <View style={styles.cards}>
                            <Text allowFontScaling={false} style={[styles.name,{fontSize:18}]}>Lifestyle</Text>
                            <FlatList 
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                data={this.state.lifestyle}
                                keyExtractor={item => item.fkUserProfileID}
                                renderItem={({item, index}) => this.renderLifestyle(item, index)}
                            />
                        </View>
                        <View style={styles.cards}>
                            <Text allowFontScaling={false} style={[styles.name,{fontSize:18}]}>Study</Text>
                            <FlatList 
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                data={this.state.study}
                                keyExtractor={item => item.fkUserProfileID}
                                renderItem={({item, index}) => this.renderStudy(item, index)}
                            />
                        </View> 
                        <View style={styles.cards}>
                            <Text allowFontScaling={false} style={[styles.name,{fontSize:18}]}>Writing</Text>
                            <FlatList 
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                data={this.state.writing}
                                keyExtractor={item => item.fkUserProfileID}
                                renderItem={({item, index}) => this.renderWriting(item, index)}
                            />
                        </View>
                    <View style={{marginBottom:"5%"}}></View> 
                    </ScrollView>
                 
                    {/* <ScrollView showsVerticalScrollIndicator={false}>

                        <TouchableOpacity>
                            <LinearGradient
                            // Button Linear Gradient
                            colors={['#F2994A', '#F2C94C']}
                            style={styles.button}>
                                <Ionicons name="md-briefcase" size={24} color="#fff" style={{textAlign:"left", padding:32, paddingBottom:10, paddingLeft:48}} />
                                <Text allowFontScaling={false} style={styles.catTitle}>Business</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={{flex:1, flexDirection:"row"}}>
                            <TouchableOpacity style={{width:180}}>
                                <LinearGradient
                                // Button Linear Gradient
                                colors={['#2193b0', '#6dd5ed']}
                                style={styles.button}>
                                    <Ionicons name="md-briefcase" size={24} color="#fff" style={{textAlign:"left", padding:32, paddingBottom:10, paddingLeft:48}} />
                                    <Text allowFontScaling={false} style={[styles.catTitle, {paddingBottom:40}]}>Business</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity style={{width:180}}>
                                <LinearGradient
                                // Button Linear Gradient
                                colors={['#2193b0', '#6dd5ed']}
                                style={styles.button}>
                                    <Ionicons name="md-briefcase" size={24} color="#fff" style={{textAlign:"left", padding:32, paddingBottom:10, paddingLeft:48}} />
                                    <Text allowFontScaling={false} style={[styles.catTitle, {paddingBottom:40}]}>Business</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View> */}
                       
                            {/* <Text allowFontScaling={false} style={[styles.name, {alignSelf:"flex-start", marginLeft:16, paddingHorizontal:0, fontSize:20}]}>Categories</Text>
                         
                            <View style={{marginTop:16, }}>
                                <View style={{flexDirection:"row", alignSelf:"stretch", justifyContent:"space-evenly", height:70}}>
                                    
                                    <TouchableOpacity style={{width:80}} onPress={() => this.props.navigation.navigate("Recommended", {cat: "Business", catId:1})}>
                                        <Ionicons name="md-briefcase" size={24} color="#171919" style={{textAlign:"center"}} />
                                        <Text allowFontScaling={false} style={styles.catTitle}>Business</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{width:80}} onPress={() => this.props.navigation.navigate("Recommended", {cat: "Design", catId:2})}>
                                        <Ionicons name="md-color-palette" size={24} color="#171919" style={{textAlign:"center"}} />
                                        <Text allowFontScaling={false} style={styles.catTitle}>Design</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{width:80}} onPress={() => this.props.navigation.navigate("Recommended", {cat: "Health", catId:3})}>
                                    <Ionicons name="md-heart" size={24} color="#171919" style={{textAlign:"center"}}/>
                                       
                                        <Text allowFontScaling={false} style={styles.catTitle}>Health</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{width:80}} onPress={() => this.props.navigation.navigate("Recommended", {cat: "IT", catId:4})}>
                                    <Ionicons name="md-cloud" size={24} color="#171919" style={{textAlign:"center"}}/>
                                       
                                        <Text allowFontScaling={false} style={styles.catTitle}>IT</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={{flexDirection:"row", alignSelf:"stretch", justifyContent:"space-evenly", height:70}}>
                                    <TouchableOpacity style={{width:80}} onPress={() => this.props.navigation.navigate("Recommended", {cat: "Lifestyle", catId:5})}>
                                    <Ionicons name="md-camera" size={24} color="#171919" style={{textAlign:"center"}}/>
                                        
                                        <Text allowFontScaling={false} style={styles.catTitle}>Lifestyle</Text>
                                    </TouchableOpacity> 
                                    <TouchableOpacity style={{width:80}} onPress={() => this.props.navigation.navigate("Recommended", {cat: "Marketing", catId:6})}>
                                    <Ionicons name="md-megaphone" size={24} color="#171919" style={{textAlign:"center"}} />
                                        
                                        <Text allowFontScaling={false} style={styles.catTitle}>Marketing</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{width:80}} onPress={() => this.props.navigation.navigate("Recommended", {cat: "Study", catId:7})}>
                                    <Ionicons name="md-school" size={24} color="#171919" style={{textAlign:"center"}}/>
                                     
                                        <Text allowFontScaling={false} style={styles.catTitle}>Study</Text>
                                    </TouchableOpacity> 
                                    <TouchableOpacity style={{width:80}} onPress={() => this.props.navigation.navigate("Recommended", {cat: "Writing", catId:8})}>
                                    <Ionicons name="ios-create" size={24} color="#171919" style={{textAlign:"center"}}/>
                                       
                                        <Text allowFontScaling={false} style={styles.catTitle}>Writing</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                      
    
                        <View style={{flex:1, borderTopWidth:3, borderTopColor:"#efefef"}}>
                            <Text allowFontScaling={false} style={[styles.name, {alignSelf:"flex-start", marginLeft:16, paddingHorizontal:0, fontSize:20}]}>Trending</Text>
                            
                            <FlatList
                            nestedScrollEnabled={true}
                                data={this.state.posts}
                                onRefresh={() => this.getPost()}
                                refreshing={this.state.isFetching}
                                keyExtractor={item => item.id}
                                renderItem={({item, index}) => this.renderPosts(item, index)}
                            />
    
                        </View> */}
    
                    {/* </ScrollView> */}
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
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
        
        textAlign:"center",
        color:"#171919",
    },
    cards:{
        height:"auto",
        marginVertical:"2%"
    },
    // img:{
    //     width:60, 
    //     height:60,
    //     borderRadius:6, 
    //     alignSelf:"center"
    // },
    // name:{
    //     fontFamily:"Futura",
    //     color:"#171919",
    //     padding:16,
    //     paddingTop:16,
    //     paddingBottom:0,
    //     fontSize:16,
    // },
    // label:{
    //     fontFamily:"OpenSans",
    //     color:"#767676",
    //     fontSize:12,
      
    // },
    // labell:{
    //     fontFamily:"OpenSans",
    //     color:"#171919",
    //     fontSize:14,
    // },
    // follow:{
    //     backgroundColor:"#f56",
    //     alignSelf:"stretch",
    //     padding:10,
    //     margin: 20,
    //     marginBottom:0,
    //     marginTop:10,
    //     marginVertical:5,
    //     borderRadius:10,
    //     elevation:4,
    // },
    // followTxt:{
    //     textAlign:"center",
    //     fontSize:14,
    //     color:"#fff",
    //     fontFamily:"Futura",
    // },
    // catTitle:{
    //     textAlign:"left",
    //     fontFamily:"Futura",
    //     fontSize:20,
    //     paddingTop:10,
    //     paddingBottom:32,
    //     color:"#fff",
    //     paddingLeft:32
    // },
    // button:{
    //     marginVertical:16,
    //     marginHorizontal:16,
    //     borderRadius:16,

    // }

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
        padding:16,
        paddingTop: 0,
        paddingBottom:0,
        fontSize:12,
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