var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
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
var score = 0;
var scoreText;

const centerWidth = this.config.width / 2;
const centerHeight = this.config.height / 2;

function preload() {
    this.load.image('background', './Brown.png');
    this.load.image('platform', './Brown Off.png');
    this.load.image('box', './Idle.png');
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
    platforms.create(100, 700, 'platform').refreshBody();
    platforms.create(250, 600, 'platform');
    platforms.create(400, 700, 'platform');
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
        repeat: 5,
        setXY: {
            x: 20,
            y: this.sys.game.config.height - 20,
            stepX: 80
        }
    });
    boxes.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.3));
    });


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
    this.physics.add.overlap(boxes, player, collectBox, null, this);

    // Controlls
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
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
}