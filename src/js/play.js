var playState = {
  player: null,
  create: function() {
    var self = this;
    self.player = game.add.sprite(384, 384, 'character');
    self.player.frame = 0;
    game.add.existing(self.player);
    self.player.anchor.setTo(0.5, 1);
    self.player.animations.add('wait', [1,11,21,31,41,51,61,71], 4);
  },
  update: function() {
    var self = this;
    self.player.animations.play('wait');
  }
};
