import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
export default function WorkSchedule() {
    return (
      <View style={styles.container}>
        <Text>Open up WorkSchedule.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });