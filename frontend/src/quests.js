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
      achievements: {
        type: Array,
      },
      actions: {
        type: Array,
      },
      chosenActions: {
        type: Array,
      },
      getQuestsData:{
        type:Array
      }

    };
  }
  constructor() {
    super();
    this.aaron = "";
    this.quests = [];
    this.actions = [];
    this.achievements = [];
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
    }
  }


  _addQuest() {
    var questName = this.shadowRoot.querySelector("#addQuestNameInput").value;
    var questId = this.shadowRoot.querySelector("#addQuestIdInput").value;
    if(questId == ""){
      window.alert("Please set the ID")
      return;
    }
    var questDesc = "";
    var questAchievementId = this.shadowRoot.querySelector("#achievementSelect").options[this.shadowRoot.querySelector("#achievementSelect").selectedIndex].text
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
    
    var status = "REVEALED";
    var questquestflag = "False"
    var questIds = this.shadowRoot.querySelector("#questSelect").options[this.shadowRoot.querySelector("#questSelect").selectedIndex].text
    console.log(questIds)
    if(questIds!="NONE" && questIds!= null && questIds!= ""){
      status = "HIDDEN"
      questquestflag = "True"
      console.log("requirement set");
      
    } else {
      questIds=null
    }
    var contentB = {
      questpointvalue: questPoints,
      questname: questName,
      questachievementid: questAchievementId,
      questid: questId,
      questdescription: questDesc,
      questquestflag: questquestflag,
      questpointflag:"False",
      questactionids:questActionIds,
      questquestidcompleted:questIds,
      questidcompleted:questIds,
      queststatus:status,
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

  _updateQuest(quest) {
    var questName = this.shadowRoot.querySelector("#addQuestNameInput").value;
    if(questName == ""){
      questName = null
    }
    var questDesc = "";
    var questAchievementId = this.shadowRoot.querySelector(
      "#addQuestAchievementInput"
    ).value;
    if(questAchievementId == ""){
      questAchievementId = null
    }
    var questActionIds = [];
    this.chosenActions.forEach((actionId) => {
      console.log(this.shadowRoot.querySelector("#times" + actionId).value)
      if(this.shadowRoot.querySelector("#times" + actionId).value > 0){
        questActionIds.push({ times: parseInt(this.shadowRoot.querySelector("#times" + actionId).value), action: actionId });
      } else {questActionIds.push({ times: 1, action: actionId });}
      
    });
    console.log("action ids")
    console.log(questActionIds)
    if(questActionIds.length == 0){
      console.log("action id is empty")
      questActionIds = null
    }
    var status = "REVEALED";
    var questquestflag = "False"
    var questIds = this.shadowRoot.querySelector("#questSelect").options[this.shadowRoot.querySelector("#questSelect").selectedIndex].text
    console.log(questIds)
    if(questIds!="NONE" && questIds!= null && questIds!= ""){
      status = "HIDDEN"
      questquestflag = "True"
      console.log("requirement set");
      
    } else {
      questIds=null
      status = null;
    }
    var contentB = {
      questpointvalue: 0,
      questname: questName,
      questachievementid: questAchievementId,
      questdescription: questDesc,
      questquestflag: questquestflag,
      questpointflag:"False",
      questactionids:questActionIds,
      questquestidcompleted:questIds,
      questidcompleted:questIds,
      queststatus:status,
      questnotificationcheck:"False",
      questnotificationmessage:""
    };

    let formData = new FormData();
    formData.append("contentB", contentB);

    fetch(this.url + "gamification/quests/" + this.game + "/" + quest.id, {
      method: "PUT",
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


  _addAction(actionId) {
    if (this.chosenActions.includes(actionId)) {
      const index = this.chosenActions.indexOf(actionId);
      if (index > -1) { // only splice array when item is found
        this.chosenActions.splice(index, 1); // 2nd parameter means remove one item only
      }
    } else {
      this.chosenActions.push(actionId);
    }
    console.log(this.chosenActions);
  }
  moveUp(quest) {
    var questNumber = quest.id
    let formData = new FormData();
    var index = this.quests.indexOf(quest);
    var succeedingQuests = [];
    for(var i=index-1; i<this.quests.length;i++){
      if(i==index){
        continue;
      }
      succeedingQuests.push(this.quests[i].id);

    }

    formData.append("questIds", succeedingQuests);
    fetch(this.url + "gamification/quests/" + this.game + "/" + questNumber+"/up", {
      method: "PUT",
      headers: { Authorization: this.aaron },
      body: formData,
    })
      .then((response) => {
        console.log(response)
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        this.getQuestsData();
        /*      $("button#addnewgame").off('click');
        $("button#addnewgame").on('click', function(event) {
            $("#createnewgame").modal('toggle');
        });*/
      });
  }

  moveDown(quest) {
    var questNumber = quest.id
    let formData = new FormData();
    var index = this.quests.indexOf(quest);
    var succeedingQuests = [];
    for(var i=index; i<this.quests.length;i++){
      if(i==index+1){
        questNumber = this.quests[i].id
        continue;
      }
      succeedingQuests.push(this.quests[i].id);

    }

    formData.append("questIds", succeedingQuests);
    fetch(this.url + "gamification/quests/" + this.game + "/" + questNumber+"/up", {
      method: "PUT",
      headers: { Authorization: this.aaron },
      body: formData,
    })
      .then((response) => {
        console.log(response)
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        this.getQuestsData();
        /*      $("button#addnewgame").off('click');
        $("button#addnewgame").on('click', function(event) {
            $("#createnewgame").modal('toggle');
        });*/
      });
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
              <p class="card-text">Required Quest: ${quest.questIdCompleted}</p>
              <p class="card-text">
                Unlocked Achievement: ${quest.achievementId}
              </p>
              <p class="card-text">
                Notification message: ${quest.notificationMessage}
              </p>
              <a
                class="btn btn-primary"
                id="buttonLevel${quest.number}"
                @click="${() => this._deleteQuest(quest)}"
                >Delete</a>
                <a class="btn btn-primary" id=buttonLevel${quest.id} @click="${() => this._updateQuest(quest)}">Update</a>
                <a class="btn btn-primary"  @click="${() => this.moveUp(quest)}">UP</a>
              <a class="btn btn-primary"  @click="${() => this.moveDown(quest)}">DOWN</a>
           
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
          id="addQuestAchievementInput"
          class="form-control"
          placeholder="Quest Achievement"
        />
        <label for="floatingInput">Quest AchievementId</label>
      </div>
      <select id=achievementSelect class="form-select" aria-label="Default select example">
      <option selected>Choose Achievement</option>
      <option value="NONE">NONE</option>
      <label class="form-check-label" for="flexCheckDefault">
        NONE
      </label>
      ${this.achievements.map(
        (achievement) => html`
        <option value="${achievement.id}">${achievement.id}</option>
          <label class="form-check-label" for="flexCheckDefault">
            ${achievement.id}
          </label>
        `
      )}
    </select>
      <select id=questSelect class="form-select" aria-label="Default select example">
      <option selected>Choose Required Quest to Unlock</option>
      <option value="NONE">NONE</option>
      <label class="form-check-label" for="flexCheckDefault">
        NONE
      </label>
      ${this.quests.map(
        (quest) => html`
        <option value="${quest.id}">${quest.id}</option>
          <label class="form-check-label" for="flexCheckDefault">
            ${quest.id}
          </label>
        `
      )}
    </select>
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
