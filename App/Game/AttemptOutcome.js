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

class AttemptOutcome extends Component {
  constructor(props){
    super(props);
    this._handlePress = this._handlePress.bind(this);
  }

  async _handlePress(out){
    if (out == 'block'){
      Actions.block({
        minutes:this.props.minutes,
        seconds:this.props.seconds,
        homeScore:this.props.homeScore,
        oppScore:this.props.oppScore,
        team:this.props.team,
        action:this.props.action,
        player:this.props.player,
        selector:this.props.selector,
        game:this.props.game,
        season: this.props.season,
        homeOpp:this.props.homeOpp,
        complexity: this.props.complexity,
        outcome:out,
        half: this.props.half,
      })
    }
    else if (out == 'goal'){
      Actions.goal({
        minutes:this.props.minutes,
        seconds:this.props.seconds,
        homeScore:this.props.homeScore,
        oppScore:this.props.oppScore,
        team:this.props.team,
        action:this.props.action,
        player:this.props.player,
        selector:this.props.selector,
        game:this.props.game,
        season: this.props.season,
        homeOpp:this.props.homeOpp,
        complexity: this.props.complexity,
        outcome:out,
        half: this.props.half,
      })
    }
    else if (out == 'save'){
      Actions.save({
        minutes:this.props.minutes,
        seconds:this.props.seconds,
        homeScore:this.props.homeScore,
        oppScore:this.props.oppScore,
        team:this.props.team,
        action:this.props.action,
        player:this.props.player,
        selector:this.props.selector,
        game:this.props.game,
        season: this.props.season,
        homeOpp:this.props.homeOpp,
        outcome:out,
        complexity: this.props.complexity,
        half: this.props.half,
      })
    }
    else if (out == 'miss'){
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
        action.half = this.props.half;
        action.outcome = out;
        if (this.props.homeOpp == 'opp' && this.props.complexity == 1){
          action.playerId = this.props.player._key;
        } else if (this.props.homeOpp == 'home'){
          action.playerId = this.props.player._key;
        }
        Database.addActionGame(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, action, this.props.complexity);
        Database.getLastAction(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, this.props.complexity, 'attempt', (data) => {
          Database.setLastAction(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, this.props.complexity, data)
        });

        Actions.popTo('game');
      } catch (error) { console.log(error) }
    }
  }


  render() {
    var cBlock = function() {
      if (this.props.selector == "Penalty Shot") {
        return;
      } else {
        return <TouchableOpacity
            style={styles.wireView}
            onPress={() => { this._handlePress('block') }}>
            <Text style={styles.buttonTextWhite}>
              BLOCK
            </Text>
          </TouchableOpacity>;
      }
    }.bind(this);


    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'true'} title={"ATTEMPT OUTCOME"}/>
      <View style={styles.viewMain}>
        <View style={styles.rowBox}>
            <TouchableOpacity
              style={styles.wireView}
              onPress={() => { this._handlePress('goal') }}>
              <Text style={styles.buttonTextWhite}>
                GOAL
              </Text>
            </TouchableOpacity>
          <TouchableOpacity
            style={styles.wireView}
            onPress={() => { this._handlePress('save') }}>
            <Text style={styles.buttonTextWhite}>
              SAVE
            </Text>
          </TouchableOpacity>
          {cBlock()}
          <TouchableOpacity
            style={styles.wireView}
            onPress={() => { this._handlePress('miss') }}>
            <Text style={styles.buttonTextWhite}>
              MISS
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </ImageBackground>
    );
  }
}
export default AttemptOutcome;
