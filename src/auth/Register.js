import React from 'react';
import { TextInput, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import styles, { darkBlue, lightBlue, white } from '../styles/styles';

type RegisterProps = {
  navigation: {
    replace: () => {},
  },
}
export default class Register extends React.Component<RegisterProps> {
  state = {
    username: '',
    firstName: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  setError = (value) => {
    this.setState({ error: value });
    return value === '';
  }

  validate = () => {
    for (const x of ['username', 'firstName', 'surname', 'password', 'confirmPassword']) { // eslint-disable-line
      if (this.state[x].length < 3) {
        return this.setError(`Field ${x} needs to be longer!`);
      }
    }
    if (this.state.confirmPassword !== this.state.password) {
      return this.setError('Passwords needs to be the same!');
    }
    const regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  // eslint-disable-line
    if (!regexp.test(this.state.email)) {
      return this.setError('Email needs to be correct');
    }
    return this.setError('');
  }

  register = () => {
    this.setState({ isLoading: true });
    axios.post('/user/sign-up', {
      username: this.state.username,
      name: this.state.firstName,
      surname: this.state.surname,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
    })
      .then(() => { Alert.alert('Success', 'User registered!'); })
      .then(() => this.props.navigation.replace('Login'))
      .catch(() => {
        Alert.alert('Error', 'User couldn\'t be registered!');
        this.setState({ isLoading: false });
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loginBackground}>
          <Text style={{ textAlign: 'center', color: white }}>Registering...</Text>
          <ActivityIndicator size="large" color={white} />
        </View>
      );
    }
    return (
      <View style={styles.loginBackground}>
        <Text style={styles.error}>{this.state.error}</Text>
        <TextInput
          placeholder="Username"
          placeholderTextColor={darkBlue}
          onChangeText={username => this.setState({ username })}
          style={[styles.input, styles.inputProfileInformation]}
          underlineColorAndroid="transparent"
          selectionColor={lightBlue}
        />
        <TextInput
          placeholder="First name"
          placeholderTextColor={darkBlue}
          style={[styles.input, styles.inputProfileInformation]}
          underlineColorAndroid="transparent"
          selectionColor={lightBlue}
          onChangeText={firstName => this.setState({ firstName })}
        />
        <TextInput
          placeholder="Surname"
          placeholderTextColor={darkBlue}
          style={[styles.input, styles.inputProfileInformation]}
          underlineColorAndroid="transparent"
          selectionColor={lightBlue}
          onChangeText={surname => this.setState({ surname })}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor={darkBlue}
          style={[styles.input, styles.inputProfileInformation]}
          underlineColorAndroid="transparent"
          selectionColor={lightBlue}
          onChangeText={email => this.setState({ email })}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={darkBlue}
          style={[styles.input, styles.inputProfileInformation]}
          underlineColorAndroid="transparent"
          selectionColor={lightBlue}
          onChangeText={password => this.setState({ password })}
          secureTextEntry
        />
        <TextInput
          placeholder="Confirm password"
          placeholderTextColor={darkBlue}
          style={[styles.input, styles.inputProfileInformation]}
          underlineColorAndroid="transparent"
          selectionColor={lightBlue}
          onChangeText={confirmPassword => this.setState({ confirmPassword })}
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.buttonContainer, { marginTop: 10 }]}
          onPress={() => this.validate() && this.register()}
        >
          <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
