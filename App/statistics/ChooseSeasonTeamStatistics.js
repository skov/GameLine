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

class ChooseSeasonTeamStatistics extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  async componentWillMount() {
    this.setState({
      team: this.props.team,
      homeOpp:this.props.homeOpp,
    });
    try {
        let user = await firebaseRef.auth().currentUser;
        var d = [];
        Database.listenAllSeasons(user.uid, this.props.team, this.props.homeOpp, (dataList) => {
          d = [...dataList];
        });
        this.setState({
            data: d,
        });
    } catch (error) {
        console.log(error);
    }
  }

  componentWillReceiveProps(props){
    console.log('component: componentWillReceiveProps');
    console.log(props);
  }

  render() {
    var cEditSeason = function(s){
      if (this.props.homeOpp == "home"){
        return <TouchableOpacity
        style={styles.listButtonBlack}
        onPress={() => { Actions.editSeason({ team: this.props.team, season:s, homeOpp:this.props.homeOpp, from:"teamStats"}) }}>
          <Text style={styles.listButtonTextBlack}>Edit</Text>
        </TouchableOpacity>;
      } else {
        return ;
      }
    }.bind(this);

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
        ListEmptyComponent={<Text style={styles.emptyListText}>No seasons registered.</Text>}
        data={this.state.data}
        renderItem={({item}) =>
          <TouchableOpacity style={styles.list}
          onPress={()=>{
            Actions.seasonTeamStatistics({
              team: this.props.team,
              season: item._key,
              homeOpp:this.props.homeOpp,
            });
          }}>
          <View style={styles.verticalView}>
          <Text style={styles.listItem3}>{item.season}</Text>
          <Text style={styles.listItem4}>{item.dateStart} / {item.dateEnd}</Text>
          </View>
           {cEditSeason(item._key)}
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
export default ChooseSeasonTeamStatistics;
