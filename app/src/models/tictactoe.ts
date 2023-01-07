export type TicTacToe = {
  "version": "0.1.0",
  "name": "tic_tac_toe",
  "instructions": [
    {
      "name": "create",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "game"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "game_id"
              }
            ]
          }
        },
        {
          "name": "playerOne",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "string"
        }
      ]
    },
    {
      "name": "join",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "game"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Game",
                "path": "game.game_id"
              }
            ]
          }
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "play",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "game"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Game",
                "path": "game.game_id"
              }
            ]
          }
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "tile",
          "type": {
            "defined": "Tile"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "players",
            "type": {
              "array": [
                {
                  "option": "publicKey"
                },
                2
              ]
            }
          },
          {
            "name": "turn",
            "type": "u8"
          },
          {
            "name": "board",
            "type": {
              "array": [
                {
                  "array": [
                    {
                      "option": {
                        "defined": "Sign"
                      }
                    },
                    3
                  ]
                },
                3
              ]
            }
          },
          {
            "name": "state",
            "type": {
              "defined": "GameState"
            }
          },
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Tile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "row",
            "type": "u8"
          },
          {
            "name": "column",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "GameState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "GameCreated"
          },
          {
            "name": "Active"
          },
          {
            "name": "Tie"
          },
          {
            "name": "Won",
            "fields": [
              {
                "name": "winner",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "Sign",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "X"
          },
          {
            "name": "O"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "PlayerTwoNotSet"
    },
    {
      "code": 6001,
      "name": "PlayerTwoAlreadySet"
    },
    {
      "code": 6002,
      "name": "GameNotCreated"
    },
    {
      "code": 6003,
      "name": "GameAlreadyStarted"
    },
    {
      "code": 6004,
      "name": "GameAlreadyEnded"
    },
    {
      "code": 6005,
      "name": "TileAlreadyPopulated"
    },
    {
      "code": 6006,
      "name": "TileOutOfBounds"
    },
    {
      "code": 6007,
      "name": "NotPlayersTurn"
    },
    {
      "code": 6008,
      "name": "PlayerOneCannotJoin"
    }
  ]
};

export const IDL: TicTacToe = {
  "version": "0.1.0",
  "name": "tic_tac_toe",
  "instructions": [
    {
      "name": "create",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "game"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "game_id"
              }
            ]
          }
        },
        {
          "name": "playerOne",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "string"
        }
      ]
    },
    {
      "name": "join",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "game"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Game",
                "path": "game.game_id"
              }
            ]
          }
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "play",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "game"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Game",
                "path": "game.game_id"
              }
            ]
          }
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "tile",
          "type": {
            "defined": "Tile"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "players",
            "type": {
              "array": [
                {
                  "option": "publicKey"
                },
                2
              ]
            }
          },
          {
            "name": "turn",
            "type": "u8"
          },
          {
            "name": "board",
            "type": {
              "array": [
                {
                  "array": [
                    {
                      "option": {
                        "defined": "Sign"
                      }
                    },
                    3
                  ]
                },
                3
              ]
            }
          },
          {
            "name": "state",
            "type": {
              "defined": "GameState"
            }
          },
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Tile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "row",
            "type": "u8"
          },
          {
            "name": "column",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "GameState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "GameCreated"
          },
          {
            "name": "Active"
          },
          {
            "name": "Tie"
          },
          {
            "name": "Won",
            "fields": [
              {
                "name": "winner",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "Sign",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "X"
          },
          {
            "name": "O"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "PlayerTwoNotSet"
    },
    {
      "code": 6001,
      "name": "PlayerTwoAlreadySet"
    },
    {
      "code": 6002,
      "name": "GameNotCreated"
    },
    {
      "code": 6003,
      "name": "GameAlreadyStarted"
    },
    {
      "code": 6004,
      "name": "GameAlreadyEnded"
    },
    {
      "code": 6005,
      "name": "TileAlreadyPopulated"
    },
    {
      "code": 6006,
      "name": "TileOutOfBounds"
    },
    {
      "code": 6007,
      "name": "NotPlayersTurn"
    },
    {
      "code": 6008,
      "name": "PlayerOneCannotJoin"
    }
  ]
};
