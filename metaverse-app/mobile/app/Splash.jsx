import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, Dimensions, Image } from "react-native";

const { width: W, height: H } = Dimensions.get("window");

// ✅ sesuaikan path aset kamu
const roga = require("../assets/images/rogaTerbang.png");
const logo = require("../assets/images/logo.png");

const rand = (min, max) => Math.random() * (max - min) + min;

export default function Splash({ onFinish }) {
  // master
  const master = useRef(new Animated.Value(0)).current;
  const exit = useRef(new Animated.Value(1)).current;

  // roga flight progress
  const fly = useRef(new Animated.Value(0)).current;

  // roga properties
  const rogaOpacity = useRef(new Animated.Value(0)).current;
  const rogaScale = useRef(new Animated.Value(0.16)).current;

  // idle after arrive
  const hover = useRef(new Animated.Value(0)).current;

  // logo appear after
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoY = useRef(new Animated.Value(18)).current;
  const logoScale = useRef(new Animated.Value(0.96)).current;

  // background glow
  const glow = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;

  // speed lines (clean)
  const lines = useMemo(() => {
    const count = 14;
    return new Array(count).fill(0).map((_, i) => ({
      id: i,
      y: rand(H * 0.14, H * 0.62),
      w: rand(W * 0.18, W * 0.38),
      h: rand(2, 4),
      o: rand(0.08, 0.18),
      offset: rand(-W * 0.2, W * 0.2),
    }));
  }, []);

  useEffect(() => {
    let mounted = true;

    // fade in root
    Animated.timing(master, { toValue: 1, duration: 450, useNativeDriver: true }).start();

    // glow pulse loop
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    glowLoop.start();

    // hover loop (jalan setelah roga sampai)
    const hoverLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(hover, {
          toValue: -6,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(hover, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    // --- Animasi terbang (kita simpan, lalu start callback) ---
    const flyAnim = Animated.parallel([
      Animated.timing(fly, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      Animated.timing(rogaScale, { toValue: 0.9, duration: 3000, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]);

    // main timeline
    Animated.sequence([
      // roga muncul dari jauh + glow naik pelan
      Animated.parallel([
        Animated.timing(rogaOpacity, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 1, duration: 1100, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),

      // terbang mendekat (lebih lama)
      flyAnim,

      // tahan biar seru (roga sudah dekat, hover akan jalan via callback)
      Animated.delay(900),

      // logo muncul setelah roga sampai
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(logoY, { toValue: 0, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(logoScale, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),

      // tahan sebentar biar kebaca
      Animated.delay(1400),

      // fade out
      Animated.timing(exit, { toValue: 0, duration: 650, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]).start(({ finished }) => {
      glowLoop.stop();
      hoverLoop.stop();
      if (finished && mounted) onFinish?.();
    });

    // ✅ START hover setelah fly selesai (tanpa Animated.call)
    flyAnim.start(({ finished }) => {
      if (finished && mounted) hoverLoop.start();
    });

    return () => {
      mounted = false;
      glowLoop.stop();
      hoverLoop.stop();
    };
  }, [exit, fly, glow, glowPulse, hover, logoOpacity, logoScale, logoY, master, rogaOpacity, rogaScale, onFinish]);

  // trajectory melengkung
  const rogaX = fly.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [-W * 0.62, W * 0.08, 0],
  });

  const rogaY = fly.interpolate({
    inputRange: [0, 0.35, 0.7, 1],
    outputRange: [H * 0.28, -H * 0.04, H * 0.03, 0],
  });

  const rogaTilt = fly.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["-16deg", "6deg", "0deg"],
  });

  // speed lines movement
  const linesShift = fly.interpolate({
    inputRange: [0, 1],
    outputRange: [W * 0.25, -W * 0.25],
  });

  const linesOpacity = fly.interpolate({
    inputRange: [0, 0.15, 0.85, 1],
    outputRange: [0, 1, 1, 0.25],
  });

  // glow pulse
  const glowScale = glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.06] });
  const glowOpacity = glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.22, 0.34] });

  return (
    <Animated.View style={[styles.root, { opacity: Animated.multiply(master, exit) }]}>
      {/* background */}
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {/* glow */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: Animated.multiply(glow, glowOpacity),
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      {/* speed lines */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {lines.map((l) => (
          <Animated.View
            key={l.id}
            style={[
              styles.line,
              {
                top: l.y,
                width: l.w,
                height: l.h,
                opacity: Animated.multiply(linesOpacity, l.o),
                transform: [{ translateX: Animated.add(linesShift, new Animated.Value(l.offset)) }],
              },
            ]}
          />
        ))}
      </View>

      {/* roga */}
      <Animated.View
        style={[
          styles.rogaWrap,
          {
            opacity: rogaOpacity,
            transform: [
              { translateX: rogaX },
              { translateY: Animated.add(rogaY, hover) },
              { scale: rogaScale },
              { rotate: rogaTilt },
            ],
          },
        ]}
      >
        <Image source={roga} style={styles.roga} resizeMode="contain" />
      </Animated.View>

      {/* logo */}
      <Animated.View
        style={[
          styles.brand,
          {
            opacity: logoOpacity,
            transform: [{ translateY: logoY }, { scale: logoScale }],
          },
        ]}
      >
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.tag}>ITB Metaverse Laboratory</Text>
        <Text style={styles.sub}>Explore · Build · Experience</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0B1020", alignItems: "center", justifyContent: "center" },

  bgTop: { position: "absolute", top: 0, left: 0, right: 0, height: H * 0.6, backgroundColor: "#0B1020" },
  bgBottom: {
    position: "absolute",
    bottom: 0,
    left: -W * 0.15,
    width: W * 1.3,
    height: H * 0.62,
    borderRadius: 999,
    backgroundColor: "#070A14",
    transform: [{ rotate: "-8deg" }],
    opacity: 0.96,
  },

  glow: {
    position: "absolute",
    width: Math.min(W * 0.95, 440),
    height: Math.min(W * 0.95, 440),
    borderRadius: 999,
    backgroundColor: "rgba(124,88,255,0.55)",
  },

  line: { position: "absolute", left: 0, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.9)" },

  rogaWrap: { alignItems: "center", justifyContent: "center" },
  roga: { width: Math.min(W * 0.78, 340), height: Math.min(W * 0.78, 340) },

  brand: { position: "absolute", bottom: 72, alignItems: "center" },
  logo: { width: Math.min(W * 0.62, 270), height: 82 },
  tag: { marginTop: 12, fontSize: 16, fontWeight: "900", color: "rgba(240,244,255,0.95)", letterSpacing: 0.4 },
  sub: { marginTop: 6, fontSize: 13, fontWeight: "800", color: "rgba(240,244,255,0.62)", letterSpacing: 0.6 },
});
