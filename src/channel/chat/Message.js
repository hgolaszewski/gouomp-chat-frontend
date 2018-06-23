/* eslint react-native/no-inline-styles: 0 */
/* eslint-disable no-underscore-dangle, react/forbid-prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import { View, ViewPropTypes, StyleSheet, Text } from 'react-native';

import Avatar from 'react-native-gifted-chat/src/Avatar';
import Bubble from 'react-native-gifted-chat/src/Bubble';
import SystemMessage from 'react-native-gifted-chat/src/SystemMessage';
import Day from 'react-native-gifted-chat/src/Day';

import { isSameUser, isSameDay } from 'react-native-gifted-chat/src/utils';
import { gray } from '../../styles/styles';

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
    },
  }),
};

export default class Message extends React.PureComponent {
  getInnerComponentProps() {
    const { containerStyle, ...props } = this.props;
    return {
      ...props,
      isSameUser,
      isSameDay,
    };
  }

  renderDay() {
    if (this.props.currentMessage.createdAt) {
      const dayProps = this.getInnerComponentProps();
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps);
      }
      return <Day {...dayProps} />;
    }
    return null;
  }

  renderBubble() {
    const bubbleProps = this.getInnerComponentProps();
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps);
    }
    return <Bubble {...bubbleProps} />;
  }

  renderSystemMessage() {
    const systemMessageProps = this.getInnerComponentProps();
    if (this.props.renderSystemMessage) {
      return this.props.renderSystemMessage(systemMessageProps);
    }
    return <SystemMessage {...systemMessageProps} />;
  }

  renderAvatar() {
    if (this.props.user._id === this.props.currentMessage.user._id && !this.props.showUserAvatar) {
      return null;
    }
    const avatarProps = this.getInnerComponentProps();
    const { currentMessage } = avatarProps;
    if (currentMessage.user.avatar === null) {
      return null;
    }
    return <Avatar {...avatarProps} />;
  }

  renderUsername() {
    const messageToCompare = this.props.previousMessage;
    const username = this.props.currentMessage.user._id.toUpperCase();
    const location = this.props.currentMessage.location; // eslint-disable-line
    if (!isSameUser(this.props.currentMessage, messageToCompare)) {
      return (
        <Text style={{
          marginLeft: 60, marginTop: 3, color: gray, fontSize: 12,
        }}
        >
          {username} {location && `(${location})`}
        </Text>
      );
    }
    return null;
  }

  render() {
    const sameUser = isSameUser(this.props.currentMessage, this.props.nextMessage);
    return (
      <View>
        {this.renderDay()}
        {this.props.currentMessage.system ? (
          this.renderSystemMessage()
        ) : (
          <React.Fragment>
            {this.props.position === 'left' && this.renderUsername()}
            <View
              style={[
                styles[this.props.position].container,
                { marginBottom: sameUser ? 2 : 10 },
                !this.props.inverted && { marginBottom: 2 },
                this.props.containerStyle[this.props.position],
              ]}
            >
              {this.props.position === 'left' && this.renderAvatar()}
              {this.renderBubble()}
              {this.props.position === 'right' && this.renderAvatar() }
            </View>
          </React.Fragment>
        )}
      </View>
    );
  }
}

Message.defaultProps = {
  renderAvatar: undefined,
  renderBubble: null,
  renderDay: null,
  renderSystemMessage: null,
  position: 'left',
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
  containerStyle: {},
  showUserAvatar: true,
  inverted: true,
};

Message.propTypes = {
  renderAvatar: PropTypes.func,
  showUserAvatar: PropTypes.bool,
  renderBubble: PropTypes.func,
  renderDay: PropTypes.func,
  renderSystemMessage: PropTypes.func,
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  user: PropTypes.object,
  inverted: PropTypes.bool,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
};
/* eslint-enable no-underscore-dangle, react/forbid-prop-types */
