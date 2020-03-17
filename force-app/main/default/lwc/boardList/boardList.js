/**
 * Created by IvanSteniakin on 3/12/2020.
 */

import { LightningElement, track, wire } from "lwc";
import getAllDashboards from "@salesforce/apex/DashboardController.getAllDashboards";
import insertNewDashboard from "@salesforce/apex/DashboardController.insertNewDashboard";
import { fireEvent } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

class Dashboard {
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

  handleAddBoardClick() {
    fireEvent(this.pageRef, "showmodalboard", null);
  }

  handleAddBoard(event) {
    const dashboard = {
      Name:event.detail
    };

    insertNewDashboard({dashboard:dashboard})
      .then(result =>{
        const board = new Dashboard(result.Id, result.Name);
        this.boards.push(board);
      })
  }

  handleAddUserClick() {
    alert("Added user!");
  }
}