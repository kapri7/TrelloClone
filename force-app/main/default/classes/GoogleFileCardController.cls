/**
 * Created by IvanSteniakin on 4/9/2020.
 */

public with sharing class GoogleFileCardController {
    @AuraEnabled
    public static List<GoogleFileCard__c> addGoogleFileCard(List<Id> fileIds, Id cardId, String fileSource) {
        List<items_Google_Drive__x> itemsGoogleDrive = [SELECT Name__c,DownloadUrl__c FROM items_Google_Drive__x WHERE Id IN :fileIds];
        List<GoogleFileCard__c> fileCards = new List<GoogleFileCard__c>();

        for (Id fileId : fileIds) {
            GoogleFileCard__c fileCard = new GoogleFileCard__c();
            fileCard.Card__c = cardId;
            fileCard.FileId__c = fileId;
            if (fileSource == 'Google') {
                for (items_Google_Drive__x item : itemsGoogleDrive) {
                    if (item.Id == fileId) {
                        fileCard.FileName__c = item.Name__c;
                        fileCard.FileUrl__c = item.DownloadUrl__c;
                        fileCard.Name = 'Google';
                    }
                }
            } else if (fileSource == 'OneDrive') {

            } else if (fileSource == 'Dropbox') {

            } else if (fileSource == 'Storage') {
                ContentVersion cv = [SELECT Id,Title FROM ContentVersion WHERE ContentDocumentId = :fileId];
                fileCard.FileName__c = cv.Title;
                fileCard.FileUrl__c = '/sfc/servlet.shepherd/document/download/' + (String) fileId;
                fileCard.Name = 'Storage';
                /*ContentVersion cv = [SELECT Id,Title FROM ContentVersion WHERE ContentDocumentId = :fileId];
                ContentDistribution cd = new ContentDistribution();
                cd.Name = 'Test';
                cd.ContentVersionId = cv.Id;
                cd.PreferencesAllowViewInBrowser = true;
                cd.PreferencesLinkLatestVersion = true;
                cd.PreferencesNotifyOnVisit = false;
                cd.PreferencesPasswordRequired = false;
                cd.PreferencesAllowOriginalDownload = true;
                insert cd;
                fileCard.FileName__c = cv.Title;
                fileCard.FileUrl__c = cd.ContentDownloadUrl;
                fileCard.Name = 'Storage';*/
            }
            fileCards.add(fileCard);
        }
        insert fileCards;
        return fileCards;
    }

    @AuraEnabled
    public static List<GoogleFileCard__c> getGoogleFileCards() {
        return [SELECT Card__c,FileId__c,FileName__c,FileUrl__c FROM GoogleFileCard__c];
    }

    @AuraEnabled
    public static void deleteGoogleFileCard(Id fileId, Id cardId) {//deletes all duplicates too(if available)
        List<GoogleFileCard__c> fileCards = [SELECT Card__c,FileId__c FROM GoogleFileCard__c WHERE FileId__c = :fileId AND Card__c = :cardId];
        delete fileCards;
    }
}