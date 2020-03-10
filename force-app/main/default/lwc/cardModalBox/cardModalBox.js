/**
 * Created by IvanSteniakin on 3/5/2020.
 */

import { LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";

export default class CardModalBox extends LightningElement {
  @track openModel;
  @track cardName = "";
  @wire(CurrentPageReference) pageRef;
  cardColumn;
  connectedCallback() {
    registerListener("showmodalcard", this.openModal, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleCardNameChange(event){
    this.cardName = event.target.value;
  }

  openModal(cardColumn) {
    this.openModel = true;
    this.cardColumn = cardColumn;
  }

  closeModal() {
    this.openModel = false;
  }

  saveMethod() {
    if (this.cardName !== "") {
      const newCardInfo = {
        cardColumn: this.cardColumn,
        cardName: this.cardName
      };
      fireEvent(this.pageRef, "addcardname", newCardInfo);
      this.cardName = "";
      this.closeModal();
    }
  }
}