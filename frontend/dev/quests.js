import { LitElement, html } from "lit";
// global variables

export class QuestElement extends LitElement {
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
      quests: {
        type: Array,
      },
      actions: {
        type: Array,
      },
      chosenActions: {
        type: Array,
      },
    };
  }
  constructor() {
    super();
    this.aaron = "";
    this.quests = [];
    this.actions = [];
    this.oldGame = undefined;
    this.game = undefined;
    this.chosenActions = [];
  }

  firstUpdated(changedProperties) {
    console.log("iekrh2");
    /*   const button = this.shadowRoot.querySelector("#reloadButtonLevel");
       this.shadowRoot
         .querySelector("#addLevelButton")
         .addEventListener("click", (event) => this._addLevel());*/
  }

  updated() {
    if (this.game != this.oldGame) {
      this.oldGame = this.game;
      console.log("fetching level data");
      this.getQuestsData();
      this.getActionsData();
    }
  }

  getQuestsData() {
    fetch(this.url + "gamification/quests/" + this.game, {
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
          this.quests = data.rows;
          console.log("done");
          console.log(this.quests);
        }
      });
  }

  _addQuest() {
    var questName = this.shadowRoot.querySelector("#addQuestNameInput").value;
    var questId = this.shadowRoot.querySelector("#addQuestIdInput").value;
    var questDesc = this.shadowRoot.querySelector("#addQuestDescInput").value;
    var questAchievementId = this.shadowRoot.querySelector(
      "#addQuestAchievementInput"
    ).value;
    var questPoints = 0
    if (isNaN(questPoints)) {
      questPoints = 0;
    } else {
      questPoints = parseInt(questPoints)
    }
    var questActionIds = [];
    this.chosenActions.forEach((actionId) => {
      console.log(this.shadowRoot.querySelector("#times" + actionId).value)
      if(this.shadowRoot.querySelector("#times" + actionId).value > 0){
        questActionIds.push({ times: parseInt(this.shadowRoot.querySelector("#times" + actionId).value), action: actionId });
      } else {questActionIds.push({ times: 1, action: actionId });}
      
    });
    var contentB = {
      questpointvalue: questPoints,
      questname: questName,
      questachievementid: questAchievementId,
      questid: questId,
      questdescription: questDesc,
      questquestflag: "False",
      questpointflag:"False",
      questactionids:questActionIds,
      questquestidcompleted:"",
      queststatus:"REVEALED",
      questnotificationcheck:"False"
    };

    let formData = new FormData();
    formData.append("contentB", contentB);

    fetch(this.url + "gamification/quests/" + this.game, {
      method: "POST",
      headers: { Authorization: this.aaron ,"Content-Type": "application/json"},
      body: JSON.stringify(contentB),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        this.getQuestsData();
      });
  }

  getActionsData() {
    fetch(this.url + "gamification/actions/" + this.game, {
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
          this.actions = data.rows;
          console.log("done");
          console.log(this.actions);
        }
      });
  }
  _addAction(actionId) {
    if (this.chosenActions.includes(actionId)) {
      this.chosenActions.pop(actionId);
    } else {
      this.chosenActions.push(actionId);
    }
    console.log(this.chosenActions);
  }

  _deleteQuest(quest) {
    var questNumber = quest.id;
    fetch(this.url + "gamification/quests/" + this.game + "/" + questNumber, {
      method: "Delete",
      headers: { Authorization: this.aaron },
    })
      .then((response) => {
        console.log(response);

        if (response.ok) {
          console.log("good response for get games gamers");
          var y = window.scrollY
          const index = this.quests.indexOf(quest);
          if (index > -1) { // only splice array when item is found
            this.quests.splice(index, 1); // 2nd parameter means remove one item only
          }
          this.requestUpdate();
          window.scroll(0,y)
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

      <h2>Gamification Quest Manager</h2>

      ${this.quests.map(
        (quest) => html`
          <div
            class="card border-dark mb-3"
            style="width: 18rem;display:inline-block;"
          >
            <div class="card-body text-dark">
              <h5 class="card-title">${quest.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${quest.id}</h6>
              <p class="card-text">${quest.description}</p>
              <p class="card-text">Required Actions:</p>
              ${quest.actionIds.map(
                (action) => html`
                  <p class="card-text">
                    <small>
                      ${action.actionId}: ${action.times} repetitions</small
                    >
                  </p>
                `
              )}
              <p class="card-text">Rewarded points: ${quest.pointValue}</p>
              <p class="card-text">
                Unlocked Achievement: ${quest.achievementId}
              </p>
              <p class="card-text">
                Notification message: ${quest.notificationMessage}
              </p>
              <a
                href="#"
                class="btn btn-primary"
                id="buttonLevel${quest.number}"
                @click="${() => this._deleteQuest(quest)}"
                >Delete</a
              >
            </div>
          </div>
        `
      )}
      <div class="form-floating mb-3">
        <input
          id="addQuestNameInput"
          class="form-control"
          placeholder="Quest Name"
        />
        <label for="floatingInput">Quest Name</label>
      </div>
      <div class="form-floating mb-3">
        <input
          id="addQuestIdInput"
          class="form-control"
          placeholder="Quest Id"
        />
        <label for="floatingInput">Quest Id</label>
      </div>
      ${this.actions.map(
        (action) => html`
          <input
            class="form-check-input"
            type="checkbox"
            @click="${() => this._addAction(action.id)}"
            value=""
            id="flexCheckDefault"
          />
          <label class="form-check-label" for="flexCheckDefault">
            ${action.id}
          </label>
          <label for="fname">Times:</label>
  <input type="text" id="times${action.id}" name="fname"><br><br>
        `
      )}
      <div class="form-floating mb-3">
        <input
          id="addQuestDescInput"
          class="form-control"
          placeholder="Quest Description"
        />
        <label for="floatingInput">Quest Description</label>
      </div>
      <div class="form-floating mb-3">
        <input
          id="addQuestAchievementInput"
          class="form-control"
          placeholder="Quest Achievement"
        />
        <label for="floatingInput">Quest AchievementId</label>
      </div>
      <div class="form-floating mb-3">
        <button
          type="button"
          id="addQuestButton"
          @click="${() => this._addQuest()}"
          class="btn btn-primary"
        >
          Add Quest!
        </button>
      </div>
    `;
  }
}

window.customElements.define("quest-element", QuestElement);
