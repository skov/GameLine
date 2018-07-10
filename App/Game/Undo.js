import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import { styles } from '../styles';
import { Actions } from 'react-native-router-flux';
import { firebaseRef } from '../firebase';
import Database from '../database';
import TopMenu from '../components/TopMenu';

class Undo extends Component {
  constructor(props){
    super(props);
    this.state = {
      actionPlayer: 'the opponent team',
      actionType: '',
      actionId: '',
      blockedUndo:true,
    }
    this._handlePress = this._handlePress.bind(this);
  }

  async componentWillMount(){
    try {
      let user = await firebaseRef.auth().currentUser;
      var call = [];
      var actPlayer = '';

      Database.getUndoAction(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, this.props.complexity, (callback) => {
        call = callback;
      });
      if (call.actionId != ''){
        this.setState({
          blockedUndo:false,
        })
      }
      if (this.props.homeOpp = 'home' || this.props.complexity == 1){
        Database.getPlayerName(user.uid, this.props.homeOpp, this.props.team, call.actionPlayer, (playerName) => {
           actPlayer = playerName;
        });
        this.setState({
          actionPlayer:actPlayer,
          actionPlayerId: call.actionPlayer,
          actionType: call.actionType,
          actionId: call.actionId,
        })
      } else {
        this.setState({
          actionPlayer: 'the opponent team',
          actionType: call.actionType,
          actionId: call.actionId,
        })
      }
    } catch (error) { }
  }
  async _handlePress(){
    try {
      let user = await firebaseRef.auth().currentUser;

      Database.undoLastAction(user.uid,this.props.team, this.props.season, this.props.game, this.props.homeOpp, this.state.actionType, this.state.actionId);
      var a = [];
      a.actionId='';
      a.actionType='';
      a.playerId='';
      if (this.state.actionType == 'goal'){
        Database.updateScore(user.uid,this.props.team, this.props.season, this.props.game, this.props.homeOpp, -1);
      }
      Database.setLastAction(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, this.props.complexity, a)
      Actions.pop();
    } catch (error) { }
  }

  render() {
    var cUndo = function() {
      if (this.state.blockedUndo == false) {
        return <View style={styles.rowBox}>
          <Text style={styles.textSize14}> You are undoing a {this.state.actionType} by {this.state.actionPlayer}</Text>
          <Text style={styles.textSize14}>Are you sure you want to undo the last action?</Text>
          <Text style={styles.textSize14}>This can NOT be reversed.</Text>
          <TouchableOpacity
            style={styles.buttonOrange}
            onPress={()=>{this._handlePress()}}>
            <Text style={styles.buttonTextWhite}>
              UNDO
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonTransparent}
            onPress={() => {Actions.pop()}}>
            <Text style={styles.buttonTextWhite}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>;
      } else if (this.state.blockedUndo == true){
        return <View style={styles.rowBox}>
          <Text style={styles.textSize14}> There is nothing to undo by this team at the moment.</Text>
          <TouchableOpacity
            style={styles.buttonTransparent}
            onPress={() => {Actions.pop()}}>
            <Text style={styles.buttonTextWhite}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>;
      }
    }.bind(this);

    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'true'} title={"UNDO"}/>
      <View style={styles.viewMain}>
        {cUndo()}
      </View>
    </ImageBackground>
    );
  }
}
export default Undo;
