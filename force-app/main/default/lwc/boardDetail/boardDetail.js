/**
 * Created by IvanSteniakin on 3/18/2020.
 */

import { api, LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import getUserBoards from "@salesforce/apex/UserBoardController.getUserBoards";
import getCurrentUser from "@salesforce/apex/TrelloController.getCurrentUser";
import deleteUserBoard from "@salesforce/apex/UserBoardController.deleteUserBoard";

class UserBoard {
  constructor(User__c, Name, id) {
    this.user = {
      id: User__c,
      name: Name
    };
    this.boardId = id;
  }
}

export default class BoardDetail extends LightningElement {
  @track userBoards = [];
  @track openModal;
  @wire(CurrentPageReference) pageRef;
  @api board;

  connectedCallback() {
    registerListener("boardinfoclick", this.handleBoardInfoClick, this);

  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleBoardInfoClick(board) {
    if (board.id === this.board.id) {
      this.openModal = true;
      getUserBoards()
        .then(users => {
          for (let user of users) {
            if (board.id === user.Dashboard__c) {
              getCurrentUser({ userId: user.User__c })
                .then(userName => {
                  if (!(this.isContainUsername(userName.Name))) {
                    this.userBoards.push(new UserBoard(user.User__c, userName.Name, board.id));
                  }
                });
            }
          }
        });

    }
  }
  isContainUsername(username){
    let isInclude = false;
    const ind = this.userBoards.findIndex((element, index, array) => {
      if (element.user.name === username) {
        isInclude = true;
        return true;
      }
    });
    return  isInclude;
}
  closeModal() {
    this.openModal = false;
  }

  saveMethod() {
    fireEvent(this.pageRef, "updateboardinfo", this.board);
    this.closeModal();
  }

  handleNameChange(event) {
    this.board.name = event.target.value;
  }


  handleDescriptionChange(event) {
    this.board.description = event.target.value;
  }

  deleteUserFromBoard(event) {
    const ind = this.userBoards.findIndex((element, index, array) => {
      if (element.user.name === event.detail.user.name) {
        return true;
      }
    });

    deleteUserBoard({ userId: event.detail.user.id, dashboardId: event.detail.boardId })
      .then(result =>{
        this.userBoards.splice(ind, 1);
      })
  }
}