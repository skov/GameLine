import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import _ from 'lodash';
import { styles } from '../styles';
import { Actions } from 'react-native-router-flux';
import Search from 'react-native-search-box';
import { firebaseRef } from '../firebase';
import Database from '../database';
import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';

class ChooseHomeTeamPlayers extends Component {
  constructor(props){
    super(props);
    this.state = {
      players:[],
      data:[],
      chosenPlayer: '',
      chosenPlayerName: '',
      chosenPlayerId: '',
    }
    this._removePlayer = this._removePlayer.bind(this)
  }
  async componentWillMount(){
    this.setState({
      data: this.props.players,
    });
   for ( let i = 0; i < 7; i++ ){
     var pos = {};
     pos._key = '';
     pos.number = '';
     pos.player = '';
     this.state.players = [...this.state.players, pos];
   }
   this.setState({
     players: this.state.players,
   })
   try {
     let user = await firebaseRef.auth().currentUser;
     Database.listenAllPlayers(user.uid, this.props.team, "home", (dataList) => {
       _.each(this.state.players, function(player) {
         for (i = 0; i < dataList.length; i++){
           if (player._key == dataList[i]._key){
             dataList.splice(i, 1);
           }
         }
       });
       this.setState({
         data: dataList,
       });
     });
   } catch (error) { console.log(error) }
  }

_removePlayer(item){
  if (item.active == false){
    item.active = true;
    let pos = {};
    pos._key = item._key;
    pos.number = item.number;
    pos.player = item.player;
    this.state.players.splice(7, 0, pos);
  } else {
    item.active = false;
  }
}

async _handlePress(position){
    if (this.state.players[position]._key == '' && this.state.chosenPlayerId != ''){
      var pos = {};
      pos._key = this.state.chosenPlayerId;
      pos.number = this.state.chosenPlayer;
      pos.player = this.state.chosenPlayerName;

      this.state.players[position]= pos;

      var index = '';
      for ( let i = 0; i < this.state.data.length; i++ ){
        if (this.state.data[i]._key == pos._key) {
          index = i;
        }
      }
      this.state.data.splice(index, 1);
      this.setState({
        chosenPlayer: '',
        chosenPlayerName: '',
        chosenPlayerId: '',
        data:this.state.data,
      })

    } else if (this.state.players[position]._key != '' && this.state.chosenPlayerId != ''){
      for ( let i = 0; i < this.state.data.length; i++ ){
        this.state.data[i].active = false;
      }
      this.setState({
        chosenPlayer: '',
        chosenPlayerName: '',
        chosenPlayerId: '',
        data:this.state.data,
      })
      Alert.alert(
        'Player is already set.',
        'Remove the player in this position to set a different one.',
        [{text: 'OK', style:{color:'black'}}],
        { cancelable: false }
      )

    } else if (this.state.players[position]._key != ''){
      var pos = {};
      pos._key = '';
      pos.number = '';
      pos.player = '';
      this.state.players[position].active = false;
      this.state.players[position].offField = false;
      this.state.data.splice(this.state.players[position], 0, this.state.players[position]);
      this.state.players[position] = pos;
      await this.setState({
        players:this.state.players,
      })
    }
}

render() {
  return (
    <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
    <TopMenu backButton={'true'} title={"CHOOSE MY PLAYERS"}/>
    <View style={styles.viewMain}>
      <View style={styles.horizontalView}>
        <View style={styles.positionContainer}>
          <Text style={styles.textSize14}>On field</Text>
          <View style={styles.viewPositions}>
            <View style={styles.verticalView}>
              <TouchableOpacity style={styles.positionGoalie} onPress={this._handlePress.bind(this,0)}>
                <Text style={styles.positionNumBlack}>{this.state.players[0].number}</Text>
                <Text style={styles.positionName1Black}>{this.state.players[0].player}</Text>
                <Text style={styles.textSize10Black}>Goalie</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.viewPositions}>
            <TouchableOpacity style={styles.position} onPress={this._handlePress.bind(this,1)}>
            <Text style={styles.positionNum}>{this.state.players[1].number}</Text>
            <Text style={styles.positionName1}>{this.state.players[1].player}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.position} onPress={this._handlePress.bind(this,2)}>
            <Text style={styles.positionNum}>{this.state.players[2].number}</Text>
            <Text style={styles.positionName1}>{this.state.players[2].player}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.position} onPress={this._handlePress.bind(this,3)}>
            <Text style={styles.positionNum}>{this.state.players[3].number}</Text>
            <Text style={styles.positionName1}>{this.state.players[3].player}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.viewPositions}>
            <TouchableOpacity style={styles.position} onPress={this._handlePress.bind(this,4)}>
            <Text style={styles.positionNum}>{this.state.players[4].number}</Text>
            <Text style={styles.positionName1}>{this.state.players[4].player}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.position} onPress={this._handlePress.bind(this,5)}>
            <Text style={styles.positionNum}>{this.state.players[5].number}</Text>
            <Text style={styles.positionName1}>{this.state.players[5].player}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.position} onPress={this._handlePress.bind(this,6)}>
            <Text style={styles.positionNum}>{this.state.players[6].number}</Text>
            <Text style={styles.positionName1}>{this.state.players[6].player}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.flatlistContainer}>
      <FlatList
        keyExtractor = {(item) => item._key}
        style={styles.flatList}
        ListEmptyComponent={<Text style={styles.emptyListText}>No players registered.</Text>}
        data={this.state.data}
        renderItem={({item}) =>
          <TouchableOpacity
          style={[styles.list, item.offField && styles.listBlocked]}
          onPress={()=>{
            if (item.offField == false){
              if (item.active == true){
                this.setState({
                chosenPlayer:'',
                chosenPlayerName:'',
                chosenPlayerId:'',
                })
                item.active = false;
              } else {
                for ( let i = 0; i < this.state.data.length; i++ ){
                  this.state.data[i].active = false;
                }
                item.active = true;
                this.setState({
                chosenPlayer:item.number,
                chosenPlayerName:item.player,
                chosenPlayerId:item._key,
                })
              }
            }

            }}>
              <Text style={[styles.playerNumber, item.active && styles.playerNumberBlocked]}>{item.number}</Text>
              <Text style={[styles.listItem2, item.active && styles.listItem2Blocked]}>{item.player}</Text>
              <TouchableOpacity
              style={styles.listButtonWhite}
              onPress={()=>{
                if (item.offField == false){
                  item.offField = true;
                  item.active = false;
                  this.setState({
                  chosenPlayer:'',
                  chosenPlayerName:'',
                  chosenPlayerId:'',
                  })
                  let pos = {};
                  pos._key = item._key;
                  pos.number = item.number;
                  pos.player = item.player;
                  this.state.players.splice(7, 0, pos);
                  this.setState({
                    oppPlayers:this.state.players,
                  })
                } else if (item.offField == true){
                  item.offField = false;
                  for ( let i = 0; i < this.state.players.length; i++ ){
                    if (this.state.players[i]._key == item._key) {
                      index = i;
                    }
                  }
                  this.state.players.splice(index, 1);
                  this.setState({
                    oppPlayers:this.state.players,
                  })
                }
              }}>
                <Text style={styles.listButtonTextWhite}>Off field</Text>
              </TouchableOpacity>
          </TouchableOpacity>}/>
          </View>
          <View style={styles.horizontalView}>
          <TouchableOpacity style={styles.buttonTransparent} onPress={()=>{ Actions.addPlayer({ homeOpp:'home', preGame:true, team: this.props.team}) }}>
            <Text style={styles.buttonTextWhite}>
              Add Player
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOrange}
          onPress={() => {
            if (this.state.players[0].number == '' || this.state.players[1].number == '' || this.state.players[2].number == '' || this.state.players[3].number == '' || this.state.players[4].number == '' || this.state.players[5].number == '' || this.state.players[6].number == ''){
              Alert.alert(
                'NOT ENOUGH PLAYERS',
                'You must choose at least the 7 players on the field to start the game.',
                [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                { cancelable: false }
              )
            } else if (this.state.players[7] == undefined){
               Alert.alert(
                 'THERE ARE NO PLAYERS ON THE BENCH',
                 "Are you sure you don't want players sitting on the bench?",
                 [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'OK', onPress: () =>
                    Actions.chooseOpponentTeam({
                      team: this.props.team,
                      teamName:this.props.teamName,
                      players: this.state.players,
                    }
                  )},
                ],
                { cancelable: false }
               )
             } else {
               Actions.chooseOpponentTeam({
                 team: this.props.team,
                 teamName: this.props.teamName,
                 players: this.state.players,
               })}
            }}>
            <Text style={styles.buttonTextWhite}>
              Next
            </Text>
          </TouchableOpacity>
          </View>
        </View>
        <BottomMenu activeTab={'index'}/>
    </ImageBackground>
  );
}
}
export default ChooseHomeTeamPlayers;
