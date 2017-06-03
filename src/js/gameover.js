var gameOverState =  function() {
  this.finalScoreToFireBase = null;
  this.restartGame = null;
  this.inputValue = 'test';
  this.input = null;
  this.instructions = null;
};

gameOverState.prototype.preload = function()  {
};

gameOverState.prototype.create = function() {
  game.add.plugin(PhaserInput.Plugin);

  this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  // stop the following keys from propagating up to the browser
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.ENTER ]);

  this.finalScoreToFireBase = game.state.states.gameover.states;

  this.displayScore = game.add.text((game.world.bounds.width/2) - 150, game.world.bounds.height - 400, this.finalScoreToFireBase, {font: '34px Space Mono', fill: '#ffffff'});
  this.displayScore.anchor.set(0.5);
  this.restartGame = game.add.text((game.world.bounds.width/2) - 13, game.world.bounds.height - 200 , 'RESTART', {font: '12px Space Mono', fill: '#ffffff'});

  this.restartGame.inputEnabled = true;
  this.restartGame.events.onInputUp.add(function() {
    window.location.reload();
  });

  saveToFireBase.call(this, this.finalScoreToFireBase);
 
};

gameOverState.prototype.displayTopTen = function(newId) {
  var fireBase = firebase.database().ref();
  var listNumber = 1;
  var listSpacing = 15;

  var namesAndScores = [];

  game.add.image((game.world.bounds.width/2) - 39, (game.world.bounds.height/2) - 200, 'topScoreBackground');
  game.add.text((game.world.bounds.width/2) - 4, (game.world.bounds.height/2) - 198, 'TOP TEN', {font: '12px Space Mono', fill: '#000000'});

  fireBase.orderByChild('score').limitToLast(10).once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childName = childSnapshot.val().name;
      var childScore = childSnapshot.val().score;
      var key = childSnapshot.key;
      namesAndScores.push({
        name: childName,
        score: childScore,
        key: key
      });

    }); 
    namesAndScores.reverse().forEach(function(element) {
      console.log('writing to top ten list');
      var listString = listNumber + ' ' + element.name + ' ' + element.score;
      if(newId && (newId === element.key)) {
        game.add.text((game.world.bounds.width/2) - 40, ((game.world.bounds.height/2) - 188) + listSpacing, '►', {font: '14px Space Mono', fill: '#000000'});
      }
      game.add.text((game.world.bounds.width/2) - 11, ((game.world.bounds.height/2) - 190) + listSpacing, listString, {font: '12px Space Mono', fill: '#000000'});

      listNumber += 1;
      listSpacing += 15;

    });
  });
};

function saveToFireBase(score) {

  var checkTopTen = [];

  var fireBase = firebase.database().ref();

  var finalScore = score;

  var pushRef = fireBase.push({
    'name': '...',
    'score': finalScore
  });

  var newId = pushRef.getKey();

  fireBase.orderByChild('score').limitToLast(11).once('value', function(snapshot) {
    var snap = snapshot;
    snap.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childName = childSnapshot.val().name;
      var childScore = childSnapshot.val().score;
      checkTopTen.push({
        key: childKey, 
        value: childScore,
        name: childName
      });  
    });
    checkTopTen.forEach(function(element) {
      // console.log(newId, element.key);
      if (element.key === newId) {
  
        this.input = game.add.inputField((game.world.bounds.width/2) - 28, game.world.bounds.height - 250, {
          font: '42px Space Mono',
          min: 0,
          max: 3,
          type: 'text',
          width: 90,
          borderWidth: 1,
          borderColor: '#000',
          cursorColor: 'black'
        });

        this.input.startFocus();

        this.instructions = game.add.text((game.world.bounds.width/2) - 2, game.world.bounds.height - 180, 'SAVE', {
          font: '12px Space Mono', fill: '#ffffff'
        });

        this.instructions.inputEnabled = true;

        this.instructions.events.onInputUp.add(saveNameToFireBase.bind(this, newId, finalScore));

      }
    });
    gameOverState.prototype.displayTopTen(newId);
  });

}

function checkIfSwear(word) {

  var isItaSwear = false;

  // console.log('checking swears');

  var swears = [
    'ass',
    '   ',
    'fuc',
    'fuk',
    'fuq',
    'fux',
    'fck',
    'coc',
    'cok',
    'coq',
    'kox',
    'koc',
    'kok',
    'dic',
    'dik',
    'diq',
    'dix',
    'dck',
    'psy',
    'fag',
    'fgt',
    'ngr',
    'nig',
    'cum',
    'jiz',
    'jzz',
    'gay',
    'gey',
    'gei',
    'gai',
    'vag',
    'fap',
    'jew',
    'joo',
    'slt',
    'jap',
    'kkk'
  ];

  swears.forEach(function(element) {
    if(word === element) {
      isItaSwear = true;
    }
  });

  return isItaSwear;
}

function saveNameToFireBase(newId, finalScore) {
  var savedName = document.querySelector('input').value;
  if(checkIfSwear(savedName)) {
    savedName = '___';
  }
  if(savedName.length > 3) {
    savedName = '---';
  }
  var score = finalScore;

  firebase.database().ref(newId).set({
    score: score,
    name: savedName
  });

  gameOverState.prototype.displayTopTen();

}