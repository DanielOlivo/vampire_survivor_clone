// import { type Parent } from '../paneDefinitions';
// import { FolderApi, ListBladeApi, Pane, TabApi, TabPageApi } from 'tweakpane';
import { Environment } from "../utils/environment";
// import { BodyWrapper } from '../rapier/wrappers';
// import { getPosition } from '../utils/position';
// import { Vector2 } from '@dimforge/rapier2d-compat';
// import { Body } from '../rapier/body/body'
// import { DynamicObject } from '../rapier/dynamicObject/dynamicObject'
// import { Signal } from '../core/signal'
// import { DirVelocity } from '../utils/dirVelocity/dirVelocity'
// import { Shape } from '../graphics/shape/shape'
// import { Tracer } from '../utils/tracer/tracer'
// import { SpriteInstance } from '../graphics/sprite/spriteInstance'
// import { CollisionManager } from '../rapier/collisionManager/collisionManager'
// import { Property } from '../core/property'
// import { EnemyManager } from '../gameobjects/enemy/enemyManager'
// import { Enemy } from '../gameobjects/enemy/enemy'
// import { Stats } from '../core/stats/characterStats';
import { addCollisionManagerPane } from "../rapier/collisionManager/collisionManager.pane";
import { Pane } from "tweakpane";

export function getPane(env: Environment) {
  const container = document.createElement("div");
  const header = document.createElement("div");
  const body = document.createElement("div");

  container.appendChild(header);
  container.appendChild(body);

  let onDrag = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", (event) => {
    onDrag = true;
    offsetX = event.clientX - container.offsetLeft;
    offsetY = event.clientY - container.offsetTop;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (event) => {
    if (!onDrag) return;
    container.style.left = String(event.clientX - offsetX) + "px";
    container.style.top = String(event.clientY - offsetY) + "px";
  });

  header.addEventListener("mouseup", () => {
    onDrag = false;
    document.body.style.userSelect = "";
  });

  container.id = "debug-panel";

  {
    const style = container.style;
    style.position = "absolute";
    style.top = "20px";
    style.left = "100px";
  }

  {
    const style = header.style;
    style.minHeight = "20px";
    style.height = "20px";
    style.backgroundColor = "orange";
  }

  {
    const style = body.style;
    // style.backgroundColor = "red"
    style.minWidth = "300px";
    style.minHeight = "100px";
  }

  document.body.appendChild(container);
  // app?.appendChild(container)

  const pane = new Pane({
    container: body,
  });

  // addPauseButton(pane, env.app.onPause)

  const tab = pane.addTab({
    pages: [{ title: "Entities" }, { title: "Environment" }],
  });

  addCollisionManagerPane(tab.pages[1], env.world.collisionManager);

  return {
    pane,
    entities: tab.pages[0],
    env: tab.pages[1],
  };
}

// export function addPauseButton(pane: Parent, onPause: Property<boolean>){
//     const button = pane.addButton({
//         title: 'Pause'
//     })
//     const handle = (isPaused: boolean) => {
//         button.title = isPaused ? 'Continue' : 'Pause'
//     }
//     onPause.signal.connect(handle)

//     button.on('click', () => onPause.set(!onPause.get()))
// }

// export function addEnemyManager(pane: Parent, manager: EnemyManager){
//     const folder = pane.addFolder({
//         title: 'enemey manager'
//     })

//     const params = {
//         pool: '',
//         total: 0,
//         onIdle: '',
//         onIdleCount: 0
//     }
//     const handler = () => {
//         params.total = Array.from(manager.utils.pool.values()).reduce((acc, typedPool) => acc + typedPool.size, 0)
//         params.onIdle = Array.from( manager.utils.onIdle ).join(' ')
//         params.onIdleCount = manager.utils.onIdle.size
//     }
//     manager.enemySpawned.connect(handler)
//     manager.deathPosition.connect(handler)

//     folder.addBinding(params, 'total', {readonly: true})
//     folder.addBinding(params, 'onIdle', {readonly: true})
//     folder.addBinding(params, 'onIdleCount', {readonly: true})

//     return folder
// }

// export function addEnemy(pane: Parent, enemy: Enemy): void {
//     const folder = pane.addFolder({
//         title: 'enemy'
//     })

//     addDynamicObject(folder, enemy.obj)
//     addStats(folder, enemy.stats)
// }

// export function addStats(pane: Parent, stats: Stats): void {
//     const folder = pane.addFolder({title: 'stats'})

//     addVar(folder, stats.health.signal, 'health', stats.health.get())
//     addVar(folder, stats.isDead.signal, 'isDead', stats.isDead.get())

// }

// export function addDynamicObject(pane: Parent, dynObj: DynamicObject): void {
//     const folder = pane.addFolder({
//         title: `dynamic Object ${dynObj.getId()}`
//     })

//     const props = {
//         id: dynObj.getId()
//     }

//     folder.addBinding(props, 'id')
//     addVar(folder, dynObj.isEnabled.signal, 'isEnabled', dynObj.isEnabled.get())
//     const bodyFolder = addBody(folder, dynObj.body)
//     const dirVelFolder = addDirVelocity(folder, dynObj.dirVelocity)
//     addVar(folder, dynObj.onFollowing.signal, 'onFollowing', dynObj.onFollowing.get())
//     addVar(folder, dynObj.onListenDir.signal, 'onListenDir', dynObj.onListenDir.get())
//     const tracerFolder = addTracer(folder, dynObj.tracer)
//     const spriteFolder = addSprite(folder, dynObj.sprite())

//     bodyFolder.expanded = false
//     dirVelFolder.expanded = false
//     tracerFolder.expanded = false
//     spriteFolder.expanded = false
// }

// export function addSprite(pane: Pane | FolderApi, sprite: SpriteInstance): FolderApi {
//     const folder = pane.addFolder({
//         title: 'sprite'
//     })

//     addVector2(folder, sprite.position.signal, 'position')
//     addVector2(folder, sprite.direction.signal, 'direction')
//     addVar(folder, sprite.isEnabled.signal, 'isEnabled', sprite.isEnabled.get())
//     folder.addBinding(sprite.sprite, 'alpha', {readonly: true})

//     return folder
// }

// export function addTracer(pane: Pane | FolderApi, tracer: Tracer): FolderApi {
//     const folder = pane.addFolder({
//         title: 'tracer'
//     })

//     addVector2(folder, tracer.viewPoint.signal, 'viewPoint')
//     addVector2(folder, tracer.target.signal, 'target')
//     addVector2(folder, tracer.direction.signal, 'direction')

//     return folder
// }

// export function addDirVelocity(pane: Pane | FolderApi, dirVel: DirVelocity): FolderApi {
//     const folder = pane.addFolder({
//         title: 'dirVelocity'
//     })

//     addVar(folder, dirVel.speed.signal, 'speed', dirVel.speed.get())
//     addVector2(folder, dirVel.dir.signal, 'dir')
//     addVector2(folder, dirVel.linvel.signal, 'linvel')

//     return folder
// }

// export function addBody(pane: Pane | FolderApi, body: Body): FolderApi {
//     const folder = pane.addFolder({
//         title: 'body'
//     })

//     addVector2(folder, body.position, 'position')
//     addVector2(folder, body.linvel, 'linvel')
//     addVar<boolean>(folder, body._body.isEnabled.signal, 'isEnabled', body._body.isEnabled.get())
//     addShape(folder, body.graphics())

//     return folder
// }

// export function addShape(pane: Pane | FolderApi, shape: Shape): FolderApi {
//     const folder = pane.addFolder({
//         title: 'shape'
//     })

//     addVector2(folder, shape.position.signal, 'position')
//     addVector2(folder, shape.bias.signal, 'bias')
//     addVar(folder, shape.isEnabled.signal, 'isEnabled', shape.isEnabled.get())

//     return folder
// }

// export function addVar<T>(pane: Pane | FolderApi, signal: Signal<T>, label: string, defaultValue: T): void {
//     const param = {
//         v: defaultValue
//     }

//     const binding = pane.addBinding(param, 'v', {readonly: true})
//     binding.label = label

//     const handleUpdate = (v: T) => {
//         param.v = v
//         binding.refresh()
//     }
//     signal.connect(handleUpdate)
// }

// export function addVector2(pane: Parent, signal: Signal<Vector2>, label: string): void {

//     const param = {
//         v: {x: 0, y: 0}
//     }

//     const binding = pane.addBinding(param, 'v')
//     binding.label = label

//     const handleUpdate = (v: Vector2) => {
//         param.v.x = v.x
//         param.v.y = v.y
//         binding.refresh()
//     }
//     signal.connect(handleUpdate)
// }

// export function addBodyWrapper(env: Environment, pane: Pane | FolderApi, wrapper: BodyWrapper): void {
//     const folder = pane.addFolder({
//         title: 'BodyWrapper'
//     })

//     const props = {
//         id: String(wrapper.id),
//         position: wrapper.getPosition(),
//         enabled: wrapper.isEnabled(),
//         linvel: wrapper.getLinvel()
//     }

//     const handleTimeUpdate = (): void => {

//         props.enabled = wrapper.isEnabled()
//         props.position = wrapper.getPosition()
//         props.linvel = wrapper.getLinvel()
//     }

//     env.app.timeUpdate.connect(handleTimeUpdate)

//     folder.addBinding(props, 'id', {readonly: true})
//     folder.addBinding(props, 'position')
//     folder.addBinding(props, 'linvel')
//     folder.addBinding(props, 'enabled', {readonly: true})
// }
