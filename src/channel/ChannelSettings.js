// @flow

import React from 'react';
import {
  Text,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import axios from 'axios';
import styles, { darkBlue, lightBlue } from '../styles/styles';
import { getUsernameFromToken } from '../helpers';

const channelSettingsStyles = StyleSheet.create({
  reverted: {
    fontSize: 15,
    color: darkBlue,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

type ChannelSettingsProps = {
    navigation: {
        navigate: () => {},
        getParam: any => {},
        setParams: any => {},
        goBack: () => {},
        replace: () => {},
    },
}

class ChannelSettings extends React.Component<ChannelSettingsProps> {
    static navigationOptions = ({ navigation }) => {
      const channel = navigation.getParam('currentChannel');
      return {
        title: `#${channel && channel.name} - settings`,
      };
    };

    state = {
      name: '',
      description: '',
      channelPassword: '',
      isLoading: false,
    }

    componentWillMount() {
    }

    changeChannelSettings = async () => {
      this.setState({
        isLoading: true,
      });
      axios.put('/channel/update', {
        id: this.props.navigation.getParam('currentChannel').id,
        name: this.state.name,
        description: this.state.description,
        password: this.state.channelPassword || null,
        executorUsername: getUsernameFromToken(),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.data;
          }
          throw new Error('error');
        })
        .then(() => {
          this.props.navigation.replace('Channel');
        })
        .catch(() => this.setState({ isLoading: false }, () => Alert.alert('Error updating channel')));
    }

    validate = () => {
      let error = '';
      const toValidate = ['name', 'description'];
      if (this.props.navigation.getParam('currentChannel').channelType === 'PRIVATE') {
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

    render() {
      if (this.state.isLoading) {
        return (
          <View style={{ flex: 1, padding: 30 }}>
            <ActivityIndicator size="large" color={darkBlue} />
          </View>
        );
      }

      return (
        <ScrollView style={styles.infoContainer}>
          <View style={styles.infoContainerBox}>
            <Text style={channelSettingsStyles.reverted}>Name</Text>
            <TextInput
              placeholderTextColor={darkBlue}
              style={[styles.input, styles.inputChannelInformation]}
              selectionColor={lightBlue}
              onChangeText={(name) => {
                this.setState({ name }, this.validate);
              }}
            />
            <Text style={channelSettingsStyles.reverted}>Description</Text>
            <TextInput
              placeholderTextColor={darkBlue}
              style={[styles.input, styles.inputChannelInformation]}
              onChangeText={(description) => {
                this.setState({ description }, this.validate);
              }}
            />
            {this.props.navigation.getParam('currentChannel').channelType === 'PRIVATE' ?
              <View>
                <Text style={channelSettingsStyles.reverted}>New password</Text>
                <TextInput
                  placeholderTextColor={darkBlue}
                  style={[styles.input, styles.inputChannelInformation]}
                  onChangeText={(channelPassword) => {
                    this.setState({ channelPassword }, this.validate);
                  }}
                  secureTextEntry
                />
              </View> : null
            }
            <TouchableOpacity
              style={[styles.buttonContainer, { alignSelf: 'flex-end' }]}
              onPress={
                (this.state.showButton && this.changeChannelSettings) || null}
            >
              <Text style={styles.buttonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }
}

export default ChannelSettings;
