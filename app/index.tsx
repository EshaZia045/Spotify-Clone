import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { songs, recentlyPlayed, topMixes, newReleases, Song } from "../constants/songs";
import SongCard from "../components/SongCard";
import MusicRow from "../components/MusicRow";

// ─── Recently Played Grid Card (2-column compact) ──────────────────────────
interface RecentCardProps {
  item: Song;
  onPress: (song: Song) => void;
}

const RecentCard: React.FC<RecentCardProps> = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.recentCard}
    onPress={() => onPress(item)}
    activeOpacity={0.7}
  >
    <Image source={{ uri: item.image }} style={styles.recentImage} resizeMode="cover" />
    <Text style={styles.recentTitle} numberOfLines={1}>
      {item.title}
    </Text>
  </TouchableOpacity>
);

// ─── Home Screen ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();

  const handleSongPress = (song: Song) => {
    router.push({
      pathname: "/player",
      params: { songId: song.id },
    });
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Feather name="clock" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Recently Played Grid (FlatList, 2 columns) ── */}
        <View style={styles.recentSection}>
          <FlatList
            data={recentlyPlayed}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.recentRow}
            renderItem={({ item }) => (
              <RecentCard item={item} onPress={handleSongPress} />
            )}
          />
        </View>

        {/* ── Horizontal Scrolling Sections ── */}
        <MusicRow
          title="Your top mixes"
          data={topMixes}
          onSongPress={handleSongPress}
        />
        <MusicRow
          title="New releases"
          data={newReleases}
          onSongPress={handleSongPress}
        />
        <MusicRow
          title="Recommended for you"
          data={songs}
          onSongPress={handleSongPress}
        />
      </ScrollView>

      {/* ── Bottom Navigation Bar ── */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color={Colors.primary} />
          <Text style={[styles.navLabel, { color: Colors.primary }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="search" size={24} color={Colors.textSecondary} />
          <Text style={styles.navLabel}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="library-outline" size={24} color={Colors.textSecondary} />
          <Text style={styles.navLabel}>Your Library</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  greeting: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 4,
  },
  headerIcon: {
    padding: 6,
  },

  // Recently played grid
  recentSection: {
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  recentRow: {
    justifyContent: "space-between",
    marginBottom: 8,
  },
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 6,
    width: "48.5%",
    overflow: "hidden",
  },
  recentImage: {
    width: 52,
    height: 52,
    backgroundColor: Colors.surface,
  },
  recentTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 10,
  },

  // Bottom nav
  bottomNav: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 8,
    paddingTop: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  navLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: "500",
  },
});
