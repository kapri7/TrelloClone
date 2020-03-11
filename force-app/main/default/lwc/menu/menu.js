import { LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners } from "c/pubsub";
import getAllLogItems from "@salesforce/apex/LogItemController.getAllLogItems";
import insertNewLogItem from "@salesforce/apex/LogItemController.insertNewLogItem";
import LOG_OBJECT from '@salesforce/schema/LogItem__c';
import NAME_FIELD from "@salesforce/schema/LogItem__c.Name";
import DATE_FIELD from "@salesforce/schema/LogItem__c.Date__c";
import MESSAGE_FIELD from "@salesforce/schema/LogItem__c.Message__c";

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
        const message = i.Message__c;
        const date = i.Date__c;
        const actionLogItem = new ActionLogItem(date, message);
        this.actions.unshift(actionLogItem);
      }
    }
  }

  insertLogItem() {
    insertNewLogItem({ logItem: this.rec })
      .then(result => {

        //console.log(JSON.stringify(result));
       // console.log("result", this.message);
      })
      .catch(error => {
        this.error = error;
        console.log("error", JSON.stringify(this.error));
      });
  }

  connectedCallback() {
    registerListener("addcardclick", this.handleAddCard, this);
    registerListener("addcardcolumnclick", this.handleAddCardColumn, this);
    registerListener("deletecardclick", this.handleDeleteCard, this);
    registerListener("deletecolumn", this.handleDeleteRow, this);
    registerListener("dragdropmenu", this.handleDragDropLog, this);
    registerListener("changecolumn", this.handleChangeColumn, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  displayLogMessage(message){
    const currentDateTime = new Date().getTime();
    const actionLogItem = new ActionLogItem(currentDateTime, message);
    this.actions.unshift(actionLogItem);
    this.rec.Name = "default";
    this.rec.Date__c = currentDateTime;
    this.rec.Message__c = message;
    this.insertLogItem();
  }

  handleChangeColumn(info){
    const message = "User *username* moved card " + info.cardName + " from list " + info.startColumn + " to list " + info.destinationColumn + ".";
    this.displayLogMessage(message);
  }

  handleAddCard(cardInfo) {
    const message = "User *username* added new card " + cardInfo.cardName + " at list " + cardInfo.cardColumn.name + " !";
    this.displayLogMessage(message);
  }

  handleAddCardColumn(cardColumnName) {
    const message = 'User *username* added new list ' + cardColumnName + '!';
    this.displayLogMessage(message);

  }

  handleDeleteCard(cardInfo) {
    const message = "User *username* deleted card " + cardInfo.card.name + " at list " + cardInfo.cardColumn.name + "!";
    this.displayLogMessage(message);
  }

  handleDeleteRow(cardColumnName) {
    const message = "User *username* deleted list " + cardColumnName + "!";
    this.displayLogMessage(message);
  }

  handleDragDropLog(info) {
    const message = "User *username* moved card " + info.draggedCard.card.name + " from list " + info.draggedCard.cardColumn.name + " to list " + info.targetColumn.name + ".";
    this.displayLogMessage(message);
  }
}