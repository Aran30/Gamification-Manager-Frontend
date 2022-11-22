import { LitElement, html } from 'lit-element';
import '../project-list.js';
import Auth from "../util/auth";
import Common from "../util/common";
import 'las2peer-frontend-statusbar/las2peer-frontend-statusbar.js';
export class DemoElement extends LitElement {

  static get properties() {
    return {
      selectedProject: {
        type: Object
      }
    }
  }

 constructor() {
    super();

  }
  // I didnt get how to use ready, so simply used firstUpdated which is always called after render...
  firstUpdated(changedProperties){
    console.log("iekrh");
    const statusBar = this.shadowRoot.querySelector("#statusBar");
    // in the following we use (event) => this.method(event) in order to be able to access
    // this.shadowRoot in the handleLogin and handleLogout methods
    statusBar.addEventListener('signed-in', (event) => this.handleLogin(event));
    statusBar.addEventListener('signed-out', (event) => this.handleLogout(event));
  }

  handleLogin(event) {
    console.log(event.detail.access_token);
    Auth.setAuthDataToLocalStorage(event.detail.access_token);

    var url = "https://api.learning-layers.eu/auth/realms/main/protocol/openid-connect/userinfo";
    fetch(url, {method: "GET", headers: {
      "Authorization": "Bearer " + Auth.getAccessToken()
    }}).then(response => {
      if(response.ok) {
        return response.json();
      }
    }).then(data => {
      console.log(data.name);
      // const userInfo = Common.getUserInfo();
      //userInfo.sub = data.sub;
      Common.storeUserInfo(data);

      // reload projects 
      window.dispatchEvent(new CustomEvent("projects-reload-request", { bubbles: true }));
    });
  }

  handleLogout() {
    Auth.removeAuthDataFromLocalStorage();

    // remove userInfo from localStorage
    Common.removeUserInfoFromStorage();
  }


  render() {
    return html`
    <las2peer-frontend-statusbar
    id="statusBar"
    service="Project List Demo"
    oidcclientid=bdda7396-3f6d-4d83-ac21-65b4069d0eab
    suppresswidgeterror="true"
    autoAppendWidget=true
    oidcAuthority="https://api.learning-layers.eu/o/oauth2"
    loginoidcprovider="https://auth.las2peer.org/auth/realms/main"
    suppress-error-toast=false
    oidcpopupsigninurl="/callbacks/popup-signin-callback.html"
    oidcpopupsignouturl="/callbacks/popup-signout-callback.html"
    oidcsilentsigninturl="/callbacks/silent-callback.html"
    ></las2peer-frontend-statusbar>
      <h2>Project list with "All Projects" enabled</h2>
      <div style="display: flex">
    
      </div>
      
      <h2>Project list with "All Projects" disabled</h2>
    `;
  }

  getStatusBarElement() {
    return this.shadowRoot.querySelector("#statusBar");
  }

  _triggerChange(event){
    let events = new CustomEvent("metadata-change-request", {
      detail: {
        "random": this.shadowRoot.querySelector("#metadataInput").value
      },
      bubbles: true
    });
    window.dispatchEvent(events);
  }

  /**
   * For testing the "project-selected" event of the project list.
   * @param event Event that contains the information on the selected project.
   * @private
   */
  _onProjectSelected(event) {
    console.log("onProjectSelected called");
    this.selectedProject = JSON.stringify(event.detail.project);
    console.log(this.selectedProject);
  }

  /**
   * Example for using the online user list.
   * Make sure that _onProjectsLoaded is called on the projects-loaded event of the project-list.
   */
  _onProjectsLoaded(event) {
    let projects = event.detail.projects;

    window.addEventListener("metadata-changed", e => {
        console.log("metadata has changed", e.detail);
        const project = JSON.parse(this.selectedProject);
        project.metadata = e.detail;
        this.selectedProject = JSON.stringify(project);
    });
    
    // uncomment this, if you want to test the online user list
    /*let mapProjectRooms = {};
    for(let project of projects) {
        mapProjectRooms[project.name] = ["exampleYjsRoom"];
    }
    this.shadowRoot.getElementById("pl1").setOnlineUserListYjsRooms(mapProjectRooms);*/
  }
}

window.customElements.define('demo-element', DemoElement);
