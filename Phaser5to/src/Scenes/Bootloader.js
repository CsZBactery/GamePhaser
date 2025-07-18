export default class Bootloader extends Phaser.Scene {
    constructor() {
        super({ key: 'Bootloader' });
    }

    preload() {
        this.load.path = './src/assets/';
        this.load.image('fondo', 'fondo.png');
        this.load.image('player', 'BbY.png');
        this.load.image('piso', 'Piso.png');
        this.load.image('pltf', 'pltf.png');
        this.load.image('torreta', 'torreta.png');
        this.load.image('balaTorreta', 'balaTorreta.png');
        this.load.audio('musica', 'medie.mp3');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Fondo como imagen estática de fondo
        this.fondo = this.add.image(0, 0, 'fondo').setOrigin(0);
        this.fondo.setDisplaySize(width * 2, height);
        this.fondo.setScrollFactor(0);

        // Música
        this.musica = this.sound.add('musica', { loop: true });
        this.musica.play();
        this.musicaPausada = false;

        // Piso principal
        this.piso = this.physics.add.staticGroup();
        this.piso.create(width / 2, height - 10, 'piso')
            .setScale(width / 100, 1)
            .refreshBody();

        // Plataformas
        this.plataformas = this.physics.add.staticGroup();
        const plataformasData = [
            { x: 300, y: 400 },
            { x: 600, y: 300 },
            { x: 900, y: 200 },
            { x: 1200, y: 300 },
            { x: 1500, y: 400 }
        ];

        this.torretas = this.add.group();
        this.balasTorreta = this.physics.add.group();

        plataformasData.forEach((pos, i) => {
            const plataforma = this.plataformas.create(pos.x, pos.y, 'pltf');
            plataforma.setScale(0.05).refreshBody();

            if (i % 2 === 1) {
                const torreta = this.add.image(pos.x, pos.y - 20, 'torreta');
                torreta.setScale(0.03);
                this.torretas.add(torreta);

                this.time.addEvent({
                    delay: 2000,
                    callback: () => this.dispararBalaDesde(torreta),
                    loop: true
                });
            }
        });

        // Jugador
        this.player = this.physics.add.sprite(100, 50, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.05);
        this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.9);
        this.player.body.setOffset(this.player.width * 0.25, this.player.height * 0.1);

        // Vida y barra
        this.vida = 5;
        this.vidaMax = 5;
        this.textoVida = this.add.text(10, 10, 'VIDA', {
            fontSize: '16px',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setScrollFactor(0);

        this.barraVidaBg = this.add.rectangle(65, 20, 100, 10, 0x555555).setScrollFactor(0);
        this.barraVida = this.add.rectangle(65, 20, 100, 10, 0xff0000).setScrollFactor(0);

        // Overlay de pausa
        this.textoPausa = this.add.text(width / 2, height / 2, 'PAUSA', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#000'
        }).setOrigin(0.5).setScrollFactor(0);
        this.textoPausa.setVisible(false);

        // Cámara
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, width * 2, height);

        // Colisiones
        this.physics.add.collider(this.player, this.piso);
        this.physics.add.collider(this.player, this.plataformas);
        this.physics.add.overlap(this.player, this.balasTorreta, this.recibirDisparo, null, this);

        // Controles
        this.cursor = this.input.keyboard.createCursorKeys();

        // Tecla para pausa
        this.input.keyboard.on('keydown-P', () => {
            this.estaPausado = !this.estaPausado;

            if (this.estaPausado) {
                this.scene.pause();
                this.textoPausa.setVisible(true);
                if (!this.musicaPausada) {
                    this.musica.pause();
                    this.musicaPausada = true;
                }
            } else {
                this.scene.resume();
                this.textoPausa.setVisible(false);
                if (this.musicaPausada) {
                    this.musica.resume();
                    this.musicaPausada = false;
                }
            }
        });
    }

    update() {
        if (!this.estaPausado) {
            if (this.cursor.left.isDown) {
                this.player.setVelocityX(-160);
                this.player.flipX = true;
            } else if (this.cursor.right.isDown) {
                this.player.setVelocityX(160);
                this.player.flipX = false;
            } else {
                this.player.setVelocityX(0);
            }

            if (this.cursor.up.isDown && this.player.body.blocked.down) {
                this.player.setVelocityY(-550);
            }

            if (this.player.y > this.cameras.main.height + 100) {
                this.scene.restart();
            }

            this.barraVida.width = (this.vida / this.vidaMax) * 100;
        }
    }

    dispararBalaDesde(torreta) {
        const bala = this.balasTorreta.create(torreta.x, torreta.y, 'balaTorreta');
        bala.setScale(0.015);
        bala.body.allowGravity = false;

        const dx = this.player.x - torreta.x;
        const dy = this.player.y - torreta.y;
        const magnitud = Math.sqrt(dx * dx + dy * dy);
        const velocidad = 200;

        const vx = (dx / magnitud) * velocidad;
        const vy = (dy / magnitud) * velocidad;

        bala.setVelocity(vx, vy);
        bala.setRotation(Phaser.Math.Angle.Between(torreta.x, torreta.y, this.player.x, this.player.y));

        this.time.delayedCall(5000, () => {
            if (bala.active) bala.destroy();
        });
    }

    recibirDisparo(player, bala) {
        bala.destroy();
        this.vida--;
        if (this.vida <= 0) {
            this.scene.restart();
        }
    }
}
