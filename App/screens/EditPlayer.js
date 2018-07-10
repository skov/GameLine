'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicatorIOS,
  AsyncStorage,
  Text,
  Image,
  ImageBackground,
  View,
  KeyboardAvoidingView,

} from 'react-native';

import { styles } from '../styles';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import { firebaseRef } from '../firebase';
import Database from '../database';
import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';
import DatePicker from 'react-native-datepicker';

class EditPlayer extends Component {
  constructor(props){
    super(props);
    this.state = {
      playerData:[],
    }
    this._playerRegistered = this._playerRegistered.bind(this)
    this._deletePlayer = this._deletePlayer.bind(this)
  }
  async componentWillMount(){
     this.setState({
       team: this.props.team,
       player: this.props.player
     });
     try{
       let user = await firebaseRef.auth().currentUser;
       var playerList = [];
       Database.listenAllPlayers(user.uid, this.props.team, this.props.homeOpp, (data) => {
         playerList = [...data]
       });
       for (i = 0; i < playerList.length; i++){
         if (playerList[i].deleted == true){
           playerList.splice(i, 1);
         }
       }
       this.setState({ playerList: playerList });
       Database.getPlayer(user.uid, this.props.homeOpp, this.props.team, this.props.player, (callback) =>{
          this.setState({
           playerData: callback,
           originalNumber : callback.number,
           uid:user.uid,
        })
       });
     } catch (error) {
       console.log(error)
     }
  }


  async _deletePlayer() {
    Alert.alert(
      'Delete Player',
      'Are you sure you want to delete this player? This action can not be un-done.',
      [{text: 'Cancel', onPress: () => {}},
      {text: 'OK', onPress: () => {
        try{
          Database.deletePlayer(this.state.uid, this.props.homeOpp, this.props.team, this.props.player);
          Actions.Team({homeOpp:this.props.homeOpp, team:this.props.team});
          } catch (error){
            console.log(error)
          }
      }}],
      { cancelable: false }
    )
  }

  async _playerRegistered() {
    if (this.state.playerData.player == ''){
      Alert.alert(
        'Empty player name.',
        'Please provide a player name.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        { cancelable: false }
      )
    } else if (this.state.playerData.email == ''){
      Alert.alert(
        'Empty player email.',
        'Please provide a player email.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        { cancelable: false }
      )
    } else if (this.state.playerData.phone == ''){
      Alert.alert(
        'Empty player phone.',
        'Please provide a player phone.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        { cancelable: false }
      )
    } else if (this.state.playerData.number == ''){
      Alert.alert(
        'Empty player number.',

        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        { cancelable: false }
      )
    } else if (this.state.playerData.dob == ''){
      Alert.alert(
        'Empty player date of birth.',
        'Please provide a player date of birth.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        { cancelable: false }
      )
    } else {
      try {
        var validNumber = true;
        var originalNum = this.state.originalNumber;
        var number = this.state.playerData.number;
        _.each(this.state.playerList, function(player) {
          if (player.number == number && player.number != originalNum){
            validNumber = false;
          }
        });
        if (validNumber == true){
          let user = await firebaseRef.auth().currentUser;
          Database.updatePlayer(user.uid, this.props.homeOpp, this.props.team, this.props.player, this.state.playerData);
          Actions.Team({homeOpp:this.props.homeOpp, team:this.props.team});
        } else {
          Alert.alert(
            'Player number taken.',
            'This player number has already been taken, please choose a different number.',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            { cancelable: false }
          )
        }
      } catch (error) { console.log(error)}
    }
   }

  onAddPhotoPressed(){

  }
  render() {
    const editPlayerInfo = () => { Actions.Player({ team: this.state.team, player: this.state.player }) }
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
        <TopMenu backButton={'true'} title={'EDIT PLAYER'}/>
        <View style={styles.viewMain}>
          <KeyboardAvoidingView
          behavior="position"
          style={{padding:10}}>
          <View style={styles.paddedBox}>
            <View style={styles.borderViewBig}>
              <TouchableOpacity>
              <Image source={require('../images/user.png')} style={styles.profileBig}></Image>
              </TouchableOpacity>
            </View>
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
                this.state.playerData.player = text
                this.setState({playerData: this.state.playerData})
              }}
              style={styles.input}
              placeholder={this.state.playerData.player}
              placeholderTextColor="rgba(255,255,255,0.8)"
              selectionColor="#ffffff"
              ></TextInput>
            <TextInput
              underlineColorAndroid="transparent"
              blurOnSubmit={true}
              autoFocus={false}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              onChangeText={ (text)=> {
                this.state.playerData.email = text
                this.setState({playerData: this.state.playerData})
              }}
              style={styles.input}
              placeholder={this.state.playerData.email}
              placeholderTextColor="rgba(255,255,255,0.8)"
              selectionColor="#ffffff"
              ></TextInput>
                <TextInput
                  underlineColorAndroid="transparent"
                  blurOnSubmit={true}
                  autoFocus={false}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="numeric"
                  returnKeyType="next"
                  onChangeText={ (text)=> {
                    this.state.playerData.phone = text
                    this.setState({playerData: this.state.playerData})
                  }}
                  style={styles.input}
                  placeholder={this.state.playerData.phone}
                  placeholderTextColor="rgba(255,255,255,0.8)"
                  selectionColor="#ffffff"
                  ></TextInput>
                  <TextInput
                    underlineColorAndroid="transparent"
                    blurOnSubmit={true}
                    autoFocus={false}
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    returnKeyType="next"
                    onChangeText={ (text)=> {
                      this.state.playerData.number = text
                      this.setState({playerData: this.state.playerData})
                    }}
                    style={styles.input}
                    placeholder={this.state.playerData.number}
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    selectionColor="#ffffff"
                    ></TextInput>
              <Text style={{fontSize:12, color:'white', marginTop:10, alignSelf:'center', marginBottom:2,}}>Date of Birth</Text>
              <DatePicker
               style={styles.datePicker}
               showIcon={false}
               date={this.state.playerData.dob}
               mode="date"
               format="YYYY-MM-DD"
               minDate="1950-01-01"
               maxDate="2100-12-31"
               confirmBtnText="Set date"
               cancelBtnText="Cancel"
               customStyles={{
                 dateInput: {
                   marginLeft: 0,
                   borderColor:'rgba(0,0,0,0)',
                 },
                 dateText:{
                      color: '#fff',
                      fontSize: 18,
                      justifyContent: 'flex-start',
                      textAlign:'left',
                      fontFamily: 'AvenirNext-Medium',
                 },
               }
             }
             onDateChange={ (date)=> {
               this.state.playerData.dob = date
               this.setState({playerData: this.state.playerData}) }} />
          <View style={styles.box3}>
            <TouchableOpacity
            onPress={()=>{this._deletePlayer()}}
            style={styles.buttonTransparent}>
              <Text style={styles.buttonTextWhite}>
                Delete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.buttonOrange}
            onPress={this._playerRegistered}
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
export default EditPlayer;
