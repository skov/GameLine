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
  Alert
} from 'react-native';
import _ from 'lodash';
import { styles } from '../styles';
import { Actions } from 'react-native-router-flux';
import Search from 'react-native-search-box';
import DatePicker from 'react-native-datepicker';
import Database from '../database';
import { firebaseRef } from '../firebase';
import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';


class AddPlayer extends Component {
  constructor(props){
    super(props);
    this.state = {
      name:'Name',
      dob:'',
      team:'',
      email : 'Email',
      phone : 'Phone Number',
      number : 'Player Number',
      homeOpp:'',
      playerList:[],
    }
    this._addAnother = this._addAnother.bind(this)
    this.validateEmail = this.validateEmail.bind(this)
    this._playerRegistered = this._playerRegistered.bind(this)
  }

  async componentWillMount(){
     this.setState({
       team: this.props.team,
       homeOpp: this.props.homeOpp,
     });
  }

  async componentDidMount(){
    try{
      let user = await firebaseRef.auth().currentUser;
      var playerList = [];
      Database.listenAllPlayers(user.uid, this.props.team, this.props.homeOpp, (data) => {
        playerList = [...data]
      });
      this.setState({ playerList: playerList });
    } catch (error){console.log(error) }
  }

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  };

  async _playerRegistered() {
    if (this.state.name == 'Name'){
      Alert.alert(
        'Empty player name.',
        'Please provide a valid player name.',
        [{text: 'OK'}],
        { cancelable: false }
      )
    } else if (this.state.email == 'Email' || !this.validateEmail(this.state.email)){
      Alert.alert(
        'Invalid Email',
        'Please provide a valid email for this player, this field can not be empty.',
        [{text: 'OK'}],
        { cancelable: false }
      )
    } else if (this.state.phone == 'Phone Number'){
      Alert.alert(
        'Invalid player phone.',
        'Please provide valid a player phone.',
        [{text: 'OK'}],
        { cancelable: false }
      )
    } else if (this.state.number == 'Player Number'){
      Alert.alert(
        'Please enter a valid player number',
        'The player number must be in numeric characters and can not be empty.',
        [{text: 'OK'}],
        { cancelable: false }
      )
    } else if (this.state.dob == ''){
      Alert.alert(
        'Empty player date of birth.',
        'Please provide a player date of birth.',
        [{text: 'OK'}],
        { cancelable: false }
      )
    } else {
       var validNumber = true;
       var number = this.state.number;
       _.each(this.state.playerList, function(player) {
         if (player.number == number){
           validNumber = false;
         }
       });
       if (validNumber == true){
          try {
            let user = await firebaseRef.auth().currentUser;
            Database.addPlayer(user.uid, this.props.homeOpp, this.state.team, this.state.name, this.state.dob, this.state.email, this.state.phone, this.state.number);
            var d = [];
            Database.listenAllPlayers(user.uid, this.props.team, this.props.homeOpp, (dataList) => {
              d = dataList;
            });
            for (i = 0; i < d.length; i++){
              if (d[i].deleted == true){
                d.splice(i, 1);
              }
            }
            Actions.pop();
            Actions.refresh({key: Math.random()});
          } catch (error) { console.log(error)}
        } else {
          Alert.alert(
            'Player number taken.',
            'This player number has already been registered in this team. Please provide another player number or check if you have already added this player.',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            { cancelable: false }
          )
        }
    }
   }

   async _addAnother() {
     if (this.state.name == 'Name'){
       Alert.alert(
         'Empty player name.',
         'Please provide a player name.',
         [{text: 'OK', onPress: () => console.log('OK Pressed')}],
         { cancelable: false }
       )
     } else if (this.state.email == 'Email' || !this.validateEmail(this.state.email)){
       Alert.alert(
         'Invalid Email',
         'Please provide a valid player email.',
         [{text: 'OK', onPress: () => console.log('OK Pressed')}],
         { cancelable: false }
       )
     } else if (this.state.phone == 'Phone Number'){
       Alert.alert(
         'Invalid player phone.',
         'Please provide valid a player phone.',
         [{text: 'OK', onPress: () => console.log('OK Pressed')}],
         { cancelable: false }
       )
     } else if (this.state.number == 'Player Number'){
       Alert.alert(
         'Please enter a valid player number',
         'The player number must be in numeric characters and can not be empty.',
         [{text: 'OK', onPress: () => console.log('OK Pressed')}],
         { cancelable: false }
       )
     } else if (this.state.dob == ''){
       Alert.alert(
         'Empty player date of birth.',
         'Please provide a player date of birth.',
         [{text: 'OK', onPress: () => console.log('OK Pressed')}],
         { cancelable: false }
       )
     } else {
       var validNumber = true;
       var number = this.state.number;
       _.each(this.state.playerList, function(player) {
         if (player.number == number){
           validNumber = false;
         }
       });
       if (validNumber == true){
          try {
            let user = await firebaseRef.auth().currentUser;
            Database.addPlayer(user.uid, this.props.homeOpp, this.state.team, this.state.name, this.state.dob, this.state.email, this.state.phone, this.state.number);
            this.setState({
              name: 'Name',
              email : 'Email',
              phone : 'Phone Number',
              number : 'Player Number',
            })
            this.NameInput.clear()
            this.EmailInput.clear()
            this.PhoneInput.clear()
            this.NumberInput.clear()
            this.DobInput.clear()
          } catch (error) { console.log(error)}
        } else {
          Alert.alert(
            'Player number taken.',
            'This player number has already been registered in this team. Please provide another player number or check if you have already added this player.',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            { cancelable: false }
          )
     }
    }
  }

   render() {
     var cPreGame = function() {
       if (this.props.preGame == true) {
         return <BottomMenu activeTab={'index'}/>;
       } else {
         return <BottomMenu activeTab={this.props.homeOpp}/>;
       }
     }.bind(this);
     return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'true'} title={"ADD PLAYER"}/>
      <View style={styles.viewMain}>
        <View style={styles.paddedBox}>
          <View style={styles.borderViewBig}>
            <TouchableOpacity>
            <Image source={require('../images/user.png')} style={styles.profileBig}></Image>
            </TouchableOpacity>
          </View>
        </View>
          <TextInput
            ref={input => { this.NameInput = input }}
            underlineColorAndroid="transparent"
            blurOnSubmit={true}
            autoFocus={false}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="default"
            returnKeyType="next"
            onChangeText={ (text)=> this.setState({name: text}) }
            style={styles.input}
            placeholder={this.state.name}
            placeholderTextColor="rgba(255,255,255,0.8)"
            selectionColor="#ffffff"
            >
            </TextInput>
            <TextInput
            ref={input => { this.EmailInput = input }}
              underlineColorAndroid="transparent"
              blurOnSubmit={true}
              autoFocus={false}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              onChangeText={ (text)=> this.setState({email: text}) }
              style={styles.input}
              placeholder={this.state.email}
              placeholderTextColor="rgba(255,255,255,0.8)"
              selectionColor="#ffffff"
              >
              </TextInput>
              <TextInput
              ref={input => { this.PhoneInput = input }}
                underlineColorAndroid="transparent"
                blurOnSubmit={true}
                autoFocus={false}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="numeric"
                returnKeyType="next"
                onChangeText={ (text)=> this.setState({phone: text}) }
                style={styles.input}
                placeholder={this.state.phone}
                placeholderTextColor="rgba(255,255,255,0.8)"
                selectionColor="#ffffff"
                >
                </TextInput>
                <TextInput
                ref={input => { this.NumberInput = input }}
                  underlineColorAndroid="transparent"
                  blurOnSubmit={true}
                  autoFocus={false}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="numeric"
                  returnKeyType="next"
                  onChangeText={ (text)=> this.setState({number: text}) }
                  style={styles.input}
                  placeholder={this.state.number}
                  placeholderTextColor="rgba(255,255,255,0.8)"
                  selectionColor="#ffffff"
                  >
                  </TextInput>
            <Text style={{fontSize:12, color:'white', marginTop:10, alignSelf:'center', marginBottom:2,}}>Date of Birth</Text>
            <DatePicker
             ref={input => { this.DobInput = input }}
             style={styles.datePicker}
             showIcon={false}
             date={this.state.dob}
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
           onDateChange={(date) => {this.setState({dob: date})}}
         />
         <View style={styles.horizontalView}>
         <TouchableOpacity onPress={this._addAnother} style={styles.buttonTransparent}>
           <Text style={styles.buttonTextWhite}>
             Add Another Player
           </Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={this._playerRegistered} style={styles.buttonOrange}>
           <Text style={styles.buttonTextWhite}>
             Finish Adding
           </Text>
         </TouchableOpacity>
    </View>

  </View>

  {cPreGame()}
</ImageBackground>
    );
  }
}
export default AddPlayer;
