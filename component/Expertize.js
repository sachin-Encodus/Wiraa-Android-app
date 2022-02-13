import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,FlatList, Modal } from 'react-native'
import { Feather, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { throwIfAudioIsDisabled } from 'expo-av/build/Audio/AudioAvailability';

export default class Expertize extends React.Component{

    state = {
        category: [],
        userId:"",
        subCat:[],
        expertise:[],
        isModalVisible: false,
        subActive:[],
        expActive:[],
        catActive:[],
        subCategory:[],
        expt:[]
    }

    componentDidMount(){

        const { userId, expt, subjects } = this.props.route.params;
        this.setState({ userId })

        fetch("http://demo.wiraa.com/api/Users/GetCategory")
        .then(response => response.json())
        .then(responseJson => {
            let category = [];
            responseJson.map(item => {
                category.push({
                    id: item.$id,
                    cirId: item.curriculumID,
                    name: item.curriculumName,
                })
            })
            this.setState({ category })
        })

        this.getSubCatg(1);

        let catActive = [];
        catActive.push(1)

        let subActive = [...this.state.subActive];
        expt.map(item => {
            subActive.push(item.id)
        })

        let expActive = [...this.state.expActive];
        subjects.map(item => {
            expActive.push(item.subId)
        })

        this.setState({ catActive, subActive, expActive })


    }

    getSubCatg = (id) => {
        fetch("http://demo.wiraa.com/api/Users/GetSubCategory?catId="+id)
        .then(response => response.json())
        .then(responseJson => {
            let subCat = [];
            responseJson.map(item => {
                subCat.push({
                    id: item.$id,
                    gradeId: item.gradeID,
                    name: item.gradeName,
                    cirId: item.fkCurriculumID,
                })
            })
            this.setState({ subCat })
        })
    }

    getExpertise = (id) => {

        fetch("http://demo.wiraa.com/api/Users/GetExpertise?subCatId="+id)
        .then(response => response.json())
        .then(responseJson => {
            let expertise = [];
            responseJson.map(item => {
                expertise.push({
                    id: item.$id,
                    subjectId: item.subjectID,
                    gradeId: item.fkGradeID,
                    name: item.subjectName,
                })
            })
            this.setState({ expertise, isModalVisible: true })
        })
    }

    catSelected = (id) => {
        this.getSubCatg(id);

        let catActive = [];

        if(catActive.includes(id)){
            this.setState({ catActive: catActive.filter(s => s !== id) })
        }else{
            catActive.push(id);
            this.setState({ catActive })
        }
    }

    selected = (id, cirId) => {

        let subActive = [...this.state.subActive];

        let subCategory = [...this.state.subCategory];

        if(subActive.includes(id)){
            this.setState({ 
                subActive: subActive.filter(s => s !== id), 
                subCategory: subCategory.filter(item => item.GradeID !== id) 
            })
        }else{
            subActive.push(id);
            subCategory.push({
                GradeID: id,
                FKCurriculumID: cirId
            })
            this.setState({ subActive, subCategory })
            
            this.getExpertise(id)
        }
    }

    selectExp = (id, gradeId) => {

        let expActive = [...this.state.expActive];

        let expt = [...this.state.expt];

        if(expActive.includes(id)){
            this.setState({ 
                expActive: expActive.filter(s => s !== id),
                expt: expt.filter(item => item.SubjectID !== id)
            })
        }else{
            expActive.push(id);
            expt.push({
                SubjectID: id,
                FKGradeID: gradeId,
            })
            this.setState({ expActive, expt })
        }

    }

    updateExpertize = () => {

        let category = [];
        this.state.subCategory.map(item => {
            category.push(item.FKCurriculumID);
        })

        const model = new FormData();

        model.append("CategoryList", JSON.stringify(this.state.category));
        model.append("GradeList", JSON.stringify(this.state.subCategory));
        model.append("SubjectList", JSON.stringify(this.state.expt));
        model.append("UserId", this.state.userId)

        fetch("http://demo.wiraa.com/Api/Profile/UpdateExpertize",{
            method: "POST",
           body: model
        })
        .then(response => response.json())
        .then(responseJson => {
            // console.log("responseJson  expertize-----",responseJson)
            this.props.navigation.goBack()
        })
    }

    render(){

        return(
            <View style={styles.container}>
                <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:12}]}>Manage Categories</Text>
    
                <View style={{flexDirection:'row', flexWrap:"wrap",margin:5, paddingTop:22}}>
                    {this.state.category.map((item, index) => (
                        <TouchableOpacity key={index} style={[styles.inActive, {backgroundColor: this.state.catActive.includes(item.cirId) ? "#f56" : "#eaeaea"}]} onPress={() => this.catSelected(item.cirId)}>
                            <Text allowFontScaling={false} style={[styles.label, {color: this.state.catActive.includes(item.cirId) ? "#fff" : "#767676"}]}>{item.name}</Text>    
                        </TouchableOpacity>
                        )
                    )}
                </View>

                <ScrollView   >
                    <View style={{flexDirection:"row", flexWrap:"wrap", paddingTop:22 ,justifyContent:'space-evenly'}}>
                        {this.state.subCat.map((item, index) => (
                            <TouchableOpacity key={index} style={[styles.inActive, {backgroundColor: this.state.subActive.includes(item.gradeId) ? "#f56" : "#eaeaea"}]} onPress={() => this.selected(item.gradeId, item.cirId)}>
                                <Text allowFontScaling={false} style={[styles.label, {color: this.state.subActive.includes(item.gradeId) ? "#fff" : "#767676"}]}>{item.name}</Text>    
                            </TouchableOpacity>
                        ))}
                    </View>
                     <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:16, marginTop:30, marginBottom:32, alignSelf:"stretch"}}>
                    <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676", width:150}]} onPress={() => this.props.navigation.goBack()} >
                        <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, {width:150} ]} onPress={() => this.updateExpertize()}>
                        <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>FINISH</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
                

               

                <Modal
                    animationType="fade"
                    visible={this.state.isModalVisible}
                    onRequestClose={() => this.setState({isModalVisible:!this.state.isModalVisible})}
                >

                    <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:6}]}>Select Expertise</Text>
                    
                    <ScrollView style={{marginBottom:16}}>
                        <View style={{flexDirection:"row", flexWrap:"wrap", margin: 16}}>
                            {this.state.expertise.map((item,index)=> (
                                <TouchableOpacity key={index} style={ [styles.inActive , { backgroundColor: this.state.expActive.includes(item.subjectId) ? "#f56" : "#eaeaea"}]} onPress={() => this.selectExp(item.subjectId, item.gradeId)}>
                                    <Text allowFontScaling={false} style={[styles.label, { color: this.state.expActive.includes(item.subjectId) ? "#fff" : "#767676"}]}>{item.name}</Text>    
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:16, marginTop:6}}>
                            <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676", width:150}]} onPress={() => this.setState({ isModalVisible: false })}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, {width:150}]} onPress={() => this.setState({ isModalVisible: false })}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>DONE</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                </Modal>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"flex-start",
        alignItems:"flex-start",
        backgroundColor:"#fff",
    },
    heading:{
        fontFamily:"Futura",
        fontSize:22,
        marginTop:40,
        color:"#171919",
        alignSelf:"center"
    },
    btn:{
        backgroundColor:"#f56",
        borderRadius:10,
        padding:16,
        paddingVertical:14,
        width:200,
        elevation:6,
    },
    label:{
        color:"#767676",
        fontFamily:"OpenSans",
        fontSize:14, 
    },
    inActive:{
        padding:10, 
        backgroundColor:"#efefef",
        borderRadius:6, 
        color:"#171919",
        margin:6,
        fontFamily:"OpenSans",
        fontSize:12,
    },

    active:{
        padding:10, 
        backgroundColor:"#f56",
        borderRadius:6, 
        color:"#fff",
        margin:6,
        fontFamily:"OpenSans",
        fontSize:12,
    },
})