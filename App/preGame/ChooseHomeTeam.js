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

class ChooseHomeTeam extends Component {
  constructor(props){
    super(props);
    this.state = {
      team : '',
      data : [],
    }
  }

  async componentWillMount() {
    try {
      let user = await firebaseRef.auth().currentUser;
      var data = [];
      Database.listenTeams(user.uid, 'home', (dataList) => {
        data = dataList;
      });
      for (i = 0; i < data.length; i++){
        if (data[i].deleted == true){
          data.splice(i, 1);
        }
      }
      this.setState({
          data: data,
          uid : user.uid,
      });
    } catch (error) { console.log(error) }
  }

  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
        <TopMenu backButton={'true'} title={"CHOOSE HOME TEAM"}/>
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
              ListEmptyComponent={<Text style={styles.emptyListText}>No teams registered.</Text>}
              data={this.state.data}
              renderItem={({item}) =>
              <TouchableOpacity
              style={styles.list}
              onPress={() => {
                var data = [];
                Database.listenAllPlayers(this.state.uid, item._key, "home", (dataList) => {
                  data = dataList;
                });
                for (i = 0; i < data.length; i++){
                  if (data[i].deleted == true){
                    data.splice(i, 1);
                  }
                }
                Actions.chooseHomeTeamPlayers({
                  team: item._key,
                  teamName:item.team,
                  players: data,
                });
              }}>
                <Text style={styles.listItem3}>{item.team}</Text>
              </TouchableOpacity>}
            />
            <TouchableOpacity
            style={styles.buttonOrangeSmall}
            onPress={() => {Actions.addTeam({ homeOpp: 'home', preGame: true})}}>
              <Text style={styles.buttonTextWhite}>
                Add Home Team
              </Text>
            </TouchableOpacity>
          </View>
          <BottomMenu activeTab={'index'}/>
      </ImageBackground>
    );
  }
}
export default ChooseHomeTeam;
