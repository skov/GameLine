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

class Save extends Component {
  constructor(props){
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  async handlePress(hitSelector){
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
      action.hitSelector = hitSelector;
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
          <View style={styles.viewMain}>
            <View style={styles.hitSelectorWrapper2}>
              <View style={styles.horizontalView}>
                <TouchableOpacity
                style={styles.positionHitSelector}
                onPress={() => { this.handlePress(1) }}>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.positionHitSelector}
                onPress={() => { this.handlePress(2) }}>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.positionHitSelector}
                onPress={() => { this.handlePress(3) }}>
                </TouchableOpacity>
              </View>

              <View style={styles.horizontalView}>
                <TouchableOpacity
                style={styles.positionHitSelector}
                onPress={() => { this.handlePress(4) }}>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.positionHitSelector}
                onPress={() => { this.handlePress(5) }}>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.positionHitSelector}
                onPress={() => { this.handlePress(6) }}>
                </TouchableOpacity>
              </View>
              <View style={styles.horizontalView}>
                <TouchableOpacity
                style={styles.positionHitSelectorB}
                onPress={() => { this.handlePress(7) }}>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.positionHitSelectorB}
                onPress={() => { this.handlePress(8) }}>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.positionHitSelectorB}
                onPress={() => { this.handlePress(9) }}>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
export default Save;
