import { LitElement, html } from "../node_modules/lit";
import "./level.js";
import "./badge.js";
import "./achievements.js";
import "./actions.js";
import "./quests.js";
import "./streaks.js";
import "../node_modules/las2peer-frontend-statusbar/las2peer-frontend-statusbar.js";
// global variables
var aaron, games, url, gameChosen, gameId, memberId, loginStatus, notification, achievements, actions, badges, levels, quests, streaks;

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
    this.url = "http://127.0.0.1:8080/"
  }

  firstUpdated(changedProperties) {
    console.log("iekrh");
    this.shadowRoot.shouldRefreshWithAnchoring = true
    const statusBar = this.shadowRoot.querySelector("#statusBar");
    // in the following we use (event) => this.method(event) in order to be able to access
    // this.shadowRoot in the handleLogin and handleLogout methods
    statusBar.addEventListener('signed-in', (event) => this.handleLogin(event));
    statusBar.addEventListener('signed-out', (event) => this.handleLogout(event));

    const button = this.shadowRoot.querySelector("#reloadButton");
    this.shadowRoot
      .querySelector("#addGameButton")
      .addEventListener("click", (event) => this._addGame());
    this.checkAndRegisterUserAgent();

  }
  handleLogin(event) {
    console.log(event.detail.profile);
    // Auth.setAuthDataToLocalStorage(event.detail.access_token);
    localStorage.removeItem("userInfo")
    localStorage.setItem("userInfo", JSON.stringify(event.detail.profile))
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
    return "Basic " + hash;
  }

  checkAndRegisterUserAgent(event) {
    console.log("checking user agent")
    console.log(localStorage.getItem("userInfo"));
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.aaron = this.authenticateUser(
      userInfo.preferred_username,
      userInfo.sub
    );
    // var log = authenticateUser(oidc_userinfo.loginName, oidc_userinfo.sub);
    fetch(this.url + "gamification/games/validation", {
      method: "POST",
      headers: { Authorization: this.aaron },
    })
      .then((response) => {
        console.log("what is my purpose")
        console.log(response)
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
    fetch(this.url + "gamification/games/list/separated", {
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
  }

  downloadGameFile() {
    this.actions = undefined;


    this.badges = undefined;
    this.achievements = undefined;
    this.levels = undefined;
    this.quests = undefined;
    this.streaks = undefined;
    this.getActionsData();

  }
  exportFile(jsonOutput) {
    const filename = this.gameId + '.json';
    var finalOutput = {}
    finalOutput[this.gameId] = jsonOutput
    const jsonStr = JSON.stringify(finalOutput);

    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }


  getActionsData() {
    fetch(this.url + "gamification/actions/" + this.gameId, {
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
        if (data != undefined) {
          this.actions = data.rows
        } else {
          this.actions = "nada"
        }
        this.getBadgeData();
      });
  }

  getBadgeData() {
    fetch(this.url + "gamification/badges/" + this.gameId, {
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
        console.log("fetched badge data");
        if (data != undefined) {
          this.badges = data.rows
        } else {
          this.badges = "nada"
        }
        this.getAchievementData();
      });
  }

  getAchievementData() {
    console.log("fetched achievement ");
    fetch(this.url + "gamification/achievements/" + this.gameId, {
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
        console.log("fetched achievement data");
        if (data != undefined) {
          this.achievements = data.rows
        } else {
          this.achievements = "nada"
        }
        this.getLevelData();
      });
  }

  getLevelData() {
    fetch(this.url + "gamification/levels/" + this.gameId, {
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
        console.log("fetched level data");
        if (data != undefined) {
          this.levels = data.rows
        } else {
          this.levels = "nada"
        }
        this.getQuestsData();
      });
  }

  getQuestsData() {
    fetch(this.url + "gamification/quests/" + this.gameId, {
      method: "GET",
      headers: { Authorization: this.aaron },
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          console.log("good response for get games gamers");
          return response.json();
        }return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data != undefined) {
          this.quests = data.rows
        } else {
          this.quests = "nada"
        }
        this.getStreaksData();
      });
  }

  deleteGame() {
    fetch(this.url + "gamification/games/data/" + this.gameId, {
      method: "DELETE",
      headers: { Authorization: this.aaron }
    })
      .then((response) => {
        if (response.ok) {
          console.log("deleted game")
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

  getStreaksData() {
    fetch(this.url + "gamification/streaks/" + this.gameId, {
      method: "GET",
      headers: { Authorization: this.aaron },
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          console.log("good response for get games gamers");
          return response.json();
        } return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data != undefined) {
          this.streaks = data.rows
        } else {
          this.achievements = "nada"
        }
        var jsonOutput = { actions: this.actions, badges: this.badges, achievements: this.achievements, levels: this.levels, quests: this.quests, streaks: this.streaks }
        console.log(jsonOutput)
        this.exportFile(jsonOutput)
      });
  }

  addStreaksFromFile(gameJSON) {
    if (gameJSON["streaks"] == undefined || gameJSON["streaks"][0] == undefined) {
      window.alert("congrats, you uploaded your game successfully!!")
    } else {
      var streak = gameJSON["streaks"][0]
      var streakName = streak["name"]
      var streakId = streak["streakId"]
      var streakDesc = streak["description"]
      var achievements = streak["achievements"]
      var status = "ACTIVE"
      var pointThreshold = streak["pointThreshold"]
      var badges = streak["badges"]
      var period = streak["period"]

      var actions = streak["actions"]

      var maxLevel = streak["streakLevel"]
      var contentB = {
        streakId: streakId,
        description: streakDesc,
        name: streakName,
        streakLevel: maxLevel,
        status: status,
        pointThreshold: pointThreshold,
        period: period,
        actions: actions,
        badges: badges,
        achievements: achievements,
        notificationMessage: "ninini",
        notificationCheck: "True"
      };

      let formData = new FormData();
      formData.append("contentB", contentB);

      fetch(this.url + "gamification/streaks/" + this.gameId, {
        method: "POST",
        headers: { Authorization: this.aaron, "Content-Type": "application/json" },
        body: JSON.stringify(contentB),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          const index = gameJSON["streaks"].indexOf(streak);
          if (index > -1) { // only splice array when item is found
            gameJSON["streaks"].splice(index, 1); // 2nd parameter means remove one item only
            this.addStreaksFromFile(gameJSON)
          }
        });
    }
  }

  addQuestsFromFile(gameJSON) {
    if (gameJSON["quests"] == undefined || gameJSON["quests"][0] == undefined) {
      this.addStreaksFromFile(gameJSON)
    } else {
      console.log("adding quest now at least i try too")
      var quest = gameJSON["quests"][0]
      var questName = quest["name"]
      var questId = quest["id"]
      var questDesc = quest["description"]
      var questAchievementId = quest["achievementId"]
      var questPoints = quest["pointValue"]
      var wrongQuest = quest["actionIds"]
      for(var i = 0; i < wrongQuest.length; i++){
        var questObject = wrongQuest[i]
        questObject["action"] = questObject["actionId"]
        wrongQuest[i]= questObject
      }
      var questActionIds = wrongQuest
      console.log(questActionIds)
      var contentB = {
        questpointvalue: questPoints,
        questname: questName,
        questachievementid: questAchievementId,
        questid: questId,
        questdescription: questDesc,
        questquestflag: "False",
        questpointflag: "False",
        questactionids: questActionIds,
        questquestidcompleted: "",
        queststatus: "REVEALED",
        questnotificationcheck: "False"
      };

      let formData = new FormData();
      formData.append("contentB", contentB);

      fetch(this.url + "gamification/quests/" + this.gameId, {
        method: "POST",
        headers: { Authorization: this.aaron, "Content-Type": "application/json" },
        body: JSON.stringify(contentB),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          const index = gameJSON["quests"].indexOf(quest);
          if (index > -1) { // only splice array when item is found
            gameJSON["quests"].splice(index, 1); // 2nd parameter means remove one item only
            this.addQuestsFromFile(gameJSON)
          }
        });
    }
  }


  addAchievementsFromFile(gameJSON) {
    if (gameJSON["achievements"] == undefined || gameJSON["achievements"][0] == undefined) {
      this.addQuestsFromFile(gameJSON)
    } else {
      var achievement = gameJSON["achievements"][0]
      var achievementName = achievement["name"]
      var achievementId = achievement["id"]
      var achievementDesc = achievement["description"]
      var achievementNot = achievement["notificationMessage"]
      var achievementPoints = achievement["pointValue"]
      var achievementBadgeId = achievement["badgeId"]
      if(achievementBadgeId == null || achievementBadgeId == undefined)
      {
        achievementBadgeId = ""
      }
      var achievementNotification = achievement["notificationMessage"]
      let formData = new FormData();
      formData.append("achievementpointvalue", achievementPoints);
      formData.append("achievementname", achievementName);
      formData.append("achievementid", achievementId);
      formData.append("achievementdesc", achievementDesc);
      formData.append("achievementbadgeid", achievementBadgeId);
      formData.append("achievementnotificationmessage", achievementNotification);
      formData.append("achievementnotificationcheck", "true");
      fetch(this.url + "gamification/achievements/" + this.gameId, {
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
          const index = gameJSON["achievements"].indexOf(achievement);
          if (index > -1) { // only splice array when item is found
            gameJSON["achievements"].splice(index, 1); // 2nd parameter means remove one item only
            this.addBadgesFromFile(gameJSON)
          }
        });
    }
  }




      
      
      addBadgesFromFile(gameJSON) {
    if (gameJSON["badges"] == undefined || gameJSON["badges"][0] == undefined) {
      this.addAchievementsFromFile(gameJSON)
    } else {
      var badge = gameJSON["badges"][0]
      var badgeName = badge["name"]
      var badgeId = badge["id"]
      var badgeDesc = badge["description"]
      var base64 = "data:image/png;base64," + badge["base64"]
      fetch(base64)
        .then((res) => { return res.arrayBuffer(); })
        .then((buf)  => {   
          var file = new File([buf], "badge", { type: "image/png" });
          var badgeInput = file
          var formData = new FormData();
          formData.append("badgeid", badgeId);
          formData.append("badgename", badgeName);
          formData.append("badgedesc", badgeDesc);
          formData.append("badgeimageinput", badgeInput);
          formData.append("badgenotificationcheck", "true");
          formData.append("badgenotificationmessage", "");
          fetch(this.url + "gamification/badges/" + this.gameId, {
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
              const index = gameJSON["badges"].indexOf(badge);
              if (index > -1) { // only splice array when item is found
                gameJSON["badges"].splice(index, 1); // 2nd parameter means remove one item only
                this.addBadgesFromFile(gameJSON)
              }
            });
        })



    }
  }


  urltoFile(url, filename, mimeType) {
    return (fetch(url)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) {
        console.log(this)
        return new File([buf], filename, { type: mimeType });
      })
    );
  }

  addActionsFromFile(gameJSON) {
    if (gameJSON["actions"] == undefined || gameJSON["actions"][0] == undefined) {
      console.log("done adding actions")
      this.addBadgesFromFile(gameJSON)
    } else {
      console.log("Adding Actions")
      var action = gameJSON["actions"][0]
      var actionName = action["name"]
      var actionId = action["id"]
      var actionDesc = action["description"]
      var actionPoints = action["pointValue"]
      var actionTypeSelect = action["actionType"]
      var actionLRSOccSelect = action["lrsOccString"]

      var actionMatchAttribute = action["lrsAttribute"]
      var actionValueAttribute = action["lrsAttributeValue"]

      let formData = new FormData();
      formData.append("actionpointvalue", actionPoints);
      formData.append("actionname", actionName);
      formData.append("actiontype", actionTypeSelect);
      formData.append("actionid", actionId);
      formData.append("actiondesc", actionDesc);
      formData.append("actionLRSOccurence", actionLRSOccSelect);
      formData.append("actionLRSAttribute", actionMatchAttribute);
      formData.append("actionLRSAttributeValue", actionValueAttribute);
      fetch(this.url + "gamification/actions/" + this.gameId, {
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
          const index = gameJSON["actions"].indexOf(action);
          if (index > -1) { // only splice array when item is found
            gameJSON["actions"].splice(index, 1); // 2nd parameter means remove one item only
            this.addActionsFromFile(gameJSON)
          }
        });
    }
  }

  addLevelsFromFile(gameJSON) {
    console.log("Adding Levels")
    if (gameJSON["levels"] == undefined || gameJSON["levels"][0] == undefined) {
      console.log("Done adding levels, now proceeding to actions")
      this.addActionsFromFile(gameJSON)
    } else {
      var level = gameJSON["levels"][0]
      var levelName = level["name"];
      var levelNumber = level["number"]
      if(levelNumber == 0){
        console.log("0 level, skipping...")
        const index = gameJSON["levels"].indexOf(level);
        if (index > -1) { // only splice array when item is found
          gameJSON["levels"].splice(index, 1); // 2nd parameter means remove one item only
          this.addLevelsFromFile(gameJSON)

        }
      }
      var levelPoints = level["pointValue"]
      var levelNotification = level["notificationMessage"]
      let formData = new FormData();
      formData.append("levelnum", levelNumber);
      formData.append("levelname", levelName);
      formData.append("levelpointvalue", levelPoints);
      formData.append("levelnotificationmessage", levelNotification);
      formData.append("levelnotificationcheck", true);
      fetch(this.url + "gamification/levels/" + this.gameId, {
        method: "POST",
        headers: { Authorization: this.aaron },
        body: formData,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("added level")
          const index = gameJSON["levels"].indexOf(level);
          if (index > -1) { // only splice array when item is found
            gameJSON["levels"].splice(index, 1); // 2nd parameter means remove one item only
            this.addLevelsFromFile(gameJSON)

          }
        });
    }
  }

  addGameFromFile(gameJSON) {
    var gameName = Object.keys(gameJSON)[0];
    let formData = new FormData();
    formData.append("gameid", gameName);
    console.log("started adding game")
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
        this.gameId = gameName
        this.addLevelsFromFile(gameJSON[gameName])
      });
  }



  uploadGameFile() {
    var gameJSON = this.shadowRoot.querySelector(
      "#fileGame"
    );
    if (gameJSON.files[0] == undefined) {
      window.alert("please choose a game file to upload!")

    } else {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        var buffer = reader.result;
        var game = JSON.parse(buffer)
        this.addGameFromFile(game)
      });
      reader.readAsText(gameJSON.files[0]);
    }
  }

  setUrl() {
    this.url = this.shadowRoot.querySelector("#fixUrlInput").value
    this.checkAndRegisterUserAgent();
  }

  render() {
    console.log("parent render")
    return html`<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <!-- JavaScript Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    <las2peer-frontend-statusbar
    id="statusBar"
    service="Gamification Frontend"
    oidcclientid=aaronma
    suppresswidgeterror="true"
    autoAppendWidget=true
    loginoidcprovider="https://auth.las2peer.org/auth/realms/main"
    suppress-error-toast=false
    ></las2peer-frontend-statusbar>

    <div class=container>
    <div class="form-floating mb-3">
      <input id="fixUrlInput" class="form-control"  placeholder="URL">
      <label for="floatingInput">URL</label>
      <button type="button" id="fixUrlButton" @click="${() => this.setUrl()}" class="btn btn-primary">Choose URL</button>
     <p>${this.url}</p>
    </div>
    <h2>Gamification Game Manager</h2>
      <div class="form-floating mb-3">
      <input id="addGameInput" class="form-control"  placeholder="Game Name">
      <label for="floatingInput">Game Name</label>
      <button type="button" id="addGameButton" class="btn btn-primary">Add Game!</button>
      <button type="button" id="deleteButton" @click="${() => this.deleteGame()}" class="btn btn-primary">Delete Selected Game!</button>
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

<level-element .aaron=${this.aaron} .game=${this.gameId} .url=${this.url}></level-element>
<badge-element .aaron=${this.aaron} .game=${this.gameId} .url=${this.url}></badge-element>
<achievement-element .aaron=${this.aaron} .game=${this.gameId} .url=${this.url}></achievement-element>
<action-element .aaron=${this.aaron} .game=${this.gameId} .url=${this.url}></action-element>
<quest-element .aaron=${this.aaron} .game=${this.gameId} .url=${this.url}></quest-element>
<streak-element .aaron=${this.aaron} .game=${this.gameId} .url=${this.url}></streak-element>
<button type="button" class="btn btn-primary btn-lg" @click="${() => this.downloadGameFile()}">Download (This might take a while)</button>

<button type="button" class="btn btn-primary btn-lg" @click="${() => this.uploadGameFile()}">Upload Game (This might take even more of a while)</button>
  <input class="form-control" type="file" id="fileGame">
    
</div>
       
      </div>

 
  </div>
    `;
  }
}

window.customElements.define("game-element", GameElement);
