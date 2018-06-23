import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { blue, lightBlue } from '../../styles/styles';

const rowStyles = StyleSheet.create({
  channel: {
    fontSize: 18,
    color: blue,
  },
  icon: { paddingLeft: 10, paddingTop: 5 },
  view: {
    flexDirection: 'row',
    height: 32,
  },
});

type props = {
  item: {},
  currentChannel: {
    id: string,
    name: string,
  },
  onSelect: Function,
}

export default ({ item, currentChannel, onSelect }: props) => (
  <View
    style={rowStyles.view}
  >
    <MaterialIcons
      name="keyboard-arrow-right"
      size={16}
      color={(currentChannel.id === item.id && lightBlue) || blue}
      style={rowStyles.icon}
    />
    <Text
      style={[
        rowStyles.channel,
        currentChannel.id === item.id && { color: lightBlue },
      ]}
      onPress={() => {
        currentChannel.id === item.id || onSelect(item);
      }}
    >
      #{item.name}
    </Text>
    {item.channelType === 'PRIVATE' &&
    <MaterialIcons
      name="lock"
      size={16}
      color={(currentChannel.id === item.id && lightBlue) || blue}
      style={rowStyles.icon}
    />
    }
  </View>
);

