import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { Modal, Center, NativeBaseProvider, Button, Text } from "native-base";
import CourierIcon from "../assets/courierIcon.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: 50.866077,
    longitude: 20.628569,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [courierLocation, setCourierLocation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [restaurantsData, setRestaurantsData] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [directions, setDirections] = useState([]);
  const [origin, setOrigin] = useState({ latitude: 0, longitude: 0 });
  const [destination, setDestination] = useState({ latitude: 0, longitude: 0 });
  const [route, setRoute] = useState(false);
  // const handleStartDelivery = async () => {
  //   try {
  //     const storedToken = await AsyncStorage.getItem("token");
  //     if (storedToken !== null && selectedOrder) {
  //       // Send a POST request to update the order state and courier status
  //       const response = await axios.post(
  //         `http://192.168.0.22:8000/api/startDelivery/${selectedOrder.id}`,
  //         null,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${storedToken}`,
  //           },
  //         }
  //       );

  //       if (response.status === 200) {
  //         console.log("Delivery started successfully");
  //       }
  //     } else {
  //       console.log("Brak zapisanego tokenu lub nie wybrano zamówienia.");
  //     }
  //   } catch (error) {
  //     console.error("Błąd podczas rozpoczynania dostawy:", error.message);
  //   }
  // };
  // const getDirections = async (destination) => {
  //   try {
  //     const storedToken = await AsyncStorage.getItem("token");
  //     console.log("Courier Location:", courierLocation);
  //     console.log("Restaurant Location:", selectedOrder);
  //     if (storedToken !== null) {
  //       const response = await axios.get(
  //         `https://maps.googleapis.com/maps/api/directions/json?origin=${courierLocation.latitude},${courierLocation.longitude}&destination=${destination}&key=AIzaSyD40ckrPhTz4c1PvOQxx2VWPMV_Znb_B2o`
  //       );

  //       if (response.status === 200) {
  //         const routes = response.data.routes;
  //         if (routes && routes.length > 0) {
  //           const route = routes[0].overview_polyline.points;
  //           setDirections(route);
  //         } else {
  //           console.error("No routes found");
  //         }
  //       } else {
  //         console.error("Invalid response status:", response.status);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error getting directions", error);
  //   }
  // };

  const setSatuses = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken !== null) {
        const response = await axios
          .put(
            "http://192.168.0.22:8000/api/setCourierAndOrderStatus",
            { order: selectedOrder.id },
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          )
          .then((response) => {
            if (response.data.message === "OK") {
              console.log("SetStatuses - OK");
              setOrigin({
                latitude: courierLocation.latitude,
                longitude: courierLocation.longitude,
              });
              // const regionTemp = region
              // regionTemp.latitudeDelta = 0.1
              // regionTemp.longitudeDelta = 0.1
              // setRegion(regionTemp)
              setRoute(true);
            }
          })
          .catch((reason) => {
            console.log("SetStatuses - ERR");
            console.log(reason);
          });
      } else {
        console.log("Brak zapisanego tokenu.");
      }
    } catch (error) {
      console.log("Błąd podczas pobierania tokenu:", error.message);
    }
  };

  useEffect(() => {
    const setLocation = async (courierLocation) => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken !== null) {
          const response = await axios
            .put(
              "http://192.168.0.22:8000/api/setLocation/" + 1,
              { lat: courierLocation.latitude, lng: courierLocation.longitude },
              {
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                },
              }
            )
            .then((response) => {
              if (response.data.message === "OK") {
                console.log("SetLocation - OK");
              }
            })
            .catch((reason) => {
              console.log("SetLocation - ERR");
              console.log(reason);
            });
        } else {
          console.log("Brak zapisanego tokenu.");
        }
      } catch (error) {
        console.error("Błąd podczas pobierania tokenu:", error.message);
      }
    };
    const watchCourierLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          return;
        }

        const location = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 1,
          },
          (location) => {
            const courierRegion = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
            setCourierLocation(courierRegion);
            setRegion(courierRegion);
            setLocation(courierRegion);
          }
        );

        return () => location.remove();
      } catch (error) {
        console.error("Error getting location", error);
      }
    };

    watchCourierLocation();

    const checkForOrders = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken !== null) {
          const response0 = await axios.get(
            "http://192.168.0.22:8000/api/getCourierStatus",
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );
          console.log(response0.data)
          if(response0.data.status === 'WOLNY') {
            const response = await axios.get(
              "http://192.168.0.22:8000/api/findNewOrder",
              {
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                },
              }
            );
  
            console.log("data:", response.data);
            if (response.status === 200) {
              const order = response.data;
              if (order) {
                // Order found, set the state and show the modal
                setSelectedOrder(order);
                setIsModalVisible(true);
                setDestination({ latitude: order.lat, longitude: order.lng });
                // getDirections()
                clearInterval(orderCheckInterval);
              }
            }
          } else {
            clearInterval(orderCheckInterval);
          }
        } else {
          console.log("Brak zapisanego tokenu.");
        }
      } catch (error) {
        console.error("Błąd podczas sprawdzania zamówień:", error.message);
      }
    };

    const orderCheckInterval = setInterval(() => {
      checkForOrders();
    }, 2000);

    return () => clearInterval(orderCheckInterval);
  }, []);

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <MapView zIndex={1}
          style={styles.map}
          region={{
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
          }}
        >
          {courierLocation && (
            <Marker
              coordinate={courierLocation}
              title="Tu jesteś"
              description="To jest twoja lokalizacja"
            >
              <Image source={CourierIcon} style={{ width: 40, height: 40 }} />
            </Marker>
          )}

          {selectedOrder && (
            <Marker
              coordinate={{
                latitude: selectedOrder.lat,
                longitude: selectedOrder.lng,
              }}
              title="Restauracja"
              description={selectedOrder.name}
            />
          )}

          {route && (
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={"AIzaSyD40ckrPhTz4c1PvOQxx2VWPMV_Znb_B2o"}
              strokeWidth={5}
              strokeColor="#55C1FF"
            ></MapViewDirections>
          )}
        </MapView>
        <StatusBar style="auto" />
        <Modal isOpen={isModalVisible} size={"full"}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Przypisono Cię do nowego zamówienia</Modal.Header>
            <Modal.Body>
              {selectedOrder && <Text>{selectedOrder.name}</Text>}
            </Modal.Body>
            <Modal.Footer>
              <Button
                onPress={() => {
                  setIsModalVisible(false);
                  setSatuses();
                }}
              >
                W drogę!
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </View>
    </NativeBaseProvider>
  );
}

function decodePolyline(encoded) {
  // Function to decode Google Maps Directions API polyline encoding
  let points = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return points;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#734046",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  deliveryButton: {
    position: 'fixed', 
    top: '100px',
    padding: '24px'
  }
});
