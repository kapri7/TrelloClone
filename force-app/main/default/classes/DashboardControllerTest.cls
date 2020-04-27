/**
 * Created by IvanSteniakin on 4/27/2020.
 */

@IsTest
private class DashboardControllerTest {
    static final Integer recordsNumber = 5;

    @TestSetup
    static void setup() {
        List<Dashboard__c> dashboards = new List<Dashboard__c>();
        for (Integer i = 0; i < recordsNumber; i++) {
            dashboards.add(new Dashboard__c(Name = 'TestDashboard' + i.format()));
        }
        insert dashboards;
    }

    @IsTest
    static void testInsertNewDashboard() {
        Dashboard__c dashboard = new Dashboard__c();
        dashboard.Name = 'Test';


        Test.startTest();
        Dashboard__c result = DashboardController.insertNewDashboard(dashboard);
        Test.stopTest();

        System.assert(result.Name == 'Test');
        System.assert(result.Id != null);
    }

    @IsTest
    static void testUpdateDashboard() {
        Dashboard__c newDashboard = [SELECT Id,Description__c,Name FROM Dashboard__c LIMIT 1];
        newDashboard.Name = 'Updated test';
        Dashboard__c result = DashboardController.updateDashboard(newDashboard);

        System.assert(result.Name == newDashboard.Name);
    }

    @IsTest
    static void testDeleteDashboard() {
        Dashboard__c dashboard = [SELECT Id FROM Dashboard__c LIMIT 1];
        DashboardController.deleteDashboard(dashboard.Id);
        List<Dashboard__c> dashboards = [SELECT Id FROM Dashboard__c WHERE Id = :dashboard.Id];
        System.assert(dashboards.size() == 0);
    }
}