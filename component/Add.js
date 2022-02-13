import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,FlatList, Modal } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons';

export default class Add extends React.Component{

    state = {
        category: [],
        subCat:[],
        expertise:[],
        isModalVisible: false,
        subActive:[],
        expActive:[],
        catActive:[],
      
    }

    componentDidMount(){

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

        this.getSubCatg(0);

        // let catActive = [];
        // catActive.push(1)

        // this.setState({ catActive })
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
                    gradeName: item.gradeName,
                    cirId: item.fkCurriculumID,
                    cirName: item.curriculum.curriculumName,
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
                    cirId: item.fkCurriculumID,
                    name: item.subjectName,
                })
            })
            this.setState({ expertise, isModalVisible: true })
        })
    }

    catSelected = (id) => {

        const { cat } = this.props;

        let catActive = [...this.state.catActive]; 

        this.getSubCatg(id);

        if(catActive.includes(id)){
            cat.filter(s=> s !== id)
            this.setState({ catActive: catActive.filter(s => s !== id) })
        }else{
            catActive.push(id);
            cat.push(id);
            this.setState({ catActive })
        }
    }

    selected = (id, gradeName, cirId, cirName) => {

        const { subCat } = this.props;

        let subActive = [...this.state.subActive];

        if(subActive.includes(id)){
            subCat.filter(item => item.gradeID !== id)
            this.setState({ subActive: subActive.filter(s => s !== id) })
        }else{
            subActive.push(id);
            subCat.push({
                gradeID: id,
                gradeName,
                isActive: true,
                fkCurriculumID: cirId,
                curriculumName: cirName
            })
            this.setState({ subActive })

            this.getExpertise(id)
        }
    
    }

    selectExp = (id, gradeId, cirId) => {

        const { expt } = this.props;

        let expActive = [...this.state.expActive];

        // expActive.push(this.state.expActive);

        if(expActive.includes(id)){
            expt.filter(item => item.subjectID !== id)
            this.setState({ expActive: expActive.filter(s => s !== id) })
        }else{
            expActive.push(id);
            expt.push({
                subjectID: id,
                fkCurriculumID: cirId,
                fkGradeID: gradeId,
                price: 0.0
            })
            this.setState({ expActive  })
        }
    }



    
    render(){

// console.log("  =============>>>>>>>> ",this.state.hello);

        return(
            <View style={styles.container}>
                    <View style={[styles.headerr]}>
                        <Feather name="chevron-right" size={24} color="transparent" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} onPress={() => this.props.navigation.goBack()} />
                        <Text allowFontScaling={false} style={[styles.heading]}>Select Expertise</Text>
                        <Feather name="chevron-right" size={24} color="transparent" style={{zIndex: 999999, padding:6, paddingHorizontal:0,}} onPress={() => this.props.navigation.goBack()} />
                    </View>
                    {/* <Text allowFontScaling={false} style={[styles.label, {fontSize:16, color:"#767676", textAlign:"center", marginBottom:16, lineHeight:20}]}>Join Our Professional Community</Text> */}
    
                <View style={{flexDirection:"row", flexWrap:"wrap", margin: 16, justifyContent:'space-evenly',}}>
                    {this.state.category.map((item, index) => (
                        <TouchableOpacity key={index} style={[styles.inActive, { elevation: 3, width:165, marginRight:10, backgroundColor: this.state.catActive.includes(item.cirId) ? "#f56" : "#fff",elevation:5}]} onPress={() => this.catSelected(item.cirId)}>
                            <Text allowFontScaling={false} style={[styles.label, {color: this.state.catActive.includes(item.cirId) ? "#fff" : "#171919"}]}>{item.name}</Text>    
                        </TouchableOpacity>
                    ))}
                </View>

                <ScrollView contentContainerStyle={{flex:1, borderTopWidth:1, borderTopColor:"#efefef"}}>
                    {this.state.subCat.length > 0 ?
                        <View style={{flexDirection:"row", flexWrap:"wrap", margin: 16}}>
                            {this.state.subCat.map((item, index) => (
                                <TouchableOpacity key={index} style={[styles.inActive, {backgroundColor: this.state.subActive.includes(item.gradeId) ? "#f56" : "#fff",elevation:5}]} onPress={() => this.selected(item.gradeId, item.gradeName, item.cirId, item.cirName)}>
                                    <Text allowFontScaling={false} style={[styles.label, {color: this.state.subActive.includes(item.gradeId) ? "#fff" : "#767676"}]}>{item.gradeName}</Text>    
                                </TouchableOpacity>
                            ))}
                        </View>
                    :
                        <View style={{flex:1, justifyContent:"center", alignItems:"center" }}>
                            <Ionicons name="md-bulb" size={72} color="#f56" />
                            <Text style={[styles.label, {paddingLeft:16, paddingTop:16}]}>Please Select Your Expertise</Text>
                        </View>
                    }
                </ScrollView>

                <Modal
                    animationType="fade"
                    visible={this.state.isModalVisible}
                    onRequestClose={() => this.setState({isModalVisible:!this.state.isModalVisible})}
                >

                    <Text allowFontScaling={false} style={[styles.heading, {color:"#171919", paddingTop:6}]}>Select Expertise4</Text>
                    
                    <ScrollView style={{marginBottom:16}}>
                        <View style={{flexDirection:"row", flexWrap:"wrap", margin: 16}}>
                            {this.state.expertise.map((item,index)=> (
                                <TouchableOpacity key={index} style={ [styles.inActive , { backgroundColor: this.state.expActive.includes(item.subjectId) ? "#f56" : "#fff",elevation:5}]} onPress={() => this.selectExp(item.subjectId, item.gradeId, item.cirId)}>
                                    <Text allowFontScaling={false} style={[styles.label, { color: this.state.expActive.includes(item.subjectId) ? "#fff" : "#767676"}]}>{item.name}</Text>    
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:16, marginTop:6}}>
                            <TouchableOpacity style={[styles.btn, {backgroundColor:"#767676", width:150}]} onPress={() => this.setState({ isModalVisible: false })}>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, {width:150}]} 
                            
                        
                            
                            onPress={() => {this.setState({ isModalVisible: false }) , this.props.getdata()  }    }>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>DONE</Text>
                            </TouchableOpacity>
                              {/* <TouchableOpacity style={[styles.btn, {width:150}]} onPress={() => {this.props.getdata(), this.setState({hello:"sachin"}) } }>
                                <Text allowFontScaling={false} style={{fontFamily:"OpenSans", color:"#fff", textAlign:"center"}}>DONE</Text>
                            </TouchableOpacity> */}
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
        justifyContent:"center",
        alignItems:"center",
    },
    heading:{
        fontFamily:"Futura",
        marginTop:20,
        fontSize:22,
        color:"#171919",
    },
    headerr:{
        flexDirection:"row",
        paddingTop:20, 
        alignSelf:"stretch", 
        justifyContent:"space-between", 
        paddingBottom:6,
        paddingHorizontal:16,
        paddingBottom:0,
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
        alignSelf:"center"
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