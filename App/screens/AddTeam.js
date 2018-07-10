import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
  StatusBar,
  TextInput,
  AsyncStorage,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import _ from 'lodash';
import { styles } from '../styles';
import { Actions } from 'react-native-router-flux';
import Search from 'react-native-search-box';
import * as firebase from 'firebase';
import { firebaseRef } from '../firebase';
import Database from '../database';
import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';


const storage = firebaseRef.storage()


const Blob = RNFetchBlob.polyfill.Blob
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const uploadImage = (uri, mime = 'application/octet-stream') => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      const sessionId = new Date().getTime()
      let uploadBlob = null
      const imageRef = storage.ref('images').child(`${sessionId}`)

      fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

class AddTeam extends Component {
  constructor(props){
    super(props);
    this.state = {
      homeOpp:'',
      team : '',
      ageStart : '',
      ageEnd : '',
      uid:'',
      uploadURL: ''
    }
    this._teamRegistered = this._teamRegistered.bind(this)
  }
  async componentWillMount(){
    let user = await firebaseRef.auth().currentUser;
    this.setState({
     homeOpp: this.props.homeOpp,
     uid:user.uid,
    })
    console.log(storage)
  }
  async _teamRegistered() {
    if (this.state.team == ''){
      Alert.alert(
        'Empty team name',
        'Please provide a team name.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        { cancelable: false }
      )
    } else if (this.state.ageStart == '' || this.state.ageEnd == ''){
      Alert.alert(
        'Invalid Ages',
        'Please provide an appropriate Age Start & Age End.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        { cancelable: false }
      )
    } else if (Number(this.state.ageStart) > Number(this.state.ageEnd)){
      Alert.alert(
        'Invalid Ages',
        'Starting age can not be lower than end age.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        { cancelable: false }
      )
    } else {
      try {
        var names = [];
        Database.checkTeamName(this.state.uid, this.props.homeOpp, this.state.team, (callback)=>{
          names = [...callback];
        });
        var flag = false;
        for (i=0;i < names.length; i++){
          if (names[i]._key == this.state.team && names[i].deleted != true){
            flag = true;
          }
        }
        if (flag == true){
          Alert.alert(
            'TEAM NAME TAKEN',
            'This team already exists. Please choose another name.',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            { cancelable: false }
          )
        } else {
          Database.addTeam(this.state.uid, this.props.homeOpp, this.state.team, this.state.ageStart, this.state.ageEnd);
          Actions.pop();
          Actions.refresh({key: Math.random()})
        }
      } catch (error) { console.log(error) }
    }
  }

  _pickImage() {
    this.setState({ uploadURL: '' })

    ImagePicker.launchImageLibrary({}, response  => {
      uploadImage(response.uri)
        .then(url => this.setState({ uploadURL: url }))
        .catch(error => console.log(error))
    })
  }

  render() {
    var cPreGame = function() {
      if (this.props.preGame == true) {
        return <BottomMenu activeTab={'index'}/>;
      } else {
        return <BottomMenu activeTab={this.props.homeOpp}/>;
      }
    }.bind(this);
    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
        <TopMenu backButton={'true'} title={'ADD TEAM'}/>
          <View style={styles.viewMain}>
            <KeyboardAvoidingView behavior="position" style={{padding:10}}>
            <View style={styles.paddedBox}>
              <View style={styles.borderViewBig}>
              {
                (() => {
                  switch (this.state.uploadURL) {
                    case null:
                      return null
                    case '':
                      return <ActivityIndicator />
                    default:
                      return (
                        <View>
                          <Image
                            source={{ uri: this.state.uploadURL }}
                            style={ styles.image }
                          />
                        </View>
                      )
                  }
                })()
              }
                <TouchableOpacity onPress={ () => this._pickImage() }>
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
                  onChangeText={ (text)=> this.setState({team: text}) }
                  style={styles.input}
                  placeholder="Team name"
                  placeholderTextColor="rgba(255,255,255,0.8)"
                  selectionColor="#ffffff"></TextInput>
                <View style={styles.horizontalView}>
                  <TextInput
                    underlineColorAndroid="transparent"
                    blurOnSubmit={true}
                    autoFocus={false}
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    returnKeyType="next"
                    onChangeText={ (text)=> this.setState({ageStart: text}) }
                    style={styles.numberPicker}
                    placeholder="Age Start"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    selectionColor="#ffffff"></TextInput>
                  <TextInput
                    underlineColorAndroid="transparent"
                    blurOnSubmit={true}
                    autoFocus={false}
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    returnKeyType="next"
                    onChangeText={ (text)=> this.setState({ageEnd: text}) }
                    style={styles.numberPicker}
                    placeholder="Age End"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    selectionColor="#ffffff"></TextInput>
                </View>
              <TouchableOpacity onPress={this._teamRegistered} style={styles.buttonOrange}>
                <Text style={styles.buttonTextWhite}>
                  Add Team
                </Text>
              </TouchableOpacity>

            </KeyboardAvoidingView>

          </View>
          {cPreGame()}
      </ImageBackground>
    );
  }
}
export default AddTeam;
