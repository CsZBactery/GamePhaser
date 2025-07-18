import Menu from './Scenes/Menu.js';
import Bootloader from './Scenes/Bootloader.js';

const config = {
    title: 'Web Game',
    url: 'google.com.mx',
    version: '0.0.1',

    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'contenedor',
    pixelArt: true,
    backgroundColor: '#37861e',

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },

    banner: {
        hidePhaser: true,
        text: '#fff00f',
        background: ['#16a085', '#2ecc71', '#e74c3c', '#000000']
    },

    // Inicia primero en el Menú
    scene: [Menu, Bootloader]
};

const game = new Phaser.Game(config);
