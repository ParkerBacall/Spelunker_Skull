
import Phaser from "phaser";
import PlayScene from "./scenes/Play";
import PreloadScene from "./scenes/Preload";

const MapWidth = 1600;
const Width = document.body.offsetWidth;
const Height = 600;

const SharedConfig = {
    mapOffset: MapWidth >  Width ? MapWidth - Width : 0,
    width: Width,
    height: Height,
}

const Scenes = [PreloadScene, PlayScene];
const createScene = Scene => new Scene(SharedConfig)
const initScenes = () => Scenes.map(createScene)

var config = {
    type: Phaser.AUTO,
    ...SharedConfig,
    pixelArt: true,
    mode: 'canvas',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: initScenes(),
    roundPixels: true,

};

const game = new Phaser.Game(config);