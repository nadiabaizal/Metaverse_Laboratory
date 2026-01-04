import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Image,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

// 🔧 SESUAIKAN PATH ASET KAMU
const roga = require("../assets/images/rogaTerbang.png");
const logo = require("../assets/images/logo.png");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export default function Splash({ onFinish }) {
  /** =====================
   *  MASTER & EXIT
   *  ===================== */
  const master = useRef(new Animated.Value(0)).current;
  const exitFade = useRef(new Animated.Value(1)).current;

  /** =====================
   *  ROGA FLIGHT
   *  ===================== */
  const rogaScale = useRef(new Animated.Value(0.15)).current;
  const rogaOpacity = useRef(new Animated.Value(0)).current;
  const rogaX = useRef(new Animated.Value(-W * 0.4)).current;
  const rogaY = useRef(new Animated.Value(H * 0.25)).current;
  const rogaTilt = useRef(new Animated.Value(-10)).current;

  /** =====================
   *  LOGO (MUNCUL BELAKANGAN)
   *  ===================== */
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoY = useRef(new Animated.Value(20)).current;

  /** =====================
   *  AMBIENCE
   *  ===================== */
  const glow = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  /** =====================
   *  STARS
   *  ===================== */
  const stars = useMemo(() => {
    return new Array(26).fill(0).map((_, i) => ({
      id: i,
      x: rand(0, W),
      y: rand(0, H * 0.7),
      r: rand(1, 2.5),
      o: rand(0.15, 0.45),
      d: rand(0, 1000),
    }));
  }, []);

  const starAnims = useRef(stars.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    /** MASTER FADE IN */
    Animated.timing(master, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    /** STAR TWINKLE */
    starAnims.forEach((v, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, {
            toValue: 1,
            duration: 1400,
            delay: stars[i].d,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: 1400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    /** GLOW PULSE */
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    /** =====================
     *  CINEMATIC TIMELINE
     *  ===================== */
    Animated.sequence([
      /** ROGA MUNCUL DARI JAUH */
      Animated.parallel([
        Animated.timing(rogaOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),

      /** TERBANG MENDEKAT (PELAAAAAN) */
      Animated.parallel([
        Animated.timing(rogaX, {
          toValue: 0,
          duration: 2200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rogaY, {
          toValue: 0,
          duration: 2200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rogaScale, {
          toValue: 0.85,
          duration: 2200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rogaTilt, {
          toValue: 0,
          duration: 2200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      /** HOVER DRAMATIS (DIAM SEBENTAR) */
      Animated.delay(900),

      /** LOGO MUNCUL SETELAH ROGA */
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoY, {
          toValue: 0,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      /** TAHAN BIAR KEBACA */
      Animated.delay(1200),

      /** FADE OUT */
      Animated.timing(exitFade, {
        toValue: 0,
        duration: 700,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onFinish?.();
    });
  }, []);

  const glowScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.05],
  });

  return (
    <Animated.View
      style={[
        styles.root,
        { opacity: Animated.multiply(master, exitFade) },
      ]}
    >
      {/* BACKGROUND */}
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {/* STARS */}
      {stars.map((s, i) => (
        <Animated.View
          key={s.id}
          style={[
            styles.star,
            {
              width: s.r * 2,
              height: s.r * 2,
              left: s.x,
              top: s.y,
              opacity: starAnims[i].interpolate({
                inputRange: [0, 1],
                outputRange: [s.o, s.o + 0.4],
              }),
            },
          ]}
        />
      ))}

      {/* GLOW */}
      <Animated.View
        style={[
          styles.glow,
          { transform: [{ scale: glowScale }] },
        ]}
      />

      {/* ROGA */}
      <Animated.View
        style={[
          styles.rogaWrap,
          {
            opacity: rogaOpacity,
            transform: [
              { translateX: rogaX },
              { translateY: rogaY },
              { scale: rogaScale },
              {
                rotate: rogaTilt.interpolate({
                  inputRange: [-15, 15],
                  outputRange: ["-15deg", "15deg"],
                }),
              },
            ],
          },
        ]}
      >
        <Image source={roga} style={styles.roga} resizeMode="contain" />
      </Animated.View>

      {/* LOGO METAVERSE */}
      <Animated.View
        style={[
          styles.brand,
          { opacity: logoOpacity, transform: [{ translateY: logoY }] },
        ]}
      >
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.tag}>ITB Metaverse Laboratory</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0B1020",
    alignItems: "center",
    justifyContent: "center",
  },

  bgTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: H * 0.6,
    backgroundColor: "#0B1020",
  },
  bgBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: H * 0.6,
    backgroundColor: "#070A14",
  },

  star: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 99,
  },

  glow: {
    position: "absolute",
    width: Math.min(W * 0.9, 420),
    height: Math.min(W * 0.9, 420),
    borderRadius: 999,
    backgroundColor: "rgba(124,88,255,0.25)",
  },

  rogaWrap: { alignItems: "center", justifyContent: "center" },
  roga: {
    width: Math.min(W * 0.75, 320),
    height: Math.min(W * 0.75, 320),
  },

  brand: {
    position: "absolute",
    bottom: 70,
    alignItems: "center",
  },
  logo: {
    width: Math.min(W * 0.6, 260),
    height: 80,
  },
  tag: {
    marginTop: 12,
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});
