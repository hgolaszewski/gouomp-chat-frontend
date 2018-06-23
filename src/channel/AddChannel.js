import React from 'react';
import { Alert, Text, View, TextInput, TouchableOpacity, ActivityIndicator, CheckBox } from 'react-native';
import axios from 'axios';
import { white, darkBlue, green, gray } from '../styles/styles';
import { getUsernameFromToken } from '../helpers';

type AddChannelProps = {
  navigation: {
    navigate: () => {},
    setParams: string => {},
  },
}

class AddChannel extends React.Component<AddChannelProps> {
  static navigationOptions = () => ({ title: 'Add Channel' });
  state = {
    name: '',
    description: '',
    checked: false,
    channelPassword: '',
    isLoading: false,
  };

  validate = () => {
    let error = '';
    const toValidate = ['name', 'description'];
    if (this.state.checked) {
      toValidate.push('channelPassword');
    }
    toValidate.forEach((x) => {
      if (this.state[x].length < 3) {
        error = `Field ${x} is too short!`;
      } else if (this.state.name !== this.state.name.toLowerCase()) {
        error = 'Field name must contain only lowercase characters!';
      } else if (this.state.name.includes(' ')) {
        error = 'Field name includes space!';
      }
    });
    this.setState({
      error,
      showButton: error === '',
    });
  }

  addChannel = async () => {
    this.setState({
      isLoading: true,
    });
    axios.post('/channel/create', {
      name: this.state.name,
      description: this.state.description,
      channelType: this.state.checked ? 'PRIVATE' : 'PUBLIC',
      password: this.state.checked ? this.state.channelPassword : '',
      username: getUsernameFromToken(),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        throw new Error('error');
      })
      .then((data) => {
        this.props.navigation.navigate('Channel', {
          currentChannel: {
            id: data.id,
            name: this.state.name,
            description: this.state.description,
            channelType: this.state.checked === true ? 'PRIVATE' : 'PUBLIC',
          },
        });
      })
      .catch(() => this.setState({ isLoading: false }, () => Alert.alert('Error creating channel')));
  }


  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color={darkBlue} />
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          padding: 40,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ flex: 1 }}>{this.state.error}</Text>

        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ flex: 1 }}>Name</Text>
          <TextInput
            style={{ flex: 2 }}
            textColor={darkBlue}
            value={this.state.name}
            onChangeText={(name) => {
              this.setState({ name }, this.validate);
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ flex: 1 }}>Description</Text>
          <TextInput
            style={{ flex: 2 }}
            textColor={darkBlue}
            multiline
            value={this.state.description}
            onChangeText={(description) => {
              this.setState({ description }, this.validate);
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ marginTop: 7, flex: 1 }}>Private channel</Text>
          <CheckBox
            style={{ marginTop: 7 }}
            value={this.state.checked}
            onValueChange={() => this.setState({ checked: !this.state.checked }, this.validate)}
          />
        </View>
        {this.state.checked && (
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ marginTop: 7, flex: 1 }}>Channel password</Text>
            <TextInput
              style={{ flex: 2 }}
              textColor={darkBlue}
              multiline
              value={this.state.channelPassword}
              onChangeText={(channelPassword) => {
                this.setState({ channelPassword }, this.validate);
              }}
              secureTextEntry
            />
          </View>)}

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{
              backgroundColor: (!this.state.showButton && gray) || green,
              width: 150,
              height: 40,
              borderRadius: 2,
              justifyContent: 'center',
              alignContent: 'center',
              margin: 20,
            }}
            onPress={(this.state.showButton && this.addChannel) || null}
          >
            <Text style={{
              color: white,
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
            }}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>
      </View>);
  }
}

export default AddChannel;
