import React,{useState} from 'react'
import { View, Text , StyleSheet,TouchableOpacity,Image} from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

export default function FollowComponent(props) {

const [follow, setFollow] = useState(props.item.isFollow);


const followUser = async () => {
    let response  = await props.addFollower(props.item.fkUserProfileId);
    if (response) setFollow(true);
    else alert("Network error. Please try again later")
}

const unfollowUser = async () => {
    let response  = await props.removeFollower(props.item.fkUserProfileId);
    if (response) setFollow(false);
    else alert("Network error. Please try again later")
}

return (
        <View style={{flex:1, alignItems:"center", justifyContent:"center", marginTop:6, borderRightWidth:1, borderRightColor:"#fff", width:widthPercentageToDP("36%"), 
        // height:heightPercentageToDP(28), 
        
        backgroundColor:"#fff", borderRadius:10, marginLeft:widthPercentageToDP(3),
        marginRight:widthPercentageToDP(1.5),
        elevation:7,marginBottom:"3%"}}> 
        <View style={{  alignItems:"center", justifyContent:"center",  marginVertical:heightPercentageToDP(3),}}  >
                <TouchableOpacity onPress={() => props.item.fkUserProfileId !== props.userProfileId ? props.navigation.navigate("UserProfile",{fkUserProfileId: props.item.fkUserProfileId}) : props.navigation.navigate("Profile")  } >
                    <Image style={{width:60, height:60, borderRadius:60}} source={{uri: props.item.profilePic === null ? "http://demo.wiraa.com/Content/img/boys-avtar.jpg" : "http://demo.wiraa.com"+props.item.profilePic}} />
                </TouchableOpacity>

                <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.name, {fontSize:14, paddingTop:6, paddingLeft:12}]}> {props.item.userName} </Text>
                <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={[styles.label, {fontSize:12}]}> {props.item.occupation} </Text>
                <TouchableOpacity onPress={() => followUser()} style={[styles.follow, {display: follow ? "none" : "flex", backgroundColor:"#f56"}]}>
                    <Text allowFontScaling={false} style={styles.followTxt}>Follow</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => unfollowUser()} style={[styles.follow, {display: !follow ? "none" : "flex", backgroundColor:"#aaaaaa"}]}>
                    <Text allowFontScaling={false} style={styles.followTxt}>Following</Text>
                </TouchableOpacity>
                </View> 
        </View>
    )
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
        marginTop:6,
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
