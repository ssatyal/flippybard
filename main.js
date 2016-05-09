// Creating 'main' state that will contain the game
var mainState = {
  preload: function(){
    // load the bird sprite
    game.load.image('bird', 'assets/bird.png');
  },

  create: function(){
    // change the background color of the game to blue
    game.stage.backgroundColor = "#71C5CF";

    //sets physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //display bird at position x=100 and y=245
    this.bird = game.add.sprite(100, 245, 'bird');

    //add physics to bird
    //needed for: movements, gravity, collisions, etc.
    game.physics.arcade.enable(this.bird);

    //add gravity to bird to make it fall
    this.bird.body.gravity.y = 1000;

    // call 'jump' function when spacekey hit
    var spaceKey = game.input.keyboard.addKey(
      Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);
  },

  update: function() {
    // if the bird is out of the screen (too high or low)
    //call restartGame function
    if (this.bird.y < 0 || this.bird.y > 490)
      this.restartGame();
  },

  //make the bird jump
  jump: function(){
    //add vertical velocity to bird
    this.bird.body.velocity.y = -350;
  },

  //restart the game
  restartGame: function(){
    //start the 'main' state, which restarts the game
    game.state.start('main');
  }

};

//initialize phaser, create 400px by 490px game
var game = new Phaser.Game(400, 490);

//add and start the main state to start game
game.state.add('main', mainState, true);
