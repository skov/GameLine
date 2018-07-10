import * as firebase from 'firebase';
import { firebaseRef } from './firebase';
import _ from 'lodash';

class Database {
  static setUserName(userId, name, email) {
    let userDetailPath = "/users/" + userId;
    return firebaseRef.database().ref(userDetailPath).set({
      name: name,
      email : email,
    })
  }

  static listenUserName(userId, callback) {
    let path = "/users/" + userId;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var name = '';
      if (snapshot.val()) {
        name = snapshot.val().name
      }
      callback(name)
    });
  }

  static listenUserEmail(userId, callback) {
    let userEmailPath = "/users/" + userId;
    firebaseRef.database().ref(userEmailPath).on('value', (snapshot) => {
      var email = '';
      if (snapshot.val()) {
        email = snapshot.val().email
      }
      callback(email)
    });
  }
  static addTeam(userId, homeOpp, team, ageStart, ageEnd){
    let homePath = "/users/" + userId + "/HomeTeams/";
    let oppPath = "/users/" + userId + "/OpponentTeams/";
    var path = homeOpp == "home" ? homePath : oppPath;
    console.log(path)
    return firebaseRef.database().ref(path).push({
      team: team,
      complexity:0,
      ageStart : ageStart,
      ageEnd : ageEnd,
    })
  }

  static editTeam(userId, homeOpp, teamId, teamName, ageStart, ageEnd){
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId;
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId;
    var path = homeOpp == "home" ? homePath : oppPath;
    return firebaseRef.database().ref(path).update({
      team: teamName,
      ageStart : ageStart,
      ageEnd : ageEnd,
    })
  }

  static editSeason(userId, homeOpp, teamId, seasonId, seasonName, dateStart, dateEnd){
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId;
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId;
    var path = homeOpp == "home" ? homePath : oppPath;
    return firebaseRef.database().ref(path).update({
      season: seasonName,
      dateStart : dateStart,
      dateEnd : dateEnd,
    })
  }

  static deleteSeason(userId, homeOpp, teamId, seasonId){
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId;
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId;
    var path = homeOpp == "home" ? homePath : oppPath;
    return firebaseRef.database().ref(path).remove()
  }

  static checkTeamName(userId, homeOpp, team, callback){
    let homePath = "/users/" + userId + "/HomeTeams/";
    let oppPath = "/users/" + userId + "/OpponentTeams/";
    var path = homeOpp == "home" ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var data = [];
      snapshot.forEach((child) => {
        data.push({
          _key: child.val().team,
          deleted: child.val().deleted,
        });
      });
      callback(data)
    });
  }

  static addOpponentTeam(userId, team, ageStart, ageEnd){
    let teamPath = "/users/" + userId + "/OpponentTeams/";
    return firebaseRef.database().ref(teamPath).push({
      team: team,
      ageStart : ageStart,
      ageEnd : ageEnd,
    })
  }
  static addSeason(userId, teamId, dateStart, dateEnd, season){
    let path = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/";
    return firebaseRef.database().ref(path).push({
      season: season,
      dateStart : dateStart,
      dateEnd : dateEnd,
    })
  }

  static addSeasonOpp(userId, teamId, seasonId, dateStart, dateEnd, season){
    let path = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId;
    return firebaseRef.database().ref(path).update({
      season: season,
      dateStart : dateStart,
      dateEnd : dateEnd,
    })
  }

  static addGame(userId, teamId, oppTeamId, seasonId, homeOpp, teamName, oppTeamName, date, complexity, gameId){
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/";
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
    if (homeOpp == "home"){
      path = homePath;
      return firebaseRef.database().ref(path).push({
        teamName: teamName,
        oppTeamName: oppTeamName,
        oppTeamId: oppTeamId,
        date:date,
        score:JSON.parse(0),
        complexity:complexity,
        lastActionId:'',
      });
    } else {
      path = oppPath;
      return firebaseRef.database().ref(path).update({
        teamName: teamName,
        oppTeamName: oppTeamName,
        oppTeamId: oppTeamId,
        date:date,
        score:JSON.parse(0),
        complexity:complexity,
        lastActionId:'',
      });
    }
  }
  static addExtraHalfTime(userId, teamId, seasonId, gameId, mins, secs){
    let path = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
    return firebaseRef.database().ref(path).update({
      hEmins:mins,
      hEsecs:secs,
    });
  }

  static addOppTeamTimers(userId, teamId, seasonId, gameId, h1mins, h1secs, h2mins, h2secs, hEmins, hEsecs){
    let path = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
    return firebaseRef.database().ref(path).update({
      h1mins:h1mins,
      h1secs:h1secs,
      h2mins:h2mins,
      h2secs:h2secs,
      hEmins:hEmins,
      hEsecs:hEsecs,
    });
  }

  static add1HalfTime(userId, teamId, seasonId, gameId, mins, secs){
    let path = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
    return firebaseRef.database().ref(path).update({
      h1mins:mins,
      h1secs:secs,
    })
  }

  static add2HalfTime(userId, teamId, seasonId, gameId, mins, secs){
    let path = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
    var s = '';
    var m = '';
    return firebaseRef.database().ref(path).update({
      h2mins:mins,
      h2secs:secs,
    })
  }

  static getGameId(userId, teamId, seasonId, callback){
    let path = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/";
    firebaseRef.database().ref(path).limitToLast(1).on('child_added', (snapshot) => {
      var gameId = "";
      if (snapshot.val()) {
        gameId = snapshot.key;
      }
      callback(gameId)
    });
  }

  static getSeasonId(userId, teamId, callback){
    let path = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/";
    firebaseRef.database().ref(path).limitToLast(1).on('child_added', (snapshot) => {
      var seasonId = "";
      if (snapshot.val()) {
        seasonId = snapshot.key;
      }
      callback(seasonId)
    });
  }

  static setStatsComplexity(userId, teamId, complexity) {
    let path = "/users/" + userId + "/HomeTeams/" + teamId;
    return firebaseRef.database().ref(path).update({
      complexity: complexity,
    })
  }

  static getStatsComplexity(userId, teamId, callback){
    let path = "/users/" + userId + "/HomeTeams/" + teamId;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var complexity = '';
      if (snapshot.val()) {
        complexity = snapshot.val().complexity
      }
      callback(complexity)
    });
  }

  static addPlayer(userId, homeOpp, teamId, name, dob, email, phone, number){
    if (homeOpp == 'home'){
      path = "/users/" + userId + "/HomeTeams/" + teamId + "/Players/";
    } else{
      path = "/users/" + userId + "/OpponentTeams/" + teamId + "/Players/";
    }
    return firebaseRef.database().ref(path).push({
      player: name,
      dob : dob,
      email : email,
      phone : phone,
      number : number,
    });
  }

  static deleteTeam(userId, homeOpp, teamId){
    var homePath = "/users/" + userId + "/HomeTeams/";
    var oppPath = "/users/" + userId + "/OpponentTeams/";
    var path = homeOpp == 'home' ? homePath : oppPath;
    return firebaseRef.database().ref(path).child(teamId).update({
      deleted: true,
    });
  }

  static deletePlayer(userId, homeOpp, teamId, playerId){
    var homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Players/" + playerId;
    var oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Players/" + playerId;
    var path = homeOpp == 'home' ? homePath : oppPath;
    console.log(path)
    return firebaseRef.database().ref(path).update({
      deleted: true,
    });
  }

  static updatePlayer(userId, homeOpp, teamId, playerId, playerData){
    if (homeOpp == 'home'){
      path = "/users/" + userId + "/HomeTeams/" + teamId + "/Players/" + playerId;
    } else{
      path = "/users/" + userId + "/OpponentTeams/" + teamId + "/Players/" + playerId;
    }
    return firebaseRef.database().ref(path).update({
      player: playerData.player,
      dob : playerData.dob,
      email : playerData.email,
      phone : playerData.phone,
      number : playerData.number,
    })
  }

  static listenTeams(userId, homeOpp, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/";
    let oppPath = "/users/" + userId + "/OpponentTeams/";
    var path = homeOpp == "home" ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var data = [];
      snapshot.forEach((child) => {
        data.push({
          _key: child.key,
          team : child.val().team,
          ageStart : child.val().ageStart,
          ageEnd : child.val().ageEnd,
          deleted : child.val().deleted,
          complexity : child.val().complexity,
        });
      });
      callback(data)
    });
  }
  static listenTeam(userId, teamId, homeOpp, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId;
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId;
    var path = homeOpp == "home" ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var data = [];
      if (snapshot.val()) {
        data._key = snapshot.key;
        data.team = snapshot.val().team;
        data.ageStart = snapshot.val().ageStart;
        data.ageEnd = snapshot.val().ageEnd;
        data.deleted = snapshot.val().deleted;
        data.complexity = snapshot.val().complexity;
      }
      callback(data)
    });
  }

  static listenAllSeasons(userId, teamId, homeOpp, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/";
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/";
    var path = homeOpp == "home" ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var data = [];
      snapshot.forEach((child) => {
        data.push({
          _key: child.key,
          season : child.val().season,
          dateStart : child.val().dateStart,
          dateEnd : child.val().dateEnd,
        });
      });
      callback(data);
    });
  }
  static listenSeason(userId, teamId, homeOpp, seasonId, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId;
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId;
    var path = homeOpp == "home" ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var data = [];
      if (snapshot.val()) {
        data._key = snapshot.key;
        data.season =  snapshot.val().season;
        data.dateStart = snapshot.val().dateStart;
        data.dateEnd = snapshot.val().dateEnd;
      }
      callback(data);
    });
  }

  static listenAllGames(userId, teamId, seasonId, homeOpp, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/";
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/";
    var path = homeOpp == "home" ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var data = [];
      snapshot.forEach((child) => {
        data.push({
          _key: child.key,
          homeTeam : child.val().homeTeam,
          oppTeam : child.val().oppTeam,
          teamName : child.val().teamName,
          oppTeamName : child.val().oppTeamName,
          score: child.val().score,
          oppScore: child.val().oppScore,
          complexity: child.val().complexity,
          date: child.val().date,
        });
      });
      callback(data)
    });
  }

  static listenGameStats(userId, teamId, seasonId, gameId, homeOpp, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
    var path = homeOpp == "home" ? homePath : oppPath;

    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var d = [];
      var p =[];
      var a = [];
      var pe = [];
      var te = [];
      if (snapshot.val()) {
        d._key = snapshot.key;
        d.teamName = snapshot.val().teamName;
        d.oppTeamName = snapshot.val().oppTeamName;
        d.oppTeamId = snapshot.val().oppTeamId;
        d.score = snapshot.val().score;
        d.date = snapshot.val().date;
        d.oppScore = snapshot.val().oppScore;
        d.complexity = snapshot.val().complexity;
        d.h1mins = snapshot.val().h1mins;
        d.h1secs = snapshot.val().h1secs;
        d.h2mins = snapshot.val().h2mins;
        d.h2secs = snapshot.val().h2secs;
        d.hEmins = snapshot.val().hEmins;
        d.hEsecs = snapshot.val().hEsecs;
        p = snapshot.val().players;
        a = snapshot.val().actions == undefined ? [] : snapshot.val().actions;
        pe = snapshot.val().penalties == undefined ? [] : snapshot.val().penalties;
        te = snapshot.val().techErrors == undefined ? [] : snapshot.val().techErrors;
      }
      callback(d, p, a, pe, te)
    });
  }

  static listenGameStatsPlayer(userId, teamId, seasonId, gameId, homeOpp, player, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/actions/";
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/actions/";
    var path = homeOpp == "home" ? homePath : oppPath;

    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var actions = [];
      snapshot.forEach((child) => {
        if (child.val().playerId == player){
          actions.push({
            _key: child.key,
            action: child.val().action,
            half:child.val().half,
            hitSelector:child.val().hitSelector,
            min:child.val().min,
            sec:child.val().sec,
            outcome:child.val().outcome,
            throwSelector:child.val().throwSelector,
          });
        }
      });
      callback(actions)
    });
  }

  static listenGameStatsPlayerTechErrors(userId, teamId, seasonId, gameId, homeOpp, player, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/tech-errors/";
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/tech-errors/";
    var path = homeOpp == "home" ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var techErrors = [];
      snapshot.forEach((child) => {
        if (child.val().playerId == player){
          actions.push({
            _key: child.key,
            errorType: child.val().errorType,
            min:child.val().min,
            sec:child.val().sec,
            half:child.val().half,
          });
        }
      });
      callback(techErrors)
    });
  }

  static listenGameStatsPlayerPenalties(userId, teamId, seasonId, gameId, homeOpp, player, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/penalties/";
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/penalties/";
    var path = homeOpp == "home" ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var techErrors = [];
      snapshot.forEach((child) => {
        if (child.val().playerId == player){
          actions.push({
            _key: child.key,
            penaltyType: child.val().errorType,
            min:child.val().min,
            sec:child.val().sec,
            half:child.val().half,
          });
        }
      });
      callback(techErrors)
    });
  }

  static listenHalfTimers(userId, teamId, seasonId, gameId, callback) {
    let path = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var data = [];
      snapshot.forEach((child) => {
        data.h1mins = snapshot.val().h1mins;
        data.h1secs = snapshot.val().h1secs;
        data.h2mins = snapshot.val().h2mins;
        data.h2secs = snapshot.val().h2secs;
        data.hEmins = snapshot.val().hEmins;
        data.hEsecs = snapshot.val().hEsecs;
      });
      callback(data)
    });
  }

  static listenSeasonStats(userId, teamId, seasonId, homeOpp, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/";
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId+ "/Games/";
    var path = homeOpp == "home" ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var list = [];
      snapshot.forEach((child) => {
        list.push({
          _key : child.key,
          date : child.val().date,
          oppTeamId : child.val().oppTeamId,
          oppTeamName : child.val().oppTeamName,
          score : child.val().score,
          oppScore : child.val().oppScore,
          teamName : child.val().teamName,
          actions: child.val().actions,
          penalties:child.val().penalties,
          techErrors:child.val().techErrors,
        });
      });
      callback(list)
    });
  }

  static listenSeasonPlayerStats(userId, teamId, seasonId, homeOpp, playerId, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/";
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId+ "/Games/";
    var path = homeOpp == "home" ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var list = [];
      snapshot.forEach((child) => {
        _.each(child.val().players, function(player){
          if (player._key == playerId){
            list.push({
              _key : child.key,
              date : child.val().date,
              oppTeamId : child.val().oppTeamId,
              oppTeamName : child.val().oppTeamName,
              score : child.val().score,
              oppScore : child.val().oppScore,
              teamName : child.val().teamName,
              actions: child.val().actions,
              penalties:child.val().penalties,
              techErrors:child.val().techErrors,
            })
          }
        });
      });
      callback(list)
    });
  }
  static listenGame(userId, teamId, seasonId, gameId, homeOpp, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
    var path = homeOpp == "home" ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var data = [];
      var players=[];
      if (snapshot.val()) {
        data._key = snapshot.key;
        data.teamName = snapshot.val().teamName;
        data.score = snapshot.val().score;
        data.date = snapshot.val().date;
        data.complexity = snapshot.val().complexity;
        data.h1mins = snapshot.val().h1mins;
        data.h1secs = snapshot.val().h1secs;
        data.h2mins = snapshot.val().h2mins;
        data.h2secs = snapshot.val().h2secs;
        data.hEmins = snapshot.val().hEmins;
        data.hEsecs = snapshot.val().hEsecs;
        data.lastActionId = snapshot.val().lastActionId;
        players = snapshot.val().players;
      }
      callback(data, players)
    });
  }

  static listenAllPlayers(userId, teamId, homeOpp, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Players/";
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Players/";
    var path = homeOpp == 'home' ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var data = [];
      snapshot.forEach((child) => {
        data.push({
          _key: child.key,
          player : child.val().player,
          number : child.val().number,
          deleted: child.val().deleted,
          active : false,
          offField : false,
        });
      });
      callback(data)
    });
  }

  static getTeam(userId, homeOpp, teamId, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId;
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId;
    var path = homeOpp == 'home' ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var data = [];
      if (snapshot.val()) {
        data.team = snapshot.val().team;
        data.ageStart = snapshot.val().ageStart;
        data.ageEnd = snapshot.val().ageEnd;
      }
      callback(data)
    });
  }

  static getTeamName(userId, homeOpp, teamId, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId;
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId;
    var path = homeOpp == 'home' ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var teamName = "";
      if (snapshot.val()) {
        teamName = snapshot.val().team
      }
      callback(teamName)
    });
  }

  static getOppTeamName(userId, teamId, callback) {
    let path = "/users/" + userId + "/OpponentTeams/" + teamId;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var teamName = "";
      if (snapshot.val()) {
        teamName = snapshot.val().team
      }
      callback(teamName)
    });
  }

  static getPlayerName(userId, homeOpp, teamId, playerId, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Players/" + playerId;
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Players/" + playerId;
    path = homeOpp == 'home' ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var playerName = "";
      if (snapshot.val()) {
        playerName = snapshot.val().player
      }
      callback(playerName)
    });
  }

  static getPlayerGoalie(userId, homeOpp, teamId, seasonId, gameId, playerId, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/players/";
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/players/";
     if (homeOpp == 'home'){
       path = homePath;
     } else {
       path = oppPath;
     }
     firebaseRef.database().ref(path).on('value', (snapshot) => {
     var goalie = false;
     snapshot.forEach((child) => {
       if (child.val()._key == playerId && child.val().goalie == true){
         goalie = true;
       }
     });
     callback(goalie);
   });
  }

  static getPlayerNumber(userId, teamId, playerId, homeOpp, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Players/" + playerId;
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Players/" + playerId;
    path = homeOpp == 'home' ? homePath : oppPath;
    firebaseRef.database().ref(pathPlayerNumber).on('value', (snapshot) => {
      var number = "";
      if (snapshot.val()) {
        number = snapshot.val().number
      }
      callback(number)
    });
  }
  static getPlayer(userId, homeOpp, teamId, playerId, callback) {
    let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Players/" + playerId;
    let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Players/" + playerId;
    path = homeOpp == 'home' ? homePath : oppPath;
    firebaseRef.database().ref(path).on('value', (snapshot) => {
      var data = [];
      if (snapshot.val()) {
        data._key = snapshot.key;
        data.dob = snapshot.val().dob;
        data.email = snapshot.val().email;
        data.player = snapshot.val().player;
        data.number = snapshot.val().number;
        data.phone = snapshot.val().phone;
      }
      callback(data)
    });
  }

static setPlayers(userId, teamId, seasonId, gameId, homeOpp, players){
  let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
  let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
  var path = homeOpp == 'home' ? homePath : oppPath;
  return firebaseRef.database().ref(path).update({
    players: players,
  })
}

static setExpelledSubstitution(userId, teamId, seasonId, gameId, homeOpp, player, min, sec, half){
  let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/expelled-substitutions/" + player._key;
  let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/expelled-substitutions/" + player._key;
  var path = homeOpp == 'home' ? homePath : oppPath;
  return firebaseRef.database().ref(path).update({
    name: player.player,
    _key: player._key,
    number: player.number,
    half: half,
    min: min,
    sec: sec,
  })
}

static getExpelledSubstitution(userId, teamId, seasonId, gameId, homeOpp, callback){
  let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/expelled-substitutions/";
  let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/expelled-substitutions/";
  var path = homeOpp == 'home' ? homePath : oppPath;

  firebaseRef.database().ref(path).on('value', (snapshot) => {
    var data = [];
    snapshot.forEach((child) => {
      data.push({
        _key: child.key,
        playerId: child.val()._key,
        name: child.val().name,
        number : child.val().number,
        min : child.val().min,
        sec : child.val().sec,
        half : child.val().half,
      });
    });
    callback(data);
  });
}


static setExpelledPlayer(userId, teamId, seasonId, gameId, homeOpp, player){
  let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/expelled-players/" + player._key;
  let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/expelled-players/" + player._key;
  var path = homeOpp == 'home' ? homePath : oppPath;
  return firebaseRef.database().ref(path).update({
    player: player.player,
  })
}

static getExpelledPlayers(userId, teamId, seasonId, gameId, homeOpp, callback){
  let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/expelled-players/";
  let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/expelled-players/";
  var path = homeOpp == 'home' ? homePath : oppPath;

  firebaseRef.database().ref(path).on('value', (snapshot) => {
    var data = [];
    snapshot.forEach((child) => {
      data.push({
        _key: child.key,
      });
    });
    callback(data);
  });
}

//-----------------END-PRE-GAME----------------//

//-----------------IN-GAME----------------//

static getUndoAction(userId, teamId, seasonId, gameId, homeOpp, complexity, callback) {
  let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
  let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
  var path = homeOpp == 'home' ? homePath : oppPath;
  firebaseRef.database().ref(path).on('value', (snapshot) => {
    var action = [];
    if (snapshot.val()) {
      action.actionId = snapshot.val().lastActionId;
      action.actionPlayer = snapshot.val().lastActionPlayer;
      action.actionType = snapshot.val().lastActionType;
    } else {
      action.actionId = '';
    }
    callback(action)
  });
}

    static getLastAction(userId, teamId, seasonId, gameId, homeOpp, complexity, actionType, callback){
      let pathAttemptHome = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/actions/';
      let pathAttemptOpp = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/actions/';
      let pathTechErrorsHome = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/techErrors/';
      let pathTechErrorsOpp = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/techErrors/';
      let pathPenaltiesHome = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/penalties/';
      let pathPenaltiesOpp = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/penalties/';

      if (homeOpp == 'home'){
        if (actionType == 'attempt'){
          path = pathAttemptHome;
          firebaseRef.database().ref(path).limitToLast(1).on('child_added', (snapshot) => {
            var data = [];
            if (snapshot.val()) {
              data.actionId = snapshot.key;
              data.actionType = snapshot.val().outcome;
              data.playerId = snapshot.val().playerId;
            }
            callback(data)
          });
        } else if (actionType == 'penalty'){
          path = pathPenaltiesHome;
          firebaseRef.database().ref(path).limitToLast(1).on('child_added', (snapshot) => {
            var data = [];
            data.actionType = 'penalty';
            if (snapshot.val()) {
              data.actionId = snapshot.key;
              data.playerId = snapshot.val().playerId;
              data.penaltyType == snapshot.val().penaltyType;
            }
            callback(data)
          });
        } else if (actionType == 'techError'){
          path = pathTechErrorsHome;
          firebaseRef.database().ref(path).limitToLast(1).on('child_added', (snapshot) => {
            var data = [];
            data.actionType = 'techError';
            if (snapshot.val()) {
              data.actionId = snapshot.key;
              data.playerId = snapshot.val().playerId;
            }
            callback(data)
          });
        }
      } else if (homeOpp == 'opp'){
        if (actionType == 'attempt'){
          path = pathAttemptOpp;
          firebaseRef.database().ref(path).limitToLast(1).on('child_added', (snapshot) => {
            var data = [];
            if (snapshot.val()) {
              data.actionId = snapshot.key;
              data.actionType = snapshot.val().outcome;
              if (complexity == 1){
                data.playerId = snapshot.val().playerId;
              }
            }
            callback(data)
          });
        } else if (actionType == 'penalty'){
          path = pathPenaltiesOpp;
          firebaseRef.database().ref(path).limitToLast(1).on('child_added', (snapshot) => {
            var data = [];
            data.actionType = 'penalty';
            if (snapshot.val()) {
              data.actionId = snapshot.key;
              if (complexity == 1){
                data.playerId = snapshot.val().playerId;
              }
            }
            callback(data)
          });
        } else if (actionType == 'techError'){
          path = pathTechErrorsOpp;
          firebaseRef.database().ref(path).limitToLast(1).on('child_added', (snapshot) => {
            var data = [];
            data.actionType = 'techError';
            if (snapshot.val()) {
              data.actionId = snapshot.key;
              if (complexity == 1){
                data.playerId = snapshot.val().playerId;
              }
            }
            callback(data)
          });
        }
      }
    }


    static undoLastAction(userId, teamId, seasonId, gameId, homeOpp, actionType, actionId){
      let pathAttemptHome = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/actions/';
      let pathAttemptOpp = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/actions/';
      let pathTechErrorsHome = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/techErrors/';
      let pathTechErrorsOpp = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/techErrors/';
      let pathPenaltiesHome = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/penalties/';
      let pathPenaltiesOpp = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/penalties/';
      if (homeOpp == 'home'){
        if (actionType == 'goal' || actionType == 'save' || actionType == 'block' || actionType == 'miss'){
          path = pathAttemptHome;
          firebaseRef.database().ref(path).child(actionId).remove();
        } else if (actionType == 'penalty'){
          path = pathPenaltiesHome;
          firebaseRef.database().ref(path).child(actionId).remove();
        } else if (actionType == 'techError'){
          path = pathTechErrorsHome;
          firebaseRef.database().ref(path).child(actionId).remove();
        }
      } else if (homeOpp == 'opp'){
        if (actionType == 'goal' || actionType == 'save' || actionType == 'block' || actionType == 'miss'){
          path = pathAttemptOpp;
          firebaseRef.database().ref(path).child(actionId).remove();
        } else if (actionType == 'penalty'){
          path = pathPenaltiesOpp;
          firebaseRef.database().ref(path).child(actionId).remove();
        } else if (actionType == 'techError'){
          path = pathTechErrorsOpp;
          firebaseRef.database().ref(path).child(actionId).remove();
        }
      }
    }

    static setLastAction(userId, teamId, seasonId, gameId, homeOpp, complexity, action){
      let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
      let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
      if (homeOpp == 'home'){
        return firebaseRef.database().ref(homePath).update({
          lastActionId: action.actionId,
          lastActionType: action.actionType,
          lastActionPlayer: action.playerId,
        })
      } else if (homeOpp == 'opp'){
        if (complexity == 1){
          return firebaseRef.database().ref(oppPath).update({
            lastActionId: action.actionId,
            lastActionType: action.actionType,
            lastActionPlayer: action.playerId,
          })
        } else {
          return firebaseRef.database().ref(oppPath).update({
            lastActionId: action.actionId,
            lastActionType: action.actionType,
          })
        }
      }
    }

    static updateScore(userId, teamId, seasonId, gameId, homeOpp, score){
      let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
      let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
      var path = homeOpp == 'home' ? homePath : oppPath;
      var s;
      firebaseRef.database().ref(path).on('value', (snapshot) => {
        if (snapshot.val()) {
          s = snapshot.val().score;
        }
      });
      return firebaseRef.database().ref(path).update({
        score: s + score,
      })
    }

    static addOppTeamScore(userId, teamId, seasonId, gameId, homeOpp, score){
      let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
      let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId;
      var path = homeOpp == 'home' ? homePath : oppPath;
      return firebaseRef.database().ref(path).update({
        oppScore: score,
      })
    }
    static getAllPenalties(userId, teamId, seasonId, gameId, homeOpp, complexity, actionType, callback){
      let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/penalties/";
      let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + "/penalties/";
      var path = homeOpp == 'home' ? homePath : oppPath;
      firebaseRef.database().ref(path).on('value', (snapshot) => {
        var data = [];
        snapshot.forEach((child) => {
          data.push({
            actionId: child.key,
            playerId: child.val().playerId,
            penaltyType : child.val().penaltyType,
            min : child.val().min,
            sec : child.val().sec,
            half : child.val().half,
          });
        });
        callback(data);
      });
    }

    static addActionGame(userId, teamId, seasonId, gameId, homeOpp, action, complexity){
      let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/actions/';
      let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/actions/';
      var path = homeOpp == 'home' ? homePath : oppPath;

      if (homeOpp == 'home'){
        if (action.outcome == 'goal' || action.outcome == 'save'){
            return firebaseRef.database().ref(path).push({
              min: action.min,
              sec: action.sec,
              teamId: action.teamId,
              action: action.action,
              throwSelector: action.throwSelector,
              seasonId: action.seasonId,
              outcome: action.outcome,
              hitSelector: action.hitSelector,
              playerId: action.playerId,
              half:action.half,
            })
          } else if (action.outcome == 'block'){
            return firebaseRef.database().ref(path).push({
              min: action.min,
              sec: action.sec,
              teamId: action.teamId,
              action: action.action,
              throwSelector: action.throwSelector,
              seasonId: action.seasonId,
              outcome: action.outcome,
              defenceType: action.defenceType,
              playerId: action.playerId,
              half:action.half,
            })
          } else if (action.outcome == 'miss'){
            return firebaseRef.database().ref(path).push({
              min: action.min,
              sec: action.sec,
              teamId: action.teamId,
              action: action.action,
              throwSelector: action.throwSelector,
              seasonId: action.seasonId,
              outcome: action.outcome,
              playerId: action.playerId,
              half:action.half,
            })
          }
        }
        else if (homeOpp == 'opp'){
        if (action.outcome == 'goal' || action.outcome == 'save'){
          if (complexity == 1){
            return firebaseRef.database().ref(path).push({
              min: action.min,
              sec: action.sec,
              teamId: action.teamId,
              action: action.action,
              throwSelector: action.throwSelector,
              seasonId: action.seasonId,
              outcome: action.outcome,
              hitSelector: action.hitSelector,
              playerId: action.playerId,
              half:action.half,
            })
          } else {
            return firebaseRef.database().ref(path).push({
              min: action.min,
              sec: action.sec,
              teamId: action.teamId,
              action: action.action,
              throwSelector: action.throwSelector,
              seasonId: action.seasonId,
              outcome: action.outcome,
              hitSelector: action.hitSelector,
              half:action.half,
            })
          }
        } else if (action.outcome == 'block'){
          if (complexity ==1){
            return firebaseRef.database().ref(path).push({
              min: action.min,
              sec: action.sec,
              teamId: action.teamId,
              action: action.action,
              throwSelector: action.throwSelector,
              seasonId: action.seasonId,
              outcome: action.outcome,
              defenceType: action.defenceType,
              playerId: action.playerId,
              half:action.half,
            })
          } else {
            return firebaseRef.database().ref(path).push({
              min: action.min,
              sec: action.sec,
              teamId: action.teamId,
              action: action.action,
              throwSelector: action.throwSelector,
              seasonId: action.seasonId,
              outcome: action.outcome,
              defenceType: action.defenceType,
              half:action.half,
            })
          }
        } else if (action.outcome == 'miss'){
          if (complexity ==1){
            return firebaseRef.database().ref(path).push({
              min: action.min,
              sec: action.sec,
              teamId: action.teamId,
              action: action.action,
              throwSelector: action.throwSelector,
              seasonId: action.seasonId,
              outcome: action.outcome,
              playerId: action.playerId,
              half:action.half,
            })
          } else {
            return firebaseRef.database().ref(path).push({
              min: action.min,
              sec: action.sec,
              teamId: action.teamId,
              action: action.action,
              throwSelector: action.throwSelector,
              seasonId: action.seasonId,
              outcome: action.outcome,
              half:action.half,
            })
          }
        }
      }
    }

    static addTechErrorGame(userId, teamId, seasonId, gameId, homeOpp, action, complexity){
      let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/techErrors/';
      let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/techErrors/';
      var path = homeOpp == 'home' ? homePath : oppPath;
      if (homeOpp == 'home'){
        return firebaseRef.database().ref(path).push({
          min: action.min,
          sec: action.sec,
          teamId: action.teamId,
          seasonId: action.seasonId,
          errorType: action.errorType,
          playerId: action.playerId,
          half:action.half,
        })
      } else if (homeOpp == 'opp'){
        if (complexity == 1){
          return firebaseRef.database().ref(path).push({
            min: action.min,
            sec: action.sec,
            teamId: action.teamId,
            seasonId: action.seasonId,
            errorType: action.errorType,
            playerId: action.playerId,
            half:action.half,
          })
        } else {
          return firebaseRef.database().ref(path).push({
            min: action.min,
            sec: action.sec,
            teamId: action.teamId,
            seasonId: action.seasonId,
            errorType: action.errorType,
            half:action.half,
          })
        }
      }
    }

    static addPenaltyGame(userId, teamId, seasonId, gameId, homeOpp, action, complexity){
      let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/penalties/';
      let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/penalties/';
      var path = homeOpp == 'home' ? homePath : oppPath;
      if (homeOpp == 'home'){
        return firebaseRef.database().ref(path).push({
          min: action.min,
          sec: action.sec,
          teamId: action.teamId,
          seasonId: action.seasonId,
          penaltyType: action.penaltyType,
          playerId: action.playerId,
          half:action.half,
        })
      } else if (homeOpp == 'opp'){
        if (complexity == 1 ){
          return firebaseRef.database().ref(path).push({
            min: action.min,
            sec: action.sec,
            teamId: action.teamId,
            seasonId: action.seasonId,
            penaltyType: action.penaltyType,
            playerId: action.playerId,
            half:action.half,
          })
        } else {
          return firebaseRef.database().ref(path).push({
            min: action.min,
            sec: action.sec,
            teamId: action.teamId,
            seasonId: action.seasonId,
            penaltyType: action.penaltyType,
            half:action.half,
          })
        }
      }
    }

    static addSubstitution(userId, teamId, seasonId, gameId, homeOpp, half, player1, player2, min, sec){
      let homePath = "/users/" + userId + "/HomeTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/substitutions/';
      let oppPath = "/users/" + userId + "/OpponentTeams/" + teamId + "/Seasons/" + seasonId + "/Games/" + gameId + '/substitutions/';
      var path = homeOpp == 'home' ? homePath : oppPath;
      return firebaseRef.database().ref(path).push({
        player1: player1,
        player2: player2,
        min: min,
        sec: sec,
        half: half,
      })
    }

  }

  module.exports = Database;
