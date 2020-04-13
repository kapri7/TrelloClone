/**
 * Created by IvanSteniakin on 4/10/2020.
 */

import { LightningElement, track, wire, api } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
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
  @api googleFiles;
  @api filesOneDrive;
  @api dropboxFiles;
  cardId;
  fileSource;
  @wire(CurrentPageReference) pageRef;

  connectedCallback() {
    registerListener("showmodalgooglefile", this.open, this);

  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  getFiles(fileType) {
    let files;
    this.fileSource = fileType;
    if (fileType === "Google") {
      files = this.googleFiles;
    } else if (fileType === "OneDrive") {
      files = this.filesOneDrive;
    } else if (fileType === "Dropbox") {
      files = this.dropboxFiles;
    }
    for (let file of files) {

      if (!file.IsFolder__c) {
        this.files.push(new File(file.Id, file.Name__c, file.DownloadUrl__c));
      }
    }
  }

  handleSelectFile(event) {
    addGoogleFileCard({ fileId: event.detail.id, cardId: this.cardId, fileSource: this.fileSource })
      .then(result => {
        this.closeModal();
        const newFileCard = {
          file: event.detail,
          cardId: this.cardId
        };
        fireEvent(this.pageRef, "newfileadded", newFileCard);
      });
  }

  open(filesInfo) {
    this.cardId = filesInfo.cardId;
    this.openModal = true;
    this.getFiles(filesInfo.fileListType);
  }

  closeModal() {
    this.files.length = 0;
    this.openModal = false;
  }
}