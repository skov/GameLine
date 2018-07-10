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

class ChooseOpponentTeamPlayers extends Component {
  constructor(props){
    super(props);
    this.state = {
      players:[],
      data:[],
      chosenPlayer: '',
      chosenPlayerName: '',
      chosenPlayerId: '',
      oppPlayers:[],
    }
    this._removePlayer = this._removePlayer.bind(this)
  }

  async componentWillMount(){
    this.setState({
      data: this.props.oppPlayers,
    });
    for ( let i = 0; i < 7; i++ ){
     var pos = {};
     pos._key = '';
     pos.number = '';
     pos.player = '';
     this.state.oppPlayers = [...this.state.oppPlayers, pos];
    }
    this.setState({
     oppPlayers: this.state.oppPlayers,
    })
    try {
     let user = await firebaseRef.auth().currentUser;
     Database.listenAllPlayers(user.uid, this.props.oppTeam, "opp", (dataList) => {
       _.each(this.state.oppPlayers, function(player) {
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
    this.state.oppPlayers.splice(7, 0, pos);
  } else {
    item.active = false;
  }
}

async _handlePress(position){
    if (this.state.oppPlayers[position]._key == '' && this.state.chosenPlayerId != ''){
      var pos = {};
      pos._key = this.state.chosenPlayerId;
      pos.number = this.state.chosenPlayer;
      pos.player = this.state.chosenPlayerName;
      this.state.oppPlayers[position]= pos;
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

    } else if (this.state.oppPlayers[position]._key != '' && this.state.chosenPlayerId != ''){
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

    } else if (this.state.oppPlayers[position]._key != ''){
      var pos = {};
      pos._key = '';
      pos.number = '';
      pos.player = '';
      this.state.oppPlayers[position].active = false;
      this.state.oppPlayers[position].offField = false;
      this.state.data.splice(this.state.oppPlayers[position], 0, this.state.oppPlayers[position]);
      this.state.oppPlayers[position] = pos;
      await this.setState({
        players:this.state.oppPlayers,
      })
    }
}

render() {
  return (
    <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
    <TopMenu backButton={'true'} title={"CHOOSE OPPONENT PLAYERS"}/>
    <View style={styles.viewMain}>
      <View style={styles.horizontalView}>
        <View style={styles.positionContainer}>
          <Text style={styles.textSize14}>On field</Text>
          <View style={styles.viewPositions}>
            <View style={styles.verticalView}>
              <TouchableOpacity style={styles.positionGoalie} onPress={this._handlePress.bind(this,0)}>
                <Text style={styles.positionNumBlack}>{this.state.oppPlayers[0].number}</Text>
                <Text style={styles.positionName1Black}>{this.state.oppPlayers[0].player}</Text>
                <Text style={styles.textSize10Black}>Goalie</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.viewPositions}>
            <TouchableOpacity style={styles.position} onPress={this._handlePress.bind(this,1)}>
            <Text style={styles.positionNum}>{this.state.oppPlayers[1].number}</Text>
            <Text style={styles.positionName1}>{this.state.oppPlayers[1].player}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.position} onPress={this._handlePress.bind(this,2)}>
            <Text style={styles.positionNum}>{this.state.oppPlayers[2].number}</Text>
            <Text style={styles.positionName1}>{this.state.oppPlayers[2].player}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.position} onPress={this._handlePress.bind(this,3)}>
            <Text style={styles.positionNum}>{this.state.oppPlayers[3].number}</Text>
            <Text style={styles.positionName1}>{this.state.oppPlayers[3].player}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.viewPositions}>
            <TouchableOpacity style={styles.position} onPress={this._handlePress.bind(this,4)}>
            <Text style={styles.positionNum}>{this.state.oppPlayers[4].number}</Text>
            <Text style={styles.positionName1}>{this.state.oppPlayers[4].player}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.position} onPress={this._handlePress.bind(this,5)}>
            <Text style={styles.positionNum}>{this.state.oppPlayers[5].number}</Text>
            <Text style={styles.positionName1}>{this.state.oppPlayers[5].player}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.position} onPress={this._handlePress.bind(this,6)}>
            <Text style={styles.positionNum}>{this.state.oppPlayers[6].number}</Text>
            <Text style={styles.positionName1}>{this.state.oppPlayers[6].player}</Text>
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
                  this.state.oppPlayers.splice(7, 0, pos);
                  this.setState({
                    oppPlayers:this.state.oppPlayers,
                  })
                } else if (item.offField == true){
                  item.offField = false;
                  for ( let i = 0; i < this.state.oppPlayers.length; i++ ){
                    if (this.state.players[i]._key == item._key) {
                      index = i;
                    }
                  }
                  this.state.oppPlayers.splice(index, 1);
                  this.setState({
                    oppPlayers:this.state.oppPlayers,
                  })
                }
              }}>
                <Text style={styles.listButtonTextWhite}>Off field</Text>
              </TouchableOpacity>
          </TouchableOpacity>}/>
          </View>
          <View style={styles.horizontalView}>
          <TouchableOpacity style={styles.buttonTransparent} onPress={()=>{ Actions.addPlayer({ homeOpp:'opp', preGame:true, team: this.props.oppTeam}) }}>
            <Text style={styles.buttonTextWhite}>
              Add Player
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOrange}
          onPress={() => {
            if (this.state.oppPlayers[0].number == '' || this.state.oppPlayers[1].number == '' || this.state.oppPlayers[2].number == '' || this.state.oppPlayers[3].number == '' || this.state.oppPlayers[4].number == '' || this.state.oppPlayers[5].number == '' || this.state.oppPlayers[6].number == ''){
              Alert.alert(
                'NOT ENOUGH PLAYERS',
                'You must choose at least the 7 players on the field to start the game.',
                [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                { cancelable: false }
              )
            } else if (this.state.oppPlayers[7] == undefined){
               Alert.alert(
                 'THERE ARE NO PLAYERS ON THE BENCH',
                 "Are you sure you don't want players sitting on the bench?",
                 [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'OK', onPress: () =>
                    Actions.chooseSeason({
                      team: this.props.team,
                      teamName:this.props.teamName,
                      players: this.props.players,
                      oppTeam: this.props.oppTeam,
                      oppTeamName:this.props.oppTeamName,
                      oppPlayers: this.state.oppPlayers,
                      complexity:this.props.complexity,
                    }
                  )},
                ],
                { cancelable: false }
               )
             } else {
              Actions.chooseSeason({
                team: this.props.team,
                teamName:this.props.teamName,
                players: this.props.players,
                oppTeam: this.props.oppTeam,
                oppTeamName:this.props.oppTeamName,
                oppPlayers: this.state.oppPlayers,
                complexity:this.props.complexity,
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
export default ChooseOpponentTeamPlayers;
