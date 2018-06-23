// @flow

import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import styles, { blue, darkBlue, lightBlue, white } from '../../styles/styles';
import Row from './Row';

const channelListStyles = StyleSheet.create({
  title: {
    color: darkBlue,
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    padding: 10,
  },
});

type ChannelListProps = {
  onSelect: (string) => {},
  toggleDrawer: Function,
  currentChannel: { id: string, name: string },
  navigate: () => {},
}

export default class extends React.Component<ChannelListProps> {
  state = {
    channels: [],
    channelsFound: [],
    loaded: false,
  }

  componentDidMount() {
    this.fetchChannels();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentChannel.id !== this.props.currentChannel.id) {
      this.fetchChannels();
    }
  }

  fetchChannels = async () => {
    axios.get('/channel/list')
      .then(response => response.data)
      .then((data) => {
        this.setState({
          channels: data,
          channelsFound: data,
          loaded: true,
        });
      })
      .catch(e => console.log(e)); // eslint-disable-line no-console
  }

  search = (phrase) => {
    this.setState(prevState => ({
      channelsFound: (
        prevState.channels.filter(x => `#${x.name}`.toUpperCase().includes(phrase.trim().toUpperCase()))
      ),
    }));
  }

  render() {
    const { channelsFound } = this.state;
    const {
      onSelect, currentChannel, navigate, toggleDrawer,
    } = this.props;
    if (!this.state.loaded) {
      return (
        <View style={{ flex: 1, padding: 30 }}>
          <ActivityIndicator size="large" color={darkBlue} />
        </View>
      );
    }

    return (
      <View
        style={styles.drawer}
      >
        <Text style={channelListStyles.title}>Channel List</Text>
        <View style={{
          flexDirection: 'row',
          height: 52,
        }}
        >
          <MaterialIcons
            name="search"
            size={32}
            color={blue}
            style={{ paddingLeft: 10 }}
          />
          <TextInput
            placeholder="Search..."
            placeholderTextColor={white}
            onChangeText={this.search}
            underlineColorAndroid="transparent"
            selectionColor={lightBlue}
            style={[styles.input, { flex: 1 }]}
          />
        </View>
        <ScrollView>
          <FlatList
            data={channelsFound}
            extraData={currentChannel}
            keyExtractor={item => item.id}
            renderItem={
              ({ item }) => (
                <Row
                  currentChannel={currentChannel}
                  onSelect={onSelect}
                  item={item}
                  navigate={navigate}
                />
              )
            }
          />
        </ScrollView>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
        >
          <MaterialIcons
            name="add"
            size={50}
            color={blue}
            onPress={() => {
              navigate('AddChannel');
              toggleDrawer();
            }}
          />
        </View>
      </View>
    );
  }
}
