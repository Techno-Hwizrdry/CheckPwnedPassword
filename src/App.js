

import React, { Component } from 'react';
import { Button, Platform, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { sha1 } from 'react-native-sha1';


const PASSWORD_API = "https://api.pwnedpasswords.com/range/"
const PREFIX_CHARS = 5  // Amount of characters in the hash prefix.

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props)

    this.state = { text: 'Stuff',
                   hashes: '',
                   loaded: false,
                   privacy_mode: false,
                 }
    this.onGoButtonPress = this.onGoButtonPress.bind(this);
    this.onTogglePrivacyMode = this.onTogglePrivacyMode.bind(this);
  };

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
    })
    .catch((error) => {
      console.error(error);
    });
  }

  onGoButtonPress(password) {
    this.setState( {loaded: false} )
    sha1(password).then( hash => {
      this.getHashSuffixesFromApi(hash)
    })
  }

  onTogglePrivacyMode() {
    this.setState({ privacy_mode: !this.state.privacy_mode })
  }

  render() {
    let result = ""

    if (this.state.loaded) {
      result = "Found in " + this.state.hashes + " database breaches."
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
            value = {this.state.privacy_mode}
          />
        </View>
        <Button
	        title="Go"
          color="#841584"
          onPress={() => this.onGoButtonPress(this.state.text)}
	      />

        <Text style={styles.occurances}>{result}</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input_text: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  },
  occurances: {
    fontSize: 20,
    marginTop: 30,
    textAlign: 'center',
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
