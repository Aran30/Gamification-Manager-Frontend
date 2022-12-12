import { LitElement, html } from "lit";
// global variables

export class LevelElement extends LitElement {
  static get properties() {
    return {
      aaron: {
        type: String,
      },
      game: {
        type: String,
      },
      oldGame: {
        type: String,
      },
      url: {
        type: String,
      },
      levelsIndex: {
        type: Array,
      },
      levels: {
        type: Array,
      },
    };
  }
  constructor() {
    super();
    this.aaron = "";
    this.levels = [];
    this.url = "http://127.0.0.1:8080/";
    this.oldGame = undefined;
    this.game = undefined;

  }

  firstUpdated(changedProperties) {
    this.shadowRoot.shouldRefreshWithAnchoring = false
    console.log("iekrh2");
    const button = this.shadowRoot.querySelector("#reloadButtonLevel");
    this.shadowRoot
      .querySelector("#addLevelButton")
      .addEventListener("click", (event) => this._addLevel());
    this.url = "http://127.0.0.1:8080/";
  }

  updated() {
    console.log(this.game + "fetching level data" + this.levels.length);
    if (this.game != this.oldGame) {
      this.oldGame = this.game;
      console.log("fetching level data");
      this.getLevelData();
    }
  }

  _addLevel() {
    var levelName = this.shadowRoot.querySelector("#addLevelNameInput").value;
    if (levelName == "") {
      console.log(this.levels)
     return;
    }
    var levelNumber = this.shadowRoot.querySelector(
      "#addLevelNumberInput"
    ).value;
    var levelPoints = this.shadowRoot.querySelector(
      "#addLevelPointsInput"
    ).value;
    var levelNotification = this.shadowRoot.querySelector(
      "#addLevelNotificationInput"
    ).value;
    console.log(levelName + levelNumber + levelPoints);
    let formData = new FormData();
    formData.append("levelnum", levelNumber);
    formData.append("levelname", levelName);
    formData.append("levelpointvalue", levelPoints);
    formData.append("levelnotificationmessage", levelNotification);
    formData.append("levelnotificationcheck",true);
    console.log(formData)
    fetch(this.url + "gamification/levels/" + this.game, {
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
        this.getLevelData();
        /*      $("button#addnewgame").off('click');
        $("button#addnewgame").on('click', function(event) {
            $("#createnewgame").modal('toggle');
        });*/
      });
  }
  // i need to change the level service code, its just thrash atm
  getLevelData() {
    fetch(this.url + "gamification/levels/" + this.game, {
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
          this.levels = data.rows;
          console.log("done");
          console.log(this.levels);
        }
      });
  }

  _deleteLevel(level){
    var levelNumber = level.number
    console.log(levelNumber)
    fetch(this.url + "gamification/levels/" + this.game + "/" + levelNumber, {
      method: "Delete",
      headers: { Authorization: this.aaron },
    })
      .then((response) => {
        console.log(response);

        if (response.ok || JSON.stringify(response).toLocaleLowerCase().includes("delete file failed")) {
          console.log("good response for get games gamers");
          
          const index = this.levels.indexOf(level);
          if (index > -1) { // only splice array when item is found
            this.levels.splice(index, 1); // 2nd parameter means remove one item only
          }
          this.requestUpdate()
          return response.json();

        }
      })
      .then((data) => {
        console.log(data);
        
      });

  }


  render() {
    return html`
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
        crossorigin="anonymous"
      />
      <!-- JavaScript Bundle with Popper -->
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
        crossorigin="anonymous"
      ></script>

      <h1>Currently Selected: ${this.game}</h1>
      <h2>Gamification Level Manager</h2>

      ${this.levels.map(
        (level) => html`
          <div class="card border-dark mb-3" style="width: 18rem;display:inline-block;">
            <div class="card-body text-dark">
              <h5 class="card-title">${level.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${level.number}</h6>
              <p class="card-text">Required points: ${level.pointValue}</p>
              <p class="card-text">Notification: ${level.notificationMessage}</p>
              <a href="#" class="btn btn-primary" id=buttonLevel${level.number} @click="${() => this._deleteLevel(level)}">Delete</a>
            </div>
          </div>
        `
      )}
      <div class="form-floating mb-3">
        <input
          id="addLevelNameInput"
          class="form-control"
          placeholder="Level Name"
        />
        <label for="floatingInput">Level Name</label>
      </div>
      <div class="form-floating mb-3">
        <input
          id="addLevelNumberInput"
          class="form-control"
          placeholder="Level Number"
        />
        <label for="floatingInput">Level Number</label>
      </div>
      <div class="form-floating mb-3">
        <input
          id="addLevelPointsInput"
          class="form-control"
          placeholder="Points required"
        />
        
        <label for="floatingInput">Points required</label>
        </div>
        <div class="form-floating mb-3">
        <input
          id="addLevelNotificationInput"
          class="form-control"
          placeholder="Notification"
        />
        
        <label for="floatingInput">Notification</label>
        <button
          type="button"
          id="addLevelButton"
          @click="${() => this._addLevel()}"
          class="btn btn-primary"
        >
          Add Level!
        </button>
      </div>
    `;
  }
}

window.customElements.define("level-element", LevelElement);
