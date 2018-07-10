import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import { styles } from '../styles';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import { firebaseRef } from '../firebase';
import Database from '../database';
import TopMenu from '../components/TopMenu';

class SubstitutionPenalty extends Component {
  constructor(props){
    super(props);
    this.state = {
      chosenPosition:-1,
      selectedPlayer:'',
      data:[],
      onFieldPlayers:[],
      offFieldPlayers:[],
      index:'',
    }
    this._handleFinish = this._handleFinish.bind(this);
  }
  async componentWillMount(){
    this.setState({
      minutes:this.props.minutes,
      seconds:this.props.seconds,
      team: this.props.team,
      season: this.props.season,
      game:this.props.game,
      homeOpp: this.props.homeOpp,
      complexity: this.props.complexity,
    });
    var playerExpelled = {};
    for ( let i = 0; i < this.props.players.length; i++ ){
      if (i >= 7){
        if(this.props.players[i].blocked == false){
          this.state.offFieldPlayers = [...this.state.offFieldPlayers, this.props.players[i]];
        }
      }
      if (this.props.players[i]._key == this.props.playerExpelled._key){
        playerExpelled = this.props.players[i];
        playerExpelled.blocked = true;
      }
    }
    this.setState({
      playerExpelled:playerExpelled,
      offFieldPlayers:this.state.offFieldPlayers,
    })
  }

  async _handleFinish(player){
    try {
      let user = await firebaseRef.auth().currentUser;
      let indexOff = this.props.players.indexOf(player);
      let indexOn = this.props.players.indexOf(this.state.playerExpelled);
      this.props.players.splice(indexOn, 1, player);
      this.props.players.splice(indexOff, 1, this.state.playerExpelled);
      this.props.players[0].goalie = true;
      Database.setPlayers(user.uid,this.props.team, this.props.season, this.state.game,this.props.homeOpp, this.props.players);
      Database.setExpelledSubstitution(user.uid,this.props.team, this.props.season, this.state.game,this.props.homeOpp, player, this.props.minutes, this.props.seconds, this.props.half);
    } catch (error) { }
    Actions.popTo('game');
  }


  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'true'} title={"PLAYER EXPELLED"}/>
      <View style={styles.viewMain}>
        <View style={styles.horizontalView}>
          <View style={styles.positionContainer}>
            <Text style={styles.textSize14}> Substitute in a player for the expelled team member.</Text>
          </View>
        </View>
        <View style={styles.flatlistContainer}>
        <FlatList
          keyExtractor = {(item) => item.number}
          style={styles.flatList}
          ListEmptyComponent={<Text style={styles.emptyListText2}>No outfield players registered.</Text>}
          data={this.state.offFieldPlayers}
          renderItem={({item}) =>
            <TouchableOpacity style={styles.list} onPress={()=>{ this._handleFinish(item) }}>
                <Text style={styles.playerNumber}>{item.number}</Text>
                <Text style={styles.listItem2}>{item.player}</Text>
              </TouchableOpacity>}/>
            </View>
    </View>
  </ImageBackground>
    );
  }
}

export default SubstitutionPenalty;
