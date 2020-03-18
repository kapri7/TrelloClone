import { LightningElement, track, wire, api } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import getAllLogItems from "@salesforce/apex/LogItemController.getAllLogItems";
import insertNewLogItem from "@salesforce/apex/LogItemController.insertNewLogItem";
import getCurrentUser from "@salesforce/apex/TrelloController.getCurrentUser";
import Id from "@salesforce/user/Id";

class ActionLogItem {

  constructor(date, message, dashboard) {
    this.date = date;
    this.message = message;
    this.name = dashboard.name;
    this.dashboard = dashboard.id;
  }
}

export default class MenuComponent extends LightningElement {

  @wire(CurrentPageReference) pageRef;
  @track actions = [];
  @api board;
  username;

  connectedCallback() {
    registerListener("addcardclick", this.handleAddCard, this);
    registerListener("addcardcolumnclick", this.handleAddCardColumn, this);
    registerListener("deletecardclick", this.handleDeleteCard, this);
    registerListener("deletecolumn", this.handleDeleteRow, this);
    registerListener("dragdropmenu", this.handleDragDropLog, this);
    registerListener("changecolumn", this.handleChangeColumn, this);
    this.handleChooseBoard();
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
    this.actions = [];
  }

  handleBoardInfo(){
    fireEvent(this.pageRef,"boardinfoclick",this.board)
  }
  insertLogItem(actionLogItem) {
    const record = {
      Name: actionLogItem.name,
      Date__c: actionLogItem.date,
      Message__c: actionLogItem.message,
      Dashboard__c: this.board.id
    };

    insertNewLogItem({ logItem: record })
      .then(result => {

        this.actions.unshift(actionLogItem);
        //console.log(JSON.stringify(result));
        // console.log("result", this.message);
      })
      .catch(error => {
        this.error = error;
        console.log("error", JSON.stringify(this.error));
      });
  }

  displayLogMessage(message) {
    const currentDateTime = new Date().getTime();
    const actionLogItem = new ActionLogItem(currentDateTime, message, this.board.id);
    this.insertLogItem(actionLogItem);
  }

  handleChooseBoard() {
    getCurrentUser({userId:Id})
      .then(result =>{
        this.username = result.Name;
      });


    getAllLogItems()
      .then(result => {
        for (let i of result) {
          if (i.Dashboard__c === this.board.id) {
            const message = i.Message__c;
            const date = i.Date__c;
            const actionLogItem = new ActionLogItem(date, message, this.board.id);
            this.actions.unshift(actionLogItem);
          }
        }
      });
  }

  handleChangeColumn(info) {
    if (info.startColumn.board === this.board.id) {
      const message = "User " + this.username + " moved card " + info.cardName + " from list " + info.startColumn + " to list " + info.destinationColumn + ".";
      this.displayLogMessage(message);
    }
  }

  handleAddCard(cardInfo) {
    if (cardInfo.cardColumn.board === this.board.id) {
      const message = "User " + this.username + " added new card " + cardInfo.cardName + " at list " + cardInfo.cardColumn.name + " !";
      this.displayLogMessage(message);
    }
  }

  handleAddCardColumn(cardColumn) {
    if (cardColumn.Dashboard__c === this.board.id) {
      const message = "User " + this.username + " added new list " + cardColumn.Name + "!";
      this.displayLogMessage(message);
    }
  }

  handleDeleteCard(cardInfo) {
    if (cardInfo.cardColumn.board === this.board.id) {
      const message = "User " + this.username + " deleted card " + cardInfo.card.name + " at list " + cardInfo.cardColumn.name + "!";
      this.displayLogMessage(message);
    }
  }

  handleDeleteRow(cardColumn) {
    if (cardColumn.board === this.board.id) {
      const message = "User " + this.username + " deleted list " + cardColumn.name + "!";
      this.displayLogMessage(message);
    }
  }

  handleDragDropLog(info) {
    if (info.draggedCard.cardColumn.board === this.board.id) {
      const message = "User " + this.username + " moved card " + info.draggedCard.card.name + " from list " + info.draggedCard.cardColumn.name + " to list " + info.targetColumn.name + ".";
      this.displayLogMessage(message);
    }
  }
}