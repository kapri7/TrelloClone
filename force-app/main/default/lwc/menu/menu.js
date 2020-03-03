import { LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners } from "c/pubsub";


class ActionLogCardItem {


  constructor(date, message, name, cardColumnNumber) {
    this.date = date;
    this.message = message;
    this.cardColumnName = cardColumnNumber;
    this.name = name;
  }
}

class ActionLogCardColumnItem {

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

export default class MenuComponent extends LightningElement {

  @wire(CurrentPageReference) pageRef;
  @track greeting = "Test";

  handleGreetingChange(event) {
    this.greeting = event.target.value;
  }

  get capitalizedGreeting() {
    return `About dashboard ${this.greeting}!`;
  }

  @track actions = [];

  getDate() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return month + "/" + day + "/" + year + "  " + hours + "." + minutes + "." + seconds;
  }

  connectedCallback() {
    registerListener("addcardclick", this.handleAddCardClick, this);
    registerListener("addcardcolumnclick", this.handleAddCardRowClick, this);
    registerListener("deletecardclick", this.handleDeleteCardClick, this);
    registerListener("deletecolumn", this.handleDeleteRow, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleAddCardClick(cardInfo) {
    let message = "User *username* added new card " + cardInfo.cardName + " at cardColumn " + cardInfo.cardColumn + " !";
    let actionLogItem = new ActionLogCardItem(this.getDate(), message, cardInfo.cardName, cardInfo.cardColumn);
    this.actions.unshift(actionLogItem);


  }

  handleAddCardRowClick(cardColumnName) {
    let message = "User *username* added new cardColumn " + cardColumnName + "!";
    let actionLogItem = new ActionLogCardColumnItem(this.getDate(), message, cardColumnName);
    this.actions.unshift(actionLogItem);
  }

  handleDeleteCardClick(cardInfo) {
    let message = "User *username* deleted card " + cardInfo.cardName + " at cardColumn " + cardInfo.cardColumn + "!";
    let actionLogItem = new DeletedActionLogCardItem(this.getDate(), message);
    this.actions.unshift(actionLogItem);
  }

  handleDeleteRow(cardColumnName) {
    let message = "User *username* deleted cardColumn " + cardColumnName + "!";
    let actionLogItem = new DeletedActionLogCardItem(this.getDate(), message);
    this.actions.unshift(actionLogItem);
  }
}