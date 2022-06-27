import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import products from "../config/products";
import Product from "../components/Product";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { List } from "react-native-paper";
import ListItem from "../components/ListItem";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const SPACING = 10;
const ListItems = () => {
  const [image, setImage] = useState(null);
  const [X, setX] = useState(width * 0.6);
  const [Y, setY] = useState(height - SPACING * 2);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

  const gestureEvent = useAnimatedGestureHandler({
    onStart: () => {},
    onActive: ({ absoluteX, absoluteY }) => {
      translateX.value = absoluteX;
      translateY.value = withTiming(absoluteY, { duration: 0 }, (finished) => {
        if (finished) {
          opacity.value = withTiming(1);
          translateX.value = withTiming(X, { duration: 600 });
          translateY.value = withTiming(Y, { duration: 600 }, (finished) => {
            if (finished) {
              opacity.value = withTiming(0);
            }
          });
        }
      });
    },
  });
  return (
    <>
      <Animated.View
        style={[
          rStyle,
          {
            zIndex: SPACING,
            width: SPACING * 5,
            height: SPACING * 5,
            justifyContent: "center",
            position: "absolute",
            alignItems: "center",
          },
        ]}
      >
        <Image
          resizeMode="contain"
          style={[
            {
              width: "100%",
              height: "100%",
            },
          ]}
          source={{ uri: image }}
        />
      </Animated.View>
      <SafeAreaView>
        <View style={{ padding: SPACING }}>
          <Text
            style={{
              fontSize: SPACING * 3,
              fontWeight: "700",
              marginBottom: SPACING,
            }}
          >
            Fruits
          </Text>
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {products.map((product) => (
                <GestureHandlerRootView key={product.id}>
                  <TapGestureHandler
                    onGestureEvent={gestureEvent}
                    onActivated={() => setImage(product.image)}
                  >
                    <Animated.View>
                      <Product product={product} />
                      {/* <ListItem product={product} /> */}
                    </Animated.View>
                  </TapGestureHandler>
                </GestureHandlerRootView>
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ListItems;

const styles = StyleSheet.create({});
