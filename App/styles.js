import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
container: {
  flex:1,
  zIndex:0,
  justifyContent:'center',
  width:null,
  height:null,
  backgroundColor:'rgba(0,0,0,0)',
},
nav: {
  zIndex:1,
  flex:1,
  top:20,
  height:'auto',
  flexDirection:'row',
  justifyContent: 'space-between',
},
headingSmall:{
  fontSize:14,
  paddingTop:10,
  paddingBottom:5,
  fontWeight:'bold',
  alignSelf:'center',
  color:'#333',
},
headingSmallNoPadding:{
  fontSize:16,
  marginTop:-30,
  alignSelf:'center',
  color:'#fff',
},
navWrapper: {
  flex:1,
  paddingLeft:10,
  paddingRight:20,
  maxHeight:64,
  //backgroundColor:'blue',
  justifyContent:'center',
  alignItems:'center',
  top:0,
},
borderWhite:{
  borderWidth:1,
  borderColor:'#fff',
  borderRadius:5,
},
barTitle:{
  textAlign:'center',
  justifyContent:'center',
  color:'#fff',
  alignSelf:'center',
  fontSize:18,
},
barText:{
  color:'#fff',
  paddingTop:5,
  fontSize:10,
},
leftNav:{
  paddingLeft:10,
  justifyContent: 'center',
  alignItems: 'center',
  width: 30,
  height: 50,
},
topNavLeft:{
  justifyContent: 'center',
  alignItems: 'center',
  width: 20,
  height: 20,
  resizeMode:'stretch',
  alignSelf:'center',
},
titleNav:{
  justifyContent: 'center',
  alignItems: 'center',
  width: 275,
  height: 50,
},
rightNav:{
  justifyContent: 'center',
  alignItems: 'center',
  width: 30,
  height: 50,
},
topNavRight:{
  justifyContent: 'center',
  alignItems: 'center',
  width: 26,
  height: 26,
  resizeMode:'stretch',
  alignSelf:'center',
},



//BOTTOM NavigationBar
navBottom: {
  flex:1,
  height:60,
  backgroundColor:'rgba(0,0,0,0.1)',
  borderTopWidth:1,
  borderColor:'#fff',
  flexDirection:'row',
  justifyContent: 'flex-start',
  bottom:0,
},
navBottomWrapper: {
  flex:1,
  maxHeight:64,
  bottom:0,
  left:0,
},
barTitle:{
  color:'#fff',
  fontSize:16,
},
barText:{
  color:'#fff',
  paddingTop:2,
  fontSize:8,
},
barTextActive:{
  color:'#302e2e',
  paddingTop:5,
  fontSize:10,
},
centerNav:{
  padding:10,
  alignSelf:'center',
  justifyContent: 'center',
  alignItems: 'center',
  width: 125,
  height: 50,
},
bottomActive:{
  marginTop:5,
  paddingLeft:10,
  justifyContent: 'center',
  alignItems: 'center',
  width: 26,
  height: 26,
  resizeMode:'stretch',
  alignSelf:'center',
},
bottomUnActive:{
  marginTop:5,
  paddingLeft:10,
  justifyContent: 'center',
  alignItems: 'center',
  width: 26,
  height: 26,
  resizeMode:'stretch',
  alignSelf:'center',
},

//-END NAVIGATION

picContainer:{
  width:90,
  height:90,
  resizeMode:'stretch',
  borderWidth:1,
  borderColor:'#fff',
  borderRadius:45,
  alignItems:'center',
},
picContainerBold:{
  width:96,
  height:96,
  resizeMode:'stretch',
  borderWidth:2,
  borderColor:'#fff',
  borderRadius:46,
  alignItems:'center',
},

teamInfo:{
  alignItems:'center',
  padding:4,
  flex:1,
},
gameInfo:{
  alignItems:'center',
  padding:4,
  flex:1,
},

gameTop:{
  padding:10,
  alignItems:'center',
  alignSelf:'flex-start',
  top:0,
  flexDirection:'row',
},
statisticsTop:{
  height:'auto',
  alignItems:'center',
  alignSelf:'center',
  flexDirection:'row',
},
viewGame:{
  paddingTop:20,
  flex:1,
  justifyContent:'space-between',
  flexDirection:'column',
  alignItems:'center',
},
viewGameBottom:{
  flex:1,
  justifyContent:'center',
  flexDirection:'column',
  alignItems:'center',
},

gamebtn:{
  height:40,
  width:150,
  flexDirection:'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  borderColor:'#fff',
  borderRadius:5,
  margin:5,
  borderWidth:1,
  paddingLeft:10,
  paddingRight:10,
  paddingTop:5,
  paddingBottom:5,
},

gamebtnTrans:{
  height:40,
  width:150,
  flexDirection:'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  borderRadius:5,
  margin:5,
  paddingLeft:10,
  paddingRight:10,
  paddingTop:5,
  paddingBottom:5,
},
viewMain:{
  justifyContent: 'center',
  alignSelf:'center',
  alignItems: 'center',
  flex:1,
  paddingBottom:5,
},

viewPositions:{
  flexDirection:'row',
},

switchBtn:{
  justifyContent:'center',
  alignItems:'center',
  alignSelf:'center',
  width:55,
  height:40,
},
datePicker:{
  alignSelf:'center',
  height: 35,
  marginBottom: 10,
  borderWidth: 1,
  borderRadius:5,
  borderColor: '#ffffff',
},
numberPicker:{
  alignSelf:'center',
  height: 40,
  margin: 5,
  color:'#fff',
  width:120,
  fontSize:16,
  textAlign: 'center',
  borderBottomWidth: 1,
  borderColor: '#ffffff',
},
name:{
  alignSelf:'center',
  width:150,
  height:50,
  resizeMode: 'contain',
},
logo:{
  alignSelf:'center',
  width:80,
  height:80,
  resizeMode: 'contain',
},
name2:{
  alignSelf:'center',
  width:200,
  height:80,
  resizeMode: 'contain',
},
logo2:{
  alignSelf:'center',
  width:150,
  height:150,
  resizeMode: 'contain',
},
profile:{
  alignSelf:'center',
  justifyContent:'center',
  alignItems:'center',
  width:80,
  height:80,
  resizeMode: 'contain',
  borderWidth: 1,
  borderRadius:40,
  borderColor: '#ffffff',
},
profileBig:{
  alignSelf:'center',
  justifyContent:'center',
  alignItems:'center',
  width:130,
  height:130,
  resizeMode: 'contain',
  borderWidth: 1,
  borderRadius:65,
  borderColor: '#ffffff',
},
icon: {
  width: 26,
  height: 26,
},
borderView:{
  alignSelf:'center',
  justifyContent:'center',
  alignItems:'center',
  width:90,
  height:90,
  padding:10,
  borderWidth: 1,
  borderRadius:100,
  borderColor: '#ffffff',
},
borderViewBig:{
  alignSelf:'center',
  justifyContent:'center',
  alignItems:'center',
  width:140,
  height:140,
  padding:10,
  marginBottom:20,
  borderWidth: 1,
  borderRadius:70,
  borderColor: '#ffffff',
},
textSize16:{
  alignSelf:'center',
  textAlign:'center',
  color:'#fff',
  backgroundColor:'rgba(0,0,0,0)',
  fontSize:16,
  marginBottom:5,
  fontFamily: 'AvenirNext-Medium',
},
textSize16a:{
  alignSelf:'center',
  textAlign:'center',
  color:'#fff',
  backgroundColor:'rgba(0,0,0,0)',
  fontSize:16,
  margin:0,
  fontFamily: 'AvenirNext-Medium',
},
textSize14:{
  alignSelf:'center',
  textAlign:'center',
  color:'#fff',
  fontSize:14,
  marginBottom:10,
  fontFamily: 'AvenirNext-Medium',
},
textSize14a:{
  alignSelf:'center',
  textAlign:'center',
  color:'#fff',
  fontSize:14,
  fontFamily: 'AvenirNext-Medium',
},
textSize12:{
  alignSelf:'center',
  textAlign:'center',
  color:'#fff',
  fontSize:12,
  marginBottom:5,
  fontFamily: 'AvenirNext-Medium',
},
textSize12a:{
  alignSelf:'center',
  textAlign:'center',
  color:'#fff',
  fontSize:12,
  margin:0,
  fontFamily: 'AvenirNext-Medium',
},
textSize10:{
  alignSelf:'center',
  textAlign:'center',
  color:'#fff',
  fontSize:10,
  marginTop:5,
  marginBottom:0,
  fontFamily: 'AvenirNext-Medium',
},
textSize10Black:{
  alignSelf:'center',
  textAlign:'center',
  color:'#333',
  fontSize:10,
  marginTop:5,
  marginBottom:0,
  fontFamily: 'AvenirNext-Medium',
},
textSize10a:{
  marginTop:0,
  alignSelf:'center',
  textAlign:'center',
  color:'#fff',
  fontSize:11,
  marginBottom:2,
  fontFamily: 'AvenirNext-Medium',
},

textSize10TableLeft:{
  margin:0,
  textAlign:'left',
  color:'#fff',
  fontSize:10,
  fontFamily: 'AvenirNext-Medium',
  paddingLeft:5,
  width:70,
},

textSize10TableRight:{
  margin:0,
  paddingRight:5,
  textAlign:'right',
  color:'#fff',
  fontSize:10,
  width:35,
  fontFamily: 'AvenirNext-Medium',
},
textSize10TableCenter:{
  marginRight:5,
  marginLeft:5,
  textAlign:'center',
  color:'#fff',
  fontSize:10,
  width:50,
  fontFamily: 'AvenirNext-Medium',
},
tintedBg:{
  padding:5,
  backgroundColor:'rgba(0,0,0,0.4)',
},
noTintedBg:{
  padding:5,
  backgroundColor:'rgba(0,0,0,0)',
},
textSize10TableCenterA:{
  marginRight:4,
  marginLeft:4,
  textAlign:'center',
  color:'#fff',
  fontSize:9,
  width:85,
  fontFamily: 'AvenirNext-Medium',
},
table:{
  justifyContent:'space-between',
  flexDirection:'row',
  paddingTop:2,
  paddingBottom:2,
  borderBottomWidth:1,
  borderColor:'#fff',
},
tableHeading:{
  backgroundColor:'rgba(255,255,255,0.15)',
  justifyContent:'space-between',
  flexDirection:'row',
  paddingTop:2,
  paddingBottom:2,
  borderBottomWidth:3,
  borderColor:'#fff',
},

tableLast:{
  justifyContent:'space-between',
  flexDirection:'row',
  paddingTop:2,
  paddingBottom:2,
},

tableWrapper:{
  flexDirection:'column',
  borderColor:'#fff',
  borderWidth:1,

  borderRadius:5,
},
textAlert:{
  borderColor:'#000',
  borderRadius:5,
  borderWidth:1,
  padding:5,
  marginBottom:-5,
},

textSize10Left:{
  textAlign:'left',
  width:120,
  justifyContent:'flex-start',
  color:'#fff',
  fontSize:11,
  marginBottom:2,
  fontFamily: 'AvenirNext-Medium',
},
textSize10LeftIndented:{
  textAlign:'left',
  width:100,
  justifyContent:'flex-start',
  color:'#fff',
  fontSize:12,
  marginBottom:2,
  fontFamily: 'AvenirNext-Medium',
},

textSize10Right:{
  width:40,
  justifyContent:'flex-end',
  textAlign:'right',
  alignSelf:'flex-end',
  color:'#fff',
  fontSize:12,
  marginBottom:2,
  fontFamily: 'AvenirNext-Medium',
},
statsWrapper:{
  paddingLeft:20,
  paddingRight:20,
  marginTop:-20,
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'flex-start',
},
statsView:{
  flex:1,
  justifyContent:'center',
  backgroundColor:'rgba(0,0,0,0)',
  padding:5,
  paddingTop:10,
  marginLeft:5,
  marginRight:5,
},
scrollViewStats:{
  flex:3,
},

throwPositionText:{
  textAlign:'center',
  borderWidth:1,
  width:36,
  height:36,
  borderColor:'#fff',
  padding:8,
  color:'#fff',
  fontSize:14,
  borderRadius:18,
},
statsView2:{
  width:300,
  backgroundColor:'rgba(0,0,0,0)',
  borderWidth:1,
  borderColor:'#fff',
  borderRadius:10,
  marginTop:40,
  padding:5,
  paddingLeft:70,
},



statsButton:{
  width:250,
  alignSelf:'flex-start',
  flexDirection:'row',
},
statsButtonIndented:{
  marginLeft:20,
  width:180,
  alignSelf:'flex-start',
  flexDirection:'row',
},
containedText:{
  width:150,
  alignSelf:'center',
},
controls:{
  width:330,
  alignSelf:'center',
},
playerNumber:{
  fontSize:16,
  color:'#fff',
  padding:4,
  marginLeft:15,
  borderWidth:1,
  borderColor:"#fff",
  borderRadius:14,
  width:28,
  height:28,
  textAlign:'center',
},
playerNumberSmall:{
  fontSize:12,
  color:'#fff',
  padding:4,
  marginRight:8,
  borderWidth:1,
  borderColor:"#fff",
  borderRadius:11,
  width:22,
  height:22,
  textAlign:'center',
},
playerNumberBlocked:{
  color:'#666',
  fontSize:16,
  padding:4,
  marginLeft:15,
  borderWidth:1,
  borderColor:"#666",
  borderRadius:14,
  width:28,
  height:28,
  textAlign:'center',
},
emptyListText:{
  marginTop:5,
  width:330,
  alignSelf:'center',
  textAlign:'center',
  color:'#fff',
  fontSize:14,
  marginBottom:5,
  fontFamily: 'AvenirNext-Medium',
},
infoBtn:{
  borderRadius:9,
  borderWidth:1,
  width:18,
  height:18,
  paddingLeft:7,
  paddingTop:1,
  marginLeft:8,
  marginBottom:-3,
  borderColor:'#333',
  color:'#333',
  alignSelf:'center',
  alignItems:'center',
},
headingView:{
  flexDirection:'row',
  alignItems:'center',
  alignSelf:'center',
},

// VIEW LAYOUTS

paddedBox:{
  paddingTop:10,
  paddingLeft:5,
  paddingRight:5,
},
paddedBox2:{
  paddingTop:5,
  paddingLeft:5,
  paddingRight:5,
},
horizontalView:{
  flexDirection:'row',
  justifyContent:'space-between',
  alignSelf:'center',
  alignItems:'center',
},
horizontalViewOverline:{
  borderTopWidth:1,
  width:330,
  borderColor:'#fff',
  flexDirection:'row',
  justifyContent:'space-between',
  alignSelf:'center',
  alignItems:'center',
},
horizontalViewSpaceBetween:{
  width:330,
  flexDirection:'row',
  justifyContent:'space-between',
  alignSelf:'center',
  alignItems:'center',
},

verticalView:{
  flex:1,
  flexDirection:'column',
  justifyContent:'center',
  alignSelf:'center',
  alignItems:'center',
  paddingLeft:5,
  paddingRight:5,
},
verticalSpacedView:{
  marginTop:10,
  height:80,
  justifyContent:'center',
  alignSelf:'center',
  alignItems:'center',
},
verticalSpacedView2:{
  height:100,
  justifyContent:'center',
  alignSelf:'center',
  alignItems:'center',
},
verticalSpacedView3:{
  height:80,
  marginTop:30,
  justifyContent:'center',
  alignSelf:'center',
  alignItems:'center',
},
horizontalSpacedView:{
  flexDirection:'row',
  width:120,
  margin:5,
  justifyContent:'center',
  alignSelf:'center',
  alignItems:'center',
},
searchContainer:{
  width:340,
  height:40,
  alignSelf:'baseline',
},
wireView:{
  borderWidth: 1,
  borderRadius:5,
  borderColor: '#ffffff',
  margin:10,
  padding:5,
  width:200,
},







input:{
  alignSelf:'center',
  height: 40,
  marginTop: 5,
  width:250,
  fontSize: 16,
  textAlign:'center',
  borderBottomWidth:1,
  borderColor: '#ffffff',
  color:'#ffffff',
  fontFamily: 'AvenirNext-Medium',
},

heading: {
  alignSelf:'center',
  fontSize: 20,
  color:'#ffffff',
  fontFamily: 'AvenirNext-Medium',
},

//Lists
search:{
  flex:1,
},
flatList:{
  flex:1,
  alignSelf:'center',
  borderWidth:1,
  borderColor:'#fff',
  borderRadius:5,
  paddingLeft:0,
  paddingRight:0,
},
flatListSmall:{
  flex:1,
  borderWidth:1,
  height:250,
  borderColor:'#fff',
  borderRadius:5,
  paddingLeft:10,
  paddingRight:10,
},
flatListTechErrors:{
  flex:1,
  borderRadius:5,
  height:100,
},
flatListStats:{
  flex:1,
  borderWidth:1,
  borderColor:'#fff',
  borderRadius:5,
},
flatlistContainer:{
  height:200,
},
flatlistContainerBig:{
  height:400,
},
list:{
  justifyContent: 'space-between',
  flex:1,
  alignSelf: 'center',
  alignItems: 'center',
  flexDirection:'row',
  borderBottomWidth:1,
  borderColor:'#fff',
  paddingLeft:0,
  paddingRight:0,
  paddingTop:5,
  paddingBottom:5,
  width:330,
},

listGame:{
  justifyContent: 'space-between',
  flex:1,
  alignSelf: 'center',
  alignItems: 'center',
  flexDirection:'row',
  borderBottomWidth:1,
  borderColor:'#fff',
  paddingLeft:0,
  paddingRight:0,
  paddingTop:2,
  paddingBottom:2,
},

listLeft:{
  flex:1,
  justifyContent: 'flex-start',
  alignSelf: 'center',
  alignItems: 'center',
  flexDirection:'row',
  borderBottomWidth:1,
  borderColor:'#fff',
  paddingLeft:0,
  paddingRight:0,
  paddingTop:5,
  paddingBottom:5,
  width:310,
},
listStats:{
  flex:1,
  flexDirection:'row',
  borderBottomWidth:1,
  borderColor:'#fff',
  paddingTop:4,
  paddingBottom:4,
},
listBlocked:{
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'space-between',
  flex:1,
  alignSelf: 'center',
  alignItems: 'center',
  flexDirection:'row',
  borderBottomWidth:1,
  borderColor:'#fff',
  paddingLeft:0,
  paddingRight:0,
  paddingTop:5,
  paddingBottom:5,
  width:330,
},
listOffField:{
  justifyContent: 'space-between',
  flex:1,
  flexDirection:'row',
  borderBottomWidth:1,
  borderColor:'#fff',
  paddingTop:5,
  paddingBottom:5,
  backgroundColor:'#3f3c3c',
  width:310,
},
listItem:{
  color:'#fff',
  paddingTop:2,
  paddingBottom:2,
  fontSize:12,
  width:200,
  alignSelf:'flex-start',
  justifyContent:'flex-start',
},

listItem4:{
  color:'#fff',
  paddingTop:0,
  color:'#333',
  paddingBottom:2,
  alignSelf:'center',
  fontSize:12,
},
listItemSmall:{
  color:'#fff',
  paddingTop:5,
  paddingBottom:5,
  flex:1,
  fontSize:10,
},
listItem2:{
  color:'#fff',
  paddingTop:5,
  paddingBottom:5,
  marginLeft:15,
  fontSize:14,
  width:195,
},
listItem3:{
  color:'#fff',
  paddingTop:5,
  textAlign: 'center',
  fontSize:14,
  width:300,
},
listItemLeft:{
  color:'#fff',
  paddingTop:5,
  textAlign: 'left',
  fontSize:14,
  width:200,
  paddingLeft:10,
},
listItem2Blocked:{
  color:'#666',
  paddingTop:5,
  paddingBottom:5,
  width:195,
  fontSize:14,
},


//BUTTONS
buttonBlack: {
  alignSelf:'center',
  height: 40,
  backgroundColor: '#3f3c3c',
  width:150,
  margin: 10,
  borderRadius:5,
  borderColor:'#3f3c3c',
  borderWidth: 1,
  justifyContent: 'center',
},
buttonOrange: {
  alignSelf:'center',
  height: 40,
  backgroundColor: '#c06a42',
  width:150,
  margin:5,
  borderRadius:5,
  borderColor:'#c06a42',
  borderWidth: 1,
  justifyContent: 'center',
},
buttonOrangeSmall: {
  alignSelf:'center',
  height: 35,
  backgroundColor: '#c06a42',
  width:140,
  marginTop: 10,
  marginLeft:10,
  marginRight:10,
  borderRadius:5,
  borderColor:'#c06a42',
  borderWidth: 1,
  justifyContent: 'center',
},
buttonOrangeXSmall: {
  alignSelf:'center',
  height: 30,
  backgroundColor: '#c06a42',
  width:95,
  marginTop: 10,
  marginLeft:5,
  marginRight:5,
  borderRadius:5,
  borderColor:'#c06a42',
  borderWidth: 1,
  justifyContent: 'center',
},
buttonTransparent: {
  alignSelf:'center',
  height: 40,
  backgroundColor: 'rgba(0,0,0,0)',
  width:150,
  margin:5,
  borderRadius:5,
  borderColor:'#ffffff',
  borderWidth: 1,
  justifyContent: 'center',
},
buttonTransparentSmall: {
  alignSelf:'center',
  height: 30,
  backgroundColor: 'rgba(0,0,0,0)',
  width:140,
  margin: 10,
  borderRadius:5,
  borderColor:'#ffffff',
  borderWidth: 1,
  justifyContent: 'center',
},
buttonTransparentSmallThin: {
  alignSelf:'center',
  height: 25,
  backgroundColor: 'rgba(0,0,0,0)',
  width:200,
  marginTop: 10,
  marginBottom: 10,
  marginLeft:10,
  marginRight:10,
  borderRadius:5,
  borderColor:'#ffffff',
  borderWidth: 1,
  justifyContent: 'center',
},
buttonTransparentXSmall: {
  alignSelf:'center',
  height: 30,
  backgroundColor: 'rgba(0,0,0,0)',
  width:95,
  marginTop: 10,
  marginLeft:5,
  marginRight:5,
  borderRadius:5,
  borderColor:'#ffffff',
  borderWidth: 1,
  justifyContent: 'center',
},
buttonTextWhite: {
  fontSize: 16,
  fontFamily: 'AvenirNext-Medium',
  color: '#FFF',
  alignSelf: 'center',
  alignItems:'center',
  justifyContent: 'center',
},
buttonTextWhiteSmall: {
  fontSize: 16,
  height:20,
  fontFamily: 'AvenirNext-Medium',
  color: '#FFF',
  alignSelf: 'center',
  alignItems:'center',
  justifyContent: 'center',
},
gamebtnIcon:{
  height:30,
  width:30,
  marginRight:10,
},
gamebtnText:{
  color:'white',
},

undoButton:{
  alignSelf:'center',
  alignItems:'center',
  height: 25,
  backgroundColor: '#ffffff',
  width:100,
  marginTop: 10,
  marginBottom:20,
  marginLeft:10,
  marginRight:10,
  borderRadius:5,
  borderColor:'#ffffff',
  borderWidth: 1,
  justifyContent: 'center',
},

// LIST BUTTONS
listButtonBlack:{
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:5,
  borderWidth:1,
  padding:5,
  marginRight:15,
  height:28,
  width:65,
  alignItems:'center',
  borderColor:'#3f3c3c',
},
listButtonWhite:{
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:5,
  borderWidth:1,
  padding:5,
  marginRight:15,
  height:28,
  width:65,
  alignItems:'center',
  borderColor:'#fff',
},
listButtonTransparent:{
  alignSelf:'center',
  alignItems:'center',
  justifyContent: 'center',
  borderColor:'#fff',
  borderWidth:1,
  borderRadius:5,
  padding:5,
  height:28,
  width:65,
  marginRight:0,
  marginLeft:5,
},
listButtonText:{
  fontSize:12,
  color:'#333',
  fontWeight:'600',
},
listButtonTextWhite:{
  fontSize:12,
  color:'#fff',
  fontWeight:'600',
},
position:{
  width:72,
  height:72,
  backgroundColor:'rgba(0,0,0,0)',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:40,
  marginLeft:5,
  marginRight:5,
  marginBottom:5,
  borderWidth:1,
  borderColor:'#fff',
},
positionGoalie:{
  width:72,
  marginBottom:2,
  height:72,
  backgroundColor:'rgba(0,0,0,0)',
  borderWidth:1,
  borderColor:'#3f3c3c',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:40,
},
positionTransparent:{
  width:72,
  height:72,
  backgroundColor:'#3f3c3c',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:40,
  borderWidth:1,
  borderColor:'#fff',
  margin:1,
},
positionSubstitute:{
  width:72,
  height:72,
  backgroundColor:'red',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:40,
  borderWidth:1,
  borderColor:'#fff',
  margin:1,
},
positionByWho:{
  width:100,
  height:100,
  padding:10,
  backgroundColor:'rgba(0,0,0,0)',
  borderWidth:1,
  borderColor:'#fff',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:50,
  margin:10,
},
positionByWhoBlocked:{
  width:100,
  height:100,
  padding:10,
  backgroundColor:'#3f3c3c',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:50,
  margin:10,
},
positionContainer:{
  flex:1,
  alignSelf:'center',
  alignItems:'center',
  justifyContent: 'center',
  margin:10,
},
positionNum:{
  alignSelf:'center',
  textAlign:'center',
  fontSize:14,
  justifyContent: 'center',
  color:'#fff',
},
positionNumBlack:{
  alignSelf:'center',
  textAlign:'center',
  fontSize:14,
  justifyContent: 'center',
  color:'#3f3c3c',
},
positionNumber:{
  alignSelf:'center',
  textAlign:'center',
  fontSize:16,
  justifyContent: 'center',
  color:'#fff',
},
positionNumber:{
  alignSelf:'center',
  textAlign:'center',
  fontSize:16,
  justifyContent: 'center',
  color:'#3f3c3c',
},
positionName:{
  alignSelf:'center',
  textAlign:'center',
  fontSize:12,
  justifyContent: 'center',
  color:'#fff',
},

positionName1:{
  alignSelf:'center',
  textAlign:'center',
  fontSize:9,
  backgroundColor:'rgba(0,0,0,0)',
  width:60,
  justifyContent: 'center',
  color:'#fff',
},
positionName1Black:{
  alignSelf:'center',
  textAlign:'center',
  fontSize:9,
  backgroundColor:'rgba(0,0,0,0)',
  width:60,
  justifyContent: 'center',
  color:'#3f3c3c',
},
hitSelectorWrapper:{
  paddingTop:3,
  marginBottom:5,
  flex:1,
  width:200,
  borderColor:"#ffffff",
  borderWidth:4,
  borderBottomWidth:0,
  borderTopLeftRadius:5,
  borderTopRightRadius:5,
  alignItems:'center',
  alignSelf:'center',
},

hitSelectorWrapper2:{
  paddingTop:3,
  marginBottom:5,
  height:218,
  width:320,
  borderColor:"#ffffff",
  borderWidth:4,
  borderBottomWidth:0,
  borderTopLeftRadius:5,
  borderTopRightRadius:5,
  alignItems:'center',
  alignSelf:'center',
},
throwSelector1:{
  marginBottom:5,
  flex:1,
  height:120,
  borderColor:"#ffffff",
  borderWidth:1,
  borderRadius:5,
  alignItems:'center',
},
throwSelector1B:{
  marginBottom:5,
  height:230,
  borderColor:"#ffffff",
  borderWidth:1,
  borderRadius:5,
  alignItems:'center',
},
throwSelector2:{
  marginTop:-1,
  width:300,
  height:75,
  borderColor:"#ffffff",
  borderWidth:1,
  alignItems:'center',
  borderBottomRightRadius:150,
  borderBottomLeftRadius:150,
},
throwSelector2B:{
  marginTop:-1,
  width:300,
  height:150,
  borderColor:"#ffffff",
  borderWidth:1,
  alignItems:'center',
  borderBottomRightRadius:65,
  borderBottomLeftRadius:65,
},
throwSelector3:{
  marginTop:-1,
  width:200,
  height:30,
  borderColor:"#ffffff",
  borderWidth:1,
  alignItems:'center',
  borderBottomRightRadius:100,
  borderBottomLeftRadius:100,
},
throwSelector3B:{
  marginTop:-1,
  width:200,
  height:80,
  borderColor:"#ffffff",
  borderWidth:1,
  alignItems:'center',
  borderBottomRightRadius:60,
  borderBottomLeftRadius:60,
},

hSelector:{
  width:62,
  padding:0,
  borderWidth:1,
  borderColor:'#fff',
  marginBottom:-1,
},
hSelectorB:{
  width:62,
  padding:5,
  borderWidth:1,
  borderColor:'#fff',
  paddingLeft:8,
  paddingRight:8,
  marginBottom:-1,
  borderBottomWidth:0,
},
selector1:{
  width:40,
  marginLeft:10,
  marginRight:10,
  marginTop:5,
},
selector2:{
  width:40,
  marginLeft:10,
  marginRight:10,
},
selector3:{
  width:40,
  marginLeft:8,
  marginRight:8,
  marginTop:-55,
},
selector4:{
  width:40,
  marginLeft:65,
  marginRight:65,
  marginTop:5,
},
selector5:{
  width:40,
  marginLeft:30,
  marginRight:30,
  marginTop:-20,
},


selector1B:{
  width:40,
  marginLeft:12,
  marginRight:12,
  marginTop:20,
},
selector2B:{
  width:40,
  marginLeft:12,
  marginRight:12,
  marginTop:10,
},
selector3B:{
  width:40,
  marginLeft:5,
  marginRight:5,
  marginTop:-55,
},
selector4B:{
  width:40,
  marginLeft:65,
  marginRight:65,
  marginTop:20,
},
selector5B:{
  width:40,
  marginLeft:30,
  marginRight:30,
  marginTop:-20,
},

throwSelectorAround:{
  width:300,
  height:380,
  borderColor:"#ffffff",
  borderWidth:1,
  alignItems:'center',
},
throwSelectorNetAround2:{
  marginTop:-1,
  width:300,
  height:240,
  borderColor:"#ffffff",
  borderWidth:1,
  alignItems:'center',
  borderBottomRightRadius:100,
  borderBottomLeftRadius:100,
},
throwSelectorNetAround:{
  marginTop:-1,
  width:200,
  height:120,
  borderColor:"#ffffff",
  borderWidth:1,
  alignItems:'center',
  borderBottomRightRadius:70,
  borderBottomLeftRadius:70,
},
throwSelectorNet:{
  marginTop:-1,
  height:50,
  width:80,
  borderColor:"#ffffff",
  borderWidth:1,
},
throwSelector:{
  borderColor:"#ffffff",
  borderWidth:1,
},

throwSelectorWrapper1:{
  flexDirection:'row',
},

positionThrowSelector1:{
  width:50,
  height:50,
  padding:10,
  backgroundColor:'#3f3c3c',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:50,
  marginTop:-100,
  marginRight:60,
  marginLeft:-60,
},
positionThrowSelector2:{
  width:50,
  height:50,
  padding:10,
  backgroundColor:'#3f3c3c',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:50,
  margin:10,
},
positionThrowSelector3:{
  width:50,
  height:50,
  padding:10,
  backgroundColor:'#3f3c3c',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:50,
  marginTop:-100,
  marginLeft:60,
  marginRight:-60,
},
positionThrowSelector1:{
  width:50,
  height:50,
  padding:10,
  backgroundColor:'#3f3c3c',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:50,
  marginTop:-100,
  marginRight:60,
  marginLeft:-60,
},
positionThrowSelector2:{
  width:50,
  height:50,
  padding:10,
  backgroundColor:'#3f3c3c',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:50,
  margin:10,
},
positionThrowSelector3:{
  width:50,
  height:50,
  padding:10,
  backgroundColor:'#3f3c3c',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:50,
  marginTop:-100,
  marginLeft:60,
  marginRight:-60,
},
positionThrowSelector4:{
  width:50,
  height:50,
  padding:10,
  backgroundColor:'#3f3c3c',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:50,
  marginRight:60,
  marginLeft:-60,
  marginTop:-70,
},
positionThrowSelector5:{
  width:50,
  height:50,
  padding:10,
  backgroundColor:'#3f3c3c',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:50,
  marginTop:70,
},
positionThrowSelector6:{
  width:50,
  height:50,
  padding:10,
  backgroundColor:'#3f3c3c',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:50,
  marginLeft:60,
  marginRight:-60,
  marginTop:-70,
},
positionThrowSelector7:{
  width:50,
  height:50,
  padding:10,
  backgroundColor:'#c06a42',
  alignSelf:'center',
  justifyContent: 'center',
  borderRadius:50,
  marginBottom:-50,
  marginTop:30,
},
textSize8:{
  fontSize:8,
  marginTop:3,
  color:'#ffffff',
  textAlign:'center',
},
positionHitSelectorContainer:{
  borderWidth:1,
  borderColor:'#ffffff',
},
positionHitSelector:{
  borderWidth:1,
  borderColor:'#ffffff',
  width:100,
  height:70,
},
positionHitSelectorB:{
  borderWidth:1,
  borderColor:'#ffffff',
  borderBottomWidth:0,
  width:100,
  height:70,
},


//NAVIGATION top

//NAVIGATION bottom


});
