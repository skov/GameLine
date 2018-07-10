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

class TechError extends Component {
  constructor(props){
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  async handlePress(errorType){
    try {
      let user = await firebaseRef.auth().currentUser;
      action = [];
      action.min = this.props.minutes;
      action.sec = this.props.seconds;
      action.teamId = this.props.team;
      action.seasonId = this.props.season;
      action.gameId = this.props.game;
      action.half = this.props.half;
      action.errorType = errorType;
      if (this.props.homeOpp == 'opp' && this.props.complexity == 1){
        action.playerId = this.props.player._key;
      } else if (this.props.homeOpp == 'home'){
        action.playerId = this.props.player._key;
      }
      Database.addTechErrorGame(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, action, this.props.complexity);
      Database.getLastAction(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, this.props.complexity, 'techError', (data) => {
        Database.setLastAction(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, this.props.complexity, data)
      });
      Actions.popTo('game');
    } catch (error) { }
  }

  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'true'} title={"ERROR TYPE"}/>
      <View style={styles.viewMain}>
        <View style={styles.rowBox}>
            <TouchableOpacity
              style={styles.wireView}
              onPress={() => { this.handlePress('DoubleDribble') }}>
              <Text style={styles.buttonTextWhite}>
                Double Dribble
              </Text>
            </TouchableOpacity>
          <TouchableOpacity
            style={styles.wireView}
            onPress={() => { this.handlePress('PassingError') }}>
            <Text style={styles.buttonTextWhite}>
              Passing Error
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wireView}
            onPress={() => { this.handlePress('CatchError') }}>
            <Text style={styles.buttonTextWhite}>
              Catch Error
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wireView}
            onPress={() => { this.handlePress('TooManySteps') }}>
            <Text style={styles.buttonTextWhite}>
              Too Many Steps
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wireView}
            onPress={() => { this.handlePress('OffensiveError') }}>
            <Text style={styles.buttonTextWhite}>
              Offensive Error
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wireView}
            onPress={() => { this.handlePress('LineCrossed') }}>
            <Text style={styles.buttonTextWhite}>
              Line Crossed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wireView}
            onPress={() => { this.handlePress('FootFault') }}>
            <Text style={styles.buttonTextWhite}>
              Foot Fault
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </ImageBackground>
    );
  }
}
export default TechError;
