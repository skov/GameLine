'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicatorIOS,
  AsyncStorage,
  Text,
  Image,
  ImageBackground,
  View,
  Alert,
  KeyboardAvoidingView,
  SegmentedControlIOS,
} from 'react-native';

import { styles } from '../styles';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import { firebaseRef } from '../firebase';
import Database from '../database';
import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';

class EditTeam extends Component {

  constructor(props){
    super(props);
    this.state = {
      teamData:[],
    }
    this._teamRegistered = this._teamRegistered.bind(this)
    this._deleteTeam = this._deleteTeam.bind(this)
  }
  async componentWillMount(){
     this.setState({
       team: this.props.team,
       homeOpp: this.props.homeOpp,
     });

     try{
       let user = await firebaseRef.auth().currentUser;
       var com = null;
       Database.listenTeam(user.uid, this.props.team, this.props.homeOpp, (dataList) => {
         com = dataList.complexity;
       });
       var teamD = [];
       Database.getTeam(user.uid, this.props.homeOpp, this.props.team, (callback) =>{
          teamD = callback;
       });
       this.setState({
         complexity: com,
         uid: user.uid,
         teamData: teamD,
         originalName : teamD.team,
     })
     } catch (error) {
       console.log(error)
     }
  }

  onAddPhotoPressed(){

  }

  async _deleteTeam() {
    Alert.alert(
      'Delete Team',
      'Are you sure you want to delete this team? This action can not be un-done.',
      [{text: 'Cancel', onPress: () => {}},
      {text: 'OK', onPress: () => {
        try{
          Database.deleteTeam(this.state.uid, this.props.homeOpp, this.props.team);
          Actions.pop();
          Actions.refresh({key: Math.random()})
          } catch (error){
            console.log(error)
          }
      }}],
      { cancelable: false }
    )
  }

  async _teamRegistered() {
    if (this.state.teamData.team == ''){
      Alert.alert(
        'Empty team name',
        'Please provide a team name.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        { cancelable: false }
      )
    } else if (this.state.teamData.ageStart == '' || this.state.teamData.ageEnd == ''){
      Alert.alert(
        'Invalid Ages',
        'Please provide an appropriate Age Start & Age End.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        { cancelable: false }
      )
    } else if (Number(this.state.teamData.ageStart) > Number(this.state.teamData.ageEnd)){
      Alert.alert(
        'Invalid Ages',
        'Starting age can not be lower than end age.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        { cancelable: false }
      )
    } else {
      try {
        var names = [];
        Database.checkTeamName(this.state.uid, this.props.homeOpp, this.state.teamData.team, (callback)=>{
          names = [...callback];
        });
        var flag = false;

        for (let i=0;i<names.length;i++){
          if (names[i]._key == this.state.teamData.team){
            if (this.state.teamData.team != this.state.originalName && names[i].deleted != true){
              flag = true;
            }
          }
        }
        if (flag == true){
          Alert.alert(
            'TEAM NAME TAKEN',
            'This team already exists. Please choose another name.',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            { cancelable: false }
          )
        } else {
          Database.editTeam(this.state.uid, this.props.homeOpp, this.state.team, this.state.teamData.team, this.state.teamData.ageStart, this.state.teamData.ageEnd);
          Actions.pop();
          Actions.refresh({key: Math.random()});
        }
      } catch (error) { console.log(error) }
    }
  }

  render() {
    var cOptions = function() {
      if (this.props.homeOpp == 'home') {
        return <View>
          <View style={styles.horizontalView}>
            <Text style={styles.textSize16}>Game Statistics Presets:</Text>
            <TouchableOpacity onPress={()=>{this._alertInfo("Presets")}}
            style={styles.infoBtn}>
              <Text style={styles.textSize14}>i</Text>
            </TouchableOpacity>
          </View>
          <SegmentedControlIOS
            values={['Simple', 'Complex']}
            selectedIndex={this.state.complexity}
            style={styles.controls}
            tintColor={'#fff'}
            onChange={(event) => {
              Database.setStatsComplexity(this.state.uid, this.props.team, JSON.parse(event.nativeEvent.selectedSegmentIndex));
              this.setState({
                complexity: event.nativeEvent.selectedSegmentIndex
              });
            }}/>
          </View>;
      } else if (this.props.homeOpp == 'opp'){
        return <View style={{width:230}}>
        <Text style={styles.textSize12}>Opponent statistics will depend on what level of complexity the home teams are set on.</Text>
        </View>;
      }
    }.bind(this);
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'true'} title={'EDIT TEAM'}/>
        <View style={styles.viewMain}>
        <KeyboardAvoidingView
        behavior="position"
        style={{padding:10} }>
          <View style={styles.paddedBox}>
            <View style={styles.borderViewBig}>
              <TouchableOpacity>
              <Image source={require('../images/user.png')} style={styles.profileBig}></Image>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.textSize14}>Click on picture to change avatar.</Text>
          <View style={styles.paddedBox} style={{width:230, alignSelf:'center'}}>
            {cOptions()}
          </View>
          <TextInput
            underlineColorAndroid="transparent"
            blurOnSubmit={true}
            autoFocus={false}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="default"
            returnKeyType="next"
            onChangeText={ (text)=> {
              this.state.teamData.team = text
              this.setState({teamData: this.state.teamData})
            }}
            style={styles.input}
            placeholder={this.state.teamData.team}
            placeholderTextColor="rgba(255,255,255,0.8)"
            selectionColor="#ffffff"></TextInput>
          <View style={styles.horizontalView}>
            <TextInput
              underlineColorAndroid="transparent"
              blurOnSubmit={true}
              autoFocus={false}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="numeric"
              returnKeyType="next"
              onChangeText={ (text)=> {
                this.state.teamData.ageStart = text
                this.setState({teamData: this.state.teamData})
              }}
              style={styles.numberPicker}
              placeholder={this.state.teamData.ageStart}
              placeholderTextColor="rgba(255,255,255,0.8)"
              selectionColor="#ffffff"></TextInput>
            <TextInput
              underlineColorAndroid="transparent"
              blurOnSubmit={true}
              autoFocus={false}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="numeric"
              returnKeyType="next"
              onChangeText={ (text)=> {
                this.state.teamData.ageEnd = text
                this.setState({teamData: this.state.teamData})
              }}
              style={styles.numberPicker}
              placeholder={this.state.teamData.ageEnd}
              placeholderTextColor="rgba(255,255,255,0.8)"
              selectionColor="#ffffff"></TextInput>
            </View>
          <View style={styles.box3}>
            <TouchableOpacity
            onPress={()=>{this._deleteTeam()}}
            style={styles.buttonTransparent}>
              <Text style={styles.buttonTextWhite}>
                Delete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>{this._teamRegistered()}}
            style={styles.buttonOrange}
            >
              <Text style={styles.buttonTextWhite}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
          </View>
          <BottomMenu activeTab={this.props.homeOpp}/>
      </ImageBackground>
    );
  }
}
export default EditTeam;
