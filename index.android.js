import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import App from "./App/App"

export default class GameLine extends Component{
    render() {
      return (
        <App />
      );
    }
  }

AppRegistry.registerComponent('GameLine', () => GameLine);
