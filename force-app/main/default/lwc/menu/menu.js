import { LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners } from "c/pubsub";


class ActionLogCardItem {


  constructor(date, message, name, cardRowNumber) {
    this.date = date;
    this.message = message;
    this.cardRowName = cardRowNumber;
    this.name = name;
  }
}

class ActionLogCardRowItem {

  constructor(date, message, name) {
    this.date = date;
    this.message = message;
    this.name = name;
  }
}

class DeletedActionLogCardItem {

  constructor(date, message) {
    this.date = date;
    this.message = message;
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
    registerListener("deletecardclick", this.handleDeleteCardClick, this);
    registerListener("deleterow", this.handleDeleteRow, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleAddCardClick(cardInfo) {
    let message = "User *username* added new card " + cardInfo.cardName + " at cardRow " + cardInfo.cardRow + " !";
    let actionLogItem = new ActionLogCardItem(this.getDate(), message, cardInfo.cardName, cardInfo.cardRow);
    this.actions.unshift(actionLogItem);


  }

  handleAddCardRowClick(cardRowName) {
    let message = "User *username* added new cardRow " + cardRowName + "!";
    let actionLogItem = new ActionLogCardRowItem(this.getDate(), message, cardRowName);
    this.actions.unshift(actionLogItem);
  }

  handleDeleteCardClick(cardInfo) {
    let message = "User *username* deleted card " + cardInfo.cardName + " at cardRow " + cardInfo.cardRow + "!";
    let actionLogItem = new DeletedActionLogCardItem(this.getDate(), message);
    this.actions.unshift(actionLogItem);
  }

  handleDeleteRow(cardRowName) {
    let message = "User *username* deleted cardRow " + cardRowName + "!";
    let actionLogItem = new DeletedActionLogCardItem(this.getDate(), message);
    this.actions.unshift(actionLogItem);
  }
}