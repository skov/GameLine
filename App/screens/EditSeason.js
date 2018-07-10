import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  SegmentedControlIOS,
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import _ from 'lodash';
import { styles } from '../styles';
import { Actions } from 'react-native-router-flux';
import Search from 'react-native-search-box';
import { firebaseRef } from '../firebase';
import Database from '../database';
import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';

class EditSeason extends Component {
  constructor(props){
    super(props);
    this._seasonRegistered = this._seasonRegistered.bind(this);
    this._deleteSeason = this._deleteSeason.bind(this);
  }
  async componentWillMount() {
    this.setState({
      season:this.props.season,
      team: this.props.team,
      homeOpp : this.props.homeOpp,
      seasonData : [],
    });

    try{
      let user = await firebaseRef.auth().currentUser;
      var sData = [];
      Database.listenSeason(user.uid, this.state.team, 'home', this.state.season, (callback)=>{
        sData = callback;
      })
      var seasonList = [];
      Database.listenAllSeasons(user.uid, this.props.team, this.props.homeOpp, (data) => {
        seasonList = [...data]
      });
      this.setState({
        originalName : sData.season,
        seasonName:  sData.season,
        dateStart:sData.dateStart,
        dateEnd: sData.dateEnd,
        seasonList: seasonList,
        uid:user.uid,
      })
    } catch (error){
      console.log(error)
    }
  }

  async _deleteSeason() {
    try{
      Alert.alert(
        'Delete Season',
        'Are you sure you want to delete this season? This action can not be un-done.',
        [{text: 'Cancel', onPress: () => {}},
        {text: 'OK', onPress: () => {
          try{
            Database.deleteSeason(this.state.uid, this.state.homeOpp, this.state.team, this.state.season)
            Actions.pop();
            Actions.refresh({key: Math.random()})
          } catch (error){
            console.log(error)
          }
        }}],
        { cancelable: false }
      )

    } catch (error) {
      console.log(error)
    }
  }
  async _seasonRegistered() {
       try {
           var validName = true;
           var originalName = this.state.originalName;
           var name = this.state.seasonName;
           _.each(this.state.seasonList, function(season) {
             if (season.season == name && season.season != originalName){
               validName = false;
             }
           });
           if (validName == true){
             Database.editSeason(this.state.uid, "home", this.props.team, this.props.season, this.state.seasonName, this.state.dateStart, this.state.dateEnd);
             Actions.pop();
             Actions.refresh({key: Math.random()})
           } else {
             Alert.alert(
               'Season name taken.',
               'This season already exists, please choose a different season name.',
               [{text: 'OK', onPress: () => console.log('OK Pressed')}],
               { cancelable: false }
             )
           }
       } catch (error) {
           console.log(error);
       }
   }

  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'true'} title={"EDIT SEASON"}/>

      <View style={styles.viewMain}>
      <View style={{marginBottom:10}}>
        <TextInput
          underlineColorAndroid="transparent"
          blurOnSubmit={true}
          autoFocus={false}
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="default"
          returnKeyType="next"
          onChangeText={ (text)=> this.setState({seasonName: text}) }
          style={styles.input}
          placeholder={this.state.seasonName}
          placeholderTextColor="rgba(255,255,255,0.8)"
          selectionColor="#ffffff"
          >
        </TextInput>
        </View>
        <Text style={{fontSize:12, color:'white', marginTop:10, alignSelf:'center', marginBottom:2,}}>Start Date</Text>
        <DatePicker
         style={styles.datePicker}
         showIcon={false}
         date={this.state.dateStart}
         mode="date"
         format="YYYY-MM-DD"
         minDate="1900-01-01"
         maxDate="2100-12-31"
         confirmBtnText="Set start"
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
       onDateChange={(date) => {this.setState({dateStart: date})}} />
       <Text style={{fontSize:12, color:'white', marginTop:10, alignSelf:'center', marginBottom:2,}}>End Date</Text>
        <DatePicker
        style={styles.datePicker}
        showIcon={false}
        date={this.state.dateEnd}
        mode="date"
        format="YYYY-MM-DD"
        minDate="190-01-01"
        maxDate="2100-12-31"
        confirmBtnText="Set end"
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
        }}
        onDateChange={(date) => {this.setState({dateEnd: date})}} />
        <TouchableOpacity onPress={this._deleteSeason} style={styles.buttonTransparent}>
          <Text style={styles.buttonTextWhite}>
            Delete
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._seasonRegistered} style={styles.buttonOrange}>
          <Text style={styles.buttonTextWhite}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>
  <BottomMenu activeTab={'index'}/>
</ImageBackground>
    );
  }
}
export default EditSeason;
