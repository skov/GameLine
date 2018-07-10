import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import { styles } from '../styles';
import { Actions } from 'react-native-router-flux';
import { firebaseRef } from '../firebase';
import Database from '../database';
import TopMenu from '../components/TopMenu';

class Goal extends Component {
  constructor(props){
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  async handlePress(defenceType){
    try {
      let user = await firebaseRef.auth().currentUser;
      action = [];
      action.min = this.props.minutes;
      action.sec = this.props.seconds;
      action.teamId = this.props.team;
      action.action = this.props.action;
      action.throwSelector = this.props.selector;
      action.seasonId = this.props.season;
      action.gameId = this.props.game;
      action.outcome = this.props.outcome;
      action.half = this.props.half;
      action.defenceType = defenceType;
      if (this.props.homeOpp == 'opp' && this.props.complexity == 1){
        action.playerId = this.props.player._key;
      } else if (this.props.homeOpp == 'home'){
        action.playerId = this.props.player._key;
      }

      Database.addActionGame(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, action, this.props.complexity);
      Database.getLastAction(user.uid, this.props.game, this.props.homeOpp, this.props.complexity, 'attempt', (data) => {
        Database.setLastAction(user.uid, this.props.game, this.props.homeOpp, this.props.complexity, data)
      });
      Actions.popTo('game');
    } catch (error) { }
  }

  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'true'} title={"ATTEMPT OUTCOME"}/>
      <View style={styles.viewMain}>
        <View style={styles.rowBox}>
          <TouchableOpacity style={styles.wireView} onPress={() => { this.handlePress('defLow') }}>
            <Text style={styles.buttonTextWhite}> Defence Low </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.wireView} onPress={() => { this.handlePress('defHigh') }}>
            <Text style={styles.buttonTextWhite}> Defence High </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ImageBackground>
    );
  }
}
export default Goal;
