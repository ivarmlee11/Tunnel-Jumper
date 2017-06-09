var playState = function () {
  this.finalScore = null;
  this.player = null;
  this.ground = null;
  this.yAxis = p2.vec2.fromValues(0, 1);
  this.xSpeed = 125;
  this.ySpeed = 525;
  this.shiftBoost = 260;
  this.jumpNumber = 0;
  this.timeOnGround = 0;
  this.liftOff = null;
  this.landed = null;
  this.playerOnGround = null;
  this.movingPlatforms = null;
  this.playerShape = null;
  this.platformVelo = 0.05;
  this.platformInterval = 1.5;  
  this.updateCycle = 1;
  this.comboPoints = 0;
  this.currentCombo = 0;
  this.totalPoints = 0;

  this.levels = {
    1: {
      1: 'big_ice',
      2: 'small_ice',
      3: 'med_ice',
      4: 'huge_ice'
    },
    2: {
      1: 'big_ice',
      2: 'small_ice',
      3: 'small_ice',
      4: 'huge_ice'
    },
    3: {
      1: 'big_ice',
      2: 'small_ice',
      3: 'small_ice',
      4: 'med_ice'
    }
  };

};

playState.prototype.create = function() {

  // game physics
  game.physics.startSystem(Phaser.Physics.P2JS);

  // game contact physics 
  game.physics.p2.world.on('preSolve', onPresolve);

  // gravity + friction
  game.physics.p2.gravity.y = 1222;
  game.physics.p2.friction = 0.5;
  game.paused = false;

  // map settings
  game.add.tileSprite(-500, -310, 2000, 2000, 'background');

  // world bounds
  game.world.setBounds(0, 0, game.world.bounds.width, game.world.bounds.height + 100);

  // add player
  this.player = game.add.sprite(250, 250, 'character');

  // apply physics to player
  game.physics.p2.enable(this.player);
  
  // player info
  this.player.frame = 0;
  this.player.name = 'player';
  this.player.scale.setTo(0.6, 0.6);
  this.player.anchor.setTo(0.5, 0.4);
  this.player.body.fixedRotation = true;
  this.player.body.setCircle(10,0,0);

  // player animations
  // this.player.animations.add('wait', [35, 36], 1, true); 
  this.player.animations.add('runLeft', [56, 57, 58, 59, 60, 61, 62, 63], 23);
  this.player.animations.add('runRight', [0, 1, 2, 3, 4, 5, 6, 7], 23);

  // add player to game
  game.add.existing(this.player);

  // add ground so the player doesn't bouce around on the world border on game start
  this.ground = game.add.sprite(100, game.world.bounds.height - 10, 'ground'); 
  game.physics.p2.enable(this.ground);
  this.ground.body.static = true;

  game.time.events.add(Phaser.Timer.SECOND * 25, moveGround.bind(this));

  // collision groups
  this.movingPlatforms = game.add.group();

  // make contactable materials
  this.spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', this.player.body);
  this.wallMaterial = game.physics.p2.createMaterial('wallMaterial');

  // describes behavior when these two materials come into contact
  this.wallSpriteContactMaterial = game.physics.p2.createContactMaterial(this.spriteMaterial, this.wallMaterial);
  
  // set wall bounce
  this.wallSpriteContactMaterial.restitution = 0.3;
  
  // places wall materials along the sides of the game world
  game.physics.p2.setWorldMaterial(this.wallMaterial, true, true, false, false);

  // make the floor and ceiling endless
  game.physics.p2.setBoundsToWorld(true, true, false, false);

  // register keys I want to use
  this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  // stop the following keys from propagating up to the browser
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.SHIFT, Phaser.Keyboard.DOWN, Phaser.Keyboard.ENTER ]);

  // points
  this.pointsLabel = game.add.text(100, game.world.bounds.height - 135, 'POINTS', {font: '12px Space Mono', fill: '#ffffff'});
  
  // points to set
  this.pointsSetLabel = game.add.text(149, game.world.bounds.height - 135, '0', {font: '12px Space Mono', fill: '#ffffff'});

  // pause
  this.pauseLabel = game.add.text(20,  game.world.bounds.height - 135, 'PAUSE', {font: '12px Space Mono', fill: '#ffffff'});

  // combo indicator
  this.comboIndicator = game.add.text(350,  game.world.bounds.height - 135, 'COMBO', {font: '12px Space Mono', fill: '#ffffff'});
  this.comboIndicator = game.add.image(400,  game.world.bounds.height - 145, 'charge0');

  this.pauseLabel.inputEnabled = true;
  this.pauseLabel.events.onInputUp.add(function () {
  // When the paus button is pressed, we pause the game
    game.paused = !game.paused;
    if(game.paused) {
      this.pauseLabel.setText('UNPAUSE');
      this.controlImage = game.add.image(131, 90, 'controls');
      this.shiftInts1 = game.add.text(178, 128, 'SHIFT', {font: '12px Space Mono', fill: '#000000'});
      this.shiftInts2 = game.add.text(248, 128, 'RUN', {font: '12px Space Mono', fill: '#000000'});
      this.spaceInts1 = game.add.text(178, 172, 'SPACE', {font: '12px Space Mono', fill: '#000000'});
      this.spaceInts2 = game.add.text(248, 172, 'JUMP', {font: '12px Space Mono', fill: '#000000'});
      this.arrowInts1 = game.add.text(206, 250, 'LEFT              RIGHT', {font: '12px Space Mono', fill: '#000000'});
      this.arrowInts2 = game.add.text(225, 315, 'SLOW DOWN', {font: '12px Space Mono', fill: '#000000'});
      this.arrowInts3 = game.add.text(253, 301, '^', {font: '25px Space Mono', fill: '#000000'});
      this.arrowInts4 = game.add.text(254, 290, '▼', {font: '10px Space Mono', fill: '#000000'});
      this.arrowInts5 = game.add.text(208, 278, '◄', {font: '12px Space Mono', fill: '#000000'});
      this.arrowInts6 = game.add.text(303, 279, '►', {font: '10px Space Mono', fill: '#000000'});
    } else {
      this.pauseLabel.setText('PAUSE');
      this.shiftInts1.destroy();
      this.shiftInts2.destroy();
      this.spaceInts1.destroy();
      this.spaceInts2.destroy();
      this.arrowInts1.destroy();
      this.arrowInts2.destroy();
      this.arrowInts3.destroy();
      this.arrowInts4.destroy();
      this.arrowInts5.destroy();
      this.arrowInts6.destroy();
      this.controlImage.destroy();
    }
  }.bind(this));

};

playState.prototype.calcPoints = function() {
  this.totalPoints = this.updateCycle + this.comboPoints;
};

playState.prototype.update = function() {

  game.physics.p2.friction = 0.5;
  
  if(this.player.position.y > game.world.bounds.height + 50) {
    endGame.call(this);
  }

  this.timeOnGround += 0.01;

  if((this.jumpNumber > 0) && (this.timeOnGround > 1) && (playerOnGround.call(this, this.yAxis))) {
    this.comboIndicator = game.add.image(300,  game.world.bounds.height - 5, 'charge0');
  }

  if(this.updateCycle == 1) {
    makePlatforms.call(this, this.player, this.movingPlatforms, 1);
  }
  this.updateCycle += 1;

  var cyc = this.updateCycle;

  if ((cyc < 3000) && (cyc % 60 === 0)) {
    makePlatforms.call(this, this.player, this.movingPlatforms, 1);
    // makePlatforms.call(this, this.player, this.movingPlatforms, 1);
  } else if ((cyc < 6000) && (cyc >= 3000) && (cyc % 60 === 0)) {
    makePlatforms.call(this, this.player, this.movingPlatforms, 2);
    // makePlatforms.call(this, this.player, this.movingPlatforms, 2);
  } else if ((cyc >= 6000)  && (cyc % 60 === 0)) {
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

    this.timeOnGround = 0;

    this.timeDiff = this.liftOff - this.landed;

    if((this.timeDiff < 0.2) && (this.shiftKey.isDown)) {
     
      if((this.jumpNumber < 3) && (this.shiftKey.isDown)) {
        this.jumpNumber += 1; 
      } else {
        if((this.jumpNumber === 3) && (this.shiftKey.isDown)) {

          this.jumpNumber = 3;
          this.currentCombo += 1;
        }
      }

    } else {

      if(this.currentCombo > 0) {
        this.comboPoints += this.currentCombo * 1000;
        this.wallSpriteContactMaterial.restitution = 0.3;
      }
      
      this.currentCombo = 0;
      this.jumpNumber = 0;
    }
    switch(this.jumpNumber) {
      case 0:
        game.physics.p2.gravity.y = 1500;
        this.ySpeed = 525;
        this.xSpeed = 125;
        this.player.body.fixedRotation = true;
        this.comboIndicator.destroy();
        this.comboIndicator = game.add.image(400,  game.world.bounds.height - 145, 'charge0');
        break;
      case 1:
        this.ySpeed = 550;   
        this.comboIndicator.destroy();
        this.comboIndicator = game.add.image(400,  game.world.bounds.height - 145, 'charge1');
        break;
      case 2:
        this.ySpeed = 575;
        this.comboIndicator.destroy();
        this.comboIndicator = game.add.image(400,  game.world.bounds.height - 145, 'charge2');
        break;
      default:
        this.ySpeed = 600;
        this.xSpeed = 300;
        game.physics.p2.gravity.y = 1050;
        this.comboIndicator.destroy();
        this.comboIndicator = game.add.image(400,  game.world.bounds.height - 145, 'charge3');
        this.wallSpriteContactMaterial.restitution = 0.65;
    }
    this.player.body.moveUp(this.ySpeed);
  
  }

  if ((this.downKey.isDown) && (this.player.body.x > 20) && (this.player.body.x < (game.world.bounds.width - 20)) && (this.updateCycle > 750) && (playerOnGround.call(this, this.yAxis))) {
    game.physics.p2.friction = 10;
  }
  
  this.movingPlatforms.forEach(movePlatforms, this);

  playState.prototype.calcPoints.call(this);

  this.pointsSetLabel.setText(this.totalPoints);
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

function makePlatforms(player, platformGroup, stage, numberOfPlatforms) {
  var thisLevel = stage;

  // console.log(thisLevel, ' level');

  var randomXAxis = ((Math.random() * game.world.bounds.width) + 1);

  if (randomXAxis < 100) {
    randomXAxis += 100;
  } else if (randomXAxis > 320) {
    randomXAxis -= 100;
  }

  var randomLevelSegmentChoice = Math.floor(((Math.random() * 4) + 1));

  // console.log(randomLevelSegmentChoice, ' randomLevelSegmentChoice');

  var levelChoice = this.levels[thisLevel][randomLevelSegmentChoice];

  // console.log(levelChoice, ' level choice');

  var platform = platformGroup.create(randomXAxis, -170, levelChoice);
  
  platform.name = 'platform';                      
  game.physics.p2.enable(platform, true);                     
  platform.body.kinematic = true;                          
  platform.velo = this.platformVelo;  
  
  platform.scale.setTo(1, 1);

}

function movePlatforms(platform) {
  platform.body.velocity.y += 0.079;

  if (platform.body.y > game.world.bounds.height + 20) {
    platform.destroy();
  }

}

function moveGround() {
  game.add.tween(this.ground).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
  var ground = this.ground;
  setTimeout(function() {
    ground.destroy();
  }, 2000);
}

function onPresolve(presolve){
  if (presolve.contactEquations[0]) {
    c = presolve.contactEquations[0];
    f = presolve.frictionEquations[0];

    var yAxis = p2.vec2.fromValues(0, 1);
    var y = p2.vec2.dot(c.normalA, yAxis);

    if (c.bodyB.parent.sprite && c.bodyB.parent.sprite.name == 'platform' && y >= 0){  //if moving upwards
      c.enabled = false;   //disable contactEquation
      f.enabled = false;   //disable frictionEquation (solves the stuckInPlatform problem)
      if (c.bodyA.parent.velocity.destination[1] < 15 ) { // velocity < 15 - still inside the platform
        c.bodyA.parent.velocity.destination[1]-=0.5;      // course correction!
      } 
    }
  }
}

function endGame() {

  this.finalScore = this.totalPoints;

  game.state.states.gameover.states = this.finalScore;

  game.state.start('gameover');

}

