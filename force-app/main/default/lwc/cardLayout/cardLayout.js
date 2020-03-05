/**
 * Created by IvanSteniakin on 2/25/2020.
 */

import { LightningElement, track, wire } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class CardLayout extends LightningElement {

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
  addColumn(columnName){
    fireEvent(this.pageRef, "addcardcolumnclick", columnName);
    this.cardColumns.push(columnName);
  }

  deleteCardRow(event) {
    this.cardColumns.splice(this.cardColumns.indexOf(event.detail), 1);
    fireEvent(this.pageRef, "deletecolumn", event.detail);
  }

  handleListItemDrag(evt) {
    console.log("Dragged id is: " + evt.detail);
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