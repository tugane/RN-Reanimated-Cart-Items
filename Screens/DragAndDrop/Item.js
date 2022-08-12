import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const ITEM_HEIGHT = 70;

function Item({ item }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: ITEM_HEIGHT,
        padding: 10,
      }}
    >
      <Image
        source={item.image}
        style={{ height: 50, width: 50, borderRadius: 4 }}
      />

      <View
        style={{
          marginLeft: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          {item.title}
        </Text>
        <Text style={{ fontSize: 12, color: "gray" }}>{item.subTitle}</Text>
      </View>
    </View>
  );
}

export default Item;

const styles = StyleSheet.create({});
