// @flow

import React from 'react';
import { DrawerLayoutAndroid, Image, Text, View } from 'react-native';
import dismissKeyboard from 'dismissKeyboard'; // eslint-disable-line
import { MaterialIcons } from '@expo/vector-icons';
import ChannelList from './channelList/ChannelList';
import style, { darkBlue, white } from '../styles/styles';
import Chat from './chat/Chat';
import logo from '../../assets/logo.png';

type ChannelProps = {
  navigation: {
    navigate: Function,
    setParams: Function,
    state: { params: {} },
    getParam: Function,
  },
}

const defaultChannel = { name: 'Gouomp' };

export default class Channel extends React.Component<ChannelProps> {
  static navigationOptions = ({ navigation }) => {
    const channel = navigation.getParam('currentChannel') || defaultChannel;
    return {
      title: `#${channel.name}`,
      headerLeft: (
        <React.Fragment>
          <MaterialIcons
            onPress={navigation.getParam('toggleDrawer') || null}
            name="menu"
            size={32}
            color={white}
            style={{ paddingLeft: 10 }}
          />
        </React.Fragment>
      ),
      headerRight: (
        <React.Fragment>
          {navigation.getParam('currentChannel', false) &&
          <MaterialIcons
            onPress={() => navigation.navigate('ChannelInfo', navigation.state.params || {})}
            name="info"
            size={32}
            color={white}
            style={{ paddingRight: 10 }}
          />
          }
          <MaterialIcons
            onPress={() => navigation.navigate('Logout')}
            name="exit-to-app"
            size={32}
            color={white}
            style={{ paddingRight: 10 }}
          />
        </React.Fragment>
      ),
    };
  };


  state = {
    isDrawerOpen: false,
  };

  componentWillMount() {
    this.props.navigation.setParams({ toggleDrawer: this.toggleDrawer });
  }

  onSelect = (channel) => {
    this.props.navigation.setParams({ currentChannel: channel });
    this.toggleDrawer();
  };

  toggleDrawer = () => {
    dismissKeyboard();
    this.setState(prevState => ({
      isDrawerOpen: !prevState.isDrawerOpen,
    }));
    if (this.state.isDrawerOpen) {
      this.drawer.closeDrawer();
    } else {
      this.drawer.openDrawer();
    }
  };

  render() {
    const currentChannel = this.props.navigation.getParam('currentChannel', { id: null });
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={
          () => (
            <ChannelList
              onSelect={this.onSelect}
              toggleDrawer={this.toggleDrawer}
              currentChannel={currentChannel}
              navigate={this.props.navigation.navigate}
            />
          )
        }
        ref={(drawer) => {
          this.drawer = drawer;
        }}
        style={style.container}
      >
        {currentChannel.id ?
          <Chat
            currentChannel={currentChannel}
          />
          :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              style={{
                width: 300,
                height: 300,
              }}
              tintColor={darkBlue}
              source={logo}
            />
            <Text style={{ textAlign: 'center', color: darkBlue, fontSize: 26 }}>Please select channel</Text>
          </View>
        }
      </DrawerLayoutAndroid>
    );
  }
}
