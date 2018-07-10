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

class Substitution extends Component {
  constructor(props){
    super(props);
    this.state = {
      chosenPosition:-1,
      selectedPlayer:'',
      data:[],
      onFieldPlayers:[],
      offFieldPlayers:[],
      subLog:[],
    }
    this._handlePress = this._handlePress.bind(this);
    this._handleFinish = this._handleFinish.bind(this);
  }
  async componentWillMount(){
    this.setState({
      game:this.props.game,
      homeOpp:this.props.homeOpp,
    });

    var onFieldPlayers = [];
    var offFieldPlayers = [];

    for (let i = 0; i < this.props.players.length; i++ ){
      if(this.props.players[i].blocked == false){
        if (i >=7){
          offFieldPlayers = [...offFieldPlayers, this.props.players[i]];
        } else {
          onFieldPlayers = [...onFieldPlayers, this.props.players[i]];
        }
      }
    }

    this.setState({
      onFieldPlayers:onFieldPlayers,
      offFieldPlayers:offFieldPlayers,
    });

    let user = await firebaseRef.auth().currentUser;
    var penaltyList = [];
    Database.getAllPenalties(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, this.props.complexity, 'penalty', (callback) => {
      penaltyList = [...callback];
    });

    var currentSecs = (Number(this.props.minutes) * 60) + Number(this.props.seconds);
    var p = this.state.onFieldPlayers;
    var half = this.props.half;
    var timerData = [];
    Database.listenHalfTimers(user.uid, this.props.team, this.props.season, this.props.game, (callback) => {
      timerData = [... callback]
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
      console.log(expelled)
      var expelledEnd = (Number(expelled.min) * 60) + Number(expelled.sec) + 120;
      for (i = 0; i < p.length; i++) {
        if (p[i]._key == expelled._key){
          p[i].expelledSub = true;
          p[i].blacklist = false;
        }
        if ((currentSecs < expelledEnd) && (half == expelled.half)) {
          if (p[i]._key == expelled._key){
            p[i].blacklist = true;
          }
        } else if( (half== "Second Half") && (expelled.half =="First Half")){
          var newEnd = expelledEnd - firstHalfSecs;
          if(currentSecs < newEnd && p[i]._key == expelled._key){
            p[i].blacklist = true;
          }
        } else if(half== "Extra Time" && expelled.half =="Second Half"){
          var newEnd = expelledEnd - secondHalfSecs;
          if(currentSecs < newEnd && p[i]._key == expelled._key){
            p[i].blacklist = true;
          }
        }
      }
    })
    console.log(p)
    this.setState({
      onFieldPlayers:p,
    });
  }

  async _handleFinish(){
    try {
      let user = await firebaseRef.auth().currentUser;
      for ( let i = 0; i < this.state.offFieldPlayers.length; i++ ){
        if (this.state.offFieldPlayers[i].expelledSub == true){
          this.state.offFieldPlayers[i].blocked = true;
        }
        this.state.onFieldPlayers = [...this.state.onFieldPlayers, this.state.offFieldPlayers[i]];
      }
      var game = this.state.game;
      var homeOpp = this.props.homeOpp;
      var half =  this.props.half;
      var team = this.props.team;
      var season = this.props.season;
      _.each(this.state.subLog, function(substitution) {
        Database.addSubstitution(user.uid, team, season, game, homeOpp, half, substitution.player1, substitution.player2, substitution.min, substitution.sec);
      });
      this.state.onFieldPlayers[0].goalie = true;
      this.setState({
        onFieldPlayers:this.state.onFieldPlayers,
      });
      Database.setPlayers(user.uid,this.props.team, this.props.season, this.state.game,this.props.homeOpp, this.state.onFieldPlayers);
    } catch (error) { console.log(error)}
    Actions.pop();
  }

  async _handlePress(player){
    if (this.state.selectedPlayer == ''){
      this.setState({
        selectedPlayer:player,
      })
    } else {
      this.setState({
        selectedPlayer:'',
      })

      let SindexOn = this.state.onFieldPlayers.indexOf(this.state.selectedPlayer);
      let PindexOn = this.state.onFieldPlayers.indexOf(player);
      let SindexOff = this.state.offFieldPlayers.indexOf(this.state.selectedPlayer);
      let PindexOff = this.state.offFieldPlayers.indexOf(player);

      if (SindexOn != -1 && PindexOn !=-1){
        this.state.onFieldPlayers.splice(PindexOn, 1, this.state.selectedPlayer);
        this.state.onFieldPlayers.splice(SindexOn, 1, player);
        this.state.subLog.push({
          player1: this.state.selectedPlayer._key,
          player2: player._key,
          min: this.props.minutes,
          sec: this.props.seconds,
        })
        this.setState({
          subLog:this.state.subLog,
        })
      }
      if (SindexOn != -1 && PindexOff !=-1){
        this.state.onFieldPlayers.splice(SindexOn, 1, player);
        this.state.offFieldPlayers.splice(PindexOff, 1, this.state.selectedPlayer);
        this.state.subLog.push({
          player1: player._key,
          player2: this.state.selectedPlayer._key,
          min: this.props.minutes,
          sec: this.props.seconds,
        })
        this.setState({
          subLog:this.state.subLog,
        })
      }
      if (SindexOff != -1 && PindexOn !=-1){
        this.state.onFieldPlayers.splice(PindexOn, 1, this.state.selectedPlayer);
        this.state.offFieldPlayers.splice(SindexOff, 1, player);
        this.state.subLog.push({
          player1: this.state.selectedPlayer._key,
          player2: player._key,
          min: this.props.minutes,
          sec: this.props.seconds,
        })
        this.setState({
          subLog:this.state.subLog,
        })
      }

      console.log(this.state.onFieldPlayers)
      console.log(this.state.offFieldPlayers)
    }
  }

  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'true'} title={"SUBSTITUTION"}/>
      <View style={styles.viewMain}>
        <View style={styles.horizontalView}>
          <View style={styles.positionContainer}>
            <Text style={styles.textSize14}> On field</Text>
            <View style={styles.viewPositions}>
              <TouchableOpacity
              disabled={this.state.onFieldPlayers[0].blacklist}
              style={[styles.position, this.state.onFieldPlayers[0].expelledSub == true && styles.positionSubstitute, this.state.onFieldPlayers[0].blacklist == true && styles.positionTransparent]}
              onPress={()=>{
                this._handlePress(this.state.onFieldPlayers[0])
              }}>
                <Text style={styles.positionNum}>{this.state.onFieldPlayers[0].number}</Text>
                <Text style={styles.positionName1}>{this.state.onFieldPlayers[0].player}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.viewPositions}>
              <TouchableOpacity
              disabled={this.state.onFieldPlayers[1].blacklist}
              style={[styles.position, this.state.onFieldPlayers[1].expelledSub == true && styles.positionSubstitute, this.state.onFieldPlayers[1].blacklist == true && styles.positionTransparent]}
              onPress={()=>{
                this._handlePress(this.state.onFieldPlayers[1])
              }}>
              <Text style={styles.positionNum}>{this.state.onFieldPlayers[1].number}</Text>
              <Text style={styles.positionName1}>{this.state.onFieldPlayers[1].player}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              disabled={this.state.onFieldPlayers[2].blacklist}
              style={[styles.position, this.state.onFieldPlayers[2].expelledSub == true && styles.positionSubstitute, this.state.onFieldPlayers[2].blacklist == true && styles.positionTransparent]}
              onPress={()=>{
                this._handlePress(this.state.onFieldPlayers[2])
              }}>
              <Text style={styles.positionNum}>{this.state.onFieldPlayers[2].number}</Text>
              <Text style={styles.positionName1}>{this.state.onFieldPlayers[2].player}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              disabled={this.state.onFieldPlayers[3].blacklist}
              style={[styles.position, this.state.onFieldPlayers[3].expelledSub == true && styles.positionSubstitute, this.state.onFieldPlayers[3].blacklist == true && styles.positionTransparent]}
              onPress={()=>{
                this._handlePress(this.state.onFieldPlayers[3])
              }}>
              <Text style={styles.positionNum}>{this.state.onFieldPlayers[3].number}</Text>
              <Text style={styles.positionName1}>{this.state.onFieldPlayers[3].player}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.viewPositions}>
              <TouchableOpacity
              disabled={this.state.onFieldPlayers[4].blacklist}
              style={[styles.position, this.state.onFieldPlayers[4].expelledSub == true && styles.positionSubstitute, this.state.onFieldPlayers[4].blacklist == true && styles.positionTransparent]}
              onPress={()=>{
                this._handlePress(this.state.onFieldPlayers[4])
              }}>
              <Text style={styles.positionNum}>{this.state.onFieldPlayers[4].number}</Text>
              <Text style={styles.positionName1}>{this.state.onFieldPlayers[4].player}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              disabled={this.state.onFieldPlayers[5].blacklist}
              style={[styles.position, this.state.onFieldPlayers[5].blacklist == true && styles.positionTransparent, this.state.onFieldPlayers[5].expelledSub == true && styles.positionSubstitute]}
              onPress={()=>{
                this._handlePress(this.state.onFieldPlayers[5])
              }}>
              <Text style={styles.positionNum}>{this.state.onFieldPlayers[5].number}</Text>
              <Text style={styles.positionName1}>{this.state.onFieldPlayers[5].player}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              disabled={this.state.onFieldPlayers[6].blacklist}
              style={[styles.position, this.state.onFieldPlayers[6].expelledSub == true && styles.positionSubstitute, this.state.onFieldPlayers[6].blacklist == true && styles.positionTransparent]}
              onPress={()=>{
                this._handlePress(this.state.onFieldPlayers[6])
              }}>
              <Text style={styles.positionNum}>{this.state.onFieldPlayers[6].number}</Text>
              <Text style={styles.positionName1}>{this.state.onFieldPlayers[6].player}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.flatlistContainer}>
        <FlatList
          keyExtractor = {(item) => item._key}
          style={styles.flatList}
          ListEmptyComponent={<Text style={styles.emptyListText2}>No outfield players registered.</Text>}
          data={this.state.offFieldPlayers}
          renderItem={({item}) =>
            <TouchableOpacity
            style={[styles.list, item.active && styles.listBlocked]}
            onPress={()=>{ this._handlePress(item) }}>
                <Text style={[styles.playerNumber, item.active && styles.playerNumberBlocked]}>{item.number}</Text>
                <Text style={[styles.listItem2, item.active && styles.listItem2Blocked]}>{item.player}</Text>
              </TouchableOpacity>}/>
            </View>
      <TouchableOpacity
      style={styles.buttonOrange}
      onPress={()=> {this._handleFinish()}}>
        <Text style={styles.buttonTextWhite}>Finish Susbtituting</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
    );
  }
}

export default Substitution;
