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
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import { styles } from '../styles';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import { firebaseRef } from '../firebase';
import Database from '../database';
import BottomMenu from '../components/BottomMenu';
import TopMenu from '../components/TopMenu';


class GameStatistics extends Component {
  constructor(props){
    super(props);
    this.state = {
      homeGoals:0,
      homeSaves:0,
      homeBlocks:0,
      homeMisses:0,
      oppGoals:0,

      homeGoalAccuracy: 0,
      homeFailAccuracy: 0,
      homeBlockedAccuracy: 0,
      homeSavedAccuracy: 0,
      homeMissedAccuracy: 0,
      homeSavedAccuracy:0,


      throwSel:[0,0,0,0,0,0,0,0],
      throwSelGoals:[0,0,0,0,0,0,0,0],
      hitSel:[0,0,0,0,0,0,0,0,0],
      hitSelGoals:[0,0,0,0,0,0,0,0,0],

      OthrowSel:[0,0,0,0,0,0,0,0],
      OthrowSelGoals:[0,0,0,0,0,0,0,0],
      OhitSel:[0,0,0,0,0,0,0,0,0],
      OhitSelGoals:[0,0,0,0,0,0,0,0,0],

      gameData:[],
      oppGameData:[],
      homePlayers:[],
      title:'',

      penaltyActive: false,
      techErrorsActive: false,
      selectedHitSel: null,
    }
  }

  async componentWillMount(){
    this.setState({
      season:this.props.season,
      game:this.props.game,
      homeOpp:this.props.homeOpp,
    });

    try {
        let user = await firebaseRef.auth().currentUser;
        var act = {};
        var techE = {};
        var pen = {};
        var play = [];
        var gameD = {};
        Database.listenGameStats(user.uid, this.props.team, this.props.season, this.props.game, this.props.homeOpp, (d, p, a, pe, te) => {
            let totalSecs = Number(d.h1secs) + Number(d.h2secs) + Number(d.hEsecs);
            let totalMins = Number(d.h1mins) + Number(d.h2mins) + Number(d.hEmins);
            if (totalSecs >= 120){
              totalSecs = totalSecs - 120;
              totalMins = totalMins + 2;
            } else if (totalSecs >= 60){
              totalSecs = totalSecs - 60;
              totalMins = totalMins + 1;
            }
            totalSecs = totalSecs.toString().length == 1 ? '0'+ totalSecs : totalSecs.toString();
            totalMins = totalMins.toString().length == 1 ? '0'+ totalMins : totalMins.toString();
            d.totalSecs = totalSecs;
            d.totalMins = totalMins;
            act = {...a};
            techE = {...te};
            pen = {...pe};
            play = [...p];
            gameD = {...d};
        });

        this.setState({
          players:play,
          actions:act,
          techErrors:techE,
          penalties:pen,
          gameData:gameD,
        });
        var opponentVar = homeOpp == "home" ? "home" : "opp";
        var oppGameData = {}
        Database.listenGameStats(user.uid, this.state.gameData.oppTeamId, this.props.season, this.props.game, opponentVar, (d, p, a, pe, te) => {
          oppGameData = {...d}
        });
        this.setState({ oppGameData:oppGameData });

        var totalA = 0;

        var attemptsFHGoals = 0;
        var attemptsSHGoals = 0;
        var attemptsETGoals = 0;

        var attemptsFHBlocks = 0;
        var attemptsSHBlocks = 0;
        var attemptsETBlocks = 0;

        var attemptsFHSaves = 0;
        var attemptsSHSaves = 0;
        var attemptsETSaves = 0;

        var attemptsFHMisses = 0;
        var attemptsSHMisses = 0;
        var attemptsETMisses = 0;

        var hitSel = [...this.state.hitSel];
        var hitSelGoals = [...this.state.hitSelGoals];

        var throwSel = [...this.state.throwSel];
        var throwSelGoals =[...this.state.throwSelGoals];
        var penaltyShots = [];
        var counterAttacks = [];

        _.each(this.state.actions, function(userObject) {
          throwSel[userObject.throwSelector-1]++;
          hitSel[userObject.hitSelector-1]++;
          if (userObject.throwSelector == "Penalty Shot"){
            penaltyShots.push(userObject);
          }
          if (userObject.throwSelector == "Counter Attack"){
            counterAttacks.push(userObject);
          }
          if (userObject.outcome == 'goal'){
            throwSelGoals[userObject.throwSelector-1]++;
            hitSelGoals[userObject.hitSelector-1]++;
            if (userObject.half == 'First Half'){
              attemptsFHGoals +=1;
            } else if (userObject.half == 'Second Half'){
              attemptsSHGoals +=1;
            } else if (userObject.half == 'Extra Time'){
              attemptsETGoals +=1;
            }
          } else if (userObject.outcome == 'block'){
            if (userObject.half == 'First Half'){
              attemptsFHBlocks +=1;
            } else if (userObject.half == 'Second Half'){
              attemptsSHBlocks +=1;
            } else if (userObject.half == 'Extra Time'){
              attemptsETBlocks +=1;
            }

          } else if (userObject.outcome == 'save'){
            if (userObject.half == 'First Half'){
              attemptsFHSaves +=1;
            } else if (userObject.half == 'Second Half'){
              attemptsSHSaves +=1;
            } else if (userObject.half == 'Extra Time'){
              attemptsETSaves +=1;
            }
          } else if (userObject.outcome == 'miss'){
            if (userObject.half == 'First Half'){
              attemptsFHMisses +=1;
            } else if (userObject.half == 'Second Half'){
              attemptsSHMisses +=1;
            } else if (userObject.half == 'Extra Time'){
              attemptsETMisses +=1;
            }
          }
        });

        var penaltyShotsCount = penaltyShots.length;
        var counterAttacksCount = counterAttacks.length;

        var attemptsFH = attemptsFHGoals + attemptsFHBlocks + attemptsFHSaves + attemptsFHMisses;
        var attemptsSH = attemptsSHGoals + attemptsSHBlocks + attemptsSHSaves + attemptsSHMisses;
        var attemptsET = attemptsETGoals + attemptsETBlocks + attemptsETSaves + attemptsETMisses;

        var totalA = attemptsFH + attemptsSH + attemptsET;
        var totalGoals = attemptsFHGoals + attemptsSHGoals + attemptsETGoals;
        var totalSaves = attemptsFHSaves + attemptsSHSaves + attemptsETSaves;
        var totalMisses = attemptsFHMisses + attemptsSHMisses + attemptsETMisses;
        var totalBlocks = attemptsFHBlocks + attemptsSHBlocks + attemptsETBlocks;

        var totalPenalties = 0;
        var yelPenalty = redPenalty = tmPenalty = 0;

        var totalPenalties = 0;
        _.each(this.state.penalties, function(userObject, i) {
          if (userObject.penaltyType == "Yellow"){
            yelPenalty+=1;
          } else if (userObject.penaltyType == "TwoMin"){
            tmPenalty+=1;
          } else if (userObject.penaltyType == "Red"){
            redPenalty+=1;
          }
          totalPenalties++;
        });

        var totalTechErrors = 0;
        var ddError = peError = ceError = tmsError =  oeError = lcError = ffError = 0;

        _.each(this.state.techErrors, function(userObject, i) {
          if (userObject.errorType == "DoubleDribble"){
            ddError+=1;
          } else if (userObject.errorType == "PassingError"){
            peError+=1;
          } else if (userObject.errorType == "CatchError"){
            ceError+=1;
          } else if (userObject.errorType == "TooManySteps"){
            tmsError+=1;
          } else if (userObject.errorType == "OffensiveError"){
            oeError+=1;
          } else if (userObject.errorType == "LineCrossed"){
            lcError+=1;
          } else if (userObject.errorType == "FootFault"){
            ffError+=1;
          }
          totalTechErrors+=1;
        });

        var homeOpp = this.props.homeOpp;


        this.setState({
          penaltyShots:penaltyShots,
          counterAttacks:counterAttacks,
          penaltyShotsCount:penaltyShotsCount,
          counterAttacksCount:counterAttacksCount,

          yelPenalty:yelPenalty,
          redPenalty:redPenalty,
          tmPenalty:tmPenalty,

          ddError:ddError,
          peError:peError,
          ceError:ceError,
          tmsError:tmsError,
          oeError:oeError,
          lcError:lcError,
          ffError:ffError,

          totalTechErrors:totalTechErrors,
          totalPenalties:totalPenalties,

          totalAttempts : totalA,
          totalGoals : totalGoals,
          totalSaves : totalSaves,
          totalMisses : totalMisses,
          totalBlocks : totalBlocks,

          attemptsFH: attemptsFH,
          attemptsSH: attemptsSH,
          attemptsET: attemptsET,

          attemptsFHGoals : attemptsFHGoals,
          attemptsSHGoals : attemptsSHGoals,
          attemptsETGoals : attemptsETGoals,

          attemptsFHBlocks : attemptsFHBlocks,
          attemptsSHBlocks : attemptsSHBlocks,
          attemptsETBlocks : attemptsETBlocks,

          attemptsFHSaves : attemptsFHSaves,
          attemptsSHSaves : attemptsSHSaves,
          attemptsETSaves : attemptsETSaves,

          attemptsFHMisses : attemptsFHMisses,
          attemptsSHMisses : attemptsSHMisses,
          attemptsETMisses : attemptsETMisses,

          throwSel:throwSel,
          throwSelGoals:throwSelGoals,
          hitSel:hitSel,
          hitSelGoals:hitSelGoals,

          selectedHitSel:null,
        })
    } catch (error) { console.log(error) }
  }

  render() {
    var cBack = function() {
      if (this.props.back == true) {
        return <View style={styles.leftNav}>
          <TouchableOpacity onPress={() => {Actions.pop()}}>
            <Image source={require('../images/back.png')} style={styles.topNavLeft}></Image>
            <Text style={styles.barText}>Back</Text>
          </TouchableOpacity>
        </View>;
      } else if (this.props.backTo == true){
        return <View style={styles.leftNav}>
          <TouchableOpacity onPress={() => {Actions.popTo('home')}}>
            <Image source={require('../images/back.png')} style={styles.topNavLeft}></Image>
            <Text style={styles.barText}>Back</Text>
          </TouchableOpacity>
        </View>;
      }else {
        return <View style={styles.leftNav}>
        </View>;
      }
    }.bind(this);

    var cOppStats = function() {
      if (this.props.homeOpp == 'home') {
        if (this.state.gameData.complexity != 0){
          return <View style={styles.teamInfo}>
          <TouchableOpacity
          onPress={() => {Actions.gameStatistics({
              team: this.state.gameData.oppTeamId,
              game: this.state.gameData._key,
              season: this.props.season,
              back: true,
              homeOpp:'opp',
            })}}>
            <Image source={require('../images/user.png')} style={styles.picContainer} />
            <Text style={styles.textSize14a}>{this.state.gameData.oppTeamName}</Text>
            </TouchableOpacity>
          </View>;
        } else {
          return <View style={styles.teamInfo}>
            <Image source={require('../images/user.png')} style={styles.picContainer} />
            <Text style={styles.textSize14a}>{this.state.gameData.oppTeamName}</Text>
          </View>;
        }
      } else {
        return <View style={styles.teamInfo}>
        <TouchableOpacity
        onPress={() => {Actions.gameStatistics({
            team: this.state.gameData.oppTeamId,
            game: this.state.gameData._key,
            season: this.props.season,
            back: true,
            homeOpp:'home',
          })}}>
          <Image source={require('../images/user.png')} style={styles.picContainer} />
          <Text style={styles.textSize14a}>{this.state.gameData.oppTeamName}</Text>
          </TouchableOpacity>
        </View>;
      }
    }.bind(this);

    var cExtraTime = function() {
      if (this.state.gameData.hEmins == '00' && this.state.gameData.hEsecs == '00') {
        return ;
      } else {
        return <View style={styles.verticalView}>
              <Text style={styles.headingSmall}>EXTRA TIME</Text>
              <Text style={styles.textSize10a}>{this.state.gameData.hEmins}:{this.state.gameData.hEsecs}</Text>
              <Text style={styles.textSize10a}>Success Rate: {(this.state.attemptsETGoals/this.state.attemptsET).toFixed(4) * 100}%</Text>
              <View style={styles.tableWrapper}>
                <View style={styles.table}>
                <Text style={styles.textSize10TableLeft}>Attempts</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsET}</Text>
                </View>
                <View style={styles.table}>
                <Text style={styles.textSize10TableLeft}>Goals</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsETGoals}</Text>
                </View>
                <View style={styles.table}>
                <Text style={styles.textSize10TableLeft}>Blocked</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsETBlocks}</Text>
                </View>
                <View style={styles.table}>
                <Text style={styles.textSize10TableLeft}>Missed</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsETMisses}</Text>
                </View>
                <View style={styles.tableLast}>
                <Text style={styles.textSize10TableLeft}>Saved</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsETSaves}</Text>
                </View>
              </View>
            </View>;
      }
    }.bind(this);

    var cPenaltyActive = function(){
      if (this.state.penaltyActive == false){
        return <TouchableOpacity style={styles.borderWhite}
          onPress={() => {this.setState({penaltyActive:true})
        }}>
          <Text style={styles.textSize12}> Click to view details. </Text>
        </TouchableOpacity>;
      } else if (this.state.penaltyActive == true){
        return <View>
        <View style={styles.tableHeading}>
        <Text style={styles.textSize10TableCenterA}>Type</Text>
        <Text style={styles.textSize10TableCenterA}>Number</Text>
        <Text style={styles.textSize10TableCenterA}>%</Text>
        </View>
        <View style={styles.table}>
        <Text style={styles.textSize10TableCenterA}>Yellow Card</Text>
        <Text style={styles.textSize10TableCenterA}>{this.state.yelPenalty}</Text>
        <Text style={styles.textSize10TableCenterA}>{((this.state.yelPenalty/this.state.totalPenalties)*100).toFixed(2)}%</Text>
        </View>
        <View style={styles.table}>
        <Text style={styles.textSize10TableCenterA}>Two Minute Penalty</Text>
        <Text style={styles.textSize10TableCenterA}>{this.state.tmPenalty}</Text>
        <Text style={styles.textSize10TableCenterA}>{((this.state.tmPenalty/this.state.totalPenalties)*100).toFixed(2)}%</Text>
        </View>
        <View style={styles.tableLast}>
        <Text style={styles.textSize10TableCenterA}>Red Card</Text>
        <Text style={styles.textSize10TableCenterA}>{this.state.redPenalty}</Text>
        <Text style={styles.textSize10TableCenterA}>{((this.state.redPenalty/this.state.totalPenalties)*100).toFixed(2)}%</Text>
        </View>
        <TouchableOpacity style={styles.borderWhite}
        onPress={() => {this.setState({penaltyActive: false})
      }}>
        <Text style={styles.textSize12}> Click to hide details. </Text>
        </TouchableOpacity>
        </View>;
      }
    }.bind(this);


    var cTechErrorsActive = function(){
      if (this.state.techErrorsActive == false){
        return <TouchableOpacity style={styles.borderWhite}
          onPress={() => {this.setState({techErrorsActive:true})
        }}>
          <Text style={styles.textSize12}> Click to view details. </Text>
        </TouchableOpacity>;
      } else if (this.state.techErrorsActive == true){
        return <View>
        <View style={styles.tableHeading}>
        <Text style={styles.textSize10TableCenterA}>Type</Text>
        <Text style={styles.textSize10TableCenterA}>Number</Text>
        <Text style={styles.textSize10TableCenterA}>%</Text>
        </View>
        <View style={styles.table}>
        <Text style={styles.textSize10TableCenterA}>Double Dribble</Text>
        <Text style={styles.textSize10TableCenterA}>{this.state.ddError}</Text>
        <Text style={styles.textSize10TableCenterA}>{(this.state.ddError/this.state.totalTechErrors).toFixed(4)*100}%</Text>
        </View>
        <View style={styles.table}>
        <Text style={styles.textSize10TableCenterA}>Passing Error</Text>
        <Text style={styles.textSize10TableCenterA}>{this.state.peError}</Text>
        <Text style={styles.textSize10TableCenterA}>{(this.state.peError/this.state.totalTechErrors).toFixed(4)*100}%</Text>
        </View>
        <View style={styles.table}>
        <Text style={styles.textSize10TableCenterA}>Catch Error</Text>
        <Text style={styles.textSize10TableCenterA}>{this.state.ceError}</Text>
        <Text style={styles.textSize10TableCenterA}>{(this.state.ceError/this.state.totalTechErrors).toFixed(4)*100}%</Text>
        </View>
        <View style={styles.table}>
        <Text style={styles.textSize10TableCenterA}>Too Many Steps</Text>
        <Text style={styles.textSize10TableCenterA}>{this.state.tmsError}</Text>
        <Text style={styles.textSize10TableCenterA}>{(this.state.tmsError/this.state.totalTechErrors).toFixed(4)*100}%</Text>
        </View>
        <View style={styles.table}>
        <Text style={styles.textSize10TableCenterA}>Offensive Error</Text>
        <Text style={styles.textSize10TableCenterA}>{this.state.oeError}</Text>
        <Text style={styles.textSize10TableCenterA}>{(this.state.oeError/this.state.totalTechErrors).toFixed(4)*100}%</Text>
        </View>
        <View style={styles.table}>
        <Text style={styles.textSize10TableCenterA}>Line Crossed</Text>
        <Text style={styles.textSize10TableCenterA}>{this.state.lcError}</Text>
        <Text style={styles.textSize10TableCenterA}>{(this.state.lcError/this.state.totalTechErrors).toFixed(4)*100}%</Text>
        </View>
        <View style={styles.tableLast}>
        <Text style={styles.textSize10TableCenterA}>Foot Fault</Text>
        <Text style={styles.textSize10TableCenterA}>{this.state.ffError}</Text>
        <Text style={styles.textSize10TableCenterA}>{(this.state.ffError/this.state.totalTechErrors).toFixed(4)*100}%</Text>
        </View>
        <TouchableOpacity style={styles.borderWhite}
          onPress={() => {this.setState({techErrorsActive: false})
        }}>
        <Text style={styles.textSize12}> Click to hide details. </Text>
        </TouchableOpacity>
        </View>;
      }
    }.bind(this);


    var cThrowSelectors = function(){
      if (this.state.selectedHitSel == null){
        return <View>
        <View style={styles.throwSelector1}>
          <View style={styles.throwSelector2}>
            <View style={styles.throwSelector3}>
            </View>
            <View style={styles.horizontalView}>
              <View style={styles.selector3}>
                <Text style={styles.textSize10a}>{this.state.throwSel[0]}/{this.state.totalAttempts}</Text>
                <Text style={styles.textSize10a}>{(this.state.throwSelGoals[0]/this.state.throwSel[0]).toFixed(4) * 100}%</Text>
              </View>
              <View style={styles.selector2}>
              <Text style={styles.textSize10a}>{this.state.throwSel[1]}/{this.state.totalAttempts}</Text>
              <Text style={styles.textSize10a}>{(this.state.throwSelGoals[1]/this.state.throwSel[1]).toFixed(4) * 100}%</Text>
              </View>
              <View style={styles.selector1}>
              <Text style={styles.textSize10a}>{this.state.throwSel[2]}/{this.state.totalAttempts}</Text>
              <Text style={styles.textSize10a}>{(this.state.throwSelGoals[2]/this.state.throwSel[2]).toFixed(4) * 100}%</Text>
              </View>
              <View style={styles.selector2}>
              <Text style={styles.textSize10a}>{this.state.throwSel[3]}/{this.state.totalAttempts}</Text>
              <Text style={styles.textSize10a}>{(this.state.throwSelGoals[3]/this.state.throwSel[3]).toFixed(4) * 100}%</Text>
              </View>
              <View style={styles.selector3}>
              <Text style={styles.textSize10a}>{this.state.throwSel[4]}/{this.state.totalAttempts}</Text>
              <Text style={styles.textSize10a}>{(this.state.throwSelGoals[4]/this.state.throwSel[4]).toFixed(4) * 100}%</Text>
              </View>
            </View>
          </View>

          <View style={styles.horizontalView}>
            <View style={styles.selector5}>
            <Text style={styles.textSize10a}>{this.state.throwSel[5]}/{this.state.totalAttempts}</Text>
            <Text style={styles.textSize10a}>{(this.state.throwSelGoals[5]/this.state.throwSel[5]).toFixed(4) * 100}%</Text>
            </View>
            <View style={styles.selector4}>
            <Text style={styles.textSize10a}>{this.state.throwSel[6]}/{this.state.totalAttempts}</Text>
            <Text style={styles.textSize10a}>{(this.state.throwSelGoals[6]/this.state.throwSel[6]).toFixed(4) * 100}%</Text>
            </View>
            <View style={styles.selector5}>
            <Text style={styles.textSize10a}>{this.state.throwSel[7]}/{this.state.totalAttempts}</Text>
            <Text style={styles.textSize10a}>{(this.state.throwSelGoals[7]/this.state.throwSel[7]).toFixed(4) * 100}%</Text>
            </View>
          </View>

        </View>
        <View style={styles.horizontalViewSpaceBetween}>
          <Text style={styles.textSize14}>PENALTY SHOTS: {this.state.penaltyShotsCount}</Text>
          <Text style={styles.textSize14}>COUNTER ATTACKS: {this.state.counterAttacksCount}</Text>
        </View>
        </View>;
      } else {
        var totalThrowsSeg = 0;
        var selectedHitSel = this.state.selectedHitSel;
        var penShot = 0;
        var counterAtt = 0;
        var throwSel = [0,0,0,0,0,0,0,0];
        var throwSelGoals = [0,0,0,0,0,0,0,0];
          _.each(this.state.actions, function(userObject) {
          totalThrowsSeg++;
          if (userObject.hitSelector == selectedHitSel+1){
            if (userObject.throwSelector == "Penalty Shot"){
              penShot += 1;
            }
            if (userObject.throwSelector == "Counter Attack"){
              counterAtt += 1;
            }
            throwSel[userObject.throwSelector-1]++;
          }
        });
        return <View>
        <View style={styles.throwSelector1}>
          <View style={styles.throwSelector2}>
            <View style={styles.throwSelector3}>
            </View>
            <View style={styles.horizontalView}>
              <View style={styles.selector3}>
                <Text style={styles.textSize10a}>{throwSel[0]}/{this.state.hitSel[selectedHitSel]}</Text>
                <Text style={styles.textSize10a}>{(throwSelGoals[0]/throwSel[0]).toFixed(4) * 100}%</Text>
              </View>
              <View style={styles.selector2}>
                <Text style={styles.textSize10a}>{throwSel[1]}/{this.state.hitSel[selectedHitSel]}</Text>
                <Text style={styles.textSize10a}>{(throwSelGoals[1]/throwSel[1]).toFixed(4) * 100}%</Text>
              </View>
              <View style={styles.selector1}>
                <Text style={styles.textSize10a}>{throwSel[2]}/{this.state.hitSel[selectedHitSel]}</Text>
                <Text style={styles.textSize10a}>{(throwSelGoals[2]/throwSel[2]).toFixed(4) * 100}%</Text>
              </View>
              <View style={styles.selector2}>
                <Text style={styles.textSize10a}>{throwSel[3]}/{this.state.hitSel[selectedHitSel]}</Text>
                <Text style={styles.textSize10a}>{(throwSelGoals[3]/throwSel[3]).toFixed(4) * 100}%</Text>
              </View>
              <View style={styles.selector3}>
                <Text style={styles.textSize10a}>{throwSel[4]}/{this.state.hitSel[selectedHitSel]}</Text>
                <Text style={styles.textSize10a}>{(throwSelGoals[4]/throwSel[4]).toFixed(4) * 100}%</Text>
              </View>
            </View>
          </View>

          <View style={styles.horizontalView}>
            <View style={styles.selector5}>
              <Text style={styles.textSize10a}>{throwSel[5]}/{this.state.hitSel[selectedHitSel]}</Text>
              <Text style={styles.textSize10a}>{(throwSelGoals[5]/throwSel[5]).toFixed(4) * 100}%</Text>
            </View>
            <View style={styles.selector4}>
              <Text style={styles.textSize10a}>{throwSel[6]}/{this.state.hitSel[selectedHitSel]}</Text>
              <Text style={styles.textSize10a}>{(throwSelGoals[6]/throwSel[6]).toFixed(4) * 100}%</Text>
            </View>
            <View style={styles.selector5}>
              <Text style={styles.textSize10a}>{throwSel[7]}/{this.state.hitSel[selectedHitSel]}</Text>
              <Text style={styles.textSize10a}>{(throwSelGoals[7]/throwSel[7]).toFixed(4) * 100}%</Text>
            </View>
          </View>
        </View>
        <View style={styles.horizontalViewSpaceBetween}>
          <Text style={styles.textSize14}>PENALTY SHOTS: {penShot}</Text>
          <Text style={styles.textSize14}>COUNTER ATTACKS: {counterAtt}</Text>
        </View>
        </View>;
      }
    }.bind(this);

    return (
      <ImageBackground source={require('../images/background.jpg')} style={styles.container}>
        <View style={styles.navWrapper}>
          <View style={styles.nav}>
          {cBack()}
          <View style={styles.titleNav}>
            <Text style={styles.barTitle}>GAME STATISTICS</Text>
          </View>
          <View style={styles.rightNav}>
          </View>
        </View>
        </View>
          <View style={styles.statisticsTop}>
            <View style={styles.teamInfo}>
              <Image source={require('../images/user.png')} style={styles.picContainerBold} />
              <Text style={styles.textSize14a}>{this.state.gameData.teamName}</Text>
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.textSize16a}>{this.state.gameData.score} : {this.state.gameData.oppScore}</Text>
              <Text style={styles.textSize12a}>{this.state.gameData.date}</Text>
              <Text style={styles.textSize12}>Total Time: {this.state.gameData.totalMins}:{this.state.gameData.totalSecs}</Text>
            </View>
            {cOppStats()}
          </View>
        <ScrollView style={styles.scrollViewStats}>
        <View style={styles.statsView}>
          <Text style={styles.headingSmall}>GAME STATISTICS</Text>
            <Text style={styles.textSize12}>Total Attempt Number: {this.state.totalAttempts} </Text>
            <View style={styles.tableWrapper}>
              <View style={styles.table}>
              <Text style={styles.textSize10TableCenter}>Goals</Text>
              <Text style={styles.textSize10TableCenter}>Blocked</Text>
              <Text style={styles.textSize10TableCenter}>Missed</Text>
              <Text style={styles.textSize10TableCenter}>Saved</Text>
              </View>
              <View style={styles.table}>
              <Text style={styles.textSize10TableCenter}>{this.state.totalGoals}</Text>
              <Text style={styles.textSize10TableCenter}>{this.state.totalBlocks}</Text>
              <Text style={styles.textSize10TableCenter}>{this.state.totalMisses}</Text>
              <Text style={styles.textSize10TableCenter}>{this.state.totalSaves}</Text>
              </View>
              <View style={styles.tableLast}>
              <Text style={styles.textSize10TableCenter}>{(this.state.totalGoals/this.state.totalAttempts).toFixed(4)*100}%</Text>
              <Text style={styles.textSize10TableCenter}>{(this.state.totalBlocks/this.state.totalAttempts).toFixed(4)*100}%</Text>
              <Text style={styles.textSize10TableCenter}>{(this.state.totalMisses/this.state.totalAttempts).toFixed(4)*100}%</Text>
              <Text style={styles.textSize10TableCenter}>{(this.state.totalSaves/this.state.totalAttempts).toFixed(4)*100}%</Text>
              </View>
            </View>
          </View>
          <View style={styles.statsView}>
          <View style={styles.horizontalView}>
            <View style={styles.verticalView}>
              <Text style={styles.headingSmall}>HALF 1</Text>
              <Text style={styles.textSize10a}>{this.state.gameData.h1mins}:{this.state.gameData.h1secs}</Text>
              <Text style={styles.textSize10a}>Success Rate: {(this.state.attemptsFHGoals/this.state.attemptsFH).toFixed(4) * 100 }%</Text>
              <View style={styles.tableWrapper}>
                <View style={styles.table}>
                <Text style={styles.textSize10TableLeft}>Attempts</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsFH}</Text>
                </View>
                <View style={styles.table}>
                <Text style={styles.textSize10TableLeft}>Goals</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsFHGoals}</Text>
                </View>
                <View style={styles.table}>
                <Text style={styles.textSize10TableLeft}>Blocked</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsFHBlocks}</Text>
                </View>
                <View style={styles.table}>
                <Text style={styles.textSize10TableLeft}>Missed</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsFHMisses}</Text>
                </View>
                <View style={styles.tableLast}>
                <Text style={styles.textSize10TableLeft}>Saved</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsFHSaves}</Text>
                </View>
              </View>
            </View>
            <View style={styles.verticalView}>
              <Text style={styles.headingSmall}>HALF 2</Text>
              <Text style={styles.textSize10a}>{this.state.gameData.h2mins}:{this.state.gameData.h2secs}</Text>
              <Text style={styles.textSize10a}>Success Rate: {(this.state.attemptsSHGoals/this.state.attemptsSH).toFixed(4)*100}%</Text>
              <View style={styles.tableWrapper}>
                <View style={styles.table}>
                <Text style={styles.textSize10TableLeft}>Attempts</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsSH}</Text>
                </View>
                <View style={styles.table}>
                <Text style={styles.textSize10TableLeft}>Goals</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsSHGoals}</Text>
                </View>
                <View style={styles.table}>
                <Text style={styles.textSize10TableLeft}>Blocked</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsSHBlocks}</Text>
                </View>
                <View style={styles.table}>
                <Text style={styles.textSize10TableLeft}>Missed</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsSHMisses}</Text>
                </View>
                <View style={styles.tableLast}>
                <Text style={styles.textSize10TableLeft}>Saved</Text>
                <Text style={styles.textSize10TableRight}>{this.state.attemptsSHSaves}</Text>
                </View>
              </View>
            </View>
            {cExtraTime()}
          </View>
          </View>
          <View style={styles.statsView}>
          <View style={styles.headingView}>
            <Text style={styles.headingSmall}>ATTEMPT POSITIONS</Text>
            <TouchableOpacity onPress={() => {
              Alert.alert(
                'Attempt Positions',
                'This is a grid of the goal frame. Each box represents the nomber of goals over the total attempts fired to that section of the goal frame, as well as the percentage of goals in that section in comparison to the total goals. The positions of each attempt are marked below with their respective statistics.',
                [{text: 'OK', style:{color:'black'}}],
                { cancelable: false }
              )}}>
              <Text style={styles.infoBtn}>i</Text>
            </TouchableOpacity>
          </View>
            <Text style={styles.textSize12}>Click on a position to view specific stats.</Text>
            <View style={styles.hitSelectorWrapper}>
                <View style={styles.horizontalView}>
                  <View style={styles.hSelector}>
                    <TouchableOpacity
                    style={[styles.noTintedBg, this.state.selectedHitSel == 0 && styles.tintedBg]}
                    onPress={()=> {this.setState({selectedHitSel : 0})}}>
                      <Text style={styles.textSize10a}>{this.state.hitSelGoals[0]}/{this.state.hitSel[0]}</Text>
                      <Text style={styles.textSize10a}>{(this.state.hitSelGoals[0]/this.state.totalGoals).toFixed(4) * 100}%</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.hSelector}>
                    <TouchableOpacity
                    style={[styles.noTintedBg, this.state.selectedHitSel == 1 && styles.tintedBg]}
                    onPress={()=> {this.setState({selectedHitSel : 1})}}>
                    <Text style={styles.textSize10a}>{this.state.hitSelGoals[1]}/{this.state.hitSel[1]}</Text>
                    <Text style={styles.textSize10a}>{(this.state.hitSelGoals[1]/this.state.totalGoals).toFixed(4) * 100}%</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.hSelector}>
                    <TouchableOpacity
                    style={[styles.noTintedBg, this.state.selectedHitSel == 2 && styles.tintedBg]}
                    onPress={()=> {this.setState({selectedHitSel : 2})}}>
                    <Text style={styles.textSize10a}>{this.state.hitSelGoals[2]}/{this.state.hitSel[2]}</Text>
                    <Text style={styles.textSize10a}>{(this.state.hitSelGoals[2]/this.state.totalGoals).toFixed(4) * 100}%</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.horizontalView}>
                  <View style={styles.hSelector}>
                    <TouchableOpacity
                    style={[styles.noTintedBg, this.state.selectedHitSel == 3 && styles.tintedBg]}
                    onPress={()=> {this.setState({selectedHitSel : 3})}}>
                    <Text style={styles.textSize10a}>{this.state.hitSelGoals[3]}/{this.state.hitSel[3]}</Text>
                    <Text style={styles.textSize10a}>{(this.state.hitSelGoals[3]/this.state.totalGoals).toFixed(4) * 100}%</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.hSelector}>
                    <TouchableOpacity
                    style={[styles.noTintedBg, this.state.selectedHitSel == 4 && styles.tintedBg]}
                    onPress={()=> {this.setState({selectedHitSel : 4})}}>
                    <Text style={styles.textSize10a}>{this.state.hitSelGoals[4]}/{this.state.hitSel[4]}</Text>
                    <Text style={styles.textSize10a}>{(this.state.hitSelGoals[4]/this.state.totalGoals).toFixed(4) * 100}%</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.hSelector}>
                    <TouchableOpacity
                    style={[styles.noTintedBg, this.state.selectedHitSel == 5 && styles.tintedBg]}
                    onPress={()=> {this.setState({selectedHitSel : 5})}}>
                    <Text style={styles.textSize10a}>{this.state.hitSelGoals[5]}/{this.state.hitSel[5]}</Text>
                    <Text style={styles.textSize10a}>{(this.state.hitSelGoals[5]/this.state.totalGoals).toFixed(4) * 100}%</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.horizontalView}>
                  <View style={styles.hSelector}>
                    <TouchableOpacity
                    style={[styles.noTintedBg, this.state.selectedHitSel == 6 && styles.tintedBg]}
                    onPress={()=> {this.setState({selectedHitSel : 6})}}>
                    <Text style={styles.textSize10a}>{this.state.hitSelGoals[6]}/{this.state.hitSel[6]}</Text>
                    <Text style={styles.textSize10a}>{(this.state.hitSelGoals[6]/this.state.totalGoals).toFixed(4) * 100}%</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.hSelector}>
                    <TouchableOpacity
                    style={[styles.noTintedBg, this.state.selectedHitSel == 7 && styles.tintedBg]}
                    onPress={()=> {this.setState({selectedHitSel : 7})}}>
                    <Text style={styles.textSize10a}>{this.state.hitSelGoals[7]}/{this.state.hitSel[7]}</Text>
                    <Text style={styles.textSize10a}>{(this.state.hitSelGoals[7]/this.state.totalGoals).toFixed(4) * 100}%</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.hSelector}>
                    <TouchableOpacity
                    style={[styles.noTintedBg, this.state.selectedHitSel == 8 && styles.tintedBg]}
                    onPress={()=> {this.setState({selectedHitSel : 8})}}>
                    <Text style={styles.textSize10a}>{this.state.hitSelGoals[8]}/{this.state.hitSel[8]}</Text>
                    <Text style={styles.textSize10a}>{(this.state.hitSelGoals[8]/this.state.totalGoals).toFixed(4) * 100}%</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          <View style={styles.statsView}>
              {cThrowSelectors()}
              <TouchableOpacity style={styles.buttonTransparentSmallThin}
              onPress={() => {this.setState({selectedHitSel:null})}}>
                <Text style={styles.textSize10}>View Overall Throw Selectors</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statsView}>
            <View style={styles.headingView}>
              <Text style={styles.headingSmall}>PENALTIES</Text>
              <TouchableOpacity onPress={() => {
                Alert.alert(
                  'Penalties',
                  'This is the total amount of penalties by type and their percentages in comparison of the overall penalty amount.',
                  [{text: 'OK', style:{color:'black'}}],
                  { cancelable: false }
                )}}>
                <Text style={styles.infoBtn}>i</Text>
              </TouchableOpacity>
            </View>
              <Text style={styles.textSize10a}>Total Penalty Amount: {this.state.totalPenalties}</Text>
              {cPenaltyActive()}
            </View>
            <View style={styles.statsView}>
            <View style={styles.headingView}>
              <Text style={styles.headingSmall}>TECH ERRORS</Text>
              <TouchableOpacity onPress={() => {
                Alert.alert(
                  'Tech Errors',
                  'This is the total amount of technical errors by type and their percentages in comparison of the overall technical error amount.',
                  [{text: 'OK', style:{color:'black'}}],
                  { cancelable: false }
                )}}>
                <Text style={styles.infoBtn}>i</Text>
              </TouchableOpacity>
            </View>
              <Text style={styles.textSize10a}>Total Technical Errors: {this.state.totalTechErrors}</Text>
              {cTechErrorsActive()}
            </View>
            <View style={styles.statsView}>
              <Text style={styles.headingSmall}>PLAYER LIST</Text>
              <View style={styles.flatlistContainer}>
                <FlatList
                  keyExtractor = {(item) => item._key}
                  style={styles.flatListSmall}
                  ListEmptyComponent={<Text style={styles.emptyListText2}>No players registered.</Text>}
                  data={this.state.players}
                  renderItem={({item}) =>
                  <TouchableOpacity
                  style={styles.list}
                  onPress={() => { Actions.gamePlayerStatistics({ team: this.props.team, season:this.state.season, homeOpp: this.state.homeOpp, player: item._key, game:this.state.game}) }}>
                      <Text style={styles.playerNumberSmall}>{item.number}</Text>
                      <Text style={styles.listItemSmall}>{item.player}</Text>
                  </TouchableOpacity>}
                />
              </View>
            </View>
        </ScrollView>
        <BottomMenu activeTab={'index'}/>
      </ImageBackground>
    );
  }
}

export default GameStatistics;