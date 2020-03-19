/**
 * Created by IvanSteniakin on 3/12/2020.
 */

import { LightningElement, track, wire } from "lwc";
import getAllDashboards from "@salesforce/apex/DashboardController.getAllDashboards";
import deleteDashboard from "@salesforce/apex/DashboardController.deleteDashboard";
import { fireEvent } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export class Dashboard {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

export default class BoardList extends LightningElement {
  @track boards = [];
  @wire(CurrentPageReference) pageRef;

  @wire(getAllDashboards)
  getDashboardInform(result) {
    if (result.data) {
      for (let i of result.data) {
        const dashboard = new Dashboard(i.Id, i.Name);
        this.boards.push(dashboard);

      }
    }
  }
  handleNewBoard(event){
    const board = new Dashboard(event.detail.Id, event.detail.Name);
    this.boards.push(board);
  }
  handleDeleteBoard(event){
    deleteDashboard({dashboardId:event.detail})
      .then(result=>{
        const ind = this.boards.findIndex((element, index, array) => {
          if (element.id === event.detail) {
            return true;
          }
        });
        this.boards.splice(ind,1);
      })
  }
}