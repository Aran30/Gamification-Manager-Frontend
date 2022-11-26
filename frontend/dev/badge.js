import { LitElement, html } from "lit";
// global variables

export class BadgeElement extends LitElement {
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
      badges: {
        type: Array,
      },
    };
  }
  constructor() {
    super();
    this.aaron = "";
    this.url = "http://127.0.0.1:8080/";
    this.badges = [];
    this.oldGame = undefined;
    this.game = undefined;
  }

  firstUpdated(changedProperties) {
    console.log("iekrh2");
  /*  const button = this.shadowRoot.querySelector("#reloadButtonLevel");
    this.shadowRoot
      .querySelector("#addLevelButton")
      .addEventListener("click", (event) => this._addLevel());*/
    this.url = "http://127.0.0.1:8080/";
  }

  updated() {
    console.log(this.game + "fetching level data" + this.oldGame);
    if (this.game != this.oldGame) {
      this.oldGame = this.game;
      console.log("fetching level data");
      this.getBadgeData();
    }
  }

  getBadgeData() {
    fetch(this.url + "gamification/badges/" + this.game, {
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
          this.badges = data.rows;
          console.log("done");
          console.log(this.badges);
        }
      });
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
    console.log(levelName + levelNumber + levelPoints);
    let formData = new FormData();
    formData.append("levelnum", levelNumber);
    formData.append("levelname", levelName);
    formData.append("levelpointvalue", levelPoints);
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

  _deleteBadge(badge){
    var badgeNumber = badge.id
    console.log(badgeNumber)
    fetch(this.url + "gamification/badges/" + this.game + "/" + badgeNumber, {
      method: "Delete",
      headers: { Authorization: this.aaron },
    })
      .then((response) => {
        console.log(response);

        if (response.ok) {
          console.log("good response for get games gamers");
          this.badges.pop(badge)
          this.requestUpdate()
          return response.json();

        }
      })
      .then((data) => {
        console.log(data);
        
      });

  }
  // i need to change the level service code, its just thrash atm
 
returnImage(badge){
  if(badge.base64==""){
    return html``;
  } else {
    return html`<img class="card-img-top" src="data:image/png;base64, ${badge.base64}" />`
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
      <h2>Gamification Badge Manager</h2>
      ${this.badges.map(
        (badge) => html`
          <div class="card border-dark mb-3" style="width: 18rem;">
          ${this.returnImage(badge)}
            <div class="card-body text-dark">
              <h5 class="card-title">${badge.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${badge.id}</h6>
              <p class="card-text">Required points: ${badge.description}</p>
              <a href="#" class="btn btn-primary" id=buttonLevel${badge.id} @click="${() => this._deleteBadge(badge)}">Delete</a>
            </div>
          </div>
        `
      )}
      <div class="mb-3">
   <label for="formFile" class="form-label">Default file input example</label>
    <input class="form-control" type="file" id="formFile">
    </div>

    `;
  }
}

window.customElements.define("badge-element", BadgeElement);
