// http://labs.phaser.io/assets/particles/

var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 0
			}
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('grass', 'img/grass.jpg');
    this.load.image('ball', 'img/soccerball.png');

    this.load.image('smoke', 'img/smoke-puff.png');
}

function create() {
	this.add.image(800, 600, 'grass');

    var particles = this.add.particles('smoke');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(600, 600, 'ball');

    logo.setVelocity(100, 200);
    logo.setBounce(0.9, 0.9);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
}

function update() {

}
