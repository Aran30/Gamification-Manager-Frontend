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
    this.badges = [];
    this.oldGame = undefined;
    this.game = undefined;
  }

  firstUpdated(changedProperties) {

    console.log("iekrh2badge");
    /*  const button = this.shadowRoot.querySelector("#reloadButtonLevel");
      this.shadowRoot
        .querySelector("#addLevelButton")
        .addEventListener("click", (event) => this._addLevel());*/
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

  _addBadge() {
    var badgeName = this.shadowRoot.querySelector("#addBadgeNameInput").value;
    if (badgeName == "") {
      console.log(this.badges)
      return;
    }
    var badgeId = this.shadowRoot.querySelector(
      "#addBadgeIdInput"
    ).value;
    var badgeDesc = this.shadowRoot.querySelector(
      "#addBadgeDescInput"
    ).value;
    var badgeInput = this.shadowRoot.querySelector(
      "#badgeImg"
    );
    console.log(badgeName + badgeId + badgeDesc);
    let formData = new FormData();
    formData.append("badgeid", badgeId);
    formData.append("badgename", badgeName);
    formData.append("badgedesc", badgeDesc);
    formData.append("badgeimageinput", badgeInput.files[0]);
    formData.append("badgenotificationcheck", "true");
    formData.append("badgenotificationmessage", "");
    fetch(this.url + "gamification/badges/" + this.game, {
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
        this.getBadgeData();
        /*      $("button#addnewgame").off('click');
        $("button#addnewgame").on('click', function(event) {
            $("#createnewgame").modal('toggle');
        });*/
      });
  }
  _updateBadge(badge) {
    var badgeNumber = badge.id
    var badgeName = this.shadowRoot.querySelector("#addBadgeNameInput").value;
    let formData = new FormData();
    if (badgeName != "") {
      formData.append("badgename", badgeName);
    }
    var badgeId = this.shadowRoot.querySelector(
      "#addBadgeIdInput"
    ).value;
    if(badgeId!=""){
      formData.append("badgeid", badgeId);
    }
    var badgeDesc = this.shadowRoot.querySelector(
      "#addBadgeDescInput"
    ).value;
    if(badgeDesc!=""){
      formData.append("badgedesc", badgeDesc);
    }
    var badgeInput = this.shadowRoot.querySelector(
      "#badgeImg"
    );
    if(badgeInput!=""){
      formData.append("badgeimageinput", badgeInput.files[0]);
    }
    formData.append("badgenotificationcheck", "true");
    formData.append("badgenotificationmessage", "");
    fetch(this.url + "gamification/badges/" + this.game + "/" + badgeNumber, {
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
        this.getBadgeData();
        /*      $("button#addnewgame").off('click');
        $("button#addnewgame").on('click', function(event) {
            $("#createnewgame").modal('toggle');
        });*/
      });
  }

  _deleteBadge(badge) {
    var badgeNumber = badge.id
    console.log(badgeNumber)
    fetch(this.url + "gamification/badges/" + this.game + "/" + badgeNumber, {
      method: "Delete",
      headers: { Authorization: this.aaron },
    })
      .then((response) => {
        console.log(response);

        if (response.ok) {
          console.log("good response for get badges gamers");
          console.log(this.badges)
          console.log(window.scrollY)
          var y = window.scrollY
          const index = this.badges.indexOf(badge);
          if (index > -1) { // only splice array when item is found
            this.badges.splice(index, 1); // 2nd parameter means remove one item only
          }

          this.requestUpdate();
          console.log(window.scrollY)
          window.scroll(0,y)
          console.log(window.scrollY)
          return response.json();
        }
      })
      .then((data) => {
        console.log(this.badges);

      });

  }
  // i need to change the level service code, its just thrash atm

  returnImage(badge) {
    if (badge.base64 == "") {
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
          <div class="card border-dark mb-3" style="width: 18rem;display:inline-block;">
          ${this.returnImage(badge)}
            <div class="card-body text-dark">
              <h5 class="card-title">${badge.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${badge.id}</h6>
              <p class="card-text">Required points: ${badge.description}</p>
              <a href="#" class="btn btn-primary" id=buttonLevel${badge.id} @click="${() => this._deleteBadge(badge)}">Delete</a>
              <a href="#" class="btn btn-primary" id=buttonLevel${badge.id} @click="${() => this._updateBadge(badge)}">Update</a>
            </div>
          </div>
        `
    )}
      <div class="mb-3">
   <label for="formFile" class="form-label">Default file input example</label>
    <input class="form-control" type="file" id="badgeImg">
    </div>
    <div class="form-floating mb-3">
    <input
      id="addBadgeNameInput"
      class="form-control"
      placeholder="Badge Name"
    />
    <label for="floatingInput">Badge Name</label>
  </div>
  <div class="form-floating mb-3">
    <input
      id="addBadgeIdInput"
      class="form-control"
      placeholder="Badge Id"
    />
    <label for="floatingInput">Badge Id</label>
  </div>
  <div class="form-floating mb-3">
    <input
      id="addBadgeDescInput"
      class="form-control"
      placeholder="Badge Description"
    />
    <label for="floatingInput">Badge Description</label>
    <button
      type="button"
      id="addBadgeButton"
      @click="${() => this._addBadge()}"
      class="btn btn-primary"
    >
      Add Badgel!
    </button>
  </div>
    `;
  }
}

window.customElements.define("badge-element", BadgeElement);
