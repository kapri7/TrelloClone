/**
 * Created by IvanSteniakin on 3/5/2020.
 */

public with sharing class DashboardController {
    @AuraEnabled(Cacheable=true)
    public static Dashboard__c[] getAllDashboards() {
        return [
                SELECT Id, Name
                FROM Dashboard__c
        ];
    }

    @AuraEnabled
    public static Dashboard__c insertNewDashboard(Dashboard__c dashboard) {
        System.debug(JSON.serialize(dashboard));
        insert dashboard;
        return dashboard;
    }
}