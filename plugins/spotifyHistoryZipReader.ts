import jszip from "jszip";
import { msToText } from "./utils";

export class SpotifyHistoryGlobalStats {
  MsPlayed: number;
  TimesPlayed: number;
  TotalTracks: number;
  TotalArtists: number;
  TotalAlbums: number;
  constructor(
    msPlayed: number = 0,
    timesPlayed: number = 0,
    totalTracks: number = 0,
    totalArtists : number = 0,
    totalAlbums : number = 0) {
      this.MsPlayed = msPlayed;
      this.TimesPlayed = timesPlayed;
      this.TotalTracks = totalTracks;
      this.TotalArtists = totalArtists;
      this.TotalAlbums = totalAlbums;
  }
}

export class SpotifyHistoryEntry {
  public ConnectionCountry: string;
  EpisodeName: string;
  EpisodeShowName: string;
  IsIncognitoMode: boolean;
  IpAddress: string;
  AlbumName: string;
  AlbumArtistName: string;
  TrackName: string;
  MsPlayed: number;
  IsOffline: any;
  OfflineTimestamp: any;
  Platform: any;
  ReasonEnd: any;
  ReasonStart: string;
  IsShuffle: boolean;
  IsSkipped: boolean;
  SpotifyEpisodeUri: string;
  SpotifyTrackUri: string;
  Timestamp: number;
  UserAgent: string;
  Username: string;

  constructor(value: {
    conn_country: string,
    episode_name: string,
    episode_show_name: string,
    incognito_mode: boolean,
    ip_addr_decrypted: string,
    master_metadata_album_album_name: string,
    master_metadata_album_artist_name: string,
    master_metadata_track_name: string,
    ms_played: number,
    offline: boolean,
    offline_timestamp: number,
    platform: string,
    reason_end: string,
    reason_start: string,
    shuffle: boolean,
    skipped: boolean,
    spotify_episode_uri: string,
    spotify_track_uri: string,
    ts: number,
    user_agent_decrypted: string,
    username: string
  }) {
    this.ConnectionCountry = value.conn_country;
    this.EpisodeName = value.episode_name;
    this.EpisodeShowName = value.episode_show_name;
    this.IsIncognitoMode = value.incognito_mode;
    this.IpAddress = value.ip_addr_decrypted;
    this.AlbumName = value.master_metadata_album_album_name;
    this.AlbumArtistName = value.master_metadata_album_artist_name;
    this.TrackName = value.master_metadata_track_name;
    this.MsPlayed = value.ms_played;
    this.IsOffline = value.offline;
    this.OfflineTimestamp = value.offline_timestamp;
    this.Platform = value.platform;
    this.ReasonEnd = value.reason_end;
    this.ReasonStart = value.reason_start;
    this.IsShuffle = value.shuffle;
    this.IsSkipped = value.skipped;
    this.SpotifyEpisodeUri = value.spotify_episode_uri;
    this.SpotifyTrackUri = value.spotify_track_uri;
    this.Timestamp = value.ts;
    this.UserAgent = value.user_agent_decrypted;
    this.Username = value.username;
  }
}

export class SpotifyHistory {
  Entries: SpotifyHistoryEntry[];

  constructor(entries: Array<SpotifyHistoryEntry>) {
    this.Entries = entries;
  }

  getGlobalStats(): SpotifyHistoryGlobalStats {
    let msPlayed = 0;
    let timesPlayed = this.Entries.length;
    let tracks = new Map();
    let artists = new Map();
    let albums = new Map();

    this.Entries.forEach(entry => {
      msPlayed += entry.MsPlayed;
      if (entry.SpotifyTrackUri) {
        tracks.set(entry.SpotifyTrackUri, 0);
        artists.set(entry.AlbumArtistName, 0);
        albums.set(entry.AlbumName, 0);
      }
    })

    return new SpotifyHistoryGlobalStats(msPlayed, timesPlayed, tracks.size, artists.size, albums.size);
  }

  getTrackStats(): Array<any> {
    let entriesByTrack: Map<string, any> = new Map<string, any>();

    this.Entries.forEach(entry => {

      const trackUri: string = entry.SpotifyTrackUri;

      if (!trackUri)
        return;

      if (!entriesByTrack.has(trackUri)) {
        entriesByTrack.set(trackUri, {
          SpotifyTrackUri: trackUri,
          TrackName: entry.TrackName,
          AlbumArtistName: entry.AlbumArtistName,
          TimesPlayed: 0,
          MsPlayed: 0
        })
      }

      const existingEntry = entriesByTrack.get(trackUri);
      existingEntry.MsPlayed += entry.MsPlayed;
      existingEntry.TimesPlayed += 1;
    });

    console.log(entriesByTrack);

    return Array.from(entriesByTrack.values()).sort((a, b) => - a.MsPlayed + b.MsPlayed);
  }

  getArtistStats(): Array<any> {
    let entriesByArtist: Map<string, any> = new Map<string, any>();

    this.Entries.forEach(entry => {
      const artistName: string = entry.AlbumArtistName;

      if (!artistName)
        return;

      if (!entriesByArtist.has(artistName)) {
        entriesByArtist.set(artistName, {
          AlbumArtistName: artistName,
          TimesPlayed: 0,
          MsPlayed: 0
        })
      }

      const existingEntry = entriesByArtist.get(artistName);
      existingEntry.MsPlayed += entry.MsPlayed;
      existingEntry.TimesPlayed += 1;
    });

    return Array.from(entriesByArtist.values()).sort((a, b) => - a.MsPlayed + b.MsPlayed);
  }

  getDateRange(): Array<Date> {
    let minDate = new Date();
    let maxDate = new Date("1900-01-01");
    this.Entries.forEach(entry => {
      const entryDate = new Date(entry.Timestamp)
      minDate = minDate < entryDate ? minDate : entryDate;
      maxDate = maxDate > entryDate ? maxDate : entryDate;
    });

    console.log(minDate, maxDate)

    return [minDate, maxDate];
  }
}

export class SpotifyHistoryZipReader {
  async parseExtendedHistory(file: File): Promise<SpotifyHistory> {
    const archive = await jszip.loadAsync(file);
    const historyEntries = await this.getEntries(archive);
    return new SpotifyHistory(historyEntries);
  }

  async getEntries(archive: jszip): Promise<SpotifyHistoryEntry[]> {
    const historyEntryListPromises = Object.keys(archive.files)
      .filter((fileName: string) => fileName.startsWith("MyData/endsong_"))
      .map(async function (filename) {
        const contentAsText = await archive.files[filename].async('string');
        return JSON.parse(contentAsText);
      })
    const historyEntryLists = await Promise.all(historyEntryListPromises);
    return historyEntryLists
      .flat()
      .map((entry) => new SpotifyHistoryEntry(entry));
  }
}