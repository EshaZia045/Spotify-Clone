import React, { useState } from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import { Song } from "../constants/songs";

const COVER_COLORS = [
  "#e63946", "#457b9d", "#a8dadc", "#f4a261",
  "#2a9d8f", "#e9c46a", "#264653", "#e76f51",
];

interface Props {
  item: Song;
  onPress: (song: Song) => void;
  variant?: "square" | "wide";
  index?: number;
}

const SongCard: React.FC<Props> = ({ item, onPress, variant = "square", index = 0 }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const color = COVER_COLORS[index % COVER_COLORS.length];

  if (variant === "wide") {
    return (
      <TouchableOpacity style={styles.wideCard} onPress={() => onPress(item)} activeOpacity={0.7}>
        <View style={[styles.wideImage, { backgroundColor: color, justifyContent: "center", alignItems: "center" }]}>
          <Text style={styles.initial}>{item.title.charAt(0)}</Text>
          {!imgError && (
            <Image
              source={{ uri: item.image }}
              style={[StyleSheet.absoluteFill, { opacity: imgLoaded ? 1 : 0 }]}
              resizeMode="cover"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          )}
        </View>
        <View style={styles.wideInfo}>
          <Text style={styles.wideTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.wideArtist} numberOfLines={1}>{item.artist}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.squareCard} onPress={() => onPress(item)} activeOpacity={0.7}>
      <View style={[styles.squareImage, { backgroundColor: color, justifyContent: "center", alignItems: "center", overflow: "hidden" }]}>
        <Text style={styles.initialLarge}>{item.title.charAt(0)}</Text>
        {!imgError && (
          <Image
            source={{ uri: item.image }}
            style={[StyleSheet.absoluteFill, { opacity: imgLoaded ? 1 : 0 }]}
            resizeMode="cover"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}
      </View>
      <Text style={styles.squareTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.squareArtist} numberOfLines={1}>{item.artist}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  squareCard: { width: 140, marginRight: 12 },
  squareImage: { width: 140, height: 140, borderRadius: 6, backgroundColor: Colors.card },
  squareTitle: { color: Colors.textPrimary, fontSize: 13, fontWeight: "600", marginTop: 8 },
  squareArtist: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  initial: { fontSize: 20, fontWeight: "700", color: "rgba(255,255,255,0.5)" },
  initialLarge: { fontSize: 48, fontWeight: "700", color: "rgba(255,255,255,0.4)" },
  wideCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: Colors.card,
    borderRadius: 6, marginRight: 12, width: 260, overflow: "hidden",
  },
  wideImage: { width: 60, height: 60 },
  wideInfo: { flex: 1, paddingHorizontal: 12 },
  wideTitle: { color: Colors.textPrimary, fontSize: 13, fontWeight: "600" },
  wideArtist: { color: Colors.textSecondary, fontSize: 12, marginTop: 3 },
});

export default SongCard;
