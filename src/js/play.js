var playState = function () {
  this.player = null;
  this.jumpTimer = 0;
  this.yAxis = p2.vec2.fromValues(0, 1);
  this.xSpeed = 150;
  this.ySpeed = 300;
  this.jumpNumber = 0;
  this.isJumpComboGoing = false;
  this.timeOfLastJump = null;
};

playState.prototype.create = function() {

  // game physics
  game.physics.startSystem(Phaser.Physics.P2JS);

  //gravity
  game.physics.p2.gravity.y = 400;

  // player info
  this.player = game.add.sprite(384, 384, 'character');
  
  // attach physics to player
  game.physics.p2.enable(this.player);
  
  this.player.frame = 0;
  this.player.anchor.setTo(0.5, 0.5);
  this.player.body.fixedRotation = true;

  game.add.existing(this.player);

  // make contactable materials
  var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', this.player.body);

  var wallMaterial = game.physics.p2.createMaterial('wallMaterial');

  game.physics.p2.setWorldMaterial(wallMaterial, true, true, false, false);

  //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
  //  those 2 materials collide it uses the following settings.
  //  A single material can be used by as many different sprites as you like.
  var contactMaterial = game.physics.p2.createContactMaterial(spriteMaterial, wallMaterial);

  // make the walls bounce
  contactMaterial.restitution = 1.0;

  //  register keys I want to use
  this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

  //  stop the following keys from propagating up to the browser
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.DOWN ]);
  
  //  debugging text
  this.textLeft = game.add.text(20, 20, "Left was pressed 250 ms ago? NO", { font: "16px Arial", fill: "#ffffff", align: "center" });
  this.textRight = game.add.text(20, 60, "Right was pressed 500 ms ago? NO", { font: "16px Arial", fill: "#ffffff", align: "center" });
  this.textSpace = game.add.text(20, 100, "Space was pressed 1000 ms ago? NO", { font: "16px Arial", fill: "#ffffff", align: "center" });
  
  this.textLeft2 = game.add.text(20, 160, "Is left still down? NO", { font: "16px Arial", fill: "#ffffff", align: "center" });
  this.textRight2 = game.add.text(20, 180, "Is right still down? NO", { font: "16px Arial", fill: "#ffffff", align: "center" });
  this.textSpace2 = game.add.text(20, 220, "Is space still down? NO", { font: "16px Arial", fill: "#ffffff", align: "center" });

  // player animations
  // this.player.animations.add('wait', [35, 36], 1, true); 
  this.player.animations.add('runLeft', [56, 57, 58, 59, 60, 61, 62, 63], 23);
  this.player.animations.add('runRight', [0, 1, 2, 3, 4, 5, 6, 7], 23);
};

playState.prototype.update = function() {

  if ((this.leftKey.isDown) && (this.shiftKey.isDown)) {
    this.player.body.moveLeft(300);
    this.player.animations.play('runLeft');
  }
  if ((this.rightKey.isDown) && (this.shiftKey.isDown)) {
    this.player.body.moveRight(300);
    this.player.animations.play('runRight');
  }

  if ((this.leftKey.isDown) && (!this.shiftKey.isDown)) {
    this.player.body.moveLeft(150);
    this.player.animations.play('runLeft');
    this.textLeft2.text = "Is left still down? YES";
  } else {
    this.textLeft2.text = "Is left still down? NO";
  } 

  if ((this.rightKey.isDown) && (!this.shiftKey.isDown)) {
    this.player.body.moveRight(150);
    this.player.animations.play('runRight');
    this.textRight2.text = "Is right still down? YES";
  } else {
    this.textRight2.text = "Is right still down? NO";
  }

  if (this.spaceKey.isDown && game.time.now > this.jumpTimer && checkIfCanJump.call(this, this.yAxis)) {
    this.player.body.moveUp(220);
    this.jumpTimer = game.time.now + 440;
    console.log(this.jumpTimer);
    this.textSpace2.text = "Is space still down? YES";
  } else {
    this.textSpace2.text = "Is space still down? NO";
  }

  if (this.leftKey.downDuration(250)) {
    this.textLeft.text = "Left was pressed 250 ms ago? YES";
  } else {
    this.textLeft.text = "Left was pressed 250 ms ago? NO";
  }
  
  if (this.rightKey.downDuration(250)) {
    this.textRight.text = "Right was pressed 250 ms ago? YES";
  } else {
    this.textRight.text = "Right was pressed 250 ms ago? NO";
  }
  
  if (this.spaceKey.downDuration(250)) {
    this.textSpace.text = "Space was pressed 250 ms ago? YES";
  } else {
    this.textSpace.text = "Space was pressed 250 ms ago? NO";
  }

};

function checkIfCanJump(yAxis) {

  var result = false;

  for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
    var c = game.physics.p2.world.narrowphase.contactEquations[i];

    if (c.bodyA === this.player.body.data || c.bodyB === this.player.body.data) {
      var d = p2.vec2.dot(c.normalA, yAxis);

      if (c.bodyA === this.player.body.data) {
          d *= -1;
      }

      if (d > 0.5) {
          result = true;
      }
    }
  }
  
  return result;

}

// function bounceBack(wasPlayerRunningWhenHeHitWall) {
//   if(this.player)
// }

function tripleJump() {

}

