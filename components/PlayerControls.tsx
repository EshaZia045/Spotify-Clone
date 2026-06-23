import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

interface PlayerControlsProps {
  isPlaying: boolean;
  liked: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onLike: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  liked,
  onPlayPause,
  onNext,
  onPrevious,
  onLike,
}) => {
  return (
    <View style={styles.container}>
      {/* Like / Heart button */}
      <TouchableOpacity onPress={onLike} style={styles.sideButton} activeOpacity={0.7}>
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={28}
          color={liked ? Colors.heartActive : Colors.heartInactive}
        />
      </TouchableOpacity>

      {/* Previous */}
      <TouchableOpacity onPress={onPrevious} style={styles.controlButton} activeOpacity={0.7}>
        <Ionicons name="play-skip-back" size={34} color={Colors.textPrimary} />
      </TouchableOpacity>

      {/* Play / Pause */}
      <TouchableOpacity onPress={onPlayPause} style={styles.playButton} activeOpacity={0.8}>
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={36}
          color="#000000"
        />
      </TouchableOpacity>

      {/* Next */}
      <TouchableOpacity onPress={onNext} style={styles.controlButton} activeOpacity={0.7}>
        <Ionicons name="play-skip-forward" size={34} color={Colors.textPrimary} />
      </TouchableOpacity>

      {/* Options / shuffle placeholder */}
      <TouchableOpacity style={styles.sideButton} activeOpacity={0.7}>
        <Feather name="shuffle" size={24} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginTop: 8,
  },
  sideButton: {
    padding: 8,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    // nudge icon to look visually centered
    paddingLeft: 4,
  },
});

export default PlayerControls;
