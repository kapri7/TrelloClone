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

  addCardColumnClick() {

    fireEvent(this.pageRef, "addcardcolumnclick", this.cardColumnNum);
    this.cardColumns.push(this.cardColumnNum);
    this.cardColumnNum ++;
  }

  deleteCardRow(event){
    this.cardColumns.splice(this.cardColumns.indexOf(event.detail), 1);
    fireEvent(this.pageRef, "deletecolumn", event.detail);
  }
}