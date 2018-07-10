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
  StatusBar,
  Alert
} from 'react-native';
import _ from 'lodash';
import { styles } from './styles';
import * as firebase from 'firebase';
import { firebaseRef } from './firebase';
import { Actions } from 'react-native-router-flux';



class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email: "",
        password: "",
        response: ""
    };
    this._login = this._login.bind(this)
    this._register = this._register.bind(this)
  }

  async _login() {
    try {
        await firebaseRef.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
        this.setState({
            response: "Logged In!"
        });
        setTimeout(() => {
            Actions.home();
        }, 0);
    } catch (error) {
        this.setState({
            response: error.toString()
        })
        alert(this.state.response);
    }
  }

  _register(){
    Actions.register()
  }

  render() {
    return (
      <ImageBackground source={require('./images/background.jpg')} style={styles.container}>
        <KeyboardAvoidingView
        behavior="position"
        style={{padding:20}}>
          <Image source={require('./images/game-line.png')} style={styles.name2}></Image>
          <Image source={require('./images/logo.png')} style={styles.logo2}></Image>
          <Text style={styles.heading}>
            Login or Register
          </Text>
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
            onChangeText={ (text)=> this.setState({password: text}) }
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="go"
            placeholder="password"
            placeholderTextColor="rgba(255,255,255,0.8)"
            secureTextEntry={true}
            selectionColor="#ffffff"
            >
          </TextInput>
          <View style={{marginTop:10}}>
          <TouchableOpacity
          onPress={this._login}
          style={styles.buttonOrange}
          >
            <Text style={styles.buttonTextWhite}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={this._register}
          style={styles.buttonTransparent}
          >
            <Text style={styles.buttonTextWhite}>
              Register
            </Text>
          </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

export default Login;
