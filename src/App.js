

import React, { Component } from 'react';
import { Button, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { sha1 } from 'react-native-sha1';


const PASSWORD_API = "https://api.pwnedpasswords.com/range/"  //{first 5 hash chars}
const PREFIX_CHARS = 5  // Amount of characters in the hash prefix.

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props)

    this.state = { text: 'Stuff',
                   hashes: '' }
    this.onGoButtonPress = this.onGoButtonPress.bind(this);
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
    })
    .catch((error) => {
      console.error(error);
    });
  }

  onGoButtonPress(password) {
    sha1(password).then( hash => {
      this.getHashSuffixesFromApi(hash)
    })
  }

  render() {
    isPrivate = false //true
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>CheckPwnedPassword</Text>
        <Text style={styles.instructions}>To get started, search here:</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          secureTextEntry={isPrivate}
          password={true}
          placeholder="To get start type password here"
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          autoCorrect={false}
          returnKey="go"
        />

        <Button
	        title="Go"
          color="#841584"
          onPress={() => this.onGoButtonPress(this.state.text)}
	      />

        <Text style={styles.instructions}>{this.state.hashes}</Text>

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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
