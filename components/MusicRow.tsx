import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import { Song } from "../constants/songs";
import SongCard from "./SongCard";

interface MusicRowProps {
  title: string;
  data: Song[];
  onSongPress: (song: Song) => void;
  indexOffset?: number;
}

const MusicRow: React.FC<MusicRowProps> = ({ title, data, onSongPress, indexOffset = 0 }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <SongCard
            item={item}
            onPress={onSongPress}
            variant="square"
            index={indexOffset + index}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 28 },
  sectionTitle: {
    color: Colors.textPrimary, fontSize: 20, fontWeight: "700",
    marginBottom: 14, paddingHorizontal: 16,
  },
  listContent: { paddingHorizontal: 16 },
});

export default MusicRow;
