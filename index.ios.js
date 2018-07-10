import React, {Component} from 'react';
import {AppRegistry, Text, Drawer,  View, StyleSheet, Image} from 'react-native';

import App from "./App/App"
console.disableYellowBox = true;

export default class GameLine extends Component{
  render() {
    return (
        <App />
    );
  }
}
AppRegistry.registerComponent("GameLine", () => GameLine);
