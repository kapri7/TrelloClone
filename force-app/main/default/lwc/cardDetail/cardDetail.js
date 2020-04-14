/**
 * Created by IvanSteniakin on 3/10/2020.
 */

import { LightningElement, api, track, wire } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import deleteGoogleFileCard from "@salesforce/apex/GoogleFileCardController.deleteGoogleFileCard";

class GoogleFileCard {
  constructor(fileId, name, url, cardId) {
    this.file = {
      id: fileId,
      name: name,
      url: url
    };
    this.cardId = cardId;
  }
}

export default class CardDetail extends LightningElement {
  @api card;
  @track openModal;
  @track isFiles = false;
  @wire(CurrentPageReference) pageRef;
  previousColumn;
  @api board;

  @api googleFileCards;
  @track googleFiles = [];
  @track oneDriveFiles = [];
  @track dropboxFiles = [];


  connectedCallback() {
    registerListener("cardinfoclick", this.handleCardInfoClick, this);
    registerListener("newfilesadded", this.handleAddNewFiles, this);
    this.getGoogleCardFiles();
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  getGoogleCardFiles() {
    for (let file of this.googleFileCards) {

      if (file.Card__c === this.card.id) {
        this.isFiles = true;
        this.googleFiles.push(new GoogleFileCard(file.FileId__c, file.FileName__c, file.FileUrl__c, file.Card__c));
      }
    }
  }

  deleteFileFromBoard(event) {
    const ind = this.googleFiles.findIndex((element, index, array) => {
      if (element.file.id === event.detail.file.id) {
        return true;
      }
    });

    deleteGoogleFileCard({ fileId: event.detail.file.id, cardId: event.detail.cardId })
      .then(result => {
        this.googleFiles.splice(ind, 1);
        if (this.googleFiles.length === 0) {
          this.isFiles = false;
        }
      });
  }

  handleSearchGoogleFile() {
    const filesInfo = {
      fileListType: "Google",
      cardId: this.card.id
    };
    fireEvent(this.pageRef, "showmodalgooglefile", filesInfo);
  }

  handleSearchOneDriveFile() {
    const filesInfo = {
      fileListType: "OneDrive",
      cardId: this.card.id
    };
    fireEvent(this.pageRef, "showmodalgooglefile", filesInfo);
  }

  handleSearchDropboxFile() {
    const filesInfo = {
      fileListType: "Dropbox",
      cardId: this.card.id
    };
    fireEvent(this.pageRef, "showmodalgooglefile", filesInfo);
  }

  handleAddNewFiles(cardFiles) {

    if (cardFiles.cardId === this.card.id) {
      for (let cardFile of cardFiles.newFiles) {
        console.log(cardFile);
        this.isFiles = true;
        this.googleFiles.push(new GoogleFileCard(cardFile.id, cardFile.name, cardFile.url, cardFiles.cardId));
      }
    }
  }

  handleCardInfoClick(cardInfo) {
    if (cardInfo.cardColumn.board === this.board.id && cardInfo.card.id === this.card.id) {
      this.openModal = true;
      this.card = cardInfo.card;
      this.previousColumn = cardInfo.cardColumn;
    }
  }

  closeModal() {
    this.openModal = false;
  }

  saveMethod() {
    const updatedCard = {
      newCard: this.card,
      oldColumn: this.previousColumn
    };

    fireEvent(this.pageRef, "updatecardinfo", updatedCard);
    this.openModal = false;
  }

  handleNameChange(event) {
    this.card.name = event.target.value;
  }

  handleCardColumnChange(event) {
    this.card.columnId = event.target.value;
  }

  handleDescriptionChange(event) {
    this.card.description = event.target.value;
  }

  handleUserChange(event) {
    this.card.user = event.target.value;
  }
}