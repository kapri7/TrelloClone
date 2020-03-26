/**
 * Created by IvanSteniakin on 3/23/2020.
 */

import { api, LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import addUserToBoard from "@salesforce/apex/UserBoardController.addUserToBoard";

export default class UsersOnBoard extends LightningElement {
  @track openModal;
  @wire(CurrentPageReference) pageRef;
  @api board;
  @track user;

  connectedCallback() {
    registerListener("showmodaluserboard", this.open, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }


  open(boardId) {
    if (this.board.id === boardId)
      this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
  }

  handleUserChange(event) {
    this.user = event.target.value;
  }

  saveMethod() {
    if (this.user !== "") {
      this.closeModal();
      addUserToBoard({dashboardId:this.board.id,userID:this.user})
    }
  }
}