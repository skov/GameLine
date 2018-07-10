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

class AddSeason extends Component {
  constructor(props){
    super(props);
    this.state = {
      season: '',
      team:'',
      dateStart:'2017-01-01',
      dateEnd:'2017-01-01',
    }
    this._seasonRegistered = this._seasonRegistered.bind(this);
  }
  async componentWillMount() {
    this.setState({
      level:this.props.level,
      team: this.props.team,
      players: this.props.players,
      oppTeam: this.props.oppTeam,
      oppPlayers: this.props.oppPlayers,
    });
  }
  async _seasonRegistered() {
       try {
           let user = await firebaseRef.auth().currentUser;
           Database.addSeason(user.uid, this.props.team, this.state.dateStart, this.state.dateEnd, this.state.season);
           var seasonId = "";
           Database.getSeasonId(user.uid, this.props.team,(callback)=>{
             seasonId = callback;
           })
           Database.addSeasonOpp(user.uid, this.props.oppTeam, seasonId, this.state.dateStart, this.state.dateEnd, this.state.season);
           Actions.pop();
           Actions.refresh({key: Math.random()})
       } catch (error) {
           console.log(error);
       }
   }

  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'true'} title={"ADD SEASON"}/>
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
          onChangeText={ (text)=> this.setState({season: text}) }
          style={styles.input}
          placeholder="Season name"
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

        <TouchableOpacity onPress={this._seasonRegistered} style={styles.buttonOrange}>
          <Text style={styles.buttonTextWhite}>
            Add Season
          </Text>
        </TouchableOpacity>
      </View>
  <BottomMenu activeTab={'index'}/>
</ImageBackground>
    );
  }
}
export default AddSeason;
