var playState = function () {
  this.playerMessage = null;
  this.player = null;
  this.ground = null;
  this.yAxis = p2.vec2.fromValues(0, 1);
  this.xSpeed = 150;
  this.ySpeed = 660;
  this.shiftBoost = 260;
  this.jumpNumber = 0;
  this.timeOnGround = 0;
  this.liftOff = null;
  this.landed = null;
  this.playerOnGround = null;
  this.movingPlatforms = null;
  this.playerSensorBottom = null;
  this.playerSensorTop = null;
  this.playerSensorLeft = null;
  this.playerSensorRight = null;
  this.playerShape = null;
  this.platformVelo = 0.05;
  this.platformInterval = 1.5;  
  this.updateCycle = 1;
  this.comboPoints = 0;
  this.currentCombo = 0;
  this.points = {
    calcPoints: function(updateCycle, comboPoints) {
      var allPoints = updateCycle + comboPoints;
      this.points.total = allPoints;
      return allPoints;
    }.bind(this),
    total: 0
  };
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
      1: "big_ice",
      2: "small_ice",
      3: "small_ice"
    }
  };
};

playState.prototype.create = function() {

  // game physics
  game.physics.startSystem(Phaser.Physics.P2JS);

  // gravity + friction
  game.physics.p2.gravity.y = 1500;
  game.physics.p2.friction = 0.5;
  game.paused = false;

  // map settings
  game.add.tileSprite(-150, -100, 1000, 1000, 'background');

  // world bounds
  game.world.setBounds(0, 0, game.world.bounds.width, game.world.bounds.height + 100);

  // add player
  this.player = game.add.sprite(250, 250, 'character');

  // apply physics to player
  game.physics.p2.enable(this.player);
  
  // player info
  this.player.frame = 0;
  this.player.name = 'player';
  this.player.anchor.setTo(0.5, 0.3);
  this.player.body.fixedRotation = true;

  // player animations
  // this.player.animations.add('wait', [35, 36], 1, true); 
  this.player.animations.add('runLeft', [56, 57, 58, 59, 60, 61, 62, 63], 23);
  this.player.animations.add('runRight', [0, 1, 2, 3, 4, 5, 6, 7], 23);

  // add player to game
  game.add.existing(this.player);
  this.player.scale.setTo(0.6, 0.6);

  // add some dimensions and sensors to the player
  this.playerShape = this.player.body.setCircle(10, 0, 0);              // the main collision shape  (radius,offsetX,offsetY)

  this.playerSensorTop = this.player.body.addRectangle(10, 10, 0, -20);  // upper sensor shape  (width,height,offsetX,offsetY)
  
  this.playerSensorTop.sensor = true;
  
  this.playerSensorBottom = this.player.body.addRectangle(10, 10, 0, 20);
  
  this.playerSensorBottom.sensor = true;

  this.playerSensorRight = this.player.body.addRectangle(10, 10, -20, 0);

  this.playerSensorRight.sensor = true;

  this.playerSensorLeft = this.player.body.addRectangle(10, 10, 20, 0);

  this.playerSensorLeft.sensor = true;

  this.player.body.onBeginContact.add(checkSensors, this);

  // add ground so the player doesn't bouce around on the world border on game start
  this.ground = game.add.sprite(0, game.world.bounds.height - 100, 'ground'); 
  game.physics.p2.enable(this.ground);
  this.ground.body.static = true;

  game.time.events.add(Phaser.Timer.SECOND * 15, moveGround.bind(this));

  // collision groups
  this.movingPlatforms = game.add.group();

  // make contactable materials
  this.spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', this.player.body);
  this.wallMaterial = game.physics.p2.createMaterial('wallMaterial');

  // describes behavior when these two materials come into contact
  this.wallSpriteContactMaterial = game.physics.p2.createContactMaterial(this.spriteMaterial, this.wallMaterial);
  
  // make the walls bouncy
  this.wallSpriteContactMaterial.restitution = 0.9;
  
  // places wall materials along the sides of the game world
  // game.physics.p2.setWorldMaterial(this.wallMaterial, true, true, false, false);
  game.physics.p2.setBoundsToWorld();

  // register keys I want to use
  this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

  // stop the following keys from propagating up to the browser
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.SHIFT, Phaser.Keyboard.DOWN ]);

  // points
  this.pointsLabel = game.add.text(100, game.world.bounds.height - 135, 'Points', {font: '12px Courier', fill: '#ffffff'});
  
  // points to set
  this.pointsSetLabel = game.add.text(149, game.world.bounds.height - 135, '0', {font: '12px Courier', fill: '#ffffff'});

  // pause
  this.pauseLabel = game.add.text(20,  game.world.bounds.height - 135, 'Pause', {font: '12px Courier', fill: '#ffffff'});

  // combo indicator
  this.comboIndicator = game.add.text(250,  game.world.bounds.height - 135, 'Combo', {font: '12px Courier', fill: '#ffffff'});
  this.comboIndicator = game.add.image(300,  game.world.bounds.height - 145, 'charge0');

  this.pauseLabel.inputEnabled = true;
  this.pauseLabel.events.onInputUp.add(function () {
    // When the paus button is pressed, we pause the game
    game.paused = !game.paused;
    if(game.paused) {
      this.pauseLabel.setText('Unpause');
      this.controlImage = game.add.image(88, 90, 'controls');
      this.shiftInts1 = game.add.text(135, 128, 'SHIFT', {font: '12px Courier', fill: '#000000'});
      this.shiftInts2 = game.add.text(205, 128, 'RUN', {font: '12px Courier', fill: '#000000'});
      this.spaceInts1 = game.add.text(135, 172, 'SPACE', {font: '12px Courier', fill: '#000000'});
      this.spaceInts2 = game.add.text(205, 172, 'JUMP', {font: '12px Courier', fill: '#000000'});
      this.arrowInts1 = game.add.text(163, 250, 'LEFT DOWN RIGHT', {font: '12px Courier', fill: '#000000'});
      this.arrowInts2 = game.add.text(141, 320, 'DROP THROUGH PLATFORMS', {font: '12px Courier', fill: '#000000'});
      this.arrowInts3 = game.add.text(208, 310, '^', {font: '25px Courier', fill: '#000000'});
    } else {
      this.pauseLabel.setText('Pause');
      this.shiftInts1.destroy();
      this.shiftInts2.destroy();
      this.spaceInts1.destroy();
      this.spaceInts2.destroy();
      this.arrowInts1.destroy();
      this.arrowInts2.destroy();
      this.arrowInts3.destroy();
      this.controlImage.destroy();
    }
  }.bind(this));

};

playState.prototype.update = function() {

  this.timeOnGround += 0.01;

  if((this.jumpNumber > 0) && (this.timeOnGround > 1) && (playerOnGround.call(this, this.yAxis))) {
    this.comboIndicator = game.add.image(300,  game.world.bounds.height - 145, 'charge0');
  }

  if(this.updateCycle == 1) {
    makePlatforms.call(this, this.player, this.movingPlatforms, 1);
  }
  this.updateCycle += 1;

  var cyc = this.updateCycle;

  if ((cyc < 3000) && (cyc % 100 === 0)) {
    makePlatforms.call(this, this.player, this.movingPlatforms, 1);
    // makePlatforms.call(this, this.player, this.movingPlatforms, 1);
  } else if ((cyc < 6000) && (cyc >= 3000) && (cyc % 100 === 0)) {
    makePlatforms.call(this, this.player, this.movingPlatforms, 2);
    // makePlatforms.call(this, this.player, this.movingPlatforms, 2);
  } else if ((cyc >= 6000)  && (cyc % 100 === 0)) {
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

    if(this.timeDiff < 0.2) {
     
      if(this.jumpNumber < 3) {
        this.jumpNumber += 1; 
      } else {
        this.jumpNumber = 3;
        this.currentCombo += 1;
      }
    
    } else {

      if(this.currentCombo > 0) {
        this.comboPoints = this.currentCombo * 1000;
        this.wallSpriteContactMaterial.restitution = 0.9;
        // console.log('Your combo just ended! You got ', this.currentCombo, ' special jumps in a row for ', this.comboPoints, ' points!');
      }

      this.currentCombo = 0;
      this.jumpNumber = 0;
    }
    // console.log(this.jumpNumber, ' jump number');
    switch(this.jumpNumber) {
      case 0:
        game.physics.p2.gravity.y = 1500;
        this.ySpeed = 550;
        this.xSpeed = 150;
        this.player.scale.setTo(0.6, 0.6);
        this.player.anchor.setTo(0.5, 0.3);
        this.player.body.fixedRotation = true;
        this.comboIndicator.destroy();
        this.comboIndicator = game.add.image(300,  game.world.bounds.height - 145, 'charge0');
        break;
      case 1:
        this.ySpeed = 575;   
        this.comboIndicator.destroy();
        this.comboIndicator = game.add.image(300,  game.world.bounds.height - 145, 'charge1');
        break;
      case 2:
        this.ySpeed = 600;
        this.comboIndicator.destroy();
        this.comboIndicator = game.add.image(300,  game.world.bounds.height - 145, 'charge2');
        break;
      default:
        this.ySpeed = 670;
        this.xSpeed = 300;
        game.physics.p2.gravity.y = 1000;
        this.comboIndicator.destroy();
        this.comboIndicator = game.add.image(300,  game.world.bounds.height - 145, 'charge3');
        this.wallSpriteContactMaterial.restitution = 1.05;

        this.player.anchor.setTo(0.5, 0.65);
        this.player.body.fixedRotation = false;
        this.player.scale.setTo(1, 1);
    }
    this.player.body.moveUp(this.ySpeed);
  
  }

  if ((this.downKey.isDown) && (this.player.body.x > 20) && (this.player.body.x < (game.world.bounds.width - 20)) && (this.updateCycle > 750) && (playerOnGround.call(this, this.yAxis))) {
    game.physics.p2.friction = 0.1;
    this.playerShape.sensor = true;
    game.physics.p2.friction = 0.5;
  }
  
  this.movingPlatforms.forEach(movePlatforms, this);

  this.points.calcPoints(this.updateCycle, this.comboPoints);

  this.pointsSetLabel.setText(this.points.total);
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

  var randWidthScale = Math.floor(((Math.random() * 3) + 1));

  var randomLevelSegmentChoice = Math.floor(((Math.random() * 3) + 1));

  // console.log(randomLevelSegmentChoice, ' randomLevelSegmentChoice');

  var levelChoice = this.levels[thisLevel][randomLevelSegmentChoice];

  // console.log(levelChoice, ' level choice');

  var platform = platformGroup.create(randomXAxis, -90, levelChoice);

  switch(levelChoice) {
    case 'big_ice':
      platform.scale.setTo(randWidthScale, 0.3);
      break;
    case 'med_ice':
      platform.scale.setTo(randWidthScale, 0.3);
      break;
    case 'small_ice':
      platform.scale.setTo(randWidthScale, 0.3);
      break;
    default:
  }
  platform.name = 'platform';                      
  game.physics.p2.enable(platform, true);                     
  platform.body.kinematic = true;                              
  platform.velo = this.platformVelo;  
}

function checkSensors(bodyA, shapeA, shapeB, contactEquation) {
  if (bodyA && bodyA.sprite && bodyA.sprite.name === 'platform' && (shapeB === this.playerSensorTop)) {
    this.playerShape.sensor = true;
  }

  if (shapeB === this.playerSensorBottom) {
    this.playerShape.sensor = false;
  }

}

function movePlatforms(platform) {
  platform.body.velocity.y += 0.094;

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


