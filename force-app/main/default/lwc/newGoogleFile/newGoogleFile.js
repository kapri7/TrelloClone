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


  @track value = [];

  handleChange(e) {
    this.value = e.detail.value;
    console.log(this.value);
  }

  connectedCallback() {
    registerListener("showmodalgooglefile", this.open, this);

  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  get options() {
    let checkboxes = [];
    for (let file of this.files) {
      const string = {
        label: file.name, value: file.id
      };
      checkboxes.push(string);
    }
    return checkboxes;
  }

  getFiles(fileType) {
    let files;//local variable
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

  handleSelectedFiles() {
    addGoogleFileCard({ fileIds: this.value, cardId: this.cardId, fileSource: this.fileSource })
      .then(result => {
        let newFiles = [];
        for (let fileId of this.value) {
          const ind = this.files.findIndex((element, index, array) => {
            if (element.id === fileId) {
              return true;
            }
          });
          console.log(this.files[0]);
          newFiles.push(this.files[ind]);
        }
        const newFileCards = {
          newFiles: newFiles,
          cardId: this.cardId
        };
        fireEvent(this.pageRef, "newfilesadded", newFileCards);
        this.value.length = 0;
        this.closeModal();
      })
      .catch(error => {
        console.log(error);
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