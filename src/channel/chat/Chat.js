import React from 'react';
import { ActivityIndicator, View, AppState, TextInput, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { Notifications, Permissions, Location, Constants } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { GiftedChat } from 'react-native-gifted-chat';
import { initializeSocket } from '../../socket';
import styles, { darkBlue } from '../../styles/styles';
import { getUsernameFromToken } from '../../helpers';
import Message from './Message';

type ChatProps = {
  currentChannel: {
    id: string,
    name: string,
    channelType: null | string,
  }
}

export default class Chat extends React.Component<ChatProps> {
  state = {
    messages: [],
    connected: false,
    fetched: false,
    username: getUsernameFromToken(),
    access: false,
    password: '',
  };

  componentDidMount() {
    this.sendMessage = initializeSocket(
      (m) => {
        if (m.channelId !== this.props.currentChannel.id) {
          return;
        }
        if (AppState.currentState !== 'active') {
          Notifications.presentLocalNotificationAsync({
            title: `New message from ${m.user.username}`,
            body: m.body,
          });
        }
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, this.dataToMessage(m)),
        }));
      },
      () => this.setState({ connected: true }),
      () => this.setState({ messages: [], connected: false }, this.fetchMessages),
    );
    this.fetchMessages();
    this.refreshLocation();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentChannel.id !== this.props.currentChannel.id) {
      this.setState({messages: [], fetched: false, password: '', access: false}, this.fetchMessages); // eslint-disable-line
    }
    this.refreshLocation();
  }

  onSend(messages = []) {
    messages.forEach(m => this.sendMessage({
      channelId: this.props.currentChannel.id,
      body: m.text,
      username: this.state.username,
    }));
  }

  refreshLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted' && !(Platform.OS === 'android' && !Constants.isDevice)) {
      const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      axios.put('/user/updateUserLocation', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        username: getUsernameFromToken(),
      });
    }
  };

  connectedMessage = () => ({
    _id: 1,
    text: `connected to #${this.props.currentChannel.name}`,
    createdAt: Date.now(),
    system: true,
  });

  fetchMessages = () => {
    axios.get(`/channel/find/${this.props.currentChannel.id}`)
      .then(response => response.data)
      .then((data) => {
        const messages = data.messages.map(this.dataToMessage);
        messages.push(this.connectedMessage());
        messages.reverse();
        this.setState({ messages });
      })
      .then(() => this.setState({ fetched: true }));
  };

  dataToMessage = data => ({
    _id: data.id,
    createdAt: data.createDate,
    text: data.body,
    location: data.user.lastLocation,
    user: {
      _id: data.user.username,
      name: data.user.username,
    },
  });

  unlock = async () => {
    try {
      const response = await axios.post('/channel/login', {
        password: this.state.password,
        channelId: this.props.currentChannel.id,
      });
      if (response.status !== 200) {
        Alert.alert('Error', 'Wrong password!');
      } else {
        this.setState({ access: true });
      }
    } catch (e) {
      Alert.alert('Error', 'Unexpected error while joining private channel');
    }
  }

  renderMessage = props => <Message {...props} />;

  render() {
    if (!this.state.fetched || !this.state.connected) {
      return (
        <View style={{ flex: 1, padding: 30 }}>
          <ActivityIndicator size="large" color={darkBlue} />
        </View>
      );
    }

    if (this.props.currentChannel.channelType === 'PRIVATE' && !this.state.access) {
      return (
        <View style={{ flex: 1, padding: 30, alignContent: 'center' }}>
          <MaterialIcons
            name="lock"
            size={128}
            color={darkBlue}
            style={{ alignSelf: 'center' }}
          />
          <TextInput
            textColor={darkBlue}
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            secureTextEntry
            placeholder="Password"
            style={{ width: 200, alignSelf: 'center', textAlign: 'center' }}
          />
          <TouchableOpacity
            style={[styles.buttonContainer, { alignSelf: 'center' }]}
            onPress={this.unlock}
          >
            <Text style={styles.buttonText}> Unlock </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <React.Fragment>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.username,
          }}
          renderMessage={this.renderMessage}
        />
      </React.Fragment>
    );
  }
}

