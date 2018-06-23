import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import Login from '../auth/Login';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';
import Logout from '../auth/Logout';
import ChannelInfo from '../channel/ChannelInfo';
import Channel from '../channel/Channel';
import ChannelSettings from '../channel/ChannelSettings';
import { authNavigationStyle, navigationStyle } from '../styles/styles';
import AddChannel from '../channel/AddChannel';
import Register from '../auth/Register';

const AuthStack = createStackNavigator({ Login, Logout, Register }, {
  navigationOptions: authNavigationStyle,

});
const MainStack = createStackNavigator({
  Channel, ChannelInfo, AddChannel, ChannelSettings,
}, {
  navigationOptions: navigationStyle,
});

export default createSwitchNavigator(
  {
    Intro: AuthLoadingScreen,
    Auth: AuthStack,
    Main: MainStack,
  },
  { initialRouteName: 'Intro' },
);
