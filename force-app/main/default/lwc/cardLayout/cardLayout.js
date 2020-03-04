/**
 * Created by IvanSteniakin on 2/25/2020.
 */

import { LightningElement, track, wire } from "lwc";
import { fireEvent } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class CardLayout extends LightningElement {

  @wire(CurrentPageReference) pageRef;
  @track cardColumns = [];
  cardColumnNum = 0;
  currentDragCard;
  currentDropColumn;

  addCardColumnClick() {

    fireEvent(this.pageRef, "addcardcolumnclick", this.cardColumnNum);
    this.cardColumns.push(this.cardColumnNum);
    this.cardColumnNum++;
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