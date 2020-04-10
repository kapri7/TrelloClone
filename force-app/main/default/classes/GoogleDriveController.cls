/**
 * Created by IvanSteniakin on 4/10/2020.
 */

public with sharing class GoogleDriveController {
    @AuraEnabled
    public static List<items_Google_Drive__x> getGoogleFiles(){
        return [SELECT Name__c,DownloadUrl__c,IsFolder__c FROM items_Google_Drive__x];
    }
}