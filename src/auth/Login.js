import React from 'react';
import axios from 'axios';
import {
  StyleSheet, TextInput, Text, View, AsyncStorage, Image, TouchableOpacity, Alert,
  ActivityIndicator,
} from 'react-native';
import styles, { darkBlue, lightBlue, white } from '../styles/styles';
import logo from '../../assets/logo.png';

const loginStyle = StyleSheet.create({
  input: {
    backgroundColor: white,
    width: 200,
    height: 40,
    color: darkBlue,
  },
  logo: {
    width: 300,
    height: 300,
  },
});


type LoginProps = {
  navigation: {
    navigate: () => {},
  },
}

export default class Login extends React.Component<LoginProps> {
  static navigationOptions = () => ({
    header: null,
  });
  state = {
    error: '',
    username: '',
    password: '',
  }

  signIn = async () => {
    this.setState({ isLoading: true });
    axios.post('/login', {
      username: this.state.username,
      password: this.state.password,
    })
      .then((response) => {
        if (response.status !== 200) {
          throw Error('login failed');
        }
        return response.headers.authorization;
      })
      .then((token) => {
        axios.defaults.headers.common.Authorization = token;
        return AsyncStorage.setItem('userToken', token);
      })
      .then(() => this.props.navigation.navigate('Main'))
      .catch(() => {
        AsyncStorage.clear();
        this.setState({ isLoading: false });
        Alert.alert('Login failed', 'Invalid credentials!');
      });
  };

  register = () => this.props.navigation.navigate('Register');

  validate = () => {
    let errorMessage = '';
    for (const x of ['username', 'password']) { // eslint-disable-line
      if (this.state[x].length < 3) {
        errorMessage = `Field ${x} needs to be longer!`;
        break;
      }
    }

    this.setState({ error: errorMessage });
    return errorMessage.length === 0;
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loginBackground}>
          <Text style={{ textAlign: 'center', color: white }}>Logging in...</Text>
          <ActivityIndicator size="large" color={white} />
        </View>
      );
    }

    return (
      <View style={styles.loginBackground}>
        <Image
          style={loginStyle.logo}
          tintColor={darkBlue}
          source={logo}
        />
        <Text style={styles.error}>{this.state.error}</Text>
        <TextInput
          placeholder="Username"
          placeholderTextColor={darkBlue}
          onChangeText={username => this.setState({ username })}
          underlineColorAndroid="transparent"
          selectionColor={lightBlue}
          style={[styles.input, loginStyle.input]}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={darkBlue}
          onChangeText={password => this.setState({ password })}
          underlineColorAndroid="transparent"
          selectionColor={lightBlue}
          secureTextEntry
          style={[styles.input, loginStyle.input]}
        />
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <TouchableOpacity
            style={[styles.buttonContainer]}
            onPress={() => this.validate() && this.signIn()}
          >
            <Text style={styles.buttonText}>LOG IN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={this.register}>
            <Text style={styles.buttonText}>REGISTER</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
