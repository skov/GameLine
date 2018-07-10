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
  AsyncStorage,
} from 'react-native';
import _ from 'lodash';
import { styles } from '../styles';
import { Actions } from 'react-native-router-flux';
import Search from 'react-native-search-box';
import { firebaseRef } from '../firebase';
import Database from '../database';
import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';

class Teams extends Component {
  constructor(props){
    super(props);
    this.state = {
      title:'',
      data:[],
    }
  }

  async componentWillMount(){
     try {
       let user = await firebaseRef.auth().currentUser;
       var dataL = [];
       Database.listenTeams(user.uid, this.props.homeOpp, (dataList) => {
        dataL = dataList;
       });
       for (i = 0; i < dataL.length; i++){
         if (dataL[i].deleted == true){
           dataL.splice(i, 1);
         }
       }
       this.setState({
         data: dataL,
         uid: user.uid,
       });
     } catch (error) {}
  }

  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
        <TopMenu backButton={'false'} title={this.props.homeOpp == 'home' ? 'MY TEAMS' : 'OPPONENT TEAMS'}/>
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
              ListEmptyComponent={<Text style={styles.emptyListText}>No teams registered.</Text>}
              data={this.state.data}
              renderItem={({item}) =>
              <TouchableOpacity
              style={styles.list}
              onPress={() => {

                Actions.Team({ team: item._key, homeOpp:this.props.homeOpp})
              }}>
                <Text style={styles.listItem2}>{item.team}</Text>
                <TouchableOpacity
                style={styles.listButtonBlack}
                onPress={() => { Actions.editTeam({ team: item._key, homeOpp:this.props.homeOpp}) }}>
                  <Text style={styles.listButtonTextBlack}>Edit</Text>
                </TouchableOpacity>
              </TouchableOpacity>}
            />
          <TouchableOpacity onPress={()=>{Actions.addTeam({ homeOpp: this.props.homeOpp })}} style={styles.buttonOrangeSmall}>
           <Text style={styles.buttonTextWhite}>
             Add Team
           </Text>
         </TouchableOpacity>
        </View>
        <BottomMenu activeTab={this.props.homeOpp}/>
      </ImageBackground>
    );
  }
}

export default Teams;
