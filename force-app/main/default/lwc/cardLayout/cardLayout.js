/**
 * Created by IvanSteniakin on 2/25/2020.
 */

import { LightningElement, track, wire } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import getAllColumns from "@salesforce/apex/CardColumnController.getAllColumns";
import insertNewColumn from "@salesforce/apex/CardColumnController.insertNewColumn";
import LOG_OBJECT from "@salesforce/schema/CardColumn__c";
import NAME_FIELD from "@salesforce/schema/CardColumn__c.Name";
import ID_FIELD from "@salesforce/schema/CardColumn__c.Id";
import DASHBOARD_FIELD from "@salesforce/schema/CardColumn__c.Dashboard__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

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
        this.id = i.Id;
        this.cardColumns.push(i.Name);
      }
    }
  }

  insertColumnItem() {
    insertNewColumn({ cardColumn: this.rec })
      .then(result => {
        this.message = result;
        this.error = undefined;
        if (this.message !== undefined) {
          this.rec.Name = "";
          //this.rec.Dashboard__c = "";
          //this.rec.Id = "";

          this.id = result.Id;
          alert(this.id);
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success",
              message: "Column created",
              variant: "success"
            })
          );
        }

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
    fireEvent(this.pageRef, "showmodalcolumn", this.cardColumnNum);


  }

  addColumn(columnName) {
    fireEvent(this.pageRef, "addcardcolumnclick", columnName);
    this.rec.Name = columnName;
    this.insertColumnItem();
    this.cardColumns.push(columnName);//todo: pass here custom object column


  }

  deleteCardColumn(event) {
    this.cardColumns.splice(this.cardColumns.indexOf(event.detail), 1);
    fireEvent(this.pageRef, "deletecolumn", event.detail);

  }

  handleListItemDrag(evt) {
    //console.log("Dragged id is: " + evt.detail);
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