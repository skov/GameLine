import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { styles } from '../styles';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import { firebaseRef } from '../firebase';
import Database from '../database';
import { SegmentedControls } from 'react-native-radio-buttons';
import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';

class Home extends Component {
  constructor(props) {
      super(props);
      this.state = {
          uid: "",
          name: "",
          email: "",
          value1: false,
          value2: false,
          complexity:2,
      };
      this._edit = this._edit.bind(this)
      this._logout = this._logout.bind(this)
      this._chooseLevel = this._chooseLevel.bind(this)
  }

_chooseLevel(){
  Actions.chooseHomeTeam();
};

_edit(){
  Actions.editProfile()
}
_profile(){
  Actions.profile()
};

async _logout() {
    try {
        await firebaseRef.auth().signOut();
        Actions.login()
    } catch (error) {
        console.log(error);
    }
}

  async componentWillMount() {
      try {
          // Get User Credentials
          let user = await firebaseRef.auth().currentUser;

          // Listen for Mobile Changes
          Database.listenUserName(user.uid, (userName) => {
              this.setState({
                  name: userName,
              });
          });
          Database.listenUserEmail(user.uid, (userEmail) => {
              this.setState({
                  email: userEmail,
              });
          });
          this.setState({
              uid: user.uid
          });

      } catch (error) {
          console.log(error);
      }
  }
  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
      <TopMenu backButton={'false'} title={'HOME'}/>
      <View style={styles.viewMain}>
          <Image source={require('../images/game-line.png')} style={styles.name}></Image>
          <View style={styles.box1}>
              <View style={styles.borderView1}>
                <Image source={require('../images/user.png')} style={styles.profile}></Image>
              </View>
            <Text style={styles.textSize16}>{this.state.name}</Text>
            <Text style={styles.textSize14}>{this.state.email}</Text>
          </View>
          <TouchableOpacity onPress={this._chooseLevel} style={styles.buttonOrange}>
            <Text style={styles.buttonTextWhite}>
              New Game
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{Actions.teams({homeOpp:'home'})}} style={styles.buttonTransparent}>
            <Text style={styles.buttonTextWhite}>
              My Teams
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{Actions.teams({homeOpp:'opp'})}} style={styles.buttonTransparent}>
            <Text style={styles.buttonTextWhite}>
              Opponent Teams
            </Text>
          </TouchableOpacity>


          <View style={styles.horizontalSpacedView}>
            <TouchableOpacity
            onPress={this._edit}
            style={styles.buttonTransparentXSmall}
            >
              <Text style={styles.buttonTextWhite}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={this._logout}
            style={styles.buttonOrangeXSmall}
            >
              <Text style={styles.buttonTextWhite}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <BottomMenu activeTab={'index'}/>
      </ImageBackground>
    );
  }
}

export default Home;
