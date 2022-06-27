import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { List } from "react-native-paper";
const SPACING = 10;
const ListItem = ({ product }) => {
  return (
    <List.Item
      style={{
        backgroundColor: "#fff",
        borderRadius: SPACING / 2,
        width: "100%",
        marginBottom: SPACING,
      }}
      title="First Item"
      description="Item description"
      left={() => (
        <Image
          resizeMode="contain"
          style={{
            height: "100%",
            width: 60,
            borderRadius: SPACING / 2,
          }}
          source={{ uri: product.image }}
        />
      )}
      right={() => <List.Icon icon="arrow-left" />}
    />
  );
};

export default ListItem;

const styles = StyleSheet.create({});
