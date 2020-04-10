/**
 * Created by IvanSteniakin on 3/10/2020.
 */

import { LightningElement, api, track, wire } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import getGoogleFileCards from "@salesforce/apex/GoogleFileCardController.getGoogleFileCards"
import deleteGoogleFileCard from "@salesforce/apex/GoogleFileCardController.deleteGoogleFileCard"

class GoogleFileCard {
  constructor(fileId, name, url,cardId) {
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

  @track googleFiles = [];
  @track oneDriveFiles = [];
  @track dropboxFiles = [];

  connectedCallback() {
    registerListener("cardinfoclick", this.handleCardInfoClick, this);
    registerListener("newfileadded", this.handleAddNewFile, this);
    this.getGoogleFiles();
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }


  getGoogleFiles(){
    getGoogleFileCards()
      .then(googleFileCards => {
        for(let file of googleFileCards){

          if(file.Card__c === this.card.id) {
            this.isFiles = true;
            this.googleFiles.push(new GoogleFileCard(file.items_Google_Drive__c, file.FileName__c, file.FileUrl__c,file.Card__c));
          }
        }
      })
  }

  deleteFileFromBoard(event){
    const ind = this.googleFiles.findIndex((element, index, array) => {
      if (element.file.id === event.detail.file.id) {
        return true;
      }
    });

    deleteGoogleFileCard({ googleFileId: event.detail.file.id, cardId: event.detail.cardId })
      .then(result =>{
        this.googleFiles.splice(ind, 1);
        if(this.googleFiles.length === 0){
          this.isFiles = false;
        }
      })
  }
  handleSearchGoogleFile(){
    fireEvent(this.pageRef,"showmodalgooglefile",this.card.id)
  }
  handleAddNewFile(cardFile){
    this.googleFiles.push(new GoogleFileCard(cardFile.file.id, cardFile.file.name, cardFile.file.url,cardFile.cardId));
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