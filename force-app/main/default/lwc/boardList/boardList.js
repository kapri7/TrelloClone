/**
 * Created by IvanSteniakin on 3/12/2020.
 */

import { LightningElement, track, wire } from "lwc";
import getAllDashboards from "@salesforce/apex/DashboardController.getAllDashboards";
import deleteDashboard from "@salesforce/apex/DashboardController.deleteDashboard";
import updateDashboard from "@salesforce/apex/DashboardController.updateDashboard";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export class Dashboard {
  constructor(id, name, description = "") {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

export default class BoardList extends LightningElement {
  @track boards = [];
  @wire(CurrentPageReference) pageRef;

  connectedCallback() {
    this.getDashboardInform();
    registerListener("updateboardinfo", this.updateBoard, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  updateBoard(newBoard) {
    const boardToUpdate = {
      Name: newBoard.name,
      Description__c: newBoard.description,
      Id: newBoard.id
    };
    updateDashboard({ newDashboard: boardToUpdate })
      .then(result => {
        const ind = this.boards.findIndex((element, index, array) => {
          if (element.id === result.Id) {
            return true;
          }
        });
        this.boards[ind].name = result.Name;
        this.boards[ind].description = result.Description__c;

        this.boards.length = 0;
        this.getDashboardInform();
      });


  }

  getDashboardInform(){
    getAllDashboards()
      .then(result =>{
        for (let i of result) {
          const dashboard = new Dashboard(i.Id, i.Name,i.Description__c);
          this.boards.push(dashboard);
        }
      })
  }

  handleNewBoard(event) {
    const board = new Dashboard(event.detail.Id, event.detail.Name);
    this.boards.push(board);
  }

  handleDeleteBoard(event) {
    deleteDashboard({ dashboardId: event.detail })
      .then(result => {
        const ind = this.boards.findIndex((element, index, array) => {
          if (element.id === event.detail) {
            return true;
          }
        });
        this.boards.splice(ind, 1);
      });
  }
}