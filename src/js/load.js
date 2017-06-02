var loadState = function () {};

loadState.prototype.preload = function() {
  var loadingBar = this.add.sprite(game.world.bounds.width - 90, game.world.bounds.height/2, 'loading');
  loadingBar.anchor.setTo(0.5,0.5);
  this.load.setPreloadSprite(loadingBar);

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.refresh();

  game.load.spritesheet('character', 'assets/sprites/character.png', 48, 48);

  game.load.image('background', 'assets/sprites/background.png');
  game.load.image('dust', 'assets/sprites/dust.png');
  game.load.image('controls', 'assets/sprites/controls.png');
  game.load.image('charge0', 'assets/sprites/charge0.png');
  game.load.image('charge1', 'assets/sprites/charge1.png');
  game.load.image('charge2', 'assets/sprites/charge2.png');
  game.load.image('charge3', 'assets/sprites/charge3.png');
  game.load.image('ground', 'assets/sprites/ground.png');
  game.load.image('spikes', 'assets/sprites/spikes.png');
  game.load.image('big_ice', 'assets/sprites/big_ice.png');
  game.load.image('med_ice', 'assets/sprites/med_ice.png');
  game.load.image('small_ice', 'assets/sprites/small_ice.png');
};

loadState.prototype.create = function() {
  game.state.start('title');
};
