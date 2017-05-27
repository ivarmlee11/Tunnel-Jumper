var loadState = function () {};

loadState.prototype.preload = function() {
  var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#ffffff'});

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.PageAlignHorizonally = true;
  game.scale.PageAlignVertically = true;
  game.stage.backgroundColor = 'white';

  game.load.spritesheet('character', 'assets/sprites/character.png', 48, 48);
  game.load.image('ground', 'assets/sprites/ground.png');
  game.load.image('ice', 'assets/sprites/ice.png');
};

loadState.prototype.create = function() {
  game.state.start('title');
};
