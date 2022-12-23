import { LitElement, html } from "lit";
// global variables

export class StreakElement extends LitElement {
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
      streaks: {
        type: Array,
      },
      actions: {
        type: Array,
      },
      chosenActions: {
        type: Array,
      },
      achievements:{
        type:Array
      },
      chosenAchievements: {
        type: Array,
      },
    };
  }
  constructor() {
    super();
    this.aaron = "";
    this.streaks = [];
    this.actions = [];
    this.achievements = [];
    this.url = "http://127.0.0.1:8080/";
    this.oldGame = undefined;
    this.game = undefined;
    this.chosenActions = [];
    this.chosenAchievements = [];
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
      this.getStreaksData();
      this.getActionsData();
      this.getAchievementData();
    }
  }

  getStreaksData() {
    fetch(this.url + "gamification/streaks/" + this.game, {
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
          this.streaks = data.rows;
          console.log("done");
          console.log(this.streaks);
        }
      });
  }

  _addStreak() {
    var streakName = this.shadowRoot.querySelector("#addStreakNameInput").value;
    var streakId = this.shadowRoot.querySelector("#addStreakIdInput").value;
    var streakDesc = this.shadowRoot.querySelector("#addStreakDescInput").value;
    var streakAchievementId = this.shadowRoot.querySelector(
      "#addStreakAchievementInput"
    ).value;
    var streakDay = this.shadowRoot.querySelector("#days").value
    var streakMinutes = this.shadowRoot.querySelector("#minutes").value
    var streakHours = this.shadowRoot.querySelector("#hours").value
    if(streakDay == ""){
      streakDay = 0
    }
    if(streakMinutes == ""){
      streakMinutes = 0
    }
    if(streakHours == ""){
      streakHours = 0
    }
    var status = "ACTIVE"
    var pointThreshold = 1
    var badges = []
    var period = "P" + streakDay + "DT" + streakHours + "H" + streakMinutes + "M0S"

    var streakActionIds = [];
  
    streakActionIds.push({actionId: this.shadowRoot.querySelector("#actionSelect").options[this.shadowRoot.querySelector("#actionSelect").selectedIndex].text})
    var achievements = []
    var maxLevel = 0;
    this.chosenAchievements.forEach((actionId) => {
      console.log(this.shadowRoot.querySelector("#times" + actionId).value)
      if(this.shadowRoot.querySelector("#times" + actionId).value > 0){
        achievements.push({ streakLevel: parseInt(this.shadowRoot.querySelector("#times" + actionId).value), achievementId: actionId });
        if(maxLevel < parseInt(this.shadowRoot.querySelector("#times" + actionId).value)){
          maxLevel = parseInt(this.shadowRoot.querySelector("#times" + actionId).value)
        }
      } else {achievements.push({ streakLevel: 1, achievementId: actionId });}
      
    });
    var contentB = {
      streakId: streakId,
      description: streakDesc,
      name: streakName,
      streakLevel:maxLevel,
      status:status,
      pointThreshold:pointThreshold,
      period:period,
      actions:streakActionIds,
      badges:badges,
      achievements:achievements,
      notificationMessage:"ninini",
      notificationCheck:"True"
    };

    let formData = new FormData();
    formData.append("contentB", contentB);

    fetch(this.url + "gamification/streaks/" + this.game, {
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
        this.getStreaksData();
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

  _deleteStreak(streak) {
    var streakNumber = streak.streakId;
    fetch(this.url + "gamification/streaks/" + this.game + "/" + streakNumber, {
      method: "Delete",
      headers: { Authorization: this.aaron },
    })
      .then((response) => {
        console.log(response);

        if (response.ok) {
          console.log("good response for get games gamers");
          var y = window.scrollY
          const index = this.streaks.indexOf(streak);
          if (index > -1) { // only splice array when item is found
            this.streaks.splice(index, 1); // 2nd parameter means remove one item only
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

  getAchievementData() {
    fetch(this.url + "gamification/achievements/" + this.game, {
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
          this.achievements = data.rows;
          console.log("done");
          console.log(this.achievements);
        }
      });
  }

  returnTime(period){
    console.log("perido is " + period.split("PT")[1])
    var pt = period.split("PT")[1]
    var hour = 0
    if(pt.includes("H")){
      hour = pt.split("H")[0]
      pt = pt.split("H")[1]
    }
    var min = 0
    if(pt.includes("M")){
      min = pt.split("M")[0]
      pt = pt.split("M")[1]
    }
    var sec = 0
    if(pt.includes("S")){
      sec = pt.split("S")[0]
    }
    console.log(hour + "Hours " +min +" Mins " + sec +" Sec")
    var time = hour + "Hours " +min +" Mins " + sec +" Sec"
    return time;
  }

  _addAchievement(actionId) {
    if (this.chosenAchievements.includes(actionId)) {
      this.chosenAchievements.pop(actionId);
      const index = this.chosenAchievements.indexOf(actionId);
      if (index > -1) { // only splice array when item is found
        this.chosenAchievements.splice(index, 1); // 2nd parameter means remove one item only
      }
    } else {
      this.chosenAchievements.push(actionId);
    }
   
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

      <h2>Gamification Streak Manager</h2>

      ${this.streaks.map(
        (streak) => html`
          <div
            class="card border-dark mb-3"
            style="width: 18rem;display:inline-block;"
          >
            <div class="card-body text-dark">
              <h5 class="card-title">${streak.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${streak.streakId}</h6>
              <p class="card-text">${streak.description}</p>
              <p class="card-text">Required Actions:</p>
              ${streak.actions.map(
                (action) => html`
                  <p class="card-text">
                    <small>
                      Triggering Action: ${action.actionId} </small
                    >
                  </p>
                `
              )}
              ${streak.achievements.map(
                (achievement) => html`
                  <p class="card-text">
                    <small>
                      Achievement "${achievement.achievementId}" unlocked at streak level ${achievement.streakLevel}</small
                    >
                  </p>
                `
              )}
              <p class="card-text">Streak occurence: ${this.returnTime(streak.period)}</p>
              <p class="card-text">Point Threshold: ${streak.pointThreshold}</p>
              <p class="card-text">
                Unlocked Achievement: ${streak.streakId}
              </p>
              <p class="card-text">
                Notification message: ${streak.notificationMessage}
              </p>
              <a
                href="#"
                class="btn btn-primary"
                id="buttonLevel${streak.streakId}"
                @click="${() => this._deleteStreak(streak)}"
                >Delete</a
              >
            </div>
          </div>
        `
      )}
      <div class="form-floating mb-3">
        <input
          id="addStreakNameInput"
          class="form-control"
          placeholder="Streak Name"
        />
        <label for="floatingInput">Streak Name</label>
      </div>
      <div class="form-floating mb-3">
        <input
          id="addStreakIdInput"
          class="form-control"
          placeholder="Streak Id"
        />
        <label for="floatingInput">Streak Id</label>
      </div>
      <select id=actionSelect class="form-select" aria-label="Default select example">
  <option selected>Choose action</option>

  ${this.actions.map(
    (action) => html`
    <option value="${action.id}">${action.id}</option>
      <label class="form-check-label" for="flexCheckDefault">
        ${action.id}
      </label>
    `
  )}



</select>
<form>
<div class="row">
<div class="col">
<label>Streak Time</label>
  </div>
  <div class="col">
    <input type="text" id=days class="form-control" placeholder="Days">
  </div>
  <div class="col">
    <input type="text" id=hours class="form-control" placeholder="Hours">
  </div>
  <div class="col">
  <input type="text" id=minutes class="form-control" placeholder="Minutes">
</div>
</div>
</form>
${this.achievements.map(
  (action) => html`
    <input
      class="form-check-input"
      type="checkbox"
      @click="${() => this._addAchievement(action.id)}"
      value=""
      id="flexCheckDefault"
    />
    <label class="form-check-label" for="flexCheckDefault">
      ${action.id}
    </label>
    <label for="fname">Streak Level:</label>
<input type="text" id="times${action.id}" name="fname"><br><br>
  `
)}
      <div class="form-floating mb-3">
        <input
          id="addStreakDescInput"
          class="form-control"
          placeholder="Streak Description"
        />
        <label for="floatingInput">Streak Description</label>
      </div>
      <div class="form-floating mb-3">
        <input
          id="addStreakAchievementInput"
          class="form-control"
          placeholder="Streak Achievement"
        />
        <label for="floatingInput">Streak AchievementId</label>
      </div>
      <div class="form-floating mb-3">
        <button
          type="button"
          id="addStreakButton"
          @click="${() => this._addStreak()}"
          class="btn btn-primary"
        >
          Add Streak!
        </button>
      </div>
    `;
  }
}

window.customElements.define("streak-element", StreakElement);
