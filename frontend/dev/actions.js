import { LitElement, html } from "lit";
// global variables

export class ActionElement extends LitElement {
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
      actions: {
        type: Array,
      },
    };
  }
  constructor() {
    super();
    this.aaron = "";
    this.actions = [];
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
    if (this.game != this.oldGame) {
      this.oldGame = this.game;
      console.log("fetching level data");
      this.getActionsData();
    }
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
        }
      });
  }

  _addAction() {
    var actionName = this.shadowRoot.querySelector("#addActionNameInput").value;
    var actionId = this.shadowRoot.querySelector("#addActionIdInput").value;
    var actionDesc = this.shadowRoot.querySelector("#addActionDescInput").value;
    var actionPoints = this.shadowRoot.querySelector(
      "#addActionPointsInput"
    ).value;
    var actionTypeSelect = "LRS";
    if (this.shadowRoot.querySelector("#actionTypeSelect").value != 1){
    actionTypeSelect = "other"
    }
    var actionLRSOccSelect = "Distinct";
    if (this.shadowRoot.querySelector("#actionLRSOccSelect").value != 1){
      actionLRSOccSelect = "All";
    }
      console.log(actionTypeSelect + "is the chosen type")
    if (isNaN(actionPoints)) {
      actionPoints = 0;
    }

    var actionMatchAttribute = this.shadowRoot.querySelector("#addActionAttributeMatchInput").value;
    var actionValueAttribute = this.shadowRoot.querySelector("#addActionValueMatchInput").value;
    
    let formData = new FormData();
    formData.append("actionpointvalue", actionPoints);
    formData.append("actionname", actionName);
    formData.append("actiontype", actionTypeSelect);
    formData.append("actionid", actionId);
    formData.append("actiondesc", actionDesc);
    formData.append("actionLRSOccurence", actionLRSOccSelect);
    formData.append("actionLRSAttribute", actionMatchAttribute);
    formData.append("actionLRSAttributeValue",  actionValueAttribute);
    fetch(this.url + "gamification/actions/" + this.game, {
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
        this.getActionsData();
      });
  }

  _deleteAction(action) {
    var actionNumber = action.id;
    fetch(this.url + "gamification/actions/" + this.game + "/" + actionNumber, {
      method: "Delete",
      headers: { Authorization: this.aaron },
    })
      .then((response) => {
        console.log(response);

        if (response.ok) {
          console.log("good response for get games gamers");
          const index = this.actions.indexOf(action);
          if (index > -1) { // only splice array when item is found
            this.actions.splice(index, 1); // 2nd parameter means remove one item only
          }
          this.requestUpdate();
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  }
  returnType(action) {
    if (action.actionType == undefined || action.actionType == null) {
      return html` <p class="card-text">Action Type: Other`;
    } else {
      return html` <p class="card-text">Action Type: ${action.actionType}</p>
      <p class="card-text">Attribute to match + value: ${action.lrsAttribute} - ${action.lrsAttributeValue}</p>`;
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

      <h2>Gamification Action Manager</h2>

      ${this.actions.map(
        (action) => html`
          <div
            class="card border-dark mb-3"
            style="width: 18rem;display:inline-block;"
          >
            <div class="card-body text-dark">
              <h5 class="card-title">${action.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${action.id}</h6>
              <p class="card-text">${action.description}</p>
              <p class="card-text">Rewarded points: ${action.pointValue}</p>
              ${this.returnType(action)}
              <p class="card-text">
                Notification message: ${action.notificationMessage}
              </p>
              <a
                href="#"
                class="btn btn-primary"
                id="buttonLevel${action.number}"
                @click="${() => this._deleteAction(action)}"
                >Delete</a
              >
            </div>
          </div>
        `
      )}
      <div class="form-floating mb-3">
        <input
          id="addActionNameInput"
          class="form-control"
          placeholder="Action Name/Verb Name"
        />
        <label for="floatingInput">Action Name/Verb Name</label>
      </div>
      <div class="form-floating mb-3">
        <input
          id="addActionIdInput"
          class="form-control"
          placeholder="Action Id"
        />
        <label for="floatingInput">Action Id</label>
      </div>
      <div class="form-floating mb-3">
        <input
          id="addActionDescInput"
          class="form-control"
          placeholder="Action Description"
        />
        <label for="floatingInput">Action Description</label>
      </div>
      <div class="form-floating mb-3">
        <input
          id="addActionPointsInput"
          class="form-control"
          placeholder="Point Rewards"
          type="number"
        />
        <label for="floatingInput">Point Rewards</label>
        </div>
        <select
        class="form-select form-select-lg mb-3"
        id="actionTypeSelect"
        aria-label=".form-select-lg example"
      >
        <option selected>Action Type Select (default LRS)</option>
        <option value="1">LRS</option>
        <option value="2">Other</option>
      </select>
      <select
      class="form-select form-select-lg mb-3"
      id="actionLRSOccSelect"
      aria-label=".form-select-lg example"
    >
      <option value="1">Distinct Objects</option>
      <option value="2">All Occurence</option>
    </select>
    <div class="input-group">
    <input id=addActionAttributeMatchInput type="text" class="form-control" placeholder="Matching Attribute"/>
    <span class="input-group-addon">-</span>
    <input id=addActionValueMatchInput type="text" class="form-control" placeholder="Value to match"/>
</div>


        <div>
        <button
          type="button"
          id="addActionButton"
          @click="${() => this._addAction()}"
          class="btn btn-primary"
        >
          Add Action!
        </button>
        </div>
    `;
  }
}

window.customElements.define("action-element", ActionElement);
