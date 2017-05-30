var playState = function () {
  this.player = null;
  this.ground = null;
  this.yAxis = p2.vec2.fromValues(0, 1);
  this.xSpeed = 150;
  this.ySpeed = 800;
  this.shiftBoost = 150;
  this.jumpNumber = 0;
  this.liftOff = null;
  this.landed = null;
  this.playerOnGround = null;
  this.movingPlatforms = null;
  this.playerSensorBottom = null;
  this.playerSensorTop = null;
  this.playerShape = null;
  this.platformVelo = 0.05;
  this.platformInterval = 1.5;  
  this.updateCycle = 1;
  this.levels = {
                1: {
                  1: "big_ice",
                  2: "small_ice",
                  3: "med_ice"
                },
                2: {
                  1: "big_ice",
                  2: "small_ice",
                  3: "small_ice"
                },
                3: {
                  1: "small_ice",
                  2: "small_ice",
                  3: "small_ice"
                }
              };
};

playState.prototype.create = function() {

  // game physics
  game.physics.startSystem(Phaser.Physics.P2JS);

  // gravity + friction
  game.physics.p2.gravity.y = 2000;
  game.physics.p2.friction = 0.5;

  // map settings
  game.stage.backgroundColor = '#000080';

  // add player
  this.player = game.add.sprite(250, 250, 'character');

  // apply physics to player
  game.physics.p2.enable(this.player);
  
  // player info
  this.player.frame = 0;
  this.player.name = 'player';
  this.player.anchor.setTo(0.5, 0.65);
  this.player.body.fixedRotation = true;

  // player animations
  // this.player.animations.add('wait', [35, 36], 1, true); 
  this.player.animations.add('runLeft', [56, 57, 58, 59, 60, 61, 62, 63], 23);
  this.player.animations.add('runRight', [0, 1, 2, 3, 4, 5, 6, 7], 23);

  // add player to game
  game.add.existing(this.player);

  // add some dimensions and sensors to the player
  this.playerShape = this.player.body.setCircle(10, 0, 0);              // the main collision shape  (radius,offsetX,offsetY)

  this.playerSensorTop = this.player.body.addRectangle(10, 10, 0, -20);  // upper sensor shape  (width,height,offsetX,offsetY)
  
  this.playerSensorTop.sensor = true;
  
  this.playerSensorBottom = this.player.body.addRectangle(10, 10, 0, 20);
  
  this.playerSensorBottom.sensor = true;

  this.playerSensorRight = this.player.body.addRectangle(10, 10, 20, 0);

  this.playerSensorRight.sensor = true;

  this.playerSensorLeft = this.player.body.addRectangle(10, 10, -20, 0);

  this.playerSensorLeft.sensor = true;

  this.player.body.onBeginContact.add(checkSensors, this);

  // add ground so the player doesn't bouce around on the world border on game start
  this.ground = game.add.sprite(0, game.world.height - 4, 'ground'); 
  game.physics.p2.enable(this.ground);
  this.ground.body.static = true;

  // add timer to destroy ground and replace it with spikes
  game.time.events.add(Phaser.Timer.SECOND * 10, function() {
    this.ground.destroy();
    this.ground = game.add.sprite(0, game.world.height, 'whisps');
  }, this);

  // collision groups
  this.movingPlatforms = game.add.group();

  // make contactable materials
  var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', this.player.body);
  var wallMaterial = game.physics.p2.createMaterial('wallMaterial');

  // describes behavior when these two materials come into contact
  var wallSpriteContactMaterial = game.physics.p2.createContactMaterial(spriteMaterial, wallMaterial);
  
  // make the walls bouncy
  wallSpriteContactMaterial.restitution = 0.9;
  
  // places wall materials along the sides of the game world
  game.physics.p2.setWorldMaterial(wallMaterial, true, true, false, false);

  // register keys I want to use
  this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

  // stop the following keys from propagating up to the browser
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.DOWN ]);
};

playState.prototype.update = function() {
  this.updateCycle += 1;
  var cyc = this.updateCycle;

  if ((cyc < 3000) && (cyc % 125 === 0)) {
    makePlatforms.call(this, this.player, this.movingPlatforms, 1);
    // makePlatforms.call(this, this.player, this.movingPlatforms, 1);
  } else if ((cyc < 6000) && (cyc >= 3000) && (cyc % 135 === 0)) {
    makePlatforms.call(this, this.player, this.movingPlatforms, 2);
    // makePlatforms.call(this, this.player, this.movingPlatforms, 2);
  } else if ((cyc >= 6000)  && (cyc % 145 === 0)) {
    makePlatforms.call(this, this.player, this.movingPlatforms, 3);
    // makePlatforms.call(this, this.player, this.movingPlatforms, 3);
  }

  // checks if player is on ground
  this.playerOnGround = playerOnGround.call(this, this.yAxis);

  if(!this.playerOnGround) {
    this.landed = getCurrentTimeInSeconds();
  }
  
  // player movement
  if ((this.leftKey.isDown) && (this.shiftKey.isDown)) {
    this.player.body.moveLeft(this.xSpeed + this.shiftBoost);
    this.player.animations.play('runLeft');
  }

  if ((this.rightKey.isDown) && (this.shiftKey.isDown)) {
    this.player.body.moveRight(this.xSpeed + this.shiftBoost);
    this.player.animations.play('runRight');
  }

  if ((this.leftKey.isDown) && (!this.shiftKey.isDown)) {
    this.player.body.moveLeft(this.xSpeed);
    this.player.animations.play('runLeft');
  }

  if ((this.rightKey.isDown) && (!this.shiftKey.isDown)) {
    this.player.body.moveRight(this.xSpeed);
    this.player.animations.play('runRight');
  }

  if (this.spaceKey.justPressed() && playerOnGround.call(this, this.yAxis)) {
    this.liftOff = getCurrentTimeInSeconds();

    var timeDiff = this.liftOff - this.landed;

    if(timeDiff < 0.35) {
      if(this.jumpNumber < 3) {
        this.jumpNumber += 1; 
      } else {
        this.jumpNumber = 3;
      }
    } else {
      this.jumpNumber = 0;
    }

    switch(this.jumpNumber) {
      case 2:
        this.ySpeed = 850;
        break;
      case 3:
        this.ySpeed = 905;
        this.xSpeed = 300;
        break;
      default:
        this.ySpeed = 800;
        this.xSpeed = 150;
    }

    this.player.body.moveUp(this.ySpeed);
  
  }
  
  this.movingPlatforms.forEach(movePlatforms, this);

};

function playerOnGround(yAxis) {

  var result = false;

  for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
    var c = game.physics.p2.world.narrowphase.contactEquations[i];

    if (c.bodyA === this.player.body.data || c.bodyB === this.player.body.data) {
      var d = p2.vec2.dot(c.normalA, yAxis);

      if (c.bodyA === this.player.body.data) {
        d *= -1;
      }

      if (d > 0.1) {
        result = true;
      }
    }
  }
  
  return result;

}

function getCurrentTimeInSeconds() {
  var date = new Date();
  var milliseconds = date.getTime();
  var seconds = milliseconds / 1000;
  return seconds;
}

function makePlatforms(player, platformGroup, stage) {

  var thisLevel = stage;

  console.log(thisLevel, ' level');

  var randomXAxis = ((Math.random() * game.world.bounds.width) + 1);

  var randomLevelSegmentChoice = Math.floor(((Math.random() * 3) + 1));
  console.log(randomLevelSegmentChoice, ' randomLevelSegmentChoice');

  var levelChoice = this.levels[thisLevel][randomLevelSegmentChoice];
  console.log(' level choice', levelChoice);

  var platform = platformGroup.create(randomXAxis, -150, levelChoice);
      platform.name = 'platform';                      
      game.physics.p2.enable(platform, true);                     
      platform.body.kinematic = true;                              
      platform.velo = this.platformVelo;                           
}

function checkSensors(bodyA, shapeA, shapeB, contactEquation) {

  if (bodyA && bodyA.sprite && bodyA.sprite.name === 'platform' && shapeB === this.playerSensorTop) {
    this.playerShape.sensor = true;
    console.log('touching moving platform with upper sensor or side sensors');
  }
  if (shapeB === (this.playerSensorBottom)) {
    this.playerShape.sensor = false;
    console.log('touching something with lower sensor');
  }
  // if (shapeB === (this.playerSensorLeft || this.playerSensorRight)) {
  //   this.playerShape.sensor = true;
  //   console.log('lols'); 
  // }
}

function movePlatforms(platform) {

  platform.body.velocity.y += 0.094;

  if (platform.body.y > game.world.bounds.height + 20) {
    platform.destroy();
  }

}


