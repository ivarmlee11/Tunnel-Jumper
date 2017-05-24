var game = new Phaser.Game(420, 420, Phaser.AUTO, null, 'gameDiv');

// game states

game.state.add('boot', boot);
game.state.add('load', load);
game.state.add('title', title);
game.state.add('play', play);

// call boot state

game.state.start('boot');