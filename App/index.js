import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';

import Login from './login';
import Register from './register';
import Home from './screens/Home';
import Teams from './screens/Teams';
import EditProfile from './screens/EditProfile';
import AddTeam from './screens/AddTeam';
import Team from './screens/Team';
import Player from './screens/Player';
import EditTeam from './screens/EditTeam';
import EditPlayer from './screens/EditPlayer';
import EditSeason from './screens/EditSeason';
import AddPlayer from './screens/AddPlayer';


import ChooseSeason from './preGame/ChooseSeason';
import AddSeason from './preGame/AddSeason';
import ChooseHomeTeam from './preGame/ChooseHomeTeam';
import ChooseOpponentTeam from './preGame/ChooseOpponentTeam';
import ChooseHomeTeamPlayers from './preGame/ChooseHomeTeamPlayers';
import ChooseOpponentTeamPlayers from './preGame/ChooseOpponentTeamPlayers';


import Game from './Game/Game';
import ByWho from './Game/ByWho';
import ThrowSelector from './Game/ThrowSelector';
import AttemptOutcome from './Game/AttemptOutcome';
import Goal from './Game/Goal';
import Save from './Game/Save';
import Block from './Game/Block';
import TechError from './Game/TechError';
import Penalty from './Game/Penalty';
import Substitution from './Game/Substitution';
import SubstitutionPenalty from './Game/SubstitutionPenalty';
import Undo from './Game/Undo';


import GameStatistics from './statistics/GameStatistics';
import ChooseSeasonTeamStatistics from './statistics/ChooseSeasonTeamStatistics';
import SeasonTeamStatistics from './statistics/SeasonTeamStatistics';
import ChooseSeasonPlayerStatistics from './statistics/ChooseSeasonPlayerStatistics';
import SeasonPlayerStatistics from './statistics/SeasonPlayerStatistics';
import GamePlayerStatistics from './statistics/GamePlayerStatistics';

class Index extends Component {
  render() {
    return (
      //<Game />
      <Router panHandlers={null}>
        <Scene key="root">
          <Scene
          key="login"
          hideNavBar={true}
          component={Login}
          initial={true}
          />
          <Scene
          key="register"
          hideNavBar={true}
          component={Register}
          />
          <Scene
          key="home"
          hideNavBar={true}
          component={Home}
          />
          <Scene
            key="teams"
            hideNavBar={true}
            component={Teams}
          />
          <Scene
            key="editProfile"
            hideNavBar={true}
            component={EditProfile}
            Title="Edit Profile"
          />
          <Scene
            key="editSeason"
            hideNavBar={true}
            component={EditSeason}
          />
          <Scene
            key="chooseSeason"
            hideNavBar={true}
            component={ChooseSeason}
            Title="Choose Season"
          />
          <Scene
            key="addSeason"
            hideNavBar={true}
            component={AddSeason}
            Title="Add Season"
          />
          <Scene
            key="chooseHomeTeam"
            hideNavBar={true}
            component={ChooseHomeTeam}
            Title="Choose Home Team"
          />
          <Scene
            key="chooseOpponentTeam"
            hideNavBar={true}
            component={ChooseOpponentTeam}
            Title="Choose Opponent Team"
          />
          <Scene
            key="chooseHomeTeamPlayers"
            hideNavBar={true}
            component={ChooseHomeTeamPlayers}
            Title="Choose Home Players"
          />
          <Scene
            key="chooseOpponentTeamPlayers"
            hideNavBar={true}
            component={ChooseOpponentTeamPlayers}
            Title="Choose Opponent Players"
          />
          <Scene
            key="game"
            hideNavBar={true}
            component={Game}
          />
          <Scene
            key="addTeam"
            hideNavBar={true}
            component={AddTeam}
          />
          <Scene
            key="Team"
            hideNavBar={true}
            component={Team}
          />
          <Scene
            key="editTeam"
            hideNavBar={true}
            component={EditTeam}
          />
          <Scene
            key="Player"
            hideNavBar={true}
            component={Player}
          />
          <Scene
            key="editPlayer"
            hideNavBar={true}
            component={EditPlayer}
          />
          <Scene
            key="addPlayer"
            hideNavBar={true}
            component={AddPlayer}
          />
          <Scene
            key="byWho"
            hideNavBar={true}
            component={ByWho}
          />
          <Scene
            key="throwSelector"
            hideNavBar={true}
            component={ThrowSelector}
          />
          <Scene
            key="attemptOutcome"
            hideNavBar={true}
            component={AttemptOutcome}
          />
          <Scene
            key="goal"
            hideNavBar={true}
            component={Goal}
          />
          <Scene
            key="save"
            hideNavBar={true}
            component={Save}
          />
          <Scene
            key="block"
            hideNavBar={true}
            component={Block}
          />
          <Scene
            key="techError"
            hideNavBar={true}
            component={TechError}
          />
          <Scene
            key="penalty"
            hideNavBar={true}
            component={Penalty}
          />
          <Scene
            key="substitution"
            hideNavBar={true}
            component={Substitution}
          />
          <Scene
            key="substitutionPenalty"
            hideNavBar={true}
            component={SubstitutionPenalty}
          />
          <Scene
            key="gameStatistics"
            hideNavBar={true}
            component={GameStatistics}
          />
          <Scene
            key="seasonTeamStatistics"
            hideNavBar={true}
            component={SeasonTeamStatistics}
          />
          <Scene
            key="chooseSeasonTeamStatistics"
            hideNavBar={true}
            component={ChooseSeasonTeamStatistics}
          />
          <Scene
            key="seasonPlayerStatistics"
            hideNavBar={true}
            component={SeasonPlayerStatistics}
          />
          <Scene
            key="gamePlayerStatistics"
            hideNavBar={true}
            component={GamePlayerStatistics}
          />
          <Scene
            key="chooseSeasonPlayerStatistics"
            hideNavBar={true}
            component={ChooseSeasonPlayerStatistics}
          />
          <Scene
            key="undo"
            hideNavBar={true}
            component={Undo}
          />

        </Scene>
      </Router>
    );
  }
}
export default Index;
