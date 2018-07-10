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

class ChooseSeason extends Component {
  constructor(props){
    super(props);
    this.state = {
      team: '',
      players: [],
      oppTeam: '',
      oppPlayers: [],
      data:[],
      uid:'',
    }
    this._startGame = this._startGame.bind(this);
    this._handlePress = this._handlePress.bind(this);
  }

  async componentWillMount() {
    this.setState({
      team: this.props.team,
      players: this.props.players,
      oppTeam: this.props.oppTeam,
      oppPlayers: this.props.oppPlayers,
      oppTeamName:this.props.oppTeamName,
      teamName:this.props.teamName,
    });
    try {
        let user = await firebaseRef.auth().currentUser;
        Database.listenAllSeasons(user.uid, this.props.team, "home", (dataList) => {
            this.setState({
                data: dataList,
                uid: user.uid,
            });
        });
    } catch (error) {
        console.log(error);
    }
  }

  async _handlePress(season){
        Alert.alert(
          'START GAME',
          'Are you ready?',
          [
            {text: 'OK', onPress: () => {this._startGame(season)}},
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
          )
  }
  async _startGame(season){
    _.each(this.state.players, function(player) {
      player.goalie = false;
      player.blocked = false;
    });
    this.state.players[0].goalie = true;
    this.setState({
      players:this.state.players,
    });

    if (this.props.complexity == 1){
      _.each(this.state.oppPlayers, function(player) {
        player.goalie = false;
        player.blocked = false;
      });
      this.state.oppPlayers[0].goalie = true;
      this.setState({
        oppPlayers:this.state.oppPlayers,
      });
    }

    try {
      var today = new Date();
      date = today.getDate() + "/"+ parseInt(today.getMonth()+1) +"/"+ today.getFullYear();
      Database.addGame(this.state.uid, this.props.team, this.props.oppTeam, season, "home", this.props.teamName, this.props.oppTeamName, date, this.props.complexity, null);

      Database.getGameId(this.state.uid,this.props.team, season, (gameId) =>{
        Database.addGame(this.state.uid, this.props.oppTeam, this.props.team, season, "opp", this.props.oppTeamName,this.props.teamName, date, this.props.complexity, gameId);
        Database.setPlayers(this.state.uid, this.props.team, season, gameId, "home", this.state.players);
        if (this.props.complexity == 1){
          Database.setPlayers(this.state.uid, this.props.oppTeam, season, gameId, "opp", this.state.oppPlayers);
        }
        Actions.game({
          game:gameId,
          team:this.props.team,
          oppTeam:this.props.oppTeam,
          season:season,
        });
      });

    } catch (error) {
        console.log(error);
    }
  }

  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'true'} title={"CHOOSE SEASON"}/>
        <View style={styles.viewMain}>

        <View style={styles.searchContainer}>
        <Search
          ref="search_box"
          backgroundColor="rgba(0,0,0,0)"
          placeholderTextColor="#b7602f"
          tintColorSearch="#b7602f"/>
        </View>
        <FlatList
        keyExtractor = {(item) => item._key}
        style={styles.flatList}
        ListEmptyComponent={<Text style={styles.emptyListText}>No seasons registered.</Text>}
        data={this.state.data}
        renderItem={({item}) =>
          <TouchableOpacity style={styles.list}
          onPress={()=>{
            this._handlePress(item._key);
          }}>
          <Text style={styles.listItem3}>{item.season}</Text>
          </TouchableOpacity>}
        />
        <TouchableOpacity
        style={styles.buttonOrange}
        onPress={() => {
          Actions.addSeason({
            level:this.state.level,
            team: this.state.team,
            players: this.state.players,
            oppTeam: this.state.oppTeam,
            oppPlayers: this.state.oppPlayers,
          })
        }}>
          <Text style={styles.buttonTextWhite}>
            Add Season
          </Text>
        </TouchableOpacity>
        </View>
        <BottomMenu activeTab={'index'}/>
      </ImageBackground>
    );
  }
}
export default ChooseSeason;
