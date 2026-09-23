import { TimeController, type TimeMode } from '../time/timeController'

type OnChange = (date: Date) => void
const get = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
const pad = (n: number) => String(n).padStart(2, '0')

export function createControls(time: TimeController, onChange: OnChange): void {
  const dateInput = get<HTMLInputElement>('date-input')
  const timeInput = get<HTMLInputElement>('time-input')
  const timezone = get<HTMLSelectElement>('timezone-input')
  const error = get<HTMLElement>('error')

  const fillInputs = () => {
    const d = time.displayDate
    const utc = time.timezoneMode === 'utc'
    const year = utc ? d.getUTCFullYear() : d.getFullYear()
    const month = (utc ? d.getUTCMonth() : d.getMonth()) + 1
    const day = utc ? d.getUTCDate() : d.getDate()
    const hours = utc ? d.getUTCHours() : d.getHours()
    const minutes = utc ? d.getUTCMinutes() : d.getMinutes()
    const seconds = utc ? d.getUTCSeconds() : d.getSeconds()
    dateInput.value = `${year}-${pad(month)}-${pad(day)}`
    timeInput.value = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
  const setActiveMode = (mode: TimeMode) => {
    document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button => button.classList.toggle('active', button.dataset.mode === mode))
    ;[dateInput, timeInput, timezone].forEach(input => input.disabled = mode === 'realtime')
  }
  const submitInputs = () => {
    try {
      const raw = `${dateInput.value}T${timeInput.value || '00:00:00'}`
      const parsed = time.timezoneMode === 'utc' ? new Date(`${raw}Z`) : new Date(raw)
      time.setDate(parsed); error.textContent = ''; setActiveMode('fixed'); onChange(parsed)
    } catch { error.textContent = '有効な日時を入力してください' }
  }
  document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.mode as TimeMode
    time.setMode(mode); setActiveMode(mode); fillInputs(); onChange(time.displayDate)
  }))
  get('now-button').addEventListener('click', () => { time.setMode('realtime'); setActiveMode('realtime'); fillInputs(); onChange(time.displayDate) })
  dateInput.addEventListener('change', submitInputs); timeInput.addEventListener('change', submitInputs)
  timezone.addEventListener('change', () => { time.timezoneMode = timezone.value as 'local' | 'utc'; fillInputs() })
  document.querySelectorAll<HTMLButtonElement>('[data-step]').forEach(button => button.addEventListener('click', () => {
    time.step(Number(button.dataset.step)); setActiveMode('fixed'); fillInputs(); onChange(time.displayDate)
  }))
  const panel = get('control-panel'), toggle = get<HTMLButtonElement>('panel-toggle')
  toggle.addEventListener('click', () => { const open = panel.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)) })
  setActiveMode(time.mode); fillInputs()
}

export function refreshInputsWhenLive(time: TimeController): void {
  if (time.mode !== 'realtime') return
  const d = time.displayDate
  get<HTMLInputElement>('date-input').value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  get<HTMLInputElement>('time-input').value = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
