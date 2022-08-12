import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, StatusBar, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  runOnUI,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import SPACING from "../../config/SPACING";
import colors from "../../config/Restaurant/colors";
import MovableItem from "./MovableItem";
import BUTTON_SIZE from "../../config/BUTTON_SIZE";

function listToObject(list) {
  const values = Object.values(list);
  const object = {};

  for (let i = 0; i < values.length; i++) {
    object[values[i].id] = i;
  }

  return object;
}

const CONTENT_HEIGHT = Dimensions.get("window").height / 2;
const ITEM_HEIGHT = 70;
const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");
const TRANSLATEX = WIDTH / 2 - BUTTON_SIZE / 2;

function addPosition(object, lastId) {
  "worklet";
  const newObject = Object.assign({}, object);
  newObject[lastId] = lastId - 1;
  return newObject;
}

function removePosition(object, id) {
  "worklet";
  const newObject = Object.assign({}, object);
  delete newObject[id];
  return newObject;
}

export default function Items() {
  const [listItems, setListItems] = useState([
    {
      id: 1,
      title: "Item 1",
      subTitle: "Item subTitle 1",
      image: require("../../assets/restaurant/brooke-lark-jUPOXXRNdcA-unsplash.jpeg"),
    },
    {
      id: 2,
      title: "Item 2",
      subTitle: "Item subTitle 2",
      image: require("../../assets/restaurant/brooke-lark-jUPOXXRNdcA-unsplash.jpeg"),
    },
  ]);

  const [isMoving, setIsMoving] = useState(false);
  const positions = useSharedValue(listToObject(listItems));
  const scrollY = useSharedValue(0);
  const scrollViewRef = useAnimatedRef();
  const item_position_y = useSharedValue(0);
  const opacity = useSharedValue(0.5);

  const BUTTON_START_POSITION_Y =
    ITEM_HEIGHT * listItems.length - (SPACING / 2 + BUTTON_SIZE / 6);

  const BUTTON_END_POSITION_Y =
    ITEM_HEIGHT * listItems.length + (BUTTON_SIZE / 2 - SPACING * 2);

  useAnimatedReaction(
    () => item_position_y.value,
    (new_position) => {
      if (
        new_position < BUTTON_END_POSITION_Y &&
        new_position > BUTTON_START_POSITION_Y
      ) {
        opacity.value = withTiming(1);
      } else {
        opacity.value = withTiming(0.5);
      }
    }
  );

  const animatedStylle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // adding item
  const addItem = () => {
    setListItems((currentItems) => {
      // creating new id
      const nextId = (currentItems[currentItems.length - 1]?.id ?? 0) + 1;
      // adding new item
      const newItems = [
        ...currentItems,
        {
          id: nextId,
          title: `Item ${nextId}`,
          subTitle: `Item subTitle ${nextId}`,
          image: require("../../assets/restaurant/brooke-lark-jUPOXXRNdcA-unsplash.jpeg"),
        },
      ];
      positions.value = runOnUI(addPosition(positions.value, nextId));
      return newItems;
    });
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });
    }, 200);
  };
  // deleting item
  const handleDelete = useCallback((id) => {
    setListItems((currentItems) => {
      const newItems = currentItems.filter((item) => item.id !== id);
      positions.value = runOnUI(removePosition(positions.value, id));

      return newItems;
    });
    console.log("positions:", positions.value);
  }, []);
  // check if scrollY changed
  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => scrollTo(scrollViewRef, 0, scrolling, false)
  );
  // scroll to new y
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.light,
          }}
        >
          <View
            style={{
              padding: SPACING,
              flex: 1,
            }}
          >
            <View
              style={{
                height:
                  listItems.length * ITEM_HEIGHT > CONTENT_HEIGHT
                    ? CONTENT_HEIGHT
                    : listItems.length * ITEM_HEIGHT,
              }}
            >
              <Animated.ScrollView
                ref={scrollViewRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={{
                  flex: 1,
                  position: "relative",
                }}
                contentContainerStyle={{
                  height: listItems.length * ITEM_HEIGHT,
                }}
                showsVerticalScrollIndicator={true}
              >
                {listItems.map((item) => (
                  <TouchableOpacity key={item.id}>
                    <MovableItem
                      onMoving={(moving) => setIsMoving(moving)}
                      item={item}
                      positions={positions}
                      scrollY={scrollY}
                      itemsCount={listItems.length}
                      BUTTON_START_POSITION_Y={BUTTON_START_POSITION_Y}
                      BUTTON_END_POSITION_Y={BUTTON_END_POSITION_Y}
                      item_position_y={item_position_y}
                      onDelete={handleDelete}
                    />
                  </TouchableOpacity>
                ))}
              </Animated.ScrollView>
              <View>
                <View
                  style={{
                    position: "absolute",
                    width: BUTTON_SIZE,
                    bottom: 0,
                    transform: [{ translateX: TRANSLATEX }],
                  }}
                >
                  {isMoving ? (
                    <Animated.View
                      onPress={() => addItem()}
                      style={[
                        {
                          backgroundColor: colors.dander,
                          width: "100%",
                          height: BUTTON_SIZE / 2,
                          borderRadius: SPACING * 5,
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        animatedStylle,
                      ]}
                    >
                      <Ionicons
                        name="remove"
                        size={SPACING * 3}
                        color="white"
                      />
                    </Animated.View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => addItem()}
                      style={{
                        backgroundColor: colors.primary,
                        width: "100%",
                        height: BUTTON_SIZE / 2,
                        borderRadius: SPACING * 5,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="add" size={SPACING * 3} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}
