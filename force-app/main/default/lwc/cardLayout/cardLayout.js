/**
 * Created by IvanSteniakin on 2/25/2020.
 */

import { LightningElement, track, wire } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import getAllColumns from "@salesforce/apex/CardColumnController.getAllColumns";
import insertNewColumn from "@salesforce/apex/CardColumnController.insertNewColumn";
import deleteColumn from "@salesforce/apex/CardColumnController.deleteColumn";
import LOG_OBJECT from "@salesforce/schema/CardColumn__c";
import NAME_FIELD from "@salesforce/schema/CardColumn__c.Name";
import ID_FIELD from "@salesforce/schema/CardColumn__c.Id";
import DASHBOARD_FIELD from "@salesforce/schema/CardColumn__c.Dashboard__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";


class Column {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}


export default class CardLayout extends LightningElement {
  @track name = NAME_FIELD;
  @track id = ID_FIELD;
  @track dashboard = DASHBOARD_FIELD;

  rec = {
    Name: this.name
    //Id: this.id,
    //Dashboard__c: this.dashboard
  };

  @wire(getAllColumns)
  getColumnInform(result) {
    if (result.data) {
      for (let i of result.data) {
        let column = new Column(i.Id, i.Name);
        this.cardColumns.push(column);
      }
    }
  }

  insertColumnItem() {
    insertNewColumn({ cardColumn: this.rec })
      .then(result => {
        let column = new Column(result.Id, this.rec.Name);
        this.cardColumns.push(column);

        console.log(JSON.stringify(result));
        console.log("result", this.message);
      })

      .catch(error => {
        this.message = undefined;
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
        this.cardColumns.splice(itemIndex, 1);
        console.log(JSON.stringify(result));
        console.log("result", this.message);
      })

      .catch(error => {
        this.message = undefined;
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

  @wire(CurrentPageReference) pageRef;

  connectedCallback() {
    registerListener("addcolumnname", this.addColumn, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  @track cardColumns = [];
  currentDragCard;
  currentDropColumn;

  cardColumnClick() {
    fireEvent(this.pageRef, "showmodalcolumn",null);
  }

  addColumn(columnName) {
    fireEvent(this.pageRef, "addcardcolumnclick", columnName);
    this.rec.Name = columnName;
    this.insertColumnItem();
  }

  deleteCardColumn(event) {
    let ind = this.cardColumns.findIndex((element, index, array) => {
      if (element.id === event.detail.id) {
        return true;
      }
    });
    this.deleteColumnItem(event.detail.id, ind);
    fireEvent(this.pageRef, "deletecolumn", event.detail.name);

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