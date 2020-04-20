/**
 * Created by IvanSteniakin on 4/17/2020.
 */

import { LightningElement, api, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import addGoogleFileCard from "@salesforce/apex/GoogleFileCardController.addGoogleFileCard";

class File {
  constructor(id, name, url) {
    this.name = name;
    this.url = url;
    this.id = id;
  }
}

export default class StorageFileModal extends LightningElement {
  @wire(CurrentPageReference) pageRef;
  @track myRecordId;
  @track openModal;


  connectedCallback() {
    registerListener("showmodalstoragefile", this.open, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  get acceptedFormats() {
    return [".pdf", ".png", ".doc", ".docx"];
  }

  handleUploadFinished(event) {
    const uploadedFiles = event.detail.files;
    console.log(uploadedFiles);

    let files = [];
    for (let file of uploadedFiles) {
      files.push(new File(file.documentId, file.name, "/sfc/servlet.shepherd/document/download/" + file.documentId));
    }
    console.log(files);
    addGoogleFileCard({ files: JSON.stringify(files), cardId: this.myRecordId, fileSource: "Storage" })
      .then(result => {
        let newFiles = [];
        for (let fileId of uploadedFiles) {
          newFiles.push(new File(fileId.documentId, fileId.name, "/sfc/servlet.shepherd/document/download/" + fileId.documentId));
        }
        const newFileCards = {
          newFiles: newFiles,
          cardId: this.myRecordId
        };
        this.closeModal();
        fireEvent(this.pageRef, "newfilesadded", newFileCards);
      })
      .catch(error => {
        console.log(error);
      });
  }

  open(cardId) {
    this.openModal = true;
    this.myRecordId = cardId;
  }

  closeModal() {
    this.openModal = false;
  }

  saveMethod() {
    this.openModal = false;
  }
}