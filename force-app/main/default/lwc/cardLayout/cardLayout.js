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


export default class CardLayout extends LightningElement {
  @track cardColumns = [];
  currentDragCard;
  currentDropColumn;

  @wire(CurrentPageReference) pageRef;
  @api board;
  connectedCallback() {
    registerListener("addcolumnname", this.insertColumn, this);
    this.fetchData();
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  fetchData() {
    getAllColumns()
      .then(result => {
        for (let i of result) {

          if (i.Dashboard__c === this.board.id) {
            const column = new Column(i.Id, i.Name, i.Dashboard__c);
            this.cardColumns.push(column);
          }
        }
      });
  }

  insertColumnItem(column) {
    insertNewColumn({ cardColumn: column })
      .then(result => {
        const column = new Column(result.Id, result.Name, result.Dashboard__c);
        this.cardColumns.push(column);
        fireEvent(this.pageRef, "addcardcolumnclick", result);
        //console.log(JSON.stringify(result));
        //console.log("result", this.message);
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
        //console.log(JSON.stringify(result));
        //console.log("result", this.message);
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