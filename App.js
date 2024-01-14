import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "./components/Map";
import WorkSchedule from "./components/WorkSchedule";
import Wallet from "./components/Wallet";
import Delivery from "./components/Delivery";
import LoginScreen from "./components/LoginScreen"; // Dodaj ekran logowania tutaj
import { FontAwesome } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Mapa") {
          iconName = focused ? "map" : "map-o";
        } else if (route.name === "Grafik") {
          iconName = focused ? "calendar" : "calendar-o";
        } else if (route.name === "Portfel") {
          iconName = focused ? "money" : "money";
        } else if (route.name === "Dostawa") {
          iconName = focused ? "edit" : "edit";
        }

        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#E79E4F",
      tabBarInactiveTintColor: "#E79E4F",
      tabBarActiveBackgroundColor: "#321F28",
      tabBarInactiveBackgroundColor: "#734046",
    })}
  >
    <Tab.Screen
      name="Mapa"
      component={MapScreen}
      options={{
        title: "Mapa",
        headerStyle: {
          backgroundColor: "#321F28",
        },
        headerTintColor: "#E79E4F",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
    <Tab.Screen
      name="Dostawa"
      component={Delivery}
      options={{
        title: "Dostawa",
        headerStyle: {
          backgroundColor: "#321F28",
        },
        headerTintColor: "#E79E4F",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
    <Tab.Screen
      name="Grafik"
      component={WorkSchedule}
      options={{
        title: "Grafik pracy",
        headerStyle: {
          backgroundColor: "#321F28",
        },
        headerTintColor: "#E79E4F",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
    <Tab.Screen
      name="Portfel"
      component={Wallet}
      options={{
        title: "Portfel",
        headerStyle: {
          backgroundColor: "#321F28",
        },
        headerTintColor: "#E79E4F",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
  </Tab.Navigator>
);

const App = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{
        headerLeft: () => null, 
      }}>
      <Stack.Screen name="Logowanie" component={LoginScreen} options={{
          title: 'LOGOWANIE',
          headerStyle: {
            backgroundColor: '#734046',
          },
          headerTintColor: '#E79E4F',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // Dodaj niestandardowe opcje nagłówka tutaj
        }}/>
      <Stack.Screen name="GB Delivery" component={MainTabNavigator} options={{
          title: 'GB Delivery',
          headerStyle: {
            backgroundColor: '#734046',
          },
          headerTintColor: '#E79E4F',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // Dodaj niestandardowe opcje nagłówka tutaj
        }}/>
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
