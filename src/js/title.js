var titleState = function() {
  this.instructionsShowing = false;
};

titleState.prototype.create = function() {
  game.input.activePointer.capture = true; 
  
  this.nameLabel = game.add.text((game.world.bounds.width/2) - 90, game.world.bounds.height/2, "TUNNEL JUMPER", {
    font: '24px Space Mono', fill: '#ffffff'
  });

  this.playLabel = game.add.text((game.world.bounds.width/2) - 15, game.world.bounds.height - 150, "START", {
    font: '12px Space Mono', fill: '#ffffff'
  });

  this.playLabel.inputEnabled = true;
  this.playLabel.events.onInputUp.add(startGame);

  this.instructionsLabel = game.add.text((game.world.bounds.width/2) - 34, game.world.bounds.height - 40, "INSTRUCTIONS", {
    font: '12px Space Mono', fill: '#ffffff'
  });

  this.instructionsLabel.inputEnabled = true;
  this.instructionsLabel.events.onInputUp.add(toggleInstructions.bind(this));

};

titleState.prototype.update = function() {

};

function startGame() {
  game.state.start('play'); 
}

function toggleInstructions() {
  if(!this.instructionsShowing) {
    this.instructionsShowing = true;
    this.controlImage = game.add.image(131, 90, 'controls');
    this.shiftInts1 = game.add.text(178, 128, 'SHIFT', {font: '12px Space Mono', fill: '#000000'});
    this.shiftInts2 = game.add.text(248, 128, 'RUN', {font: '12px Space Mono', fill: '#000000'});
    this.spaceInts1 = game.add.text(178, 172, 'SPACE', {font: '12px Space Mono', fill: '#000000'});
    this.spaceInts2 = game.add.text(248, 172, 'JUMP', {font: '12px Space Mono', fill: '#000000'});
    this.arrowInts1 = game.add.text(206, 250, 'LEFT              RIGHT', {font: '12px Space Mono', fill: '#000000'});
    this.arrowInts2 = game.add.text(225, 320, 'SLOW DOWN', {font: '12px Space Mono', fill: '#000000'});
    this.arrowInts3 = game.add.text(253, 301, '^', {font: '25px Space Mono', fill: '#000000'});
    this.arrowInts4 = game.add.text(254, 290, '▼', {font: '10px Space Mono', fill: '#000000'});
    this.arrowInts5 = game.add.text(208, 278, '◄', {font: '12px Space Mono', fill: '#000000'});
    this.arrowInts6 = game.add.text(303, 279, '►', {font: '10px Space Mono', fill: '#000000'});
  } else {
    this.instructionsShowing = false;
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
}