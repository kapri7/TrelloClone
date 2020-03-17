/**
 * Created by IvanSteniakin on 3/18/2020.
 */

import { LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners } from "c/pubsub";

export default class DashboardModalBox extends LightningElement {
  @track openModel;
  @track boardName = "";
  @wire(CurrentPageReference) pageRef;

  connectedCallback() {
    registerListener("showmodalboard", this.openModal, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleBoardNameChange(event) {
    this.boardName = event.target.value;
  }

  openModal() {
      this.openModel = true;
  }

  closeModal() {
    this.openModel = false;
    this.boardName = "";
  }

  saveMethod() {
    if (this.boardName !== "") {
      this.dispatchEvent(new CustomEvent("addboard",{detail: this.boardName}));
      this.closeModal();
    }
  }
}