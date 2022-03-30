export default class GameState {
  constructor(gameState, actions) {
    this.state = "";
    this.gameState = gameState;
    this.actions = actions;
  }

  OnEnter = (player) => {
    player.SetGameState(this.gameState, this);
    this.actions.map((action) =>
      player.BindAction(action.key, (player, data) => {
        console.log(`${player.name} triggered ${action.key}`);
        const newState = action.callback(action.key, player, data);
        if (newState !== null) {
          newState.OnEnter(player);
        }
      })
    );
  };

  OnExit = (player) => {
    this.actions.map((action) => player.RemoveAction(action.key));
  };
}
