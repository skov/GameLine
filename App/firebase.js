import * as Firebase from "firebase";

var config = {
      apiKey: "AIzaSyBTHw46F7SrDL7_Bs54Hs1qjvwU-uCuflc",
      authDomain: "gameline-8e87e.firebaseapp.com",
      databaseURL: "https://gameline-8e87e.firebaseio.com",
      projectId: "gameline-8e87e",
      storageBucket: "gameline-8e87e.appspot.com",
      messagingSenderId: "1013381235156"
    };

export const firebaseRef = Firebase.initializeApp(config);
