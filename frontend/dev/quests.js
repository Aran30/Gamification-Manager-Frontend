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
      }
    };
  }
  constructor() {
    super();
    this.aaron = "";
    this.quests = [];
    this.actions = []
    this.url = "http://127.0.0.1:8080/";
    this.oldGame = undefined;
    this.game = undefined;
  }

  firstUpdated(changedProperties) {
    console.log("iekrh2");
    /*   const button = this.shadowRoot.querySelector("#reloadButtonLevel");
       this.shadowRoot
         .querySelector("#addLevelButton")
         .addEventListener("click", (event) => this._addLevel());*/
    this.url = "http://127.0.0.1:8080/";
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
    var questId = this.shadowRoot.querySelector(
      "#addQuestIdInput"
    ).value;
    var questDesc = this.shadowRoot.querySelector(
      "#addQuestDescInput"
    ).value;
    var questPoints = this.shadowRoot.querySelector(
      "#addQuestPointsInput"
    ).value;
    var questTypeSelect = this.shadowRoot.querySelector(
      "#questTypeSelect"
    ).value;
    if (isNaN(questPoints)) {
      questPoints = 0
    }
    let formData = new FormData();
    formData.append("questpointvalue", questPoints);
    formData.append("questname", questName);
    formData.append("questtype", questTypeSelect);
    formData.append("questid", questId);
    formData.append("questdesc", questDesc);
    fetch(this.url + "gamification/quests/" + this.game, {
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


  _deleteQuest(quest) {
    var questNumber = quest.id
    fetch(this.url + "gamification/quests/" + this.game + "/" + questNumber, {
      method: "Delete",
      headers: { Authorization: this.aaron },
    })
      .then((response) => {
        console.log(response);

        if (response.ok) {
          console.log("good response for get games gamers");
          this.quests.pop(quest);
          this.requestUpdate();
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
          <div class="card border-dark mb-3" style="width: 18rem;display:inline-block;">
            <div class="card-body text-dark">
              <h5 class="card-title">${quest.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${quest.id}</h6>
              <p class="card-text">${quest.description}</p>
              <p class="card-text">Required Actions:</p>
              ${quest.actionIds.map(
                (action) => html `
                <p class="card-text"><small> ${action.actionId}: ${action.times} repetitions</small></p>
                `
              )}
              <p class="card-text"> Rewarded points: ${quest.pointValue}</p>
              <p class="card-text"> Unlocked Achievement: ${quest.achievementId}</p>
              <p class="card-text"> Notification message: ${quest.notificationMessage}</p>
              <a href="#" class="btn btn-primary" id=buttonLevel${quest.number} @click="${() => this._deleteQuest(quest)}">Delete</a>
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
      <select class="form-select form-select-lg mb-3" id="questTypeSelect" aria-label=".form-select-lg example">
  <option selected>Actions to complete Quest </option>
  <option value="1">LRS</option>
  <option value="2">Other</option>
</select>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
  <label class="form-check-label" for="flexCheckDefault">
    Default checkbox
  </label>
</div>
     ${this.actions.map(
      (action) => html`
      <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
      <label class="form-check-label" for="flexCheckDefault">
        ${action.id}
      </label>
        `
    )}
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
  <label class="form-check-label" for="flexCheckChecked">
    Checked checkbox
  </label>
</div>
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
        <input
          id="addQuestPointsInput"
          class="form-control"
          placeholder="Point Rewards"
          type=number
        />
        <label for="floatingInput">Point Rewards</label>
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
