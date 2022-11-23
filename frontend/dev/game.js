import { LitElement, html } from "lit-element";
// global variables
var aaron, games, url, client, gameId, memberId, loginStatus, notification;

export class GameElement extends LitElement {
  static get properties() {
    return {
      aaron: {
        type: String,
      },
      games: {
        type: Array,
      },
      url: {
        type: String,
      },
    };
  }
  constructor() {
    super();
    this.aaron = ""
    if (this.games == null) {
      this.games = ["dd"]
    }

  }

  firstUpdated(changedProperties) {
    console.log("iekrh");
    const button = this.shadowRoot.querySelector("#reloadButton");
    button.addEventListener("click", (event) =>
      this.checkAndRegisterUserAgent(event)
    );
    this.shadowRoot.querySelector("#addGameButton").addEventListener("click", (event) =>
      this._addGame()
    );
    url = "http://127.0.0.1:8080/";
  }

  authenticateUser(user, password) {
    var token = user + ":" + password;
    console.log(token);
    // Should i be encoding this value????? does it matter???
    // Base64 Encoding -> btoa
    var hash = btoa(token);
    console.log(hash);
    return "Basic " + hash;
  }

  checkAndRegisterUserAgent(event) {
    console.log(localStorage.getItem("userInfo"))
    var userInfo = JSON.parse(localStorage.getItem("userInfo"))
    this.aaron = this.authenticateUser(userInfo.preferred_username, userInfo.sub)
    // var log = authenticateUser(oidc_userinfo.loginName, oidc_userinfo.sub);
    console.log(aaron);
    console.log(event);
    fetch(url + "gamification/games/validation", {
      method: "POST",
      headers: { Authorization: this.aaron },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        this.getGamesData();
        /*      $("button#addnewgame").off('click');
        $("button#addnewgame").on('click', function(event) {
            $("#createnewgame").modal('toggle');
        });*/
      });
    /* client.sendRequest("POST",
        "gamification/games/validation",
        "",
        "application/json",
        {},
        function(data,type){
        getGamesData();
        sendIntentLogin();
         $("button#addnewgame").off('click');
          $("button#addnewgame").on('click', function(event) {
              $("#createnewgame").modal('toggle');
          });
      },
        function(error) {
              $('#gameselection').before('<div class="alert alert-danger">Error connecting web services</div>');
          }
      );*/
  }
  _onGameItemClicked(game) {
    this.gameId = game; 
    console.log(game);
    for(var i=0; i<this.games.length;i++){
      console.log(this.games[i])
      this.shadowRoot.querySelector("#select" + this.games[i]).disabled = false;
    }
    this.shadowRoot.querySelector("#select" + game).disabled = true;
  }

  _addGame() {
    var gameName = this.shadowRoot.querySelector("#addGameInput").value;
    console.log(this.shadowRoot.querySelector("#addGameInput"))
    console.log(gameName)
    let formData = new FormData();
    formData.append('gameid', gameName);
    fetch(url + "gamification/games/data", {
      method: "POST",
      headers: { Authorization: this.aaron },
      body: formData

    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        this.getGamesData();
        /*      $("button#addnewgame").off('click');
        $("button#addnewgame").on('click', function(event) {
            $("#createnewgame").modal('toggle');
        });*/
      });
  }

  getGamesData() {
    fetch(url + "gamification/games/list/separated", {
      method: "GET",
      headers: { Authorization: this.aaron },
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          console.log("good response for get games gamers")
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        this.games = []
        data.forEach(element => {
          this.games.push(element.game_id)
        });

        //    $("button#addnewgame").off('click');
        //   $("button#addnewgame").on('click', function(event) {
        //      $("#createnewgame").modal('toggle');
        // });
      });
    /*    client.sendRequest(
      "GET",
      "gamification/games/list/separated",
      "",
      "application/json",
      {},
      function (data, type) {
        console.log(data);
        //Global games
        $("#globalgamestbody").empty();
        for (var i = 0; i < data[0].length; i++) {
          var gameData = data[0][i];
          var newRow =
            "<tr><td class='text-center'>" +
            "<button type='button' class='btn btn-xs btn-success bglobgameclass'>Register</button></td> ";
          newRow += "<td id='gameidid'>" + gameData.id + "</td>";
          newRow += "<td id='gamedescid'>" + gameData.description + "</td>";
          newRow += "<td id='gamecommtypeid'>" + gameData.commType + "</td>";

          $("#list_global_games_table tbody").append(newRow);
        }

        //User games
        $("#registeredgamestbody").empty();
        for (var i = 0; i < data[1].length; i++) {
          var gameData = data[1][i];
          var newRow =
            "<tr><td class='text-center'>" +
            "<button type='button' class='btn btn-xs btn-success breggameclass'>Select</button></td> ";
          newRow += "<td id='gameidid'>" + gameData.id + "</td>";
          newRow += "<td id='gamedescid'>" + gameData.description + "</td>";
          newRow += "<td id='gamecommtypeid'>" + gameData.commType + "</td>";
          newRow +=
            "<td><button type='button' onclick='removeGameHandler(this)' data-dismiss='modal' data-toggle='modal' data-target='#alertremovegame' class='btn btn-xs btn-danger '>Remove</button></td>";
          newRow +=
            "<td><button type='button' onclick='deleteGameHandler(this)' data-dismiss='modal' data-toggle='modal' data-target='#alertdeletegame' class='btn btn-xs btn-danger '>Delete</button></td>";

          $("#list_registered_games_table tbody").append(newRow);
        }

        gameListener();
      },
      function (error) {
        // Notification failed to get game data
        console.log(error);
      }
    );*/
  }

  render() {
    return html`
      <h2>Gamification Game Manager</h2>
      <paper-input id="addGameInput" always-float-label label="Floating label" placeholder="Game Name"></paper-input><paper-button raised id="addGameButton">Add Game!</paper-button>
  ${this.games.map(game => html`
  <paper-card  class="project-item-card" @click="${() => this._onGameItemClicked(game)}">
  <paper-button raised id=select${game}>${game}</paper-button>
  </paper-card>
`)}
        <paper-button raised id="reloadButton">Reload Games</paper-button>
      </div>

      <h2>Project list with "All Projects" disabled</h2>
    `;
  }
}

window.customElements.define("game-element", GameElement);
