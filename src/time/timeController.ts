export type TimeMode = 'realtime' | 'fixed'
export type TimezoneMode = 'local' | 'utc'

export class TimeController {
  mode: TimeMode = 'realtime'
  displayDate = new Date()
  timezoneMode: TimezoneMode = 'local'

  constructor() {
    const query = new URLSearchParams(location.search)
    if (query.get('mode') === 'time' && query.get('t')) {
      const parsed = new Date(query.get('t')!)
      if (!Number.isNaN(parsed.getTime())) {
        this.mode = 'fixed'
        this.displayDate = parsed
      }
    }
  }

  tick(): Date {
    if (this.mode === 'realtime') this.displayDate = new Date()
    return this.displayDate
  }

  setMode(mode: TimeMode): void {
    this.mode = mode
    if (mode === 'realtime') this.displayDate = new Date()
    this.syncUrl()
  }

  setDate(date: Date): void {
    if (Number.isNaN(date.getTime())) throw new Error('有効な日時を入力してください')
    this.mode = 'fixed'
    this.displayDate = date
    this.syncUrl()
  }

  step(milliseconds: number): void {
    this.setDate(new Date(this.displayDate.getTime() + milliseconds))
  }

  syncUrl(): void {
    const query = this.mode === 'realtime' ? '?mode=now' : `?mode=time&t=${encodeURIComponent(this.displayDate.toISOString())}`
    history.replaceState(null, '', `${location.pathname}${query}`)
  }
}
