export default class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }

    preload() {
        this.load.path = './src/assets/';
        this.load.image('fondo', 'fondo.png');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const fondo = this.add.image(0, 0, 'fondo');
        fondo.setOrigin(0);
        fondo.setDisplaySize(width, height);

        // Título
        this.add.text(width / 2, height / 3, 'Phaser 5to', {
            fontSize: '48px',
            fill: '#000804ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Texto de instrucción
        const startText = this.add.text(width / 2, height / 1.8, 'Haz clic o presiona ENTER para empezar', {
            fontSize: '20px',
            fill: '#000505ff'
        }).setOrigin(0.5);

        // Evento al dar clic o presionar ENTER
        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('Bootloader');
        });

        this.input.once('pointerdown', () => {
            this.scene.start('Bootloader');
        });
    }
}
