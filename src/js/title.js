var titleState = function() {};

titleState.prototype.create = function() {
  // var nameLabel = game.add.text(160, 80, "Click anywhere to start", {
  //   font: '14px Space Mono', fill: '#ffffff'
  // });
  // game.input.activePointer.capture = true;
  game.state.start('play'); 
};

titleState.prototype.update = function() {

};