var loadState = function () {};

loadState.prototype.preload = function() {
  var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#ffffff'});

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.PageAlignHorizonally = true;
  game.scale.PageAlignVertically = true;

  game.load.spritesheet('character', 'assets/sprites/character.png', 48, 48);

  game.load.image('background', 'assets/sprites/background.png');
  game.load.image('ground', 'assets/sprites/ground.png');
  game.load.image('whisps', 'assets/sprites/whisps.png');
  game.load.image('big_ice', 'assets/sprites/big_ice.png');
  game.load.image('med_ice', 'assets/sprites/med_ice.png');
  game.load.image('small_ice', 'assets/sprites/small_ice.png');
};

loadState.prototype.create = function() {
  game.state.start('title');
};
