

import React, { Component } from 'react';
import { Button, Platform, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { sha1 } from 'react-native-sha1';


const PASSWORD_API = "https://api.pwnedpasswords.com/range/"
const PREFIX_CHARS = 5  // Amount of characters in the hash prefix.
const PRIVACY_MODE = "#C5D4ED"

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props)

    this.state = { text: 'Stuff',
                   hashes: 0,
                   loaded: false,
                   loading: false,
                   privacy_mode: false,
                 }
    this.onSearchButtonPress = this.onSearchButtonPress.bind(this);
    this.onTogglePrivacyMode = this.onTogglePrivacyMode.bind(this);
  };

  /*
    This method will convert the text response, from the API fetch,
    to a JSON object so that a search for input hash can be conducted.
  */
  textResponseToJSON(raw_text) {
    let text = raw_text.replace(/\r?\n|\r/g, '\",\"')

    text = '\"' + text.replace(/:/g, "\":\"") + '\"'

    return  JSON.parse('\{' + text + '\}' )
  }

  async getHashSuffixesFromApi(hash) {
    const hash_prefix = hash.substring(0, PREFIX_CHARS)
    const hash_suffix = hash.substring(PREFIX_CHARS)
    const url = PASSWORD_API + hash_prefix.toString()

    return fetch(url)
    .then((response) => {
      return response.text()  // Just text is fetched from the API.
    })
    .then((responseJson) => {
      returned_hashes = this.textResponseToJSON(responseJson)
      
      /* Check if the hash is in the results.  If it is, then
         set the state to the count of database breaches the
         hash was found in.  Otherwise, set the state to 0.
       */
      let database_breach_count = 0;

      if (hash_suffix in returned_hashes) {
        database_breach_count = returned_hashes[hash_suffix];
      }

      this.setState( {hashes: database_breach_count} )
      this.setState( {loaded: true} )
      this.setState( {loading: false} )
    })
    .catch((error) => {
      console.error(error);
    });
  }

  onSearchButtonPress(password) {
    this.setState( {loaded: false} )
    this.setState( {loading: true} )
    sha1(password).then( hash => {
      this.getHashSuffixesFromApi(hash)
    })
  }

  onTogglePrivacyMode() {
    this.setState({ privacy_mode: !this.state.privacy_mode })
  }

  /*
    This method will set the color of occurance <Text> component.
    If no hashes were found, then the <Text> color will be purple.
    Otherwise, it will be red.
  */
  occuranceStyle() {
    var style = {
      color: 'purple',
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 30,
      textAlign: 'center',
    }

    if (this.state.hashes > 0) {
      style.color = 'red'
    } else if (this.state.loading) {
      style.color = 'black'
    }

    return style
 }


  render() {
    let result  = ""
    let comment = ""

    if (this.state.loaded) {
      result = "Found in " + this.state.hashes + " database breaches."

      if (this.state.hashes == 0) {
        comment = "Yay!...but use with caution."
      } else {
        comment = "It is recommened that you do not use that password."
      }
    } else if (this.state.loading) {
      result = "Loading..."
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>CheckPwnedPassword</Text>
        <Text style={styles.instructions}>To get started, search here:</Text>
        <TextInput
          style={styles.input_text}
          secureTextEntry={this.state.privacy_mode}
          password={true}
          placeholder="To get start type password here"
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          autoCorrect={false}
          returnKey="go"
        />
        <View style={styles.privacy_container}>
          <Text style={styles.privacy_mode}>Privacy Mode</Text>
          <Switch
            onValueChange = { () => this.onTogglePrivacyMode() }
            trackColor={{
              true: PRIVACY_MODE,
            }}      
            thumbColor={'black'}
            value = {this.state.privacy_mode}
          />
        </View>
        <Button
	        title="Search"
          color="#0F6AAB"
          onPress={() => this.onSearchButtonPress(this.state.text)}
	      />

        <Text style={this.occuranceStyle()}>{result}</Text>
        <Text style={styles.comment}>{comment}</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  comment: {
    textAlign: 'center',
    color: '#333333',
    marginTop: 10,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#8fa0bc',
    flex: 1,
    justifyContent: 'center',
  },
  input_text: {
    backgroundColor: PRIVACY_MODE,
    borderColor: 'gray',
    borderWidth: 1,
    height: 40,
  },
  privacy_container: {
    color: '#000000',
    flexDirection: 'row',
    margin: 25,
    textAlign: 'center',
  },
  privacy_mode: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  welcome: {
    color: '#333333',
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    marginBottom: 30,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
