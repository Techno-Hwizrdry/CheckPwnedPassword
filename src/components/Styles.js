import { StyleSheet } from "react-native";

const BLACK = '#000000';
const BACKGROUND = '#AFB8FA';
const DARKGRAY = '#333333';
const TITLE = "#2C0452";

const ELEVATION = 30;
const RADIUS = 12;
const SHADOW_SEARCHBUTTON = { height: -12, width: -12 };

const INPUTSHADOWS = {
  elevation: ELEVATION,
  shadowOffset: SHADOW_SEARCHBUTTON,
  shadowColor: '#62d5ff',
  shadowOpacity: 1.0,
  shadowRadius: 18
}

const styles = StyleSheet.create({
    comment: {
      textAlign: 'center',
      color: DARKGRAY,
      marginTop: 10
    },
    container: {
      alignItems: 'center',
      backgroundColor: BACKGROUND,
      elevation: 3,
      flex: 1,
      justifyContent: 'center'
    },
    input_text: {
      ...INPUTSHADOWS,
      backgroundColor: BACKGROUND,
      borderRadius: RADIUS,
      height: 40,
      width: 150,
      textAlign: 'center'
    },
    privacy_container: {
      color: BLACK,
      flexDirection: 'row',
      margin: 25,
      textAlign: 'center',
    },
    privacy_mode: {
      textAlign: 'center',
      color: DARKGRAY,
      marginBottom: 5
    },
    found: {
      color: "#C32CF5",
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 30,
      textAlign: 'center'
    },
    loading: {
      color: BLACK,
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 30,
      textAlign: 'center'
    },
    not_found: {
      color: TITLE,
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 30,
      textAlign: 'center'
    },
    searchbutton: {
      ...INPUTSHADOWS,
      alignItems: 'center',
      backgroundColor: BACKGROUND,
      borderRadius: RADIUS,
      color: BLACK,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    searchbuttontxt: {
      fontWeight: 'bold',
      padding: 10
    },
    welcome: {
      color: TITLE,
      fontSize: 30,
      textAlign: 'center',
      margin: 10,
      marginBottom: 30
    },
    instructions: {
      textAlign: 'center',
      color: DARKGRAY,
      marginBottom: 5
    },
  });

export { styles };