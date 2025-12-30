import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const PURPLE = "#2E2B8F";
const BAR_HEIGHT = 74;
const RADIUS = 18;
const SIDE_PADDING = 18;

const BUBBLE_SIZE = 56;
const BUBBLE_TOP = -18;

function normalizeRouteName(name = "") {
  // kalau route kebaca "home/index", kita normalize jadi "home"
  return name.split("/")[0];
}

function getLabel(routeName) {
  const key = normalizeRouteName(routeName);
  switch (key) {
    case "facility":
      return "Facility";
    case "event":
      return "Event";
    case "home":
      return "Home";
    case "project":
      return "Project";
    case "organization":
      return "Organization";
    default:
      return key;
  }
}

function getIcon(routeName, focused) {
  const key = normalizeRouteName(routeName);
  const color = focused ? "#FFFFFF" : "#111827";

  switch (key) {
    case "facility":
      return (
        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={22}
          color={color}
        />
      );
    case "event":
      return (
        <MaterialCommunityIcons
          name="calendar-blank-outline"
          size={22}
          color={color}
        />
      );
    case "home":
      return <Ionicons name="home-outline" size={22} color={color} />;
    case "project":
      return (
        <MaterialCommunityIcons name="atom-variant" size={22} color={color} />
      );
    case "organization":
      return (
        <MaterialCommunityIcons
          name="account-group-outline"
          size={22}
          color={color}
        />
      );
    default:
      return <Ionicons name="ellipse-outline" size={22} color={color} />;
  }
}

export default function CustomTabBar({ state, navigation }) {
  const routes = state.routes;
  const activeIndex = state.index;

  const width = Dimensions.get("window").width;
  const innerWidth = width - SIDE_PADDING * 2;
  const tabWidth = innerWidth / routes.length;

  const translateX = useRef(new Animated.Value(activeIndex * tabWidth)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: true,
      stiffness: 180,
      damping: 18,
      mass: 0.9,
    }).start();
  }, [activeIndex, tabWidth, translateX]);

  const activeRoute = routes[activeIndex];

  const labels = useMemo(
    () => routes.map((r) => getLabel(r.name)),
    [routes]
  );

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={[styles.bar, { width: innerWidth }]}>
        {/* Bubble (active icon) */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.bubble,
            {
              transform: [
                {
                  translateX: Animated.add(
                    translateX,
                    new Animated.Value((tabWidth - BUBBLE_SIZE) / 2)
                  ),
                },
              ],
            },
          ]}
        >
          {getIcon(activeRoute.name, true)}
        </Animated.View>

        {/* Tabs */}
        {routes.map((route, index) => {
          const focused = index === activeIndex;

          const onPress = () => {
            if (!focused) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[styles.tab, { width: tabWidth }]}
              android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: true }}
            >
              {/* icon area */}
              <View style={styles.iconArea}>
                {!focused ? getIcon(route.name, false) : <View style={{ height: 22 }} />}
              </View>

              {/* label */}
              <Text
                style={[styles.label, focused && styles.labelFocused]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {labels[index]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 16,
    alignItems: "center",
  },
  bar: {
    height: BAR_HEIGHT,
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS,
    flexDirection: "row",
    alignItems: "center",
    overflow: "visible",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tab: {
    height: BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10, // bikin posisi label mirip mockup
  },
  iconArea: {
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    color: "#111827",
    maxWidth: "90%",
  },
  labelFocused: {
    fontWeight: "600",
  },
  bubble: {
    position: "absolute",
    top: BUBBLE_TOP,
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
});
