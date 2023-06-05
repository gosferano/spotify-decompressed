type SortBy = 'duration' | 'count'

export default class SpotifyHistoryFilter {
  constructor(
    public Dates: [Date, Date],
    public SortBy: SortBy = 'duration',
    public IncludeSkipped: boolean = false
  ) {}
}
