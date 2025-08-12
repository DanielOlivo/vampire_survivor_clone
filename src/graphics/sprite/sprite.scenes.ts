// import { Container, FillGradient, Graphics, Sprite } from "pixi.js";
// import { SceneMaker } from "../../gameobjects/definitions";
// import { fitRect, getSprite } from "./spriteInstance";
// import { getSpriteTinter } from "./tinter";
// import { getSpriteAnimator } from "./spriteAnimator";

// export const spriteOverlayExplore: SceneMaker = ({entitiesEnvironment}) => {
//     const container = new Container()
//     const sprite = new Sprite(entitiesEnvironment.textures.getTexture('sword3'))
//     // const mask = new Sprite(entitiesEnvironment.textures.getTexture('swordMask'))
//     // const mask = new Graphics().rect(30, 20)
//     const gradient = new FillGradient({
//         type: 'linear',
//         colorStops: [
//             {offset: 0, color: 0x000000},
//             {offset: 1, color: 0xff0000}

//         ]
//     })
//     const mask = new Graphics().rect(0, 0, 60, 40).fill(gradient)
//     const maskTexture = entitiesEnvironment.app().renderer.generateTexture(mask)
//     const maskSprite = new Sprite(maskTexture)
//     fitRect(sprite, 30, 60)
//     // sprite.mask = maskSprite
//     entitiesEnvironment.container.addChild(container)

//     const arcShape = new Graphics().arc(0, 0, 60, -Math.PI * 0.4, Math.PI * 0.3).stroke({width: 4, color: 0xffffff})
//     const arcTexture = entitiesEnvironment.app().renderer.generateTexture(arcShape)
//     const arcSprite = new Sprite(arcTexture)
//     // arcSprite.height = 120
//     // arcSprite.width = 60
//     arcSprite.scale.set(1, 2)
//     // arcSprite.mask = maskSprite

//     container.addChild(arcSprite, maskSprite)

//     container.position.set(200, 200)
//     mask.position.set(0, -100)

//     const timer = entitiesEnvironment.timers.getContinuousTimer(
//         (t: number) => maskSprite.position.set(0, -60 + t * 180),
//         0.4
//     )
//     timer.start()
// }
