import { LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners } from "c/pubsub";


class ActionLogCardItem {


  constructor(date, message, id,cardRowNumber) {
    this.date = date;
    this.message = message;
    this.cardRowNumber =  cardRowNumber;
    this.id = id;
  }
}

class ActionLogCardRowItem {

  constructor(date, message, id) {
    this.date = date;
    this.message = message;
    this.id = id;
  }
}

export default class HelloWebComponent extends LightningElement {

  @wire(CurrentPageReference) pageRef;
  @track greeting = "myDashboard";

  handleGreetingChange(event) {
    this.greeting = event.target.value;
  }

  get capitalizedGreeting() {
    return `About dashboard ${this.greeting}!`;
  }

  @track actions = [];

  getDate() {
    let date = new Date();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    let year = date.getFullYear();
    let hours = String(date.getHours()).padStart(2, "0");
    let minutes = String(date.getMinutes()).padStart(2, "0");
    let seconds = String(date.getSeconds()).padStart(2, "0");

    return month + "/" + day + "/" + year + "  " + hours + "." + minutes + "." + seconds;
  }

  connectedCallback() {
    registerListener("addcardclick", this.handleAddCardClick, this);
    registerListener("addcardrowclick", this.handleAddCardRowClick, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleAddCardClick(cardRow) {
    let id = 0;
    if (this.actions.length > 0) {
      for (let i of this.actions) {
        if (i instanceof ActionLogCardItem && i.cardRowNumber === cardRow) {
          id = i.id + 1;
          break;
        }
      }
    }
    let actionLogItem = new ActionLogCardItem(this.getDate(), "New card" + id + " at cardRow " + cardRow + " !", id,cardRow);
    this.actions.unshift(actionLogItem);


  }

  handleAddCardRowClick() {
    let id = 0;
    if (this.actions.length > 0) {
      for (let i of this.actions) {
        if (i instanceof ActionLogCardRowItem) {
          id = i.id + 1;
          break;
        }
      }
    }
    let actionLogItem = new ActionLogCardRowItem(this.getDate(), "New cardRow " + id + "!", id);
    this.actions.unshift(actionLogItem);
  }
}