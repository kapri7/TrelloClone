/**
 * Created by IvanSteniakin on 3/5/2020.
 */

import { LightningElement, track, wire, api } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";

export default class CardModalBox extends LightningElement {
  @track openModal;
  @track cardName = "";
  @wire(CurrentPageReference) pageRef;
  cardColumn;
  @api board;
  @api column;
  connectedCallback() {
    registerListener("showmodalcard", this.open, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleCardNameChange(event) {
    this.cardName = event.target.value;
  }

  open(info) {
    if (info.board.id === this.board.id && info.cardColumn.id === this.column.id) {
      this.openModal = true;
      this.cardColumn = info.cardColumn;
    }
  }

  closeModal() {
    this.openModal = false;
    this.cardName = "";
  }

  saveMethod() {
    if (this.cardName !== "") {
      const newCardInfo = {
        cardColumn: this.cardColumn,
        cardName: this.cardName
      };
      fireEvent(this.pageRef, "addcardname", newCardInfo);
     // this.dispatchEvent(new Event())
      this.cardName = "";
      this.closeModal();
    }
  }
}