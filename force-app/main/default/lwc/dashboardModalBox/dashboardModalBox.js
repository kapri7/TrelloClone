/**
 * Created by IvanSteniakin on 3/18/2020.
 */

import { LightningElement, track, wire,api } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";

export default class DashboardModalBox extends LightningElement {
  @track openModal;
  @track boardName = "";
  @wire(CurrentPageReference) pageRef;
  @api board;
  connectedCallback() {
    registerListener("showmodalboard", this.open, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleBoardNameChange(event) {
    this.boardName = event.target.value;
  }

  open(boardId) {
    if(this.board.id === boardId)
      this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
    this.boardName = "";
  }

  saveMethod() {
    if (this.boardName !== "") {
      const boardInfo = {
        name:this.boardName,
        thisTab: this.board.id
      };
      fireEvent(this.pageRef,"addboard",boardInfo);
      this.closeModal();
    }
  }
}