var bootState =  function() {};

bootState.prototype.preload = function()  {
  game.load.image('loading','assets/sprites/loading.png'); 
};

bootState.prototype.create = function() {
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.state.start('load');
};

