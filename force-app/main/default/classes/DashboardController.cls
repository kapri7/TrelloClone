/**
 * Created by IvanSteniakin on 3/5/2020.
 */

public with sharing class DashboardController {

    @AuraEnabled
    public static Dashboard__c insertNewDashboard(Dashboard__c dashboard) {
        System.debug(JSON.serialize(dashboard));
        insert dashboard;
        return dashboard;
    }

    @AuraEnabled
    public static void deleteDashboard(Id dashboardId) {
        System.debug(JSON.serialize(dashboardId));
        Dashboard__c dashboard = [SELECT Id FROM Dashboard__c WHERE Id = :dashboardId];
        delete dashboard;
    }

    @AuraEnabled
    public static Dashboard__c updateDashboard(Dashboard__c newDashboard) {
        System.debug(JSON.serialize(newDashboard));
        Dashboard__c dashboard = [SELECT Id,Name,Description__c FROM Dashboard__c WHERE Id = :newDashboard.Id];
        dashboard.Name = newDashboard.Name;
        dashboard.Description__c = newDashboard.Description__c;
        update dashboard;
        return dashboard;
    }
}