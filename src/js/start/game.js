var game = new Phaser.Game(500, 900, Phaser.AUTO, null, 'gameDiv');

// game states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('title', titleState);
game.state.add('play', playState);
game.state.add('gameover', gameOverState);

// call boot state
game.state.start('boot');

