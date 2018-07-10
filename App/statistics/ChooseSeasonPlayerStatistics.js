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

class ChooseSeasonPlayerStatistics extends Component {
  constructor(props){
    super(props);
    this.state = {
      team: '',
    }
  }

  async componentWillMount() {
    this.setState({
      team: this.props.team,
      homeOpp:this.props.homeOpp,
    });
    try {
        let user = await firebaseRef.auth().currentUser;
        Database.listenAllSeasons(user.uid, this.props.team, this.props.homeOpp, (dataList) => {
          this.setState({
            data: dataList,
          });
        });
    } catch (error) {
        console.log(error);
    }
  }

  // Important: You must return a Promise
  beforeFocus = () => {
      return new Promise((resolve, reject) => {
          console.log('beforeFocus');
          resolve();
      });
  }

  // Important: You must return a Promise
  onFocus = (text) => {
      return new Promise((resolve, reject) => {
          console.log('onFocus', text);
          resolve();
      });
  }

  // Important: You must return a Promise
  afterFocus = () => {
      return new Promise((resolve, reject) => {
          console.log('afterFocus');
          resolve();
      });
  }
  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'true'} title={'CHOOSE SEASON'}/>
        <View style={styles.viewMain}>
        <View style={styles.searchContainer}>
          <Search
            ref="search_box"
            backgroundColor="rgba(0,0,0,0)"
            placeholderTextColor="#b7602f"
            tintColorSearch="#b7602f"
          />
        </View>
        <FlatList
        keyExtractor = {(item) => item._key}
        style={styles.flatList}
        ListEmptyComponent={<Text style={styles.emptyListText2}>No seasons registered.</Text>}
        data={this.state.data}
        renderItem={({item}) =>
          <TouchableOpacity style={styles.list}
          onPress={()=>{
            Actions.seasonPlayerStatistics({
              team: this.props.team,
              season: item._key,
              homeOpp:this.props.homeOpp,
              player:this.props.player,
            });
          }}>
          <View style={styles.verticalView}>
          <Text style={styles.listItem3}>{item.season}</Text>
          <Text style={styles.listItem4}>{item.dateStart} / {item.dateEnd}</Text>
          </View>
          </TouchableOpacity>}
        />
        </View>
        <TouchableOpacity onPress={()=> {
          Actions.addSeason({team: this.props.team})
        }} style={styles.buttonOrange}>
          <Text style={styles.buttonTextWhite}>
            Add Season
          </Text>
        </TouchableOpacity>
        <BottomMenu activeTab={this.state.homeOpp}/>
      </ImageBackground>
    );
  }
}
export default ChooseSeasonPlayerStatistics;
