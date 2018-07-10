import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import { styles } from '../styles';
import { Actions } from 'react-native-router-flux';
import { firebaseRef } from '../firebase';
import Database from '../database';
import TopMenu from '../components/TopMenu';

class Penalty extends Component {
  constructor(props){
    super(props);
    this.state = {
      yellowPenalties:'',
      twoMin:'',
    }
    this._handlePress = this._handlePress.bind(this);
  }

  async componentWillMount(){
    var countAvailablePlayers = 0;
    for (i=0;i<this.props.players.length;i++){
      if (this.props.players[i].blocked == false){
        countAvailablePlayers++;
      }
    }
    this.setState({
      availablePlayers:countAvailablePlayers,
    })
    try{
      let user = await firebaseRef.auth().currentUser;
      var penaltyList = [];
      Database.getAllPenalties(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, this.props.complexity, 'penalty', (callback) => {
        penaltyList = [...callback];
      });
      var YellowPenalties = 0;
      var TwoMin = 0;
      _.each(penaltyList, function(penalty) {
        if (penalty.penaltyType == "Yellow"){
          YellowPenalties +=1;
        } else if (penalty.penaltyType == "TwoMin"){
          TwoMin +=1;
        }
      })
      this.setState({
        yellowPenalties : YellowPenalties,
        twoMin : TwoMin,
      })
    } catch (error) { console.log(error) }
  }

  async _handlePress(penaltyType){
    try {
      let user = await firebaseRef.auth().currentUser;
      action = [];
      action.min = this.props.minutes;
      action.sec = this.props.seconds;
      action.teamId = this.props.team;
      action.seasonId = this.props.season;
      action.gameId = this.props.game;
      action.half = this.props.half;
      action.penaltyType = penaltyType;
      if (this.props.homeOpp == 'opp' && this.props.complexity == 1){
        action.playerId = this.props.player._key;
      } else if (this.props.homeOpp == 'home'){
        action.playerId = this.props.player._key;
      }
      Database.addPenaltyGame(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, action, this.props.complexity);
      Database.getLastAction(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, this.props.complexity, 'penalty', (data) => {
        Database.setLastAction(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, this.props.complexity, data)
      });
      if (penaltyType == "Red" && this.props.complexity == 1){
        if (this.state.availablePlayers > 7){
          Database.setExpelledSubstitution(user.uid,this.props.team, this.props.season, this.props.game,this.props.homeOpp, this.props.player, this.props.minutes, this.props.seconds, this.props.half);
        } else {
          Database.setExpelledPlayer(user.uid,this.props.team, this.props.season, this.props.game, this.props.homeOpp, this.props.player);
        }
        Actions.popTo('game');
      } else {
        Actions.popTo('game');
      }

    } catch (error) { console.log(error) }
  }

  render() {
    var cYellow = function() {
      if (this.state.yellowPenalties < 2) {
        return <TouchableOpacity
          style={styles.wireView}
          onPress={() => { this._handlePress('Yellow') }}>
          <Text style={styles.buttonTextWhite}>
            Yellow Card
          </Text>
        </TouchableOpacity>;
      } else {
        return ;
      }
    }.bind(this);
    var cTwoMins = function() {
      if (this.state.twoMin < 3) {
        return <TouchableOpacity
          style={styles.wireView}
          onPress={() => { this._handlePress('TwoMin') }}>
          <Text style={styles.buttonTextWhite}>
            2 Min. Penalty
          </Text>
        </TouchableOpacity>;
      } else {
        return ;
      }
    }.bind(this);
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'true'} title={"PENALTY TYPE"}/>
      <View style={styles.viewMain}>
        <View style={styles.rowBox}>
            {cYellow()}
            {cTwoMins()}
          <TouchableOpacity
            style={styles.wireView}
            onPress={() => { this._handlePress('Red') }}>
            <Text style={styles.buttonTextWhite}>
              Red Card
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </ImageBackground>
    );
  }
}
export default Penalty;
