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
  Button,
  Alert,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import { styles } from '../styles';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import { firebaseRef } from '../firebase';
import Database from '../database';

class Game extends Component {

  constructor(props){
    super(props);
    this.state = {
      timer: null,
      minutes: '00',
      seconds: '00',
      gamePaused: false,
      uid:'',
      h1mins:'',
      h1secs:'',
      h2mins:'',
      h2secs:'',
      exmins:'',
      exsecs:'',
      half:'First Half',
      homeData:[],
      oppData:[],
      players:[],
      oppPlayers:[],
      penaltyMin:0,
      penaltySec:0,
    }
    this._onUndo = this._onUndo.bind(this);
    this.onSubstitution = this.onSubstitution.bind(this);
    this.onPenalty = this.onPenalty.bind(this);
    this.onTechError = this.onTechError.bind(this);
    this.onThrowSelector = this.onThrowSelector.bind(this);
    this.onByWho = this.onByWho.bind(this);
    this.onButtonPause = this.onButtonPause.bind(this);
    this.onButtonEnd = this.onButtonEnd.bind(this);
    this.start = this.start.bind(this);
    this.endGame = this.endGame.bind(this);
    this.onStart2ndHalf = this.onStart2ndHalf.bind(this);
    this._checkBlacklists = this._checkBlacklists.bind(this);
  }

  async componentWillMount(){
     this.setState({
       game:this.props.game,
     });
     try {
      let user = await firebaseRef.auth().currentUser;
      Database.listenGame(user.uid, this.props.team, this.props.season, this.props.game, "home", (data, players) => {
        this.setState({
          uid:user.uid,
          players:players,
          homeData:data,
        });
      });

      Database.listenGame(user.uid, this.props.oppTeam, this.props.season, this.props.game, "opp", (oppData, oppPlayers) => {
        this.setState({
          oppData:oppData,
        });
        if (oppData.complexity == 1){
          this.setState({
            oppPlayers:oppPlayers,
          });
        }
      });
     } catch (error) { }
  }

  async componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  start() {
        var self = this;
        let timer = setInterval(() => {
            var num = (Number(this.state.seconds) + 1).toString(),
                count = this.state.minutes;

            if ( Number(this.state.seconds) == 59 ) {
                count = (Number(this.state.minutes) + 1).toString();
                num = '00';
            }
            self.setState({
                minutes: count.length == 1 ? '0'+ count : count + '',
                seconds: num.length == 1 ? '0'+ num : num + '',
            });
        }, 1000);
        this.setState({timer});
    }

    _checkBlacklists(){
      console.log("...")
    }

    onButtonPause() {
      if (this.state.half == 'First Half'){
        Alert.alert(
          'START HALF TIME',
          'Are you sure?',
          [
            {text: 'START', onPress: () =>this.onStart2ndHalf()},
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
          )
      } else if (this.state.half == 'Half Time'){
        this.setState({
          minutes: '00',
          seconds: '00',
          gamePaused:false,
          timer: null,
          half:'Second Half',
        });
        this.start();
      } else if (this.state.half == 'Second Half'){
        clearInterval(this.state.timer);
        Database.add2HalfTime(this.state.uid, this.props.team, this.props.season, this.state.homeData._key, this.state.minutes, this.state.seconds);
        this.setState({
          h2mins:this.state.minutes,
          h2secs:this.state.seconds,
          gamePaused:true,
          half:'Pre-Extra Time',
        });
      } else if (this.state.half == 'Pre-Extra Time'){
        this.setState({
          minutes: '00',
          seconds: '00',
          gamePaused:false,
          timer: null,
          half:'Extra Time',
        });
        this.start();
      }
    }

    async onButtonEnd() {
      Alert.alert(
        'END GAME',
        'Are you sure?',
        [
          {text: 'END GAME', onPress: () =>this.endGame()},
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        ],
        { cancelable: false }
        )
    }

    async onStart2ndHalf() {
      clearInterval(this.state.timer);
      Database.add1HalfTime(this.state.uid, this.props.team, this.props.season, this.state.homeData._key, this.state.minutes, this.state.seconds);
      this.setState({
        h1mins:this.state.minutes,
        h1secs:this.state.seconds,
        gamePaused:true,
        half:'Half Time',
      });
    }

    async endGame(){
      try {
        let user = await firebaseRef.auth().currentUser;
        if (this.state.half == 'Second Half' || this.state.half == 'Pre-Extra Time' ){
          clearInterval(this.state.timer);
          Database.add2HalfTime(this.state.uid, this.props.team, this.props.season, this.state.homeData._key, this.state.minutes, this.state.seconds);
          Database.addExtraHalfTime(this.state.uid, this.props.team, this.props.season, this.state.homeData._key, '00', '00');
          Database.addOppTeamTimers(this.state.uid, this.props.oppTeam, this.props.season, this.state.homeData._key, this.state.h1mins, this.state.h1secs, this.state.minutes, this.state.seconds, '00', '00');
        } else if (this.state.half == 'Extra Time'){
          clearInterval(this.state.timer);
          Database.addExtraHalfTime(this.state.uid, this.props.team, this.props.season, this.state.homeData._key, this.state.minutes, this.state.seconds);
          Database.addOppTeamTimers(this.state.uid, this.props.oppTeam, this.props.season, this.state.homeData._key, this.state.h1mins, this.state.h1secs, this.state.h2mins, this.state.h2secs, this.state.minutes, this.state.minutes);
        }
        Database.addOppTeamScore(this.state.uid, this.props.team, this.props.season, this.state.homeData._key, 'home', this.state.oppData.score);
        Database.addOppTeamScore(this.state.uid, this.props.oppTeam, this.props.season, this.state.homeData._key, 'opp', this.state.homeData.score);
        Actions.gameStatistics({game:this.props.game, team:this.props.team, season:this.props.season, homeOpp:'home', back:false, backTo:true});
      } catch (error) { console.log(error)}
    }

    async _onUndo(homeOpp) {
      var team = homeOpp == 'home' ? this.props.team : this.props.oppTeam;
      await Actions.undo({
        team: team,
        game: this.props.game,
        complexity: this.state.homeData.complexity,
        season: this.props.season,
        homeOpp: homeOpp,
        half: this.state.half,
      })
    }

    async onSubstitution(homeOpp) {
      var team = homeOpp == 'home' ? this.props.team : this.props.oppTeam;
      var players = homeOpp == 'home' ? this.state.players : this.state.oppPlayers;
      Actions.substitution({
        minutes:this.state.minutes,
        seconds:this.state.seconds,
        players: players,
        team: team,
        season: this.props.season,
        game:this.props.game,
        homeOpp: homeOpp,
        complexity: this.state.homeData.complexity,
        action:'substitution',
        half: this.state.half,
      })
    }

    async onPenalty(homeOpp) {
      var team = homeOpp == 'home' ? this.props.team : this.props.oppTeam;
      var players = homeOpp == 'home' ? this.state.players : this.state.oppPlayers;
      Actions.penalty({
        players:players,
        minutes:this.state.minutes,
        seconds:this.state.seconds,
        team: team,
        season: this.props.season,
        game: this.props.game,
        action:'penalty',
        homeOpp: homeOpp,
        complexity: this.state.homeData.complexity,
        half: this.state.half,
      })
    }

    async onTechError(homeOpp) {
      var team = homeOpp == 'home' ? this.props.team : this.props.oppTeam;
      Actions.techError({
        minutes:this.state.minutes,
        seconds:this.state.seconds,
        team: team,
        season: this.props.season,
        game: this.props.game,
        homeOpp: homeOpp,
        action:'techError',
        complexity: this.state.homeData.complexity,
        half: this.state.half,
      })
    }

    async onThrowSelector(homeOpp) {
      var team = homeOpp == 'home' ? this.props.team : this.props.oppTeam;
      var players = homeOpp == 'home' ? this.state.players : this.state.oppPlayers;
      Actions.throwSelector({
        minutes:this.state.minutes,
        seconds:this.state.seconds,
        team: team,
        season: this.props.season,
        action:'attempt',
        game:this.props.game,
        homeOpp: homeOpp,
        complexity:this.state.homeData.complexity,
        half: this.state.half,
      })
    }
    async onByWho(homeOpp, action) {
      var team = homeOpp == 'home' ? this.props.team : this.props.oppTeam;
      var players = homeOpp == 'home' ? this.state.players : this.state.oppPlayers;
      Actions.byWho({
        minutes:this.state.minutes,
        seconds:this.state.seconds,
        players: players,
        team: team,
        season: this.props.season,
        game:this.props.game,
        homeOpp: homeOpp,
        action: action,
        complexity: this.state.homeData.complexity,
        half: this.state.half,
      })
    }

  render() {
        var cComplexity = function() {
          if (this.state.homeData.complexity == 1){
            return <View  style={styles.viewMain}>
                        <TouchableOpacity
                          style={styles.gamebtn}
                          onPress={() => { this.onByWho('opp', 'attempt')}}>
                          <Image source={require('../images/attempt.png')} style={styles.gamebtnIcon} />
                          <Text style={styles.gamebtnText}>Attempt</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={styles.gamebtn}
                        onPress={() => { this.onByWho('opp', 'techError') }}>
                          <Image source={require('../images/techError.png')} style={styles.gamebtnIcon} />
                          <Text style={styles.gamebtnText}>TechError</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={styles.gamebtn}
                        onPress={() => { this.onByWho('opp', 'penalty') }}>
                          <Image source={require('../images/penalty.png')} style={styles.gamebtnIcon} />
                          <Text style={styles.gamebtnText}>Penalty</Text>
                        </TouchableOpacity>
                          <TouchableOpacity
                          style={styles.gamebtn}
                          onPress={() => { this.onSubstitution('opp') }}>
                            <Image source={require('../images/substitution.png')} style={styles.gamebtnIcon} />
                            <Text style={styles.gamebtnText}>Substitution</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                          onPress={() =>{ this._onUndo('opp') }}
                          style={styles.undoButton}>
                            <Text>UNDO</Text>
                          </TouchableOpacity>
                        </View>;
          } else {
            return <View  style={styles.viewMain}>
                        <TouchableOpacity
                          style={styles.gamebtn}
                          onPress={() => {this.onThrowSelector('opp')}}>
                          <Image source={require('../images/attempt.png')} style={styles.gamebtnIcon} />
                          <Text style={styles.gamebtnText}>Attempt</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={styles.gamebtn}
                        onPress={() => { this.onTechError('opp') }}>
                          <Image source={require('../images/techError.png')} style={styles.gamebtnIcon} />
                          <Text style={styles.gamebtnText}>TechError</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={styles.gamebtn}
                        onPress={() => { this.onPenalty('opp') }}>
                          <Image source={require('../images/penalty.png')} style={styles.gamebtnIcon} />
                          <Text style={styles.gamebtnText}>Penalty</Text>
                        </TouchableOpacity>
                          <TouchableOpacity
                          style={styles.gamebtnTrans}>
                          </TouchableOpacity>
                          <TouchableOpacity
                          onPress={() =>{ this._onUndo('opp') }}
                          style={styles.undoButton}>
                            <Text>UNDO</Text>
                          </TouchableOpacity>
                        </View>;
          }
        }.bind(this);

        var cHalfTime = function() {
          if (this.state.half == 'First Half') {
            return <View style={styles.viewGameBottom}>
            <TouchableOpacity
            disabled={this.state.stopDisabled}
            onPress={this.onButtonPause}
            accessibilityLabel="Stop"
            style={styles.buttonTransparent}>
              <Text style={styles.buttonTextWhite}>Half Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
            disabled={this.state.stopDisabled}
            accessibilityLabel="Stop"
            style={styles.buttonBlack}
            onPress={()=>{
              clearInterval(this.state.timer);
              this.setState({
                gamePaused:true,
              });
              Alert.alert(
                'TIME OUT',
                'Press to resume game.',
                [ {text: 'RESUME GAME', onPress: () => {
                  this.start();
                  this.setState({
                    gamePaused:false,
                  });
                }} ],
                { cancelable: false }
                )
              }}>
              <Text style={styles.buttonTextWhite}>Pause Game</Text>
            </TouchableOpacity>
            </View>;
          } else if (this.state.half == 'Half Time'){
            return <View style={styles.viewGameBottom}>
            <TouchableOpacity
            disabled={this.state.stopDisabled}
            onPress={this.onButtonPause}
            accessibilityLabel="Stop"
            style={styles.buttonTransparent}>
              <Text style={styles.buttonTextWhite}>Start 2nd Half</Text>
            </TouchableOpacity>
            </View>;
          } else if (this.state.half == 'Pre-Extra Time'){
            return <View style={styles.viewGameBottom}>
            <TouchableOpacity
            disabled={this.state.stopDisabled}
            onPress={this.onButtonPause}
            accessibilityLabel="Stop"
            style={styles.buttonTransparent}>
              <Text style={styles.buttonTextWhite}>Start Extra Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.buttonOrange}
            accessibilityLabel="Clear"
            onPress={this.onButtonEnd}>
              <Text style={styles.buttonTextWhite}>End Game</Text>
            </TouchableOpacity>
            </View>;
          } else if (this.state.half == 'Second Half'){
            return <View style={styles.viewGameBottom}>
              <TouchableOpacity
              disabled={this.state.stopDisabled}
              accessibilityLabel="Stop"
              style={styles.buttonTransparent}
              onPress={()=>{this.onButtonPause()}}>
                <Text style={styles.buttonTextWhite}>Extra Time</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.buttonOrange}
              accessibilityLabel="Clear"
              onPress={this.onButtonEnd}>
                <Text style={styles.buttonTextWhite}>End Game</Text>
              </TouchableOpacity>
              <TouchableOpacity
              disabled={this.state.stopDisabled}
              accessibilityLabel="Stop"
              style={styles.buttonBlack}
              onPress={()=>{
                clearInterval(this.state.timer);
                this.setState({
                  gamePaused:true,
                });
                Alert.alert(
                  'TIME OUT',
                  'Press OK to resume game.',
                  [ {text: 'OK', onPress: () => {
                    this.start();
                    this.setState({
                      gamePaused:false,
                    });
                  }} ],
                  { cancelable: false }
                  )
                }}>
                <Text style={styles.buttonTextWhite}>Time Out</Text>
              </TouchableOpacity>
            </View>;
          } else if (this.state.half == 'Extra Time'){
            return <View style={styles.viewGameBottom}>
            <TouchableOpacity
            style={styles.buttonOrange}
            accessibilityLabel="Clear"
            onPress={this.onButtonEnd}>
              <Text style={styles.buttonTextWhite}>End Game</Text>
            </TouchableOpacity>
            <TouchableOpacity
            disabled={this.state.stopDisabled}
            accessibilityLabel="Stop"
            style={styles.buttonBlack}
            onPress={()=>{
              clearInterval(this.state.timer);
              this.setState({
                gamePaused:true,
              });
              Alert.alert(
                'TIME OUT',
                'Press OK to resume game.',
                [ {text: 'OK', onPress: () => {
                  this.start();
                  this.setState({
                    gamePaused:false,
                  });
                }} ],
                { cancelable: false }
                )
              }}>
              <Text style={styles.buttonTextWhite}>Time Out</Text>
            </TouchableOpacity>
            </View>;
          }
        }.bind(this);

        var cPause = function() {
          if (this.state.gamePaused == false) {
            return <View style={styles.horizontalView}>
              <View  style={styles.viewMain}>
                <TouchableOpacity
                  style={styles.gamebtn}
                  onPress={() => { this.onByWho('home', 'attempt') }}>
                  <Image source={require('../images/attempt.png')} style={styles.gamebtnIcon} />
                  <Text style={styles.gamebtnText}>Attempt</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.gamebtn}
                onPress={() => { this.onByWho('home', 'techError') }}>
                  <Image source={require('../images/techError.png')} style={styles.gamebtnIcon} />
                  <Text style={styles.gamebtnText}>TechError</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.gamebtn}
                onPress={() => { this.onByWho('home', 'penalty') }}>
                  <Image source={require('../images/penalty.png')} style={styles.gamebtnIcon} />
                  <Text style={styles.gamebtnText}>Penalty</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.gamebtn}
                onPress={() => { this.onSubstitution('home') }}>
                  <Image source={require('../images/substitution.png')} style={styles.gamebtnIcon} />
                  <Text style={styles.gamebtnText}>Substitution</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() =>{ this._onUndo('home') }}
                style={styles.undoButton}>
                  <Text>UNDO</Text>
                </TouchableOpacity>
              </View>

            {cComplexity()}

            </View>;
          } else if (this.state.gamePaused == true){
            return <View  style={styles.viewMain}>
                <Text style={styles.textSize16a}> HALF TIME </Text>
              </View>;
          }
        }.bind(this);




    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
        <View style={styles.viewGame}>
          <View style={styles.gameTop}>
            <View style={styles.teamInfo}>
              <Image source={require('../images/user.png')} style={styles.picContainer} />
              <Text style={styles.textSize14}>{this.state.homeData.teamName}</Text>
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.heading}>{this.state.homeData.score} - {this.state.oppData.score}</Text>
              <Text style={styles.textSize14}> {this.state.minutes}:{this.state.seconds}</Text>
              <Text style={styles.textSize12Black}> {this.state.half} </Text>
            </View>
            <View style={styles.teamInfo}>
              <Image source={require('../images/user.png')} style={styles.picContainer} />
              <Text style={styles.textSize14}>{this.state.oppData.teamName}</Text>
            </View>
          </View>
          {cPause()}

          {cHalfTime()}


        </View>
      </ImageBackground>
    );
  }
}

export default Game;
