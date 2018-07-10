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
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import { styles } from './styles';
import * as firebase from 'firebase';
import { firebaseRef } from './firebase';
import Database from './database';

class Register extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      name:'',
      password: '',
      confPassword:'',
      response:'',
    }
    this._register = this._register.bind(this)
    this._login = this._login.bind(this)
  }
  async _register() {
       try {
           await firebaseRef.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
           this.setState({
               response: "account created",
           });
           let user = await firebaseRef.auth().currentUser;
           Database.setUserName(user.uid, this.state.name, this.state.email);
           setTimeout(() => {
               Actions.home();
           }, 1500);
       } catch (error) {
           this.setState({
               response: error.toString()
           })
           alert(this.state.response);
       }
   }

  _login() {
      Actions.login();
  }

  render() {
    return (
      <ImageBackground source={require('./images/background.jpg')} style={styles.container}>
        <KeyboardAvoidingView
        behavior="position"
        style={{padding:10}
      }
        >
          <Image source={require('./images/game-line.png')} style={styles.name}></Image>
          <Image source={require('./images/logo.png')} style={styles.logo}></Image>
          <Text style={styles.heading}>
            Register Account
          </Text>
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
          <TextInput
            underlineColorAndroid="transparent"
            onChangeText={ (text)=> this.setState({password: text}) }
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="next"
            placeholder="password"
            placeholderTextColor="rgba(255,255,255,0.8)"
            secureTextEntry={true}
            selectionColor="#ffffff"
            >
          </TextInput>
          <TextInput
            underlineColorAndroid="transparent"
            onChangeText={ (text)=> this.setState({confPassword: text}) }
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="go"
            placeholder="confirm password"
            placeholderTextColor="rgba(255,255,255,0.8)"
            secureTextEntry={true}
            selectionColor="#ffffff"
            >
          </TextInput>
          <View style={{marginTop:10}}>
            <TouchableOpacity onPress={this._register} style={styles.buttonOrange}>
              <Text style={styles.buttonTextWhite}>
                Register
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._login} >
              <View style={styles.containedText}>
              <Text style={styles.textSize12}>
                Already have an account? Login here.
              </Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}
export default Register;
