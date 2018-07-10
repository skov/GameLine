import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import { styles } from '../styles';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import TopMenu from '../components/TopMenu';

class ThrowSelector extends Component {
  constructor(props){
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  async handlePress(sel){
      Actions.attemptOutcome({
        homeOpp:this.props.homeOpp,
        season: this.props.season,
        team:this.props.team,
        game:this.props.game,
        player:this.props.player,
        action:this.props.action,
        minutes:this.props.minutes,
        seconds:this.props.seconds,
        selector:sel,
        complexity: this.props.complexity,
        half: this.props.half,
      });
  }

  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
        <TopMenu backButton={'true'} title={"THROW SELECTOR"}/>
        <View style={styles.viewMain}>
          <View style={styles.statsView}>
            <View style={styles.throwSelector1B}>
              <View style={styles.throwSelector2B}>
                <View style={styles.throwSelector3B}>
                </View>
                <View style={styles.horizontalView}>
                  <TouchableOpacity style={styles.selector3B} onPress={() => { this.handlePress(1) }}>
                    <Text style={styles.throwPositionText}>1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selector2B} onPress={() => { this.handlePress(2) }}>
                    <Text style={styles.throwPositionText}>2</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selector1B} onPress={() => { this.handlePress(3) }}>
                    <Text style={styles.throwPositionText}>3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selector2B} onPress={() => { this.handlePress(4) }}>
                    <Text style={styles.throwPositionText}>4</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selector3B} onPress={() => { this.handlePress(5) }}>
                    <Text style={styles.throwPositionText}>5</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.horizontalView}>
                <TouchableOpacity style={styles.selector5B} onPress={() => { this.handlePress(6) }}>
                  <Text style={styles.throwPositionText}>6</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.selector4B} onPress={() => { this.handlePress(7) }}>
                  <Text style={styles.throwPositionText}>7</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.selector5B} onPress={() => { this.handlePress(8) }}>
                  <Text style={styles.throwPositionText}>8</Text>
                </TouchableOpacity>
              </View>

            </View>
            <TouchableOpacity style={styles.buttonTransparentSmall} onPress={() => { this.handlePress("Penalty Shot") }}>
              <Text style={styles.buttonTextWhite}>Penalty Shot</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonOrangeSmall} onPress={() => { this.handlePress("Counter Attack") }}>
              <Text style={styles.buttonTextWhite}>Counter Attack</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
    );
  }
}

export default ThrowSelector;
