/**
 * Created by IvanSteniakin on 4/10/2020.
 */

import { LightningElement, track, wire, api } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import addGoogleFileCard from "@salesforce/apex/GoogleFileCardController.addGoogleFileCard";
import getFilesList from "@salesforce/apex/DropboxController.getFilesList";
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
    this.fileSource = fileType;
    if (fileType === "Google") {
      for (let file of this.googleFiles) {

        if (!file.IsFolder__c) {
          this.files.push(new File(file.Id, file.Name__c, file.DownloadUrl__c));
        }
      }
    } else if (fileType === "Dropbox") {
      getFilesList()
        .then(result => {
          console.log(result);
          for (let dropboxFile of result) {
            this.files.push(new File(dropboxFile.fileId__c, dropboxFile.Name, dropboxFile.fileUrl__c));
          }
        })
      .catch(error => {
        console.log(error);
      })

    }
  }

  handleSelectedFiles() {
    let selectedFiles = [];

      for(let file of this.files){
        for(let id of this.value ){
          if(file.id === id){
            selectedFiles.push(file);
          }

        }
      }

    addGoogleFileCard({ files: JSON.stringify(selectedFiles), cardId: this.cardId, fileSource: this.fileSource})
      .then(result => {
        let newFiles = [];
        for (let fileId of this.value) {
          const ind = this.files.findIndex((element, index, array) => {
            if (element.id === fileId) {
              return true;
            }
          });
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