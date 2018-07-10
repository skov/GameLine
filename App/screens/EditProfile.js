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
  KeyboardAvoidingView,
  SegmentedControlIOS,
  Alert,
} from 'react-native';

import { styles } from '../styles';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import { firebaseRef } from '../firebase';
import Database from '../database';
import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';

class EditProfile extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: firebaseRef.auth().currentUser.email,
      name: firebaseRef.auth().currentUser.name,
      password: '',
      confPassword:'',
    }
    this._submit = this._submit.bind(this)
  }
  async _submit(){
    let user = await firebaseRef.auth().currentUser;
    Database.setUserName(user.uid, this.state.name, this.state.email);
    Actions.home();
  }
  _profile(){
    Actions.profile()
  };
  onAddPhotoPressed(){

  }
  _alertInfo(alertType){
    if (alertType == "Language"){
      Alert.alert(
        'Language Presets',
        'My Alert Msg',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        { cancelable: false }
      )
    }
  }

  render() {
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
        <TopMenu backButton={'true'} title={'EDIT TEAM'}/>
          <View style={styles.viewMain}>
          <KeyboardAvoidingView
          behavior="position"
          style={{padding:10}}>
          <View style={styles.paddedBox}>
            <View style={styles.borderViewBig}>
              <TouchableOpacity>
              <Image source={require('../images/user.png')} style={styles.profileBig}></Image>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.textSize14}>Click on picture to change avatar.</Text>
            <TextInput
              underlineColorAndroid="transparent"
              blurOnSubmit={true}
              autoFocus={false}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              onChangeText={ (text)=> this.setState({name: text}) }
              style={styles.input}
              placeholder="name"
              placeholderTextColor="rgba(255,255,255,0.8)"
              selectionColor="#ffffff"
              >
            </TextInput>
            <TextInput
              underlineColorAndroid="transparent"
              blurOnSubmit={true}
              autoFocus={false}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              onChangeText={ (text)=> this.setState({email: text}) }
              style={styles.input}
              placeholder="email"
              placeholderTextColor="rgba(255,255,255,0.8)"
              selectionColor="#ffffff"
              >
            </TextInput>
          <View style={styles.box3}>
          <View style={styles.verticalSpacedView2}>
          <View style={styles.horizontalView}>
          <Text style={styles.textSize16}>Choose Language:</Text>
          <TouchableOpacity
          onPress={()=>{this._alertInfo("Language")}}
          style={styles.infoBtn}>
            <Text style={styles.textSize14}>i</Text>
          </TouchableOpacity>
          </View>
            <SegmentedControlIOS
              values={['English','Danish','German','Spanish']}
              selectedIndex={0}
              tintColor={'#fff'}
              style={styles.controls}
              onChange={(event) => {
                this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
              }}/>
            </View>
            <TouchableOpacity onPress={this._submit} style={styles.buttonOrange} >
              <Text style={styles.buttonTextWhite}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
          </View>
          <BottomMenu activeTab={'home'}/>
      </ImageBackground>
    );
  }
}
export default EditProfile;
