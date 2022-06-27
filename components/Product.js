import { Dimensions, Image, Text, View } from "react-native";
import React from "react";

const width = Dimensions.get("screen").width;
const SPACING = 10;

const Product = ({ product }) => {
  return (
    <View
      style={{
        height: 300,
        width: width / 2 - SPACING * 1.5,
        backgroundColor: "#fff",
        marginBottom: SPACING,
        borderRadius: SPACING,
      }}
    >
      <Image
        resizeMode="contain"
        style={{ width: "100%", height: "80%" }}
        source={{ uri: product.image }}
      />
      <View style={{ padding: SPACING }}>
        <Text>
          {product.name} - {product.price}
        </Text>
      </View>
    </View>
  );
};

export default Product;
