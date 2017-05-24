var playState = {
  create: function() {
    var player = game.add.sprite(100, 200, 'characters');
    player.frame = 9;
    game.add.existing(player);
    player.anchor.setTo(0.5, 1);
  },
  update: function() {

  }
};
