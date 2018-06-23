import { StyleSheet } from 'react-native';

export const white = '#f7fcfc';
export const lightBlue = '#62b6cb';
export const blue = '#2a628f';
export const darkBlue = '#13293d';
export const green = '#61ff7e';
export const red = '#ff334b';
export const gray = '#868686';
export const authNavigationStyle = {
  headerStyle: {
    backgroundColor: lightBlue,
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    color: white,
  },
  headerTintColor: white,
};

export const navigationStyle = {
  headerStyle: {
    backgroundColor: darkBlue,
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    color: white,
  },
  headerTintColor: white,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    backgroundColor: white,
  },
  infoContainerBox: {
    backgroundColor: white,
    alignItems: 'baseline',
    padding: 10,
  },
  revertedBox: {
    backgroundColor: darkBlue,
  },
  active: {
    color: green,
  },
  drawer: {
    flex: 1,
    backgroundColor: white,
  },
  input: {
    backgroundColor: blue,
    borderRadius: 25,
    paddingLeft: 30,
    paddingRight: 30,
    height: 30,
    marginHorizontal: 10,
    marginBottom: 10,
    color: white,
  },
  inputProfileInformation: {
    backgroundColor: white,
    width: 300,
    height: 50,
    color: darkBlue,
  },
  inputChannelInformation: {
    backgroundColor: white,
    width: 300,
    height: 30,
    color: darkBlue,
  },
  textArea: {
    backgroundColor: blue,
    borderRadius: 25,
    paddingLeft: 30,
    paddingRight: 30,
    height: 100,
    marginHorizontal: 10,
    marginBottom: 10,
    color: white,
  },
  loginBackground: {
    flex: 1,
    backgroundColor: lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: darkBlue,
    paddingVertical: 10,
    marginBottom: 10,
    width: 100,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: white,
    fontWeight: '700',
  },
  error: {
    color: darkBlue,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default styles;
