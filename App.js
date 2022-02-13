import React from 'react';
import { LogBox, BackHandler ,View , Image} from 'react-native'
import * as Font from 'expo-font';
import { Ionicons,MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import LandingScreen from './Screens/LandingScreen';
import PostRequest from './Screens/PostRequest';
import Dashboard from './Screens/Dashboard';
import Notifications from './Screens/Notifications';
import Messages from './Screens/Messages';
import Profile from './Screens/Profile';
import QnA from './Screens/QnA';
import QuestionDetails from './Screens/QuestionDetails';
import Explore from './Screens/Explore';
import Manage from './Screens/Manage';
import Settings from './Screens/Settings';
import BusinessUser from './Screens/BusinessUser';
import OrderDetails from './Screens/OrderDetails';
import ResetPassword from './Screens/ResetPassword';
import PostArticle from './Screens/PostArticle';
import PostQuestion from './Screens/PostQuestion';
import Follow from './Screens/Follow';
import Pricing from './Screens/Pricing'
import Comment from './Screens/Comment'

import AddBtn from './component/AddBtn'
import Conversation from './Screens/Conversation';
import Recommended from './Screens/Recommended';
import Interests from './component/Interests';
import Expertize from './component/Expertize';
import ProjectDetails from './Screens/ProjectDetails';
import UserProfile from './Screens/UserProfile';
import Add from './component/Add';
import Categories from './Screens/Categories';
import Admin from './Screens/Admin';
import PackageDetails from './Screens/PackageDetails';
import CommonHeader from './component/CommonHeader';
import Badge from './Screens/Badge';
import LogoutScreen  from  './Screens/LogoutScreen';
import FollowComponent from './Screens/followComponent';
import PostComponent from './Screens/PostComponent';
import Splash from './Screens/Splash';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer =  createDrawerNavigator();


export default class App extends React.Component {


  state={
    indicator:false,
    userType:""
  }
  // state={
  //   loaded:true,
  // }

 componentDidMount(){
 LogBox.ignoreAllLogs();
 this.loadFontAsync();
     
          }
        
        
          async  hide (){
        
           let user = await AsyncStorage.getItem('userData');  
           let parsed = JSON.parse(user);  
          //  console.log("==============xxxxxxxxxxxxxxx",parsed.userInfo.userType);
           this.setState({userType:parsed.userInfo.userType})
                    }




  loadFontAsync = async() => {
    await Font.loadAsync({
      "Futura": require("./assets/fonts/Futura_Heavy_font.ttf"),
      "OpenSans": require("./assets/fonts/OpenSans-SemiBold.ttf"),
    });
    
  }

  placeholderComp = () => {
    return null;
  }

  drawerNavigation = () => {
       this.hide()
    return(
      <Drawer.Navigator initialRouteName="Home" drawerContentOptions={{activeBackgroundColor:"#f56", activeTintColor:"#fff", labelStyle: { fontFamily:"Futura" }}}>
        <Drawer.Screen name="Home" component={this.bottomTabNavigation} options={{unmountOnBlur: true}} />
        <Drawer.Screen name="Profile" component={Profile} options={{unmountOnBlur: true}} />
        <Drawer.Screen name="Community" component={QnA} options={{unmountOnBlur: true}} />
         { this.state.userType === 3 ? <Drawer.Screen name="Package" component={Pricing} /> : null}
        <Drawer.Screen name="Settings" component={Settings} />
        <Drawer.Screen name="Logout" component={LogoutScreen} />
      </Drawer.Navigator>
    )
  }

  handleBackButton = () => {
    BackHandler.exitApp();
    return true;
  }

   notify = () =>{
   
this.setState({indicator: true})
 console.log("value ", this.state.indicator);
  }


  bottomTabNavigation = ( {navigation} ) => {

    return(
      <Tab.Navigator initialRouteName="Home" tabBarOptions={{
        activeTintColor:"#f56",
        activeBackgroundColor:"#fff",
        inactiveTintColor:"#767676",
        showLabel: false,
      }}>
        <Tab.Screen name="Home" component={Dashboard} options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-home" size={size} color={color} />  
          )}}   
          listeners={{
            focus : () => BackHandler.addEventListener('hardwareBackPress',this.handleBackButton),
            blur : () => BackHandler.removeEventListener('hardwareBackPress',this.handleBackButton) 
          }}  />
        <Tab.Screen name="Explore" component={Explore} options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-people" size={size} color={color} />
          ),
        }} />
        <Tab.Screen name="Add" component={this.placeholderComp} listeners={{
          tabPress: (e) => {
            e.preventDefault();
          }
        }} options={{
          tabBarIcon:() => (
            <AddBtn navigation={navigation} />  
          ),
        }} />
        <Tab.Screen name="Notifications" component={Notifications} notify={this.notify.bind(this)} navigation={this.props.navigation}   options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color, size }) => (
    <View>
 {//use notification  icon
        this.state.indicator === true ? 
        <Ionicons name="notifications" size={size} color={color} /> : <Badge size={size} color={color} navigation={this.props.navigation}  />
      }
    </View>
          ),
        }} />
        <Tab.Screen name="Manage" component={Admin} options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }} />
      </Tab.Navigator>
    )
  }
  
  render(){
    return(   
         
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
        <Stack.Screen name="Splash" component={Splash}  />
          <Stack.Screen name="LandingScreen" component={LandingScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen}/>
           <Stack.Screen name="Dashboard" component={this.drawerNavigation} />
          <Stack.Screen name="Manage" component={Manage} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="Follow" component={Follow} />
          <Stack.Screen name="Recommended" component={Recommended} />
          <Stack.Screen name="PostRequest" component={PostRequest} />
          <Stack.Screen name="PostQuestion" component={PostQuestion} />
          <Stack.Screen name="PostArticle" component={PostArticle} />
          <Stack.Screen name="Messages" component={Messages} />
          <Stack.Screen name="Interests" component={Interests} />
          <Stack.Screen name="Expertise" component ={Expertize} />
          <Stack.Screen name="QnA" component={QnA} />
          <Stack.Screen name="QuestionDetails" component={QuestionDetails} />
          <Stack.Screen name="Explore" component={Explore} />
          <Stack.Screen name="Pricing" component={Pricing} />
          <Stack.Screen name="BusinessUser" component={BusinessUser} />
          <Stack.Screen name="Add" component={Add} />
          <Stack.Screen name="Categories" component={Categories} />
          <Stack.Screen name="Comment" component={Comment} />
          <Stack.Screen name="PackageDetails" component={PackageDetails} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="OrderDetails" component={OrderDetails} />
          <Stack.Screen name="ProjectDetails" component={ProjectDetails} />
          <Stack.Screen name="Conversation" component={Conversation} options={{ unmountOnBlur: true }} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="CommonHeader" component={CommonHeader} navigation={this.props.navigation} />
          <Stack.Screen name="followComponent" component={FollowComponent} navigation={this.props.navigation} />
          <Stack.Screen name="PostComponent" component={PostComponent} navigation={this.props.navigation} />
          

        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

