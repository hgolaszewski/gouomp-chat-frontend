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
  Linking,
} from 'react-native';
import axios from 'axios';
import { DocumentPicker } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';
import styles, { darkBlue, lightBlue, white } from '../styles/styles';
import { getUsernameFromToken } from '../helpers';

const channelInfoStyles = StyleSheet.create({
  title: {
    color: darkBlue,
    fontSize: 20,
    fontWeight: 'bold',
  },
  reverted: {
    color: white,
  },
});

type ChannelInfoProps = {
    navigation: {
        navigate: () => {},
        getParam: any => {},
        setParams: any => {},
        goBack: () => {},
        replace: () => {},
    },
}

class ChannelInfo extends React.Component<ChannelInfoProps> {
    static navigationOptions = ({ navigation }) => {
      const channel = navigation.getParam('currentChannel');
      return {
        title: `#${channel && channel.name} - info`,
        headerRight:
                channel.username === getUsernameFromToken() ?
                  <React.Fragment>
                    <MaterialIcons
                      onPress={() => navigation.navigate('ChannelSettings', navigation.state.params || {})}
                      name="settings"
                      size={32}
                      color={white}
                      style={{ paddingRight: 10 }}
                    />
                    <MaterialIcons
                      onPress={navigation.getParam('deleteChannel') || null}
                      name="remove-circle"
                      size={32}
                      color={white}
                      style={{ paddingRight: 10 }}
                    />
                  </React.Fragment> : null,
      };
    };


    state = {
      isLoading: false,
      isFetching: false,
      files: [],
      users: [],
    }

    componentWillMount() {
      this.props.navigation.setParams({ deleteChannel: this.deleteChannelConfirm });
      this.fetchFiles();
      this.fetchUsers();
    }

    deleteChannelConfirm = async () => {
      Alert.alert(
        'WARNING!',
        'Do you want delete this channel?',
        [
          { text: 'YES', onPress: this.deleteChannel },
          { text: 'NO' },
        ],
      );
    }

    deleteChannel = () => {
      this.setState({ isLoading: true });
      const channelId = this.props.navigation.getParam('currentChannel').id;
      const username = getUsernameFromToken();
      axios.delete(`/channel/delete/${channelId}/user/${username}`)
        .then(() => this.props.navigation.replace('Channel'))
        .catch(() => this.setState({ isLoading: false }, () => Alert.alert('Error', 'You cannot delete this channel!')));
    };

    upload = async () => {
      const pickerResult = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
      if (pickerResult.type === 'cancel') return;
      try {
            const data = new FormData(); // eslint-disable-line
        data.append('file', {
          uri: pickerResult.uri,
          name: pickerResult.name,
          type: '*/*',
        });
        this.setState({ isFetching: true });
        await axios.post(
          `/chatResource/upload/${this.props.navigation.getParam('currentChannel').id}`, data,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        this.fetchFiles();
      } catch (e) {
        Alert.alert('Error', 'Upload failed, sorry :(');
      }
      this.setState({ isFetching: false });
    };

    fetchUsers = async () => {
      const response = await axios.get(`/channel/find/${this.props.navigation.getParam('currentChannel').id}`);
      const userStatistics = {};
      response.data.messages.forEach((x) => {
        userStatistics[x.user.username] = (userStatistics[x.user.username] || 0) + 1;
      });
      this.setState({
        users: userStatistics,
      });
    };

    fetchFiles = async () => {
      this.setState({
        isFetching: true,
      });
      const response = await axios.get(`/chatResource/list/${this.props.navigation.getParam('currentChannel').id}`);
      this.setState({
        files: response.data,
        isFetching: false,
      });
    };

    downloadFile = (file) => {
      Linking.openURL(file.awsLocation);
    };

    removeFile = async (file) => {
      this.setState({ isFetching: true });
      try {
        await axios.delete(`/chatResource/delete/${file.id}`);
      } catch (e) {
        Alert.alert('Error', 'There was a problem with deleting this file!');
      }
      this.setState({ isFetching: false });
      this.fetchFiles();
    };

    renderFileRow = (file) => {
      const name = file.name.slice(14).trim();
      return (
        <View key={file.name} style={{ flexDirection: 'row' }}>
          <MaterialIcons
            name="file-download"
            size={32}
            color={darkBlue}
            style={{ paddingLeft: 3 }}
            onPress={() => this.downloadFile(file)}
          />
          <MaterialIcons
            name="delete-forever"
            size={32}
            color={darkBlue}
            style={{ paddingLeft: 5, paddingRight: 15 }}
            onPress={() => this.removeFile(file)}
          />
          <Text style={{ paddingVertical: 10 }}>{name}</Text>
        </View>
      );
    }

    renderUsers = () => {
      const usersWithStatsArray = [];
      Object.keys(this.state.users)
        .sort((key1, key2) => this.state.users[key2] - this.state.users[key1])
        .forEach((key) => {
          usersWithStatsArray.push(`${key} (${this.state.users[key]})`);
        });
      return usersWithStatsArray.join(', ');
    }

    render() {
      const currentChannelDesc = this.props.navigation.getParam('currentChannel').description;
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
            <Text style={channelInfoStyles.title}>Description</Text>
            <Text>{currentChannelDesc}</Text>
          </View>
          <View style={[styles.infoContainerBox, styles.revertedBox]}>
            <Text
              style={[channelInfoStyles.title, channelInfoStyles.reverted]}
            >
                        Most active users
            </Text>
            <Text style={channelInfoStyles.reverted}>{this.renderUsers()}</Text>
          </View>
          <View style={styles.infoContainerBox}>
            <Text style={channelInfoStyles.title}>Shared files</Text>
            {this.state.isFetching ?
              <View style={{
                flexDirection: 'column',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              >
                <ActivityIndicator size="large" color={darkBlue} />
              </View>
              :
              <React.Fragment>
                <View style={{}}>
                  {this.state.files.map(this.renderFileRow)}
                </View>
                <TouchableOpacity
                  style={[styles.buttonContainer, { alignSelf: 'flex-end', backgroundColor: lightBlue }]}
                  onPress={this.upload}
                >
                  <Text style={styles.buttonText}>Add file</Text>
                </TouchableOpacity>
              </React.Fragment>}
          </View>
        </ScrollView>
      );
    }
}

export default ChannelInfo;
