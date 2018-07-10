import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { styles } from '../styles';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';

class BottomMenu extends Component {
  constructor(props) {
    super(props);
    this._index = this._index.bind(this)
    this._myTeams = this._myTeams.bind(this)
    this._oppTeams = this._oppTeams.bind(this)
  }
  _index(){
    Actions.home()
  };
  _myTeams(){
    Actions.teams({homeOpp:'home'})
  };
  _oppTeams(){
    Actions.teams({homeOpp:'opp'})
  };
  render() {
    var cMenu = function() {
      if (this.props.activeTab == 'index') {
        return <View style={styles.navBottom}>
          <View style={styles.centerNav}>
            <TouchableOpacity onPress={this._index}>
              <Image source={require('../images/indexActive.png')} style={styles.bottomActive}></Image>
              <Text style={styles.barTextActive}>Home</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.centerNav}>
          <TouchableOpacity onPress={this._myTeams}>
            <Image source={require('../images/myTeams.png')} style={styles.bottomUnActive}></Image>
            <Text style={styles.barText}>My Teams</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.centerNav}>
          <TouchableOpacity onPress={this._oppTeams}>
            <Image source={require('../images/oppTeams.png')} style={styles.bottomUnActive}></Image>
            <Text style={styles.barText}>Opponent Teams</Text>
            </TouchableOpacity>
          </View>
        </View>;
      } else if (this.props.activeTab == 'home'){
        return <View style={styles.navBottom}>
          <View style={styles.centerNav}>
            <TouchableOpacity onPress={this._index}>
              <Image source={require('../images/index.png')} style={styles.bottomActive}></Image>
              <Text style={styles.barText}>Home</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.centerNav}>
          <TouchableOpacity onPress={this._myTeams}>
            <Image source={require('../images/myTeamsActive.png')} style={styles.bottomUnActive}></Image>
            <Text style={styles.barTextActive}>My Teams</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.centerNav}>
          <TouchableOpacity onPress={this._oppTeams}>
            <Image source={require('../images/oppTeams.png')} style={styles.bottomUnActive}></Image>
            <Text style={styles.barText}>Opponent Teams</Text>
            </TouchableOpacity>
          </View>
        </View>;
      } else if (this.props.activeTab == 'opp'){
        return <View style={styles.navBottom}>
          <View style={styles.centerNav}>
            <TouchableOpacity onPress={this._index}>
              <Image source={require('../images/index.png')} style={styles.bottomActive}></Image>
              <Text style={styles.barText}>Home</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.centerNav}>
          <TouchableOpacity onPress={this._myTeams}>
            <Image source={require('../images/myTeams.png')} style={styles.bottomUnActive}></Image>
            <Text style={styles.barText}>My Teams</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.centerNav}>
          <TouchableOpacity onPress={this._oppTeams}>
            <Image source={require('../images/oppTeamsActive.png')} style={styles.bottomUnActive}></Image>
            <Text style={styles.barTextActive}>Opponent Teams</Text>
            </TouchableOpacity>
          </View>
        </View>;
      }
    }.bind(this);

    return (
      <View style={styles.navBottomWrapper}>
        {cMenu()}
      </View>
    );
  }
}
export default BottomMenu;
