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
  Alert
} from 'react-native';

import { styles } from '../styles';
import { Actions } from 'react-native-router-flux';
import Database from '../database';
import _ from 'lodash';
import { firebaseRef } from '../firebase';
import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
        teamName:"",
        team :"",
        key: null,
        email: null,
        number: null,
        phone: null,
        dob: null,
        name : null,
        p:[],
    };
  }

  async componentWillMount() {
    this.setState({
      team: this.props.team,
      player: this.props.player,
    });
    try {
      let user = await firebaseRef.auth().currentUser;
      var pl = [];
      Database.getPlayer(user.uid, this.props.homeOpp, this.state.team, this.state.player, (play) => {
        pl = play;
      });
      this.setState({
        p: pl,
        uid: user.uid
      });
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
        <TopMenu backButton={'true'} title={'PLAYER DATA'}/>
        <View style={styles.viewMain}>
          <View style={styles.paddedBox}>
            <View style={styles.borderViewBig}>
                <Image source={require('../images/user.png')} style={styles.profileBig}></Image>
            </View>
          </View>
          <View>
            <Text style={styles.heading}>{this.state.p.player}</Text>
            <Text style={styles.heading}>#{this.state.p.number}</Text>
          </View>
          <View style={styles.horizontalView}>
            <View style={styles.paddedBox}>
              <Text style={styles.textSize14}>Email: {this.state.p.email}</Text>
              <Text style={styles.textSize14}>Phone Number: {this.state.p.phone}</Text>
              <Text style={styles.textSize14}>Date of Birth: {this.state.p.dob}</Text>
            </View>
          </View>
          <View style={styles.horizontalView}>
            <View>
              <TouchableOpacity
              style={styles.buttonTransparentSmall}
              onPress={() =>{Actions.chooseSeasonPlayerStatistics({
                team:this.state.team,
                player:this.props.player,
                homeOpp: this.props.homeOpp,
              })}}>
                <Text style={styles.buttonTextWhite}>
                  View Statistics
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <BottomMenu activeTab={this.props.homeOpp}/>
      </ImageBackground>
    );
  }
}
export default Player;
