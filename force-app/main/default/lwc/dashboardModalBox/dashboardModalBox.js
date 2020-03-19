/**
 * Created by IvanSteniakin on 3/18/2020.
 */

import { LightningElement, track, wire,api } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";

export default class DashboardModalBox extends LightningElement {
  @track openModel;
  @track boardName = "";
  @wire(CurrentPageReference) pageRef;
  @api board;
  connectedCallback() {
    registerListener("showmodalboard", this.openModal, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleBoardNameChange(event) {
    this.boardName = event.target.value;
  }

  openModal(boardId) {
    if(this.board.id === boardId)
      this.openModel = true;
  }

  closeModal() {
    this.openModel = false;
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