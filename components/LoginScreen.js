import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import {
  Input,
  Icon,
  Stack,
  Pressable,
  Center,
  NativeBaseProvider,
  Button,
  Text
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import axios from 'axios';

// const logIn = async (email, password, navigation) => {
//   try {
//     const response = await axios.post('http://192.168.0.22:8000/api/login_check', {
//       username: email,
//       password: password,
//     })
//     console.log('Sukces:', response.data.token);
//     try {
//       await AsyncStorage.setItem('token', response.data.token);
//       console.log('Token został pomyślnie zapisany.');
//       navigation.navigate('GB Delivery')
//     } catch (error) {
//       console.log('Błąd podczas zapisywania tokenu:', error.message);
//     }
//   } catch (error) {
//     console.log('Błąd:', error.message);
//   }

  // Pobierz token z AsyncStorage
// try {
//   const storedToken = await AsyncStorage.getItem('token');
//   if (storedToken !== null) {
//     // Znaleziono token, możesz go używać
//     console.log('Znaleziono token:', storedToken);
//   } else {
//     // Nie znaleziono tokenu
//     console.log('Brak zapisanego tokenu.');
//   }
// } catch (error) {
//   console.error('Błąd podczas pobierania tokenu:', error.message);
// }
// };

export default function LoginScreen() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const navigation = useNavigation();
  const logIn = async () => {
    try {
      const response = await axios.post('http://192.168.0.22:8000/api/login_check', {
        username: email,
        password: password,
      })
      console.log('Sukces:', response.data.token);
      try {
        await AsyncStorage.setItem('token', response.data.token);
        console.log('Token został pomyślnie zapisany.');
        navigation.navigate('GB Delivery')
      } catch (error) {
        console.log('Błąd podczas zapisywania tokenu:', error.message);
      }
    } catch (error) {
      console.log('Błąd:', error.message);
      setIsValid(true)
    }
  }
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3" bgColor={"#734046"}>
        <Stack space={4} w="100%" alignItems="center">
          <Input
            onChangeText={(email) =>setEmail(email)}
            w={{
              base: "75%",
              md: "25%",
            }}
            InputLeftElement={
              <Icon
                as={<MaterialIcons name="person" />}
                size={5}
                ml="2"
                color="#E79E4F"
              />
            }
            placeholder="Email"
            variant={"rounded"}
            focusOutlineColor={"#E79E4F"}
            color={"#E79E4F"}
          />
          <Input
            onChangeText={(password) =>setPassword(password)}
            w={{
              base: "75%",
              md: "25%",
            }}
            type={show ? "text" : "password"}
            InputRightElement={
              <Pressable onPress={() => setShow(!show)}>
                <Icon
                  as={
                    <MaterialIcons
                      name={show ? "visibility" : "visibility-off"}
                    />
                  }
                  size={5}
                  mr="2"
                  color="#E79E4F"
                />
              </Pressable>
            }
            placeholder="Hasło"
            variant={"rounded"}
            focusOutlineColor={"#E79E4F"}
            color={"#E79E4F"}
          />
          <Button colorScheme={'myPrimary'} onPress={() => {
              console.log('logIn')
              logIn()
          }}>
            <Text>ZALOGUJ</Text>
          </Button>
          {isValid ? <Text color={'error.600'}>Niepoprawny adres email lub hasło</Text> : null}
        </Stack>
        ;
      </Center>
    </NativeBaseProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#734046",
    alignItems: "center",
    justifyContent: "center",
  },
});
