import './style.css'
import { calculateSunPosition } from './astronomy/sunPosition'
import { createScene } from './scene/createScene'
import { TimeController } from './time/timeController'
import { createControls, refreshInputsWhenLive } from './ui/controls'

const get = (id: string) => document.getElementById(id)!
const sceneHost = get('scene')
let world: ReturnType<typeof createScene>

try {
  world = createScene(sceneHost)
} catch {
  sceneHost.innerHTML = '<div class="webgl-error"><strong>3D表示を利用できません</strong><br>WebGL対応ブラウザを使用してください。</div>'
  throw new Error('WebGL unavailable')
}

const time = new TimeController()
const coordinate = (value: number, positive: string, negative: string) => `${Math.abs(value).toFixed(1)}° ${value >= 0 ? positive : negative}`
const localFormatter = new Intl.DateTimeFormat('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
const dateFormatter = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })

function update(date: Date) {
  try {
    const position = calculateSunPosition(date)
    world.setSunDirection(position.direction)
    get('latitude').textContent = coordinate(position.latitude, 'N', 'S')
    get('longitude').textContent = coordinate(position.longitude, 'E', 'W')
    get('local-time').textContent = localFormatter.format(date)
    get('date-label').textContent = dateFormatter.format(date)
    get('utc-time').textContent = `UTC  ${date.toISOString().replace('T', '  ').slice(0, 19)}`
    get('mode-label').textContent = time.mode === 'realtime' ? 'LIVE POSITION' : 'SELECTED MOMENT'
  } catch { get('error').textContent = '有効な日時を入力してください' }
}

createControls(time, update)
get('grid-toggle').addEventListener('change', event => { world.grid.visible = (event.target as HTMLInputElement).checked })
get('equator-toggle').addEventListener('change', event => { world.equator.visible = (event.target as HTMLInputElement).checked })
get('terminator-toggle').addEventListener('change', event => world.earth.setTerminator((event.target as HTMLInputElement).checked))
get('sun-toggle').addEventListener('change', event => {
  const checked = (event.target as HTMLInputElement).checked
  world.sunArrow.visible = checked; get('sun-note').hidden = !checked
})
update(time.tick())
setInterval(() => { update(time.tick()); refreshInputsWhenLive(time) }, 1000)
