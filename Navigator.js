import * as React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Provider, BottomNavigation, Text } from "react-native-paper";
import ListItems from "./Screens/ListItems";

const Navigator = () => {
  const HomeRoute = () => <ListItems />;
  const FavoriteRoute = () => (
    <SafeAreaView>
      <Text style={{ fontSize: 25, fontWeight: "bold", margin: 10 }}>
        Favorite
      </Text>
    </SafeAreaView>
  );
  const CartRoute = () => (
    <SafeAreaView>
      <Text style={{ fontSize: 25, fontWeight: "bold", margin: 10 }}>Cart</Text>
    </SafeAreaView>
  );
  const AccountRoute = () => (
    <SafeAreaView>
      <Text style={{ fontSize: 25, fontWeight: "bold", margin: 10 }}>
        Account
      </Text>
    </SafeAreaView>
  );

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Home", icon: "home" },
    { key: "favorite", title: "Favorite", icon: "heart" },
    { key: "cart", title: "Cart", icon: "cart" },
    { key: "account", title: "Account", icon: "account" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    favorite: FavoriteRoute,
    cart: CartRoute,
    account: AccountRoute,
  });

  return (
    <Provider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </Provider>
  );
};

const styles = StyleSheet.create({
  title: {
    margin: 10,
    fontSize: 15,
    textAlign: "center",
    fontSize: 35,
  },
});
export default Navigator;
