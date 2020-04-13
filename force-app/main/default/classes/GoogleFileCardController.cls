/**
 * Created by IvanSteniakin on 4/9/2020.
 */

public with sharing class GoogleFileCardController {
    @AuraEnabled
    public static void addGoogleFileCard(Id fileId, Id cardId, String fileSource) {
        GoogleFileCard__c fileCard = new GoogleFileCard__c();
        fileCard.Card__c = cardId;
        fileCard.FileId__c = fileId;
        if (fileSource == 'Google') {
            items_Google_Drive__x itemsGoogleDrive = [SELECT Name__c,DownloadUrl__c FROM items_Google_Drive__x WHERE Id = :fileId];
            fileCard.FileName__c = itemsGoogleDrive.Name__c;
            fileCard.FileUrl__c = itemsGoogleDrive.DownloadUrl__c;
            fileCard.Name = 'Google';
        } else if (fileSource == 'OneDrive') {
        } else if (fileSource == 'Dropbox'){

        }
            insert fileCard;
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