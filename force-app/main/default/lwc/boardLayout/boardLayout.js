/**
 * Created by IvanSteniakin on 2/25/2020.
 */

import { LightningElement, track, wire, api } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import getAllColumns from "@salesforce/apex/CardColumnController.getAllColumns";
import insertNewColumn from "@salesforce/apex/CardColumnController.insertNewColumn";
import deleteColumn from "@salesforce/apex/CardColumnController.deleteColumn";
import { ShowToastEvent } from "lightning/platformShowToastEvent";


class Column {
  constructor(id, name, board) {
    this.id = id;
    this.name = name;
    this.board = board;
  }
}


export default class BoardLayout extends LightningElement {
  @track cardColumns = [];
  currentDragCard;
  currentDropColumn;

  @wire(CurrentPageReference) pageRef;
  @api board;
  @api combinedCards;
  @api googleFileCards;

  @track isMyTasks = 0;
  connectedCallback() {
    registerListener("addcolumnname", this.insertColumn, this);
    registerListener("checkboxtasks", this.showMyTasks, this);
    this.fetchData();
    //console.log(this.googleFiles);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  fetchData() {
    let cardColumnIds = [];
    for (let i of this.combinedCards) {
      if (i.CardColumn__r.Dashboard__c=== this.board.id && !cardColumnIds.includes(i.CardColumn__c)) {
        cardColumnIds.push(i.CardColumn__c);
        this.cardColumns.push(new Column(i.CardColumn__c, i.CardColumn__r.Name, i.CardColumn__r.Dashboard__c));
      }
    }
  }

  showMyTasks(checkBoxInfo){
    if(this.board.id === checkBoxInfo.boardId){
      this.cardColumns.length = 0;
      this.isMyTasks = checkBoxInfo.status;
      this.fetchData();
      fireEvent(this.pageRef, "addonlymycards", checkBoxInfo);
    }
  }

  insertColumnItem(column) {
    insertNewColumn({ cardColumn: column })
      .then(result => {
        const column = new Column(result.Id, result.Name, result.Dashboard__c);
        this.cardColumns.push(column);
        fireEvent(this.pageRef, "addcardcolumnclick", result);
      })

      .catch(error => {
        this.error = error;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
        console.log("error", JSON.stringify(this.error));
      });
  }

  deleteColumnItem(id, itemIndex) {
    deleteColumn({ cardColumnId: id })
      .then(result => {
        alert(itemIndex);
        this.cardColumns.splice(itemIndex, 1);
      })

      .catch(error => {
        this.error = error;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
        console.log("error", JSON.stringify(this.error));
      });
  }




  handleCardColumn() {
    fireEvent(this.pageRef, "showmodalcolumn", this.board);
  }

  insertColumn(column) {
    const newColumn = {
      Name: column.name,
      Dashboard__c: column.dashboard
    };
    if(this.board.id === column.dashboard)
    this.insertColumnItem(newColumn);
  }

  deleteCardColumn(event) {
    const ind = this.cardColumns.findIndex((element, index, array) => {
      if (element.id === event.detail.id) {
        return true;
      }
    });
    this.deleteColumnItem(event.detail.id, ind);
    fireEvent(this.pageRef, "deletecolumn", event.detail);

  }

  handleListItemDrag(evt) {
    this.currentDragCard = evt.detail;
  }

  handleItemDrop(evt) {
    this.currentDropColumn = evt.detail;
    const dragDropInfo = {
      draggedCard: this.currentDragCard,
      targetColumn: this.currentDropColumn
    };
    fireEvent(this.pageRef, "draganddrop", dragDropInfo);
  }
}