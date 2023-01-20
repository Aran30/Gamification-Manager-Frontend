import { LitElement, html } from "lit";
// global variables

export class AchievementElement extends LitElement {
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
      achievements: {
        type: Array,
      }
    };
  }
  constructor() {
    super();
    this.aaron = "";
    this.achievements = [];
    this.oldGame = undefined;
    this.game = undefined;
  }

  firstUpdated(changedProperties) {
    console.log("iekrh2");
    /*   const button = this.shadowRoot.querySelector("#reloadButtonLevel");
       this.shadowRoot
         .querySelector("#addLevelButton")
         .addEventListener("click", (event) => this._addLevel());*/
  }

  updated() {
    console.log(this.game + "fetching level data" + this.achievements.length);
    if (this.game != this.oldGame) {
      this.oldGame = this.game;
      console.log("fetching level data");
      this.getAchievementData();
    }
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

  _addAchievement() {

    var achievementName = this.shadowRoot.querySelector("#addAchievementNameInput").value;
    var achievementId = this.shadowRoot.querySelector(
      "#addAchievementIdInput"
    ).value;
    var achievementDesc = this.shadowRoot.querySelector(
      "#addAchievementDescInput"
    ).value;
    var achievementNot = this.shadowRoot.querySelector(
      "#addAchievementNotificationInput"
    ).value;
    var achievementPoints = this.shadowRoot.querySelector(
      "#addAchievementPointsInput"
    ).value;
    if(isNaN(achievementPoints)){
      achievementPoints = 0
    }
    var achievementBadgeId = this.shadowRoot.querySelector(
      "#addAchievementBadgeInput"
    ).value;
    var achievementNotification = this.shadowRoot.querySelector(
      "#addAchievementNotificationInput"
    ).value;
    let formData = new FormData();
    formData.append("achievementpointvalue", achievementPoints);
    formData.append("achievementname", achievementName);
    formData.append("achievementid", achievementId);
    formData.append("achievementdesc", achievementDesc);
    formData.append("achievementbadgeid", achievementBadgeId);
    formData.append("achievementnotificationmessage", achievementNotification);
    formData.append("achievementnotificationcheck", "true");
    console.log(formData)
    fetch(this.url + "gamification/achievements/" + this.game, {
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
        this.getAchievementData();
        /*      $("button#addnewgame").off('click');
        $("button#addnewgame").on('click', function(event) {
            $("#createnewgame").modal('toggle');
        });*/
      });
  }

   // need to update backend to also change the new attributes
   _updateAchievement(achievement) {
    var achievementNumber = achievement.id
    var achievementName = this.shadowRoot.querySelector("#addAchievementNameInput").value;
    let formData = new FormData();
    if (achievementName != "") {
      formData.append("achievementname", achievementName);
    }
    
    var achievementDesc = this.shadowRoot.querySelector(
      "#addAchievementDescInput"
    ).value;
    if(achievementDesc!=""){
      formData.append("achievementdesc", achievementDesc);
    }
    var achievementPoints = this.shadowRoot.querySelector(
      "#addAchievementPointsInput"
    ).value;
    if(achievementPoints!=""){
      formData.append("achievementpointvalue", achievementPoints);
    }
    var achievementNotification = this.shadowRoot.querySelector(
      "#addAchievementNotificationInput"
    ).value;
    if(achievementNotification !=""){
      formData.append("achievementnotificationmessage", achievementNotification);
    }

    var achievementBadge = this.shadowRoot.querySelector(
      "#addAchievementBadgeInput"
    ).value;
    if(achievementBadge !=""){
      formData.append("achievementbadgeid", achievementBadge);
    }

    formData.append("achievementnotificationcheck", "true");
    fetch(this.url + "gamification/achievements/" + this.game + "/" + achievementNumber, {
      method: "PUT",
      headers: { Authorization: this.aaron },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        this.getAchievementData();
        /*      $("button#addnewgame").off('click');
        $("button#addnewgame").on('click', function(event) {
            $("#createnewgame").modal('toggle');
        });*/
      });
  }

  _deleteAchievement(achievement) {
    var achievementNumber = achievement.id
    fetch(this.url + "gamification/achievements/" + this.game + "/" + achievementNumber, {
      method: "Delete",
      headers: { Authorization: this.aaron },
    })
      .then((response) => {
        console.log(response);

        if (response.ok) {
          console.log("good response for get games gamers");
          const index = this.achievements.indexOf(achievement);
          if (index > -1) { // only splice array when item is found
            this.achievements.splice(index, 1); // 2nd parameter means remove one item only
          }
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

      <h2>Gamification Achievement Manager</h2>

      ${this.achievements.map(
      (achievement) => html`
          <div class="card border-dark mb-3" style="width: 18rem;display:inline-block;">
            <div class="card-body text-dark">
              <h5 class="card-title">${achievement.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${achievement.id}</h6>
              <p class="card-text">${achievement.description}</p>
              <p class="card-text"> Rewarded points: ${achievement.pointValue}</p>
              <p class="card-text"> Rewarded badge: ${achievement.badgeId}</p>
              <p class="card-text"> Notification message: ${achievement.notificationMessage}</p>
              <a href="#" class="btn btn-primary" id=buttonLevel${achievement.number} @click="${() => this._deleteAchievement(achievement)}">Delete</a>
              <a href="#" class="btn btn-primary" id=buttonLevel${achievement.id} @click="${() => this._updateAchievement(achievement)}">Update</a>
            </div>
          </div>
        `
    )}
      <div class="form-floating mb-3">
        <input
          id="addAchievementNameInput"
          class="form-control"
          placeholder="Achievement Name"
        />
        <label for="floatingInput">Achievement Name</label>
      </div>
      <div class="form-floating mb-3">
        <input
          id="addAchievementIdInput"
          class="form-control"
          placeholder="Achievement Id"
        />
        <label for="floatingInput">Achievement Id</label>
      </div>
      <div class="form-floating mb-3">
      <input
        id="addAchievementDescInput"
        class="form-control"
        placeholder="Achievement Description"
      />
      <label for="floatingInput">Achievement Description</label>
    </div>
    <div class="form-floating mb-3">
    <input
      id="addAchievementNotificationInput"
      class="form-control"
      placeholder="Achievement Notification"
    />
    <label for="floatingInput">Achievement Notification</label>
  </div>
  <div class="form-floating mb-3">
  <input
    id="addAchievementBadgeInput"
    class="form-control"
    placeholder="Achievement Badge Id"
  />
  <label for="floatingInput">Achievement Badge Id</label>
</div>
      <div class="form-floating mb-3">
        <input
          id="addAchievementPointsInput"
          class="form-control"
          placeholder="Point Rewards"
          type=number
        />
        <label for="floatingInput">Point Rewards</label>
        <button
          type="button"
          id="addAchievementButton"
          @click="${() => this._addAchievement()}"
          class="btn btn-primary"
        >
          Add Achievement!
        </button>
      </div>
    `;
  }
}

window.customElements.define("achievement-element", AchievementElement);
