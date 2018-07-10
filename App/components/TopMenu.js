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

class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title:'',
    }
  }
  async componentWillMount(){
     this.setState({
       title: this.props.title,
     });
  }
  render() {
    var cMenu = function() {
      if (this.props.backButton == 'true') {
        return <View style={styles.nav}>
          <View style={styles.leftNav}>
            <TouchableOpacity onPress={() => {Actions.pop()}}>
              <Image source={require('../images/back.png')} style={styles.topNavLeft}></Image>
              <Text style={styles.barText}>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.titleNav}>
            <Text style={styles.barTitle}>{this.state.title}</Text>
          </View>
          <View style={styles.rightNav}>
          </View>
        </View>;
      } else if (this.props.backButton == 'false'){
        return <View style={styles.nav}>
          <View style={styles.leftNav}>
          </View>
          <View style={styles.titleNav}>
            <Text style={styles.barTitle}>{this.state.title}</Text>
          </View>
          <View style={styles.rightNav}>
          </View>
        </View>;
      }
    }.bind(this);
    return (
      <View style={styles.navWrapper}>
        {cMenu()}
      </View>
    );
  }
}
export default TopMenu;
