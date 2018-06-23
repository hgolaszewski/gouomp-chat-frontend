import React from 'react';
import { View, AsyncStorage, ActivityIndicator } from 'react-native';
import styles from '../styles/styles';

type LogoutProps = {
  navigation: {
    navigate: () => {},
  },
}

export default class Logout extends React.Component<LogoutProps> {
  static navigationOptions = {
    title: 'Logout',
  };

  constructor() {
    super();
    this.logoutAndRedirect();
  }

  logoutAndRedirect = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
}
