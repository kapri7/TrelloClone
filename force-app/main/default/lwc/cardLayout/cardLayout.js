/**
 * Created by IvanSteniakin on 2/25/2020.
 */

import { LightningElement, track, wire } from "lwc";
import { fireEvent } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class CardLayout extends LightningElement {

  @wire(CurrentPageReference) pageRef;
  @track cardRows = [];
  cardRowNum = 0;
  handleRowButtonClick() {
    this.cardRows.push(this.cardRowNum);
    this.cardRowNum ++;
  }

  deleteCardRow(event){
    this.cardRows.splice(this.cardRows.indexOf(event.detail), 1);
    fireEvent(this.pageRef, "deleterow", event.detail);
  }
}