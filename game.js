var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 500
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
var platform;
var player;
var cursors;
var boxes;
var saws;
var score = 0;
var gameOver = false;
var scoreText;
var gameOverText;

const centerWidth = this.config.width / 2;
const centerHeight = this.config.height / 2;

function preload() {
    this.load.image('background', './Brown.png');
    this.load.image('platform', './Brown Off.png');
    this.load.image('box', './Idle.png');
    this.load.image('saw', './Off.png');
    this.load.spritesheet('guy', './Run (32x32).png', {
        frameWidth: 32,
        frameHeight: 32
    });
}

function create() {
    // Background
    this.add.image(centerWidth, centerHeight, 'background').setScale(13);

    // Platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(100, 500, 'platform').refreshBody();
    platforms.create(140, 500, 'platform');
    platforms.create(250, 400, 'platform');
    platforms.create(290, 400, 'platform');
    platforms.create(400, 500, 'platform');
    platforms.create(440, 500, 'platform');
    platforms.create(480, 500, 'platform');
    platforms.create(520, 500, 'platform');
    platforms.create(560, 500, 'platform');
    // Floor made out of platforms
    for (let i = 1; i < 20; i++) {
        platforms.create(40 * i, this.sys.game.config.height, 'platform');
    }

    scoreText = this.add.text(20, 200, 'Score:' + score, {
        fontSize: '32px',
        fill: '#000000'
    });

    // Boxes
    boxes = this.physics.add.group({
        key: 'box',
        repeat: 8,
        setXY: {
            x: 20,
            y: 100,
            stepX: 80
        }
    });
    boxes.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.3));
    });

    saws = this.physics.add.group();

    // Player
    player = this.physics.add.sprite(60, 500, 'guy');
    player.setCollideWorldBounds(true);
    player.setBounce(0.1);
    player.flipX = false;

    // ---ANIMATIONS---
    this.anims.create({
        key: 'idle',
        frames: [{
            key: 'guy',
            frame: 0
        }],
        frameRate: 10
    });

    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('guy', {
            start: 1,
            end: 11
        }),
        frameRate: 15,
        repeat: -1
    });

    // Collisions
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(boxes, platforms);
    this.physics.add.collider(saws, platforms);
    this.physics.add.overlap(boxes, player, collectBox, null, this);
    this.physics.add.overlap(player, saws, hitSaw, null, this);

    // Controlls
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (gameOver) {
        return;
    }
    // Player movement
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.anims.play('walk', true);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.anims.play('walk', true);
        if (player.flipX == true) {
            player.flipX = false;
        }
    } else {
        player.setVelocityX(0);
        player.anims.play('idle', true);
    }

    // Player jump
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
    }
}

function collectBox(player, box) {
    box.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    if (boxes.countActive(true) === 0) {
        boxes.children.iterate(function (child) {
            child.enableBody(true, child.x, 100, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var saw = saws.create(x, 16, 'saw');
        saw.setBounce(1);
        saw.setCollideWorldBounds(true);
        saw.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

}

function hitSaw(player, saw) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.stop();
    gameOverText = this.add.text((game.config.width / 2) - 30, game.config.height / 2, 'GAME OVER', {
        fontSize: '32px',
        fill: '#000000'
    });
    gameOver = true;
}