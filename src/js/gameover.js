var gameOverState =  function() {};

gameOverState.prototype.preload = function()  {
};

gameOverState.prototype.create = function() {
  var finalScore = game.state.states.gameover.states;
  console.log('in game over state');

    // game.add.text((game.world.bounds.width/2) - 30, game.world.bounds.height - 400, finalScore, {font: '32px Space Mono', fill: '#ffffff'});

  // this.restartGame = game.add.text((game.world.bounds.width/2) - 80, game.world.bounds.height - 300, 'Hit enter or click here to restart.', {font: '12px Space Mono', fill: '#ffffff'});

  // this.restartGame.inputEnabled = true;
  // this.restartGame.events.onInputUp.add(function() {
  //   game.state.start('play'); 
  // });

  // if (this.enterKey.isDown) {
  //   game.state.start('play');
  // }

  // game.paused = true;
};
