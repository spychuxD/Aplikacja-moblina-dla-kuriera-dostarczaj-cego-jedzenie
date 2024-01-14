import { StyleSheet, View } from "react-native";
import React, { useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { VStack, Box, Text, Center, NativeBaseProvider } from "native-base";
export default function Delivery() {
  const [order, setOrder] = useState({
    name: "",
    address_line_1: "",
    address_line_2: "",
    cart: "",
    cost: "",
  });
  const [isOrder, setIsOrder] = useState(false);
  const getOrder = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken !== null) {
        const response = await axios.get(
          "http://192.168.0.22:8000/api/findCourierOrder",
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (response.status === 200) {
          setOrder(response.data);
          setIsOrder(true);
        } else if (response.status === 207){
          setIsOrder(false);
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getOrder();
    }, [])
  );
  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        {isOrder ? (
          <Box>
            <Center>
              <Text color={"#E79E4F"} fontSize="xl" bold>
                RESTAURACJA
              </Text>
              <Text color={"#E79E4F"} fontSize="xl" bold>
                {order.name}
              </Text>
              <Text color={"#E79E4F"} fontSize="xl" bold>
                {order.address_line_1}
              </Text>
              <Text color={"#E79E4F"} fontSize="xl" bold>
                {order.zip_code} {order.city}
              </Text>
              <Text color={"#E79E4F"} fontSize="xl" bold>
                ADRES DOSTAWY
              </Text>
              <Text color={"#E79E4F"} fontSize="xl" bold>
                {order.address_line_2}
              </Text>
              <Text color={"#E79E4F"} fontSize="xl" bold>
                {order.zip_code} {order.city}
              </Text>
              <Text color={"#E79E4F"} fontSize="xl" bold>
                Koszyk: {order.cart.dishName}
              </Text>
              <Text color={"#E79E4F"} fontSize="xl" bold>
                Koszt: {order.cost}
              </Text>
            </Center>
          </Box>
        ) : (
          <Box>
            <Center>
              <Text color={"#E79E4F"} fontSize="md" bold>
                Tutaj pojawią Ci się szczegóły dostawy, gdy zostanie przypisane
                do Ciebie jakieś zamówienie.
              </Text>
            </Center>
          </Box>
        )}
        <StatusBar style="auto" />
      </View>
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
