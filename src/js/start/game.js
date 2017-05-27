var game = new Phaser.Game(420, 420, Phaser.AUTO, null, 'gameDiv');
// game states

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('title', titleState);
game.state.add('play', playState);

// call boot state

game.state.start('boot');
