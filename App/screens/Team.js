'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicatorIOS,
  AsyncStorage,
  Text,
  Image,
  ImageBackground,
  View,
  FlatList,
  SegmentedControlIOS,
  Switch,
  Alert,
} from 'react-native';

import { styles } from '../styles';
import { Actions } from 'react-native-router-flux';
import Database from '../database';
import _ from 'lodash';
import Search from 'react-native-search-box';
import { firebaseRef } from '../firebase';
import { SegmentedControls } from 'react-native-radio-buttons';
import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';

class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      teamData:[],
    }
  }

  async componentWillMount(){
    try {
      let user = await firebaseRef.auth().currentUser;
      Database.listenTeam(user.uid, this.props.team, this.props.homeOpp, (callback) => {
        this.setState({
          uid:user.uid,
          teamData: callback,
          complexity: callback.complexity,
          team: this.props.team,
        });
      });
      var dataList = [];
      Database.listenAllPlayers(user.uid, this.props.team, this.props.homeOpp, (callback) => {
        dataList = [...callback];
      });
      for (i = 0; i < dataList.length; i++){
        if (dataList[i].deleted == true){
          dataList.splice(i, 1);
        }
      }
      this.setState({
        data: dataList,
      });
      var title = "";
      Database.getTeamName(user.uid, this.props.homeOpp, this.props.team, (callback) =>{
        title = callback.toUpperCase() + " DATA";
      });
      this.setState({
        t : title,
      })
    } catch (error) {}
  }

  _alertInfo(alertType){
    if (alertType == "Presets"){
      Alert.alert(
        'Game Statistics Presets',
        'My Alert Msg',
        [{text: 'OK'}],
        { cancelable: false }
      )
    }
    else if (alertType == "Email"){
      Alert.alert(
        'Email Auto-Send',
        'My Alert Msg',
        [{text: 'OK'}],
        { cancelable: false }
      )
    }
  }
  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'true'} title={'TEAM DATA'}/>
        <View style={styles.viewMain}>
        <View style={styles.paddedBox}>
            <View style={styles.paddedBox}>
              <View style={styles.borderView}>
                <Image source={require('../images/user.png')} style={styles.profile}></Image>
              </View>
            </View>
              <TouchableOpacity
              style={styles.buttonTransparentSmall}
              onPress={() =>{Actions.chooseSeasonTeamStatistics({
                team:this.props.team,
                homeOpp:this.props.homeOpp,
              })}}>
                <Text style={styles.buttonTextWhite}>
                  View Statistics
                </Text>
              </TouchableOpacity>
        </View>
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
        ListEmptyComponent={<Text style={styles.emptyListText}>No players registered.</Text>}
        data={this.state.data}
        renderItem={({item}) =>
          <TouchableOpacity
          style={styles.list}
          onPress={() => { Actions.Player({ team: this.state.team, player: item._key, homeOpp: this.props.homeOpp  }) }}
          >
            <Text style={styles.playerNumber}>{item.number}</Text>
            <Text style={styles.listItemLeft}>{item.player}</Text>
            <TouchableOpacity
            style={styles.listButtonBlack}
            onPress={() => { Actions.editPlayer({ team: this.props.team, player:item._key, homeOpp:this.props.homeOpp}) }}>
              <Text style={styles.listButtonTextBlack}>Edit</Text>
            </TouchableOpacity>
        </TouchableOpacity>}
        />
        <TouchableOpacity
        onPress={() => { Actions.addPlayer({ team: this.state.team, homeOpp: this.state.homeOpp, homeOpp: this.props.homeOpp  }) }}
        style={styles.buttonOrangeSmall}>
        <Text style={styles.buttonTextWhite}>
          Add Player
        </Text>
        </TouchableOpacity>

        </View>
      <BottomMenu activeTab={this.props.homeOpp}/>
      </ImageBackground>
    );
  }
}
export default Team;
