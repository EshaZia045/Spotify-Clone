import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, Image, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Colors } from "../constants/colors";
import { songs } from "../constants/songs";
import PlayerControls from "../components/PlayerControls";

const COVER_COLORS = ["#e63946","#457b9d","#a8dadc","#f4a261","#2a9d8f","#e9c46a","#264653","#e76f51"];

export default function PlayerScreen() {
  const { songId } = useLocalSearchParams<{ songId: string }>();
  const router = useRouter();

  const initIndex = songs.findIndex((s) => s.id === songId);
  const [currentIndex, setCurrentIndex] = useState(initIndex >= 0 ? initIndex : 0);
  const song = songs[currentIndex];
  const coverColor = COVER_COLORS[currentIndex % COVER_COLORS.length];

  const [isPlaying, setIsPlaying]     = useState(false);
  const [liked, setLiked]             = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [audioError, setAudioError]   = useState(false);
  const [imgLoaded, setImgLoaded]     = useState(false);
  const [imgError, setImgError]       = useState(false);
  const [progress, setProgress]       = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [durationText, setDurationText] = useState(song.duration);

  const soundRef   = useRef<Audio.Sound | null>(null);
  const isMounted  = useRef(true);
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { isMounted.current = true; return () => { isMounted.current = false; }; }, []);

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  };

  const unloadSound = async () => {
    if (loadingTimer.current) clearTimeout(loadingTimer.current);
    if (soundRef.current) {
      try { await soundRef.current.stopAsync(); } catch (_) {}
      try { await soundRef.current.unloadAsync(); } catch (_) {}
      soundRef.current = null;
    }
  };

  const loadAudio = useCallback(async (autoPlay = false) => {
    await unloadSound();
    if (!isMounted.current) return;

    setIsLoading(true);
    setAudioError(false);
    setProgress(0);
    setCurrentTime("0:00");
    setDurationText(songs[currentIndex].duration);

    // Safety timeout — if not loaded in 10s, show error
    loadingTimer.current = setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false);
        setAudioError(true);
      }
    }, 10000);

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { sound, status } = await Audio.Sound.createAsync(
        { uri: songs[currentIndex].audio },
        { shouldPlay: autoPlay, progressUpdateIntervalMillis: 500 },
        (s: AVPlaybackStatus) => {
          if (!s.isLoaded || !isMounted.current) return;
          const dur = s.durationMillis ?? 0;
          const pos = s.positionMillis ?? 0;
          setProgress(dur > 0 ? pos / dur : 0);
          setCurrentTime(fmt(pos));
          if (dur > 0) setDurationText(fmt(dur));
          setIsPlaying(s.isPlaying);
          if (s.didJustFinish) setCurrentIndex((p) => (p + 1) % songs.length);
        }
      );

      if (loadingTimer.current) clearTimeout(loadingTimer.current);
      soundRef.current = sound;

      if (!isMounted.current) { await sound.unloadAsync(); return; }
      setIsLoading(false);
      if (autoPlay) { setIsPlaying(true); }

    } catch (e) {
      if (loadingTimer.current) clearTimeout(loadingTimer.current);
      console.warn("Audio load error:", e);
      if (isMounted.current) { setIsLoading(false); setAudioError(true); }
    }
  }, [currentIndex]);

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
    loadAudio(false);          // load but don't auto-play on song change
    setLiked(false);
    return () => { unloadSound(); };
  }, [currentIndex]);

  const handlePlayPause = async () => {
    if (audioError) { await loadAudio(true); return; }
    if (!soundRef.current) { await loadAudio(true); return; }
    if (isPlaying) await soundRef.current.pauseAsync();
    else await soundRef.current.playAsync();
  };

  const handleNext     = () => setCurrentIndex((p) => (p + 1) % songs.length);
  const handlePrevious = () => setCurrentIndex((p) => (p - 1 + songs.length) % songs.length);
  const handleLike     = () => setLiked((l) => !l);

  const pct = `${Math.round(progress * 100)}%` as any;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.container}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-down" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.topBarCenter}>
            <Text style={styles.playingFrom}>NOW PLAYING</Text>
            <Text style={styles.playlistName} numberOfLines={1}>{song.album}</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="more-horizontal" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Album Art */}
        <View style={styles.artworkContainer}>
          <View style={[styles.artwork, { backgroundColor: coverColor }]}>
            {/* Letter fallback - always visible until image loads */}
            {(!imgLoaded || imgError) && (
              <Text style={styles.artworkInitial}>{song.title.charAt(0)}</Text>
            )}
            {!imgError && (
              <Image
                source={{ uri: song.image }}
                style={[StyleSheet.absoluteFill, { borderRadius: 8, opacity: imgLoaded ? 1 : 0 }]}
                resizeMode="cover"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
              />
            )}
          </View>
        </View>

        {/* Song Info */}
        <View style={styles.songInfoRow}>
          <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
            <Text style={styles.artistName} numberOfLines={1}>{song.artist}</Text>
          </View>
          <TouchableOpacity onPress={handleLike} activeOpacity={0.7}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={26}
              color={liked ? Colors.heartActive : Colors.heartInactive}
            />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: pct }]} />
            <View style={[styles.progressThumb, { left: pct }]} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>{currentTime}</Text>
            <Text style={styles.timeLabel}>{durationText}</Text>
          </View>
        </View>

        {/* Audio status */}
        {audioError && (
          <Text style={styles.errorText}>⚠️ Audio unavailable — tap play to retry</Text>
        )}

        {/* Controls */}
        <View style={styles.controlsWrapper}>
          {isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading audio…</Text>
            </View>
          ) : (
            <PlayerControls
              isPlaying={isPlaying}
              liked={liked}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onLike={handleLike}
            />
          )}
        </View>

        {/* Extra Controls */}
        <View style={styles.extraControls}>
          <TouchableOpacity><Feather name="repeat" size={22} color={Colors.textSecondary} /></TouchableOpacity>
          <TouchableOpacity><Feather name="cast"   size={22} color={Colors.textSecondary} /></TouchableOpacity>
          <TouchableOpacity><Feather name="list"   size={22} color={Colors.textSecondary} /></TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
  topBar:          { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 28 },
  iconBtn:         { padding: 4, width: 40 },
  topBarCenter:    { alignItems: "center", flex: 1 },
  playingFrom:     { color: Colors.textSecondary, fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },
  playlistName:    { color: Colors.textPrimary, fontSize: 13, fontWeight: "600", marginTop: 2 },
  artworkContainer:{ alignItems: "center", marginBottom: 28, elevation: 16 },
  artwork:         { width: 300, height: 300, borderRadius: 8, overflow: "hidden", justifyContent: "center", alignItems: "center" },
  artworkInitial:  { fontSize: 100, fontWeight: "700", color: "rgba(255,255,255,0.35)" },
  songInfoRow:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  songInfo:        { flex: 1, marginRight: 16 },
  songTitle:       { color: Colors.textPrimary, fontSize: 22, fontWeight: "700" },
  artistName:      { color: Colors.textSecondary, fontSize: 15, marginTop: 4 },
  progressContainer:{ marginBottom: 20 },
  progressTrack:   { height: 4, backgroundColor: Colors.progressTrack, borderRadius: 2, position: "relative", justifyContent: "center" },
  progressFill:    { height: 4, backgroundColor: Colors.progressFill, borderRadius: 2 },
  progressThumb:   { position: "absolute", width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.textPrimary, top: -4, marginLeft: -6 },
  timeRow:         { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  timeLabel:       { color: Colors.textSecondary, fontSize: 12 },
  errorText:       { color: "#ff6b6b", fontSize: 12, textAlign: "center", marginBottom: 8 },
  controlsWrapper: { minHeight: 80, justifyContent: "center" },
  loadingRow:      { alignItems: "center", gap: 10 },
  loadingText:     { color: Colors.textSecondary, fontSize: 13, marginTop: 6 },
  extraControls:   { flexDirection: "row", justifyContent: "space-around", marginTop: 24, paddingHorizontal: 16 },
});
