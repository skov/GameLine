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
import NavigationBar from 'react-native-navbar';
import { styles } from '../styles';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import { firebaseRef } from '../firebase';
import Database from '../database';
import TopMenu from '../components/TopMenu';

class ByWho extends Component {
  constructor(props){
    super(props);
    this.state = {
      player1: [],
      player2: [],
      player3: [],
      player4: [],
      player5: [],
      player6: [],
      player7: [],
      timerData: [],
    }
    this._handlePress = this._handlePress.bind(this);
  }
  async componentWillMount(){
    try{
      let user = await firebaseRef.auth().currentUser;
      var penaltyList = [];
      Database.getAllPenalties(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, this.props.complexity, 'penalty', (callback) => {
        penaltyList = [...callback];
      });

      var currentSecs = (Number(this.props.minutes) * 60) + Number(this.props.seconds);
      var p = this.props.players;
      var half = this.props.half;

      var timerData = [];
      Database.listenHalfTimers(user.uid, this.props.team, this.props.season, this.props.game, (callback) => {
        timerData = [...callback];
      });
      this.setState({ timerData:timerData });
      var firstHalfSecs = (Number(this.state.timerData.h1mins) * 60) + Number(this.state.timerData.h1secs);
      var secondHalfSecs = (Number(this.state.timerData.h2mins) * 60) + Number(this.state.timerData.h2secs);

      _.each(penaltyList, function(penalty) {
        var penaltyEnd = (Number(penalty.min) * 60) + Number(penalty.sec) + 120;
        for (i = 0; i < p.length; i++) {
          if (penalty.penaltyType == "TwoMin"){
            if ((currentSecs < penaltyEnd) && (half == penalty.half)) {
              if (p[i]._key == penalty.playerId){
                p[i].blacklist = true;
              }
            } else if( (half== "Second Half") && (penalty.half =="First Half")){
              var newEnd = penaltyEnd - firstHalfSecs;
              if(currentSecs < newEnd && p[i]._key == penalty.playerId){
                p[i].blacklist = true;
              }
            } else if(half== "Extra Time" && penalty.half =="Second Half"){
              var newEnd = penaltyEnd - secondHalfSecs;
              if(currentSecs < newEnd && p[i]._key == penalty.playerId){
                p[i].blacklist = true;
              }
            }
          }
        }
      })

      var expelledList = [];
      Database.getExpelledSubstitution(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, (callback) => {
        expelledList = [...callback];
      });
      _.each(expelledList, function(expelled) {
        for (i = 0; i < p.length; i++) {
          if (p[i]._key == expelled._key){
            p[i].blacklist = true;
          }
        }
      })
      this.setState({
        player1: p[0],
        player2: p[1],
        player3: p[2],
        player4: p[3],
        player5: p[4],
        player6: p[5],
        player7: p[6],
      });
    } catch (e){
      console.log(e);
    }
  }

  _handlePress(player){
    if (this.props.action == 'attempt'){
      Actions.throwSelector({
        homeOpp:this.props.homeOpp,
        season: this.props.season,
        game:this.props.game,
        team:this.props.team,
        action:this.props.action,
        player:player,
        minutes:this.props.minutes,
        seconds:this.props.seconds,
        complexity: this.props.complexity,
        half: this.props.half,
      })
    }
    else if (this.props.action == 'techError'){
      Actions.techError({
        homeOpp:this.props.homeOpp,
        season: this.props.season,
        game:this.props.game,
        team:this.props.team,
        player:player,
        minutes:this.props.minutes,
        seconds:this.props.seconds,
        complexity: this.props.complexity,
        half: this.props.half,
      })
    }
    else if (this.props.action == 'penalty'){
      Actions.penalty({
        players:this.props.players,
        homeOpp:this.props.homeOpp,
        season: this.props.season,
        game:this.props.game,
        team:this.props.team,
        player:player,
        minutes:this.props.minutes,
        seconds:this.props.seconds,
        complexity: this.props.complexity,
        half: this.props.half,
      })
    }
  }

  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
        <TopMenu backButton={'true'} title={"CHOOSE PLAYER"}/>
        <View style={styles.positionContainer}>
              <View style={styles.viewPositions}>
                <TouchableOpacity
                style={[styles.positionByWho, this.state.player1.blacklist && styles.positionByWhoBlocked]}
                disabled={this.state.player1.blacklist}
                onPress={() => {this._handlePress(this.state.player1)}}>
                  <Text style={styles.positionNumber}>{this.state.player1.number}</Text>
                  <Text style={styles.positionName}>{this.state.player1.player}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.viewPositions}>
              <TouchableOpacity
              style={[styles.positionByWho, this.state.player2.blacklist && styles.positionByWhoBlocked]}
              disabled={this.state.player2.blacklist}
              onPress={() => {this._handlePress(this.state.player2)}}>
                <Text style={styles.positionNumber}>{this.state.player2.number}</Text>
                <Text style={styles.positionName}>{this.state.player2.player}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={[styles.positionByWho, this.state.player3.blacklist && styles.positionByWhoBlocked]}
              disabled={this.state.player3.blacklist}
              onPress={() => {this._handlePress(this.state.player3)}}>
                <Text style={styles.positionNumber}>{this.state.player3.number}</Text>
                <Text style={styles.positionName}>{this.state.player3.player}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={[styles.positionByWho, this.state.player4.blacklist && styles.positionByWhoBlocked]}
              disabled={this.state.player4.blacklist}
              onPress={() => {this._handlePress(this.state.player4)}}>
                <Text style={styles.positionNumber}>{this.state.player4.number}</Text>
                <Text style={styles.positionName}>{this.state.player4.player}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.viewPositions}>
              <TouchableOpacity
              style={[styles.positionByWho, this.state.player5.blacklist && styles.positionByWhoBlocked]}
              disabled={this.state.player5.blacklist}
              onPress={() => {this._handlePress(this.state.player5)}}>
                <Text style={styles.positionNumber}>{this.state.player5.number}</Text>
                <Text style={styles.positionName}>{this.state.player5.player}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={[styles.positionByWho, this.state.player6.blacklist && styles.positionByWhoBlocked]}
              disabled={this.state.player6.blacklist}
              onPress={() => {this._handlePress(this.state.player6)}}>
                <Text style={styles.positionNumber}>{this.state.player6.number}</Text>
                <Text style={styles.positionName}>{this.state.player6.player}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={[styles.positionByWho, this.state.player7.blacklist && styles.positionByWhoBlocked]}
              disabled={this.state.player7.blacklist}
              onPress={() => {this._handlePress(this.state.player7)}}>
                <Text style={styles.positionNumber}>{this.state.player7.number}</Text>
                <Text style={styles.positionName}>{this.state.player7.player}</Text>
              </TouchableOpacity>
              </View>
          </View>
      </ImageBackground>
    );
  }
}

export default ByWho;
