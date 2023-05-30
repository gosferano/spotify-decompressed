export default class SpotifyHistoryTrackStats {
  constructor(
    public readonly SpotifyTrackUri: string,
    public readonly TrackName: string,
    public readonly AlbumArtistName: string,
    public Count: number,
    public MsPlayed: number
  ) {}
}
