import React, { useEffect, useState } from "react";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { Dimensions } from "react-native";
import Item from "./Item";
import SPACING from "../../config/SPACING";
import BUTTON_SIZE from "../../config/BUTTON_SIZE";

function clamp(value, lowerBound, upperBound) {
  "worklet";
  return Math.max(lowerBound, Math.min(value, upperBound));
}

function objectMove(object, from, to) {
  "worklet";
  const newObject = Object.assign({}, object);

  for (const id in object) {
    if (object[id] === from) {
      newObject[id] = to;
    }

    if (object[id] === to) {
      newObject[id] = from;
    }
  }

  return newObject;
}

const CONTENT_HEIGHT = Dimensions.get("window").height / 2;
const ITEM_HEIGHT = 70;
const SCROLL_HEIGHT_THRESHOLD = ITEM_HEIGHT;

function MovableItem({
  item,
  positions,
  scrollY,
  itemsCount,
  onMoving,
  item_position_y,
  BUTTON_START_POSITION_Y,
  BUTTON_END_POSITION_Y,
  onDelete,
}) {
  const [moving, setMoving] = useState(false);
  const top = useSharedValue(positions.value[item.id] * ITEM_HEIGHT);
  const opacity = useSharedValue(1);

  useEffect(() => {
    onMoving(moving);
  }, [moving]);

  useAnimatedReaction(
    () => positions.value[item.id],
    (currentPosition, previousPosition) => {
      if (currentPosition !== previousPosition) {
        if (!moving) {
          top.value = withSpring(currentPosition * ITEM_HEIGHT);
        }
      }
    },
    [moving]
  );

  const gestureHandler = useAnimatedGestureHandler({
    onStart() {
      runOnJS(setMoving)(true);
      opacity.value = withSpring(1);
    },
    onActive(event) {
      const positionY = event.absoluteY + scrollY.value;
      item_position_y.value = positionY;
      // change opacity
      if (
        positionY < BUTTON_END_POSITION_Y &&
        positionY > BUTTON_START_POSITION_Y
      ) {
        opacity.value = withSpring(0);
      } else {
        opacity.value = withSpring(1);
      }

      if (positionY <= scrollY.value + SCROLL_HEIGHT_THRESHOLD) {
        // Scroll up
        scrollY.value = withTiming(0, { duration: 200 });
      } else if (
        positionY >=
        scrollY.value + CONTENT_HEIGHT - SCROLL_HEIGHT_THRESHOLD
      ) {
        // Scroll down
        const contentHeight = itemsCount * ITEM_HEIGHT;
        const containerHeight = CONTENT_HEIGHT;
        const maxScroll = contentHeight - containerHeight;
        if (maxScroll > 0) {
          scrollY.value = withTiming(maxScroll, { duration: 200 });
        }
      } else {
        cancelAnimation(scrollY);
      }

      top.value = withTiming(positionY - ITEM_HEIGHT - SPACING, {
        duration: 16,
      });

      const newPosition = clamp(
        Math.floor(positionY / ITEM_HEIGHT),
        0,
        itemsCount - 1
      );

      if (newPosition !== positions.value[item.id]) {
        positions.value = objectMove(
          positions.value,
          positions.value[item.id],
          newPosition
        );
      }
    },
    onFinish() {
      top.value = positions.value[item.id] * ITEM_HEIGHT;
      runOnJS(setMoving)(false);
      opacity.value = withSpring(1);
      if (
        item_position_y.value < BUTTON_END_POSITION_Y &&
        item_position_y.value > BUTTON_START_POSITION_Y
      ) {
        runOnJS(onDelete)(item.id);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      left: 0,
      right: 0,
      top: top.value,
      // zIndex: moving ? 1 : 0,
      shadowColor: "black",
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowOpacity: withSpring(moving ? 0.2 : 0),
      shadowRadius: 10,
      opacity: opacity.value,
    };
  }, [moving]);

  return (
    <Animated.View style={animatedStyle}>
      <BlurView intensity={moving ? 100 : 0} tint="light">
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={{ maxWidth: "80%" }}>
            <Item item={item} />
          </Animated.View>
        </PanGestureHandler>
      </BlurView>
    </Animated.View>
  );
}

export default MovableItem;
