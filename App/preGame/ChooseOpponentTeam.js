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
  FlatList
} from 'react-native';
import _ from 'lodash';
import { styles } from '../styles';
import { Actions } from 'react-native-router-flux';
import Search from 'react-native-search-box';
import { firebaseRef } from '../firebase';
import Database from '../database';
import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';

class ChooseOpponentTeam extends Component {
  constructor(props){
    super(props);
    this.state = {
      complexity:'',
      team:'',
      players:[],
      data : [],
      oppTeam : '',
    }
  }

  async componentWillMount() {
    this.setState({
      team: this.props.team,
      players:this.props.players,
      teamName:this.props.teamName,
    });
      try {
          let user = await firebaseRef.auth().currentUser;
          var complex = null;
          Database.getStatsComplexity(user.uid, this.props.team, (complexity) => {
            complex = complexity;
          });

          var data = [];
          Database.listenTeams(user.uid, 'opp', (dataList) => {
            data = dataList;
          });
          for (i = 0; i < data.length; i++){
            if (data[i].deleted == true){
              data.splice(i, 1);
            }
          }
          this.setState({
            data: data,
            complexity:complex,
          })
      } catch (error) {
          console.log(error);
      }
  }

  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
        <TopMenu backButton={'true'} title={"CHOOSE OPPONENT TEAM"}/>
        <View style={styles.viewMain}>
          <View style={styles.searchContainer}>
            <Search
              ref="search_box"
              backgroundColor="rgba(0,0,0,0)"
              placeholderTextColor="#b7602f"
              tintColorSearch="#b7602f"/>
          </View>
          <FlatList
            keyExtractor = {(item) => item.number}
            style={styles.flatList}
            ListEmptyComponent={<Text style={styles.emptyListText}>No teams registered.</Text>}
            data={this.state.data}
            renderItem={({item}) =>
            <TouchableOpacity
            style={styles.list}
            onPress={() => {
                if(this.state.complexity == 1){
                  var data = [];
                  Database.listenAllPlayers(this.state.uid, item._key, "opp", (dataList) => {
                    data = dataList;
                  });
                  for (i = 0; i < data.length; i++){
                    if (data[i].deleted == true){
                      data.splice(i, 1);
                    }
                  }
                  Actions.chooseOpponentTeamPlayers({
                    teamName:this.props.teamName,
                    complexity:this.state.complexity,
                    team: this.state.team,
                    players: this.state.players,
                    oppTeam: item._key,
                    oppTeamName: item.team,
                    oppPlayers: data,
                  })
                } else if (this.state.complexity == 0){
                  Actions.chooseSeason({
                    teamName:this.props.teamName,
                    complexity:this.state.complexity,
                    team: this.state.team,
                    players: this.state.players,
                    oppTeam: item._key,
                    oppTeamName: item.team,
                  })
                }
              }}>
                <Text style={styles.listItem2}>{item.team}</Text>
              </TouchableOpacity>}/>
            <TouchableOpacity
            style={styles.buttonOrangeSmall}
            onPress={() => {Actions.addTeam({ homeOpp: 'opp', preGame: true})}}>
              <Text style={styles.buttonTextWhite}>Add Opponent</Text>
            </TouchableOpacity>
          </View>
          <BottomMenu activeTab={'index'}/>
      </ImageBackground>
    );
  }
}
export default ChooseOpponentTeam;
