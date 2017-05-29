var playState = function () {
  this.player = null;
  this.ground = null;
  this.yAxis = p2.vec2.fromValues(0, 1);
  this.xSpeed = 150;
  this.ySpeed = 400;
  this.shiftBoost = 150;
  this.jumpNumber = 0;
  this.liftOff = null;
  this.landed = null;
  this.playerOnGround = null;
};

playState.prototype.create = function() {

  // game physics
  game.physics.startSystem(Phaser.Physics.P2JS);

  // gravity + friction
  game.physics.p2.gravity.y = 600;
  game.physics.p2.friction = 0.5;

  // allow for collision callbacks
  game.physics.p2.setImpactEvents(true);
  game.physics.p2.world.setGlobalStiffness(1e5);

  // add player
  this.player = game.add.sprite(250, 250, 'character');

  // apply physics to player
  game.physics.p2.enable(this.player);

  // player info
  this.player.frame = 0;
  this.player.name = 'player';
  this.player.anchor.setTo(0.5, 0.28);
  this.player.body.fixedRotation = true;

  // add player to game
  game.add.existing(this.player);

  // add ground
  this.ground = game.add.sprite(0, game.world.height-24, 'ground'); 
  game.physics.p2.enable(this.ground);
  this.ground.body.static = true;
  
  // make contactable materials
  var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', this.player.body);
  var wallMaterial = game.physics.p2.createMaterial('wallMaterial');

  game.physics.p2.setWorldMaterial(wallMaterial, true, true, false, false);

  //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
  //  those 2 materials collide it uses the following settings.
  //  A single material can be used by as many different sprites as you like.
  var contactMaterial = game.physics.p2.createContactMaterial(spriteMaterial, wallMaterial);
  
  // make the walls bouncy
  contactMaterial.restitution = 0.9;

  // ----------------------------- //
  //  register keys I want to use
  this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

  //  stop the following keys from propagating up to the browser
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.DOWN ]);

  // player animations
  // this.player.animations.add('wait', [35, 36], 1, true); 
  this.player.animations.add('runLeft', [56, 57, 58, 59, 60, 61, 62, 63], 23);
  this.player.animations.add('runRight', [0, 1, 2, 3, 4, 5, 6, 7], 23);
};

playState.prototype.update = function() {

  this.playerOnGround = playerOnGround.call(this, this.yAxis);

  console.log('player is on the ground ', this.playerOnGround);

  if(!this.playerOnGround) {
    this.landed = getCurrentTimeInSeconds();
    // console.log('landed time ', this.landed);
  }
  

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
    console.log(timeDiff, ' time diff');

    if(timeDiff < 1) {
      if(this.jumpNumber < 3) {
        this.jumpNumber += 1; 
      } else {
        this.jumpNumber = 3;
      }
    } else {
      this.jumpNumber = 0;
    }
    console.log('jump number ', this.jumpNumber);

    switch(this.jumpNumber) {
      case 2:
        this.ySpeed = 450;
        break;
      case 3:
        this.ySpeed = 599;
        break;
      default:
        this.ySpeed = 400;
    }

    this.player.body.moveUp(this.ySpeed);
  
    console.log('player is in the air');
  }

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

function playerTouchedDown() {

}
