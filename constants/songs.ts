export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  image: string;
  audio: string;
}

export const songs: Song[] = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    image: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    title: "Stay",
    artist: "Justin Bieber ft. The Kid LAROI",
    album: "Justice",
    duration: "2:21",
    image: "https://i.scdn.co/image/ab67616d0000b273e6f407c7f3a0ec98845e4431",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:23",
    image: "https://i.scdn.co/image/ab67616d0000b2734bc66095f8a70bc4e6593f4f",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "4",
    title: "Peaches",
    artist: "Justin Bieber",
    album: "Justice",
    duration: "3:18",
    image: "https://i.scdn.co/image/ab67616d0000b273e6f407c7f3a0ec98845e4431",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: "5",
    title: "Montero",
    artist: "Lil Nas X",
    album: "Montero",
    duration: "2:17",
    image: "https://i.scdn.co/image/ab67616d0000b273be82673b5f79d9658ec0a9fd",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: "6",
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: "2:58",
    image: "https://i.scdn.co/image/ab67616d0000b27370dbc9f47669d120ad874ec1",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
  {
    id: "7",
    title: "Bad Guy",
    artist: "Billie Eilish",
    album: "When We All Fall Asleep",
    duration: "3:14",
    image: "https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    id: "8",
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: "2:54",
    image: "https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
];

export const recentlyPlayed: Song[] = songs.slice(0, 6);
export const topMixes: Song[] = [songs[2], songs[4], songs[6], songs[1], songs[5]];
export const newReleases: Song[] = [songs[7], songs[3], songs[0], songs[5], songs[4]];
