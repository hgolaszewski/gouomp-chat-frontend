import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  View,
} from 'react-native';
import axios from 'axios';
import styles, { darkBlue } from '../styles/styles';
import { isTokenValid } from '../helpers';

type AuthLoadingScreenProps = {
  navigation: {
    navigate: () => {},
  },
}

export default class AuthLoadingScreen extends React.Component<AuthLoadingScreenProps> {
  componentDidMount() {
    this.fetchTokenAndRedirect();
  }

  fetchTokenAndRedirect = async () => {
    const token = await AsyncStorage.getItem('userToken');
    axios.defaults.headers.common.Authorization = token;
    this.props.navigation.navigate((token && isTokenValid(token)) ? 'Main' : 'Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={darkBlue} />
      </View>
    );
  }
}
