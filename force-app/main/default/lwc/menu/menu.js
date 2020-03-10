import { LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners } from "c/pubsub";
import getAllLogItems from "@salesforce/apex/LogItemController.getAllLogItems";
import insertNewLogItem from "@salesforce/apex/LogItemController.insertNewLogItem";
import LOG_OBJECT from '@salesforce/schema/LogItem__c';
import NAME_FIELD from "@salesforce/schema/LogItem__c.Name";
import DATE_FIELD from "@salesforce/schema/LogItem__c.Date__c";
import MESSAGE_FIELD from "@salesforce/schema/LogItem__c.Message__c";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
class ActionLogItem {

  constructor(date, message) {
    this.date = date;
    this.message = message;
  }
}

export default class MenuComponent extends LightningElement {

  @wire(CurrentPageReference) pageRef;
  @track greeting = "Test";

  @track name = NAME_FIELD;
  @track message = MESSAGE_FIELD;
  @track dateLog = DATE_FIELD;

  rec = {
    Name: this.name,
    Message__c: this.message,
    Date__c: this.dateLog
  };


  handleGreetingChange(event) {
    this.greeting = event.target.value;
  }

  get capitalizedGreeting() {
    return `About dashboard ${this.greeting}!`;
  }


  @track actions = [];

  @wire(getAllLogItems)
  getLogInform(result) {
    if (result.data) {
      for (let i of result.data) {
        let message = i.Message__c;
        let date = i.Date__c.replace("T", " ").slice(0, 19);//19 - 24 unused elements
        let actionLogItem = new ActionLogItem(date, message);
        this.actions.unshift(actionLogItem);
      }
    }
  }

  insertLogItem() {
    insertNewLogItem({ logItem: this.rec })
      .then(result => {
        this.message = result;
        this.error = undefined;
        if (this.message !== undefined) {
          this.rec.Name = "";
          this.rec.Message__c = "";
          this.rec.Date__c = "";
        }

        //console.log(JSON.stringify(result));
       // console.log("result", this.message);
      })
      .catch(error => {
        this.message = undefined;
        this.error = error;
        console.log("error", JSON.stringify(this.error));
      });
  }

  getCurrentDate() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return year + '-' + month + '-' + day + ' '  + hours + ':' + minutes + ':' + seconds;
  }

  connectedCallback() {
    registerListener("addcardclick", this.handleAddCardClick, this);
    registerListener("addcardcolumnclick", this.handleAddCardColumnClick, this);
    registerListener("deletecardclick", this.handleDeleteCardClick, this);
    registerListener("deletecolumn", this.handleDeleteRow, this);
    registerListener("dragdropmenu", this.handleDragDropLog, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  displayLogMessage(message){
    let currentDateTime = this.getCurrentDate();
    let actionLogItem = new ActionLogItem(currentDateTime, message);
    this.actions.unshift(actionLogItem);
    this.rec.Name = currentDateTime.replace(' ','T') + '.000Z';
    this.rec.Date__c = currentDateTime.replace(' ','T') + '.000Z';
    this.rec.Message__c = message;
    this.insertLogItem();
  }

  handleAddCardClick(cardInfo) {
    let message = "User *username* added new card " + cardInfo.cardName + " at list " + cardInfo.cardColumn.name + " !";
    this.displayLogMessage(message);
  }

  handleAddCardColumnClick(cardColumnName) {
    let message = 'User *username* added new list ' + cardColumnName + '!';
    this.displayLogMessage(message);

  }

  handleDeleteCardClick(cardInfo) {
    let message = "User *username* deleted card " + cardInfo.card.name + " at list " + cardInfo.cardColumn.name + "!";
    this.displayLogMessage(message);
  }

  handleDeleteRow(cardColumnName) {
    let message = "User *username* deleted list " + cardColumnName + "!";
    this.displayLogMessage(message);
  }

  handleDragDropLog(info) {
    let message = "User *username* moved card " + info.draggedCard.card.name + " from list " + info.draggedCard.cardColumn.name + " to list " + info.targetColumn.name + ".";
    this.displayLogMessage(message);
  }
}