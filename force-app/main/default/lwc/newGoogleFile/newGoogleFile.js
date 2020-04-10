/**
 * Created by IvanSteniakin on 4/10/2020.
 */

import { LightningElement, track, wire, api } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import getGoogleFiles from "@salesforce/apex/GoogleDriveController.getGoogleFiles";
import addGoogleFileCard from "@salesforce/apex/GoogleFileCardController.addGoogleFileCard";
import { CurrentPageReference } from "lightning/navigation";

class File {
  constructor(id, name, url) {
    this.name = name;
    this.url = url;
    this.id = id;
  }
}

export default class NewGoogleFile extends LightningElement {
  @track openModal;
  @track files = [];
  @api cardId;
  @wire(CurrentPageReference) pageRef;

  connectedCallback() {
    registerListener("showmodalgooglefile", this.open, this);

  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  getFiles() {
    getGoogleFiles()
      .then(result => {
        for (let file of result) {
          if (!file.IsFolder__c) {
            this.files.push(new File(file.Id, file.Name__c, file.DownloadUrl__c));
            //  console.log(file.Name__c);
          }
        }
      });
  }

  handleSelectFile(event) {
    addGoogleFileCard({googleFileId:event.detail.id,cardId:this.cardId})
      .then(result =>{
        this.closeModal();
        const newFileCard = {
          file: event.detail,
          cardId:this.cardId
        }
        fireEvent(this.pageRef,"newfileadded",newFileCard);
      })
  }

  open(cardId) {
    if (this.cardId === cardId) {
      this.openModal = true;
      this.getFiles();
    }

  }

  closeModal() {
    this.openModal = false;
  }
}