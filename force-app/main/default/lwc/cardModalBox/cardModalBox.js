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
  cardColumnName;
  connectedCallback() {
    registerListener("showmodalcard", this.openModal, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleCardNameChange(event){
    this.cardName = event.target.value;
  }

  openModal(cardColumnName) {
    this.openModel = true;
    this.cardColumnName = cardColumnName;
  }

  closeModal() {
    this.openModel = false;
  }

  saveMethod() {
    if (this.cardName !== "") {
      const newCardInfo = {
        cardColumn: this.cardColumnName,
        cardName: this.cardName
      };
      fireEvent(this.pageRef, "addcardname", newCardInfo);
      this.cardName = "";
      this.closeModal();
    }
  }
}