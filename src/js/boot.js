var bootState =  function() {};

bootState.prototype.create = function() {
  // game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.state.start('load');
};

