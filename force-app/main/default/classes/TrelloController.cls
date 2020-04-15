/**
 * Created by IvanSteniakin on 3/13/2020.
 */

public with sharing class TrelloController {
    @AuraEnabled(Cacheable=true)
    public static Map <String,List<SObject>> getAllData() {
        Map <String,List<SObject>> allData = new Map<String,List<SObject>>();
        List<LogItem__c> logItems = [
                SELECT Date__c,Message__c,Dashboard__c
                FROM LogItem__c
                ORDER BY Date__c
        ];
        allData.put('LogItem',logItems);
        List<GoogleFileCard__c> googleFileCards = [SELECT Card__c,FileId__c,FileName__c,FileUrl__c FROM GoogleFileCard__c];
        allData.put('GoogleFileCard',googleFileCards);
        List<items_Google_Drive__x> itemsGoogleDrives =  [SELECT Name__c,DownloadUrl__c,IsFolder__c FROM items_Google_Drive__x ORDER BY Name__c];
        allData.put('ItemsGoogleDrive',itemsGoogleDrives);
        List<SObject> cards = [
                SELECT Name, Description__c,User__c, CardColumn__c,
                        CardColumn__r.Name, CardColumn__r.Dashboard__c,
                        CardColumn__r.Dashboard__r.Name, CardColumn__r.Dashboard__r.Description__c
                FROM Card__c
                ORDER BY CreatedDate
        ];
        allData.put('CardColumnDashboard',cards);
        return allData;
    }

    @AuraEnabled
    public static User getCurrentUser(Id userId) {
        return [SELECT Name FROM User WHERE Id = :userId];
    }
}