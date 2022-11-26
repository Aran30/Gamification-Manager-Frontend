import { LitElement, html } from "lit";
import "./level.js";
import "./badge.js";
import "las2peer-frontend-statusbar/las2peer-frontend-statusbar.js";
// global variables
var aaron, games, url, gameChosen, gameId, memberId, loginStatus, notification;

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
      gameId: {
        type: String,
      },
      
    };
  }
  constructor() {
    super();
    this.aaron = "";
    this.gameChosen = false;
    if (this.games == null) {
      this.games = ["dd"];
    }
  }

  firstUpdated(changedProperties) {
    console.log("iekrh");
    const statusBar = this.shadowRoot.querySelector("#statusBar");
    // in the following we use (event) => this.method(event) in order to be able to access
    // this.shadowRoot in the handleLogin and handleLogout methods
    statusBar.addEventListener('signed-in', (event) => this.handleLogin(event));
    statusBar.addEventListener('signed-out', (event) => this.handleLogout(event));

    const button = this.shadowRoot.querySelector("#reloadButton");
    this.shadowRoot
      .querySelector("#addGameButton")
      .addEventListener("click", (event) => this._addGame());
    url = "http://127.0.0.1:8080/";
    this.checkAndRegisterUserAgent();

  }
  handleLogin(event) {
    console.log(event.detail.profile);
   // Auth.setAuthDataToLocalStorage(event.detail.access_token);
   localStorage.removeItem("userInfo")
    localStorage.setItem("userInfo",JSON.stringify(event.detail.profile))
    this.checkAndRegisterUserAgent();
  }

  handleLogout() {
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
    console.log(localStorage.getItem("userInfo"));
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.aaron = this.authenticateUser(
      userInfo.preferred_username,
      userInfo.sub
    );
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
    console.log("hello")
    this.gameId = game;
    console.log(game);
    this.gameChosen = !!game;
  }

  _addGame() {
    var gameName = this.shadowRoot.querySelector("#addGameInput").value;
    console.log(this.shadowRoot.querySelector("#addGameInput"));
    console.log(gameName);
    let formData = new FormData();
    formData.append("gameid", gameName);
    fetch(this.url + "gamification/games/data", {
      method: "POST",
      headers: { Authorization: this.aaron },
      body: formData,
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
          console.log("good response for get games gamers");
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        this.games = [];
        data.forEach((element) => {
          this.games.push(element.game_id);
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
    return html`<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <!-- JavaScript Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    <las2peer-frontend-statusbar
    id="statusBar"
    service="Gamification Frontend"
    oidcclientid=bdda7396-3f6d-4d83-ac21-65b4069d0eab
    suppresswidgeterror="true"
    autoAppendWidget=true
    loginoidcprovider="https://auth.las2peer.org/auth/realms/main"
    suppress-error-toast=false
    ></las2peer-frontend-statusbar>
    <div class=container>
    <h2>Gamification Game Manager</h2>
      <div class="form-floating mb-3">
      <input id="addGameInput" class="form-control"  placeholder="Game Name">
      <label for="floatingInput">Game Name</label>
      <button type="button" id="addGameButton" class="btn btn-primary">Add Game!</button>
    </div>
<div class="list-group">
${this.games.map(
  (game) => html`
    <a
      href="#"
      class="list-group-item list-group-item-action"
      @click="${() => this._onGameItemClicked(game)}"
    >
      ${game}
    </a>
  `
)}

<level-element .aaron=${this.aaron} .game=${this.gameId}></level-element>
<badge-element .aaron=${this.aaron} .game=${this.gameId}></badge-element>
<achievement-element .aaron=${this.aaron} .game=${this.gameId}></achievement-element>
</div>
       
      </div>

 
  </div>
    `;
  }
}

window.customElements.define("game-element", GameElement);
