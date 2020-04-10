/**
 * Created by IvanSteniakin on 4/9/2020.
 */

public with sharing class GoogleFileCardController {
    @AuraEnabled
    public static void addGoogleFileCard(Id googleFileId,Id cardId) {
        GoogleFileCard__c googleFileCard = new GoogleFileCard__c();
        googleFileCard.Card__c = cardId;
        googleFileCard.items_Google_Drive__c = googleFileId;
        items_Google_Drive__x itemsGoogleDrive = [SELECT Name__c,DownloadUrl__c FROM items_Google_Drive__x WHERE Id =:googleFileId];
        googleFileCard.FileName__c = itemsGoogleDrive.Name__c;
        googleFileCard.FileUrl__c = itemsGoogleDrive.DownloadUrl__c;
        googleFileCard.Name = 'default';
        insert googleFileCard;
    }

    @AuraEnabled
    public static List<GoogleFileCard__c> getGoogleFileCards(){
        return [SELECT Card__c,items_Google_Drive__c,FileName__c,FileUrl__c FROM GoogleFileCard__c];
    }
    @AuraEnabled
    public static void deleteGoogleFileCard(Id googleFileId,Id cardId){//deletes all duplicates too(if available)
        List<GoogleFileCard__c> googleFileCards = [SELECT Card__c,items_Google_Drive__c FROM GoogleFileCard__c WHERE items_Google_Drive__c =: googleFileId AND Card__c =: cardId];
        delete googleFileCards;
    }
}