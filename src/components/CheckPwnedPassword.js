/*
 *  CheckPwnedPassword
 *  Author:  Alexan Mardigian
 *  Version: 1.0
 *  Copyright 2021, Alexan Mardigian, All rights reserved.
*/

import React, { useState } from 'react';
import { Button, Switch, Text, TextInput, View } from 'react-native';
import * as Crypto from 'expo-crypto';
import styles from "./Styles";

const PASSWORD_API = "https://api.pwnedpasswords.com/range/";
const PREFIX_CHARS = 5;  // Amount of characters in the hash prefix.

export default function App() {
    const [state, setState] = useState({
        hashes: 0,
        isLoaded: false,
        isLoading: false,
        privacy_mode: false,
        privacyMode: false,
        text: ''
    });

    const handlePrivacyMode = () => {
        setState( {...state, 'privacyMode': !state['privacyMode']} );
    }
    
    const handlePwdInput = (pwd) => {
        setState( {...state, text: pwd} );
    }

    /*
        This method will set the color of occurance <Text> component.
        If no hashes were found, then the <Text> color will be purple.
        Otherwise, it will be red.
    */
    const occuranceStyle = () => {
        return state.hashes > 0 ? styles.found : styles.not_found;
    }

    const onSearchButtonPress = () => {
        setState({
            ...state,
            isLoaded: false,
            isLoading: true
        });
        (async () => {
            const digest = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA1,
                state.text
            );
            getHashSuffixesFromApi(digest.toUpperCase());
        })();
    }
    
    const getHashSuffixesFromApi = async (hash) => {
        const hashPrefix = hash.substring(0, PREFIX_CHARS);
        const hashSuffix = hash.substring(PREFIX_CHARS);
        const url = PASSWORD_API + hashPrefix.toString();
    
        return fetch(url)
        .then((response) => {
            return response.text();  // Just text is fetched from the API.
        })
        .then((responseText) => {
            const SEPARATOR = responseText.includes('\r\n') ? '\r\n' : '\r';
            const HASHES = Object.assign(...responseText.split(SEPARATOR).map(
                s => s.split(':'))
                .map(([k, v]) => ({ [k]: v }))
            );
            const DBBREACHES = hashSuffix in HASHES ? HASHES[hashSuffix] : 0;

            setState( {...state,
                hashes: DBBREACHES,
                isLoaded: true,
                isLoading: false
            });
        })
        .catch((error) => {
            console.error(error);
        });
    }

    let result  = "";
    let comment = "";
    let oStyle = occuranceStyle();

    if (state.isLoaded) {
      result  = "Found in " + state.hashes + " database breaches.";
      comment = state.hashes == 0 ? "Yay!...but use with caution." : "It is recommened that you do not use that password.";
    }
    
    if (state.isLoading) {
      result = "Loading...";
      oStyle = styles.loading;
    }

    return (
        <View style={ styles.container }>
            <Text style={ styles.welcome }>CheckPwnedPassword</Text>
            <Text style={ styles.instructions }>To get started, search here:</Text>
            <TextInput
                style={ styles.input_text }
                secureTextEntry={ state.privacyMode }
                password={ true }
                placeholder="type password here"
                placeholderTextColor={ styles.found.color }
                onChangeText={ handlePwdInput }
                value={ state.text }
                autoCorrect={ false }
                onSubmitEditing={ onSearchButtonPress }
                returnKey="go"
            />
            <View style={ styles.privacy_container }>
                <Text style={ styles.privacy_mode }>Privacy Mode</Text>
                <Switch
                    onValueChange = { handlePrivacyMode }
                    trackColor={{ true: styles.found.color }}      
                    thumbColor={ 'black' }
                    value = { state.privacyMode }
                />
            </View>
            <Button
	            title="Search"
                color="#246DF5"
                onPress={ onSearchButtonPress }
	        />

            <Text style={ oStyle }>{ result }</Text>
            <Text style={ styles.comment }>{ comment }</Text>
        </View>
  );
}