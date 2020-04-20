/**
 * Created by IvanSteniakin on 4/9/2020.
 */

public with sharing class GoogleFileCardController {
    @AuraEnabled
    public static List<GoogleFileCard__c> addGoogleFileCard(String files, Id cardId, String fileSource) {
        List<GoogleFileCard__c> fileCards = new List<GoogleFileCard__c>();
        List<FileParser> fs = (List<FileParser>) JSON.deserialize(files,List<FileParser>.class);
        for (FileParser file : fs) {

            GoogleFileCard__c fileCard = new GoogleFileCard__c();
            fileCard.Card__c = cardId;
            fileCard.FileId__c = file.id;
            if (fileSource == 'Google') {
                fileCard.FileName__c = file.name;
                fileCard.FileUrl__c = file.url;
                fileCard.Name = 'Google';
            } else if (fileSource == 'Dropbox') {
                    fileCard.FileName__c = file.name;
                    fileCard.FileUrl__c = file.url;
                    fileCard.Name = 'Dropbox';
            } else if (fileSource == 'Storage') {
                fileCard.FileName__c = file.name;
                fileCard.FileUrl__c = file.url;
                fileCard.Name = 'Storage';
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
    public static void deleteGoogleFileCard(String fileId, Id cardId) {//deletes all duplicates too(if available)
        List<GoogleFileCard__c> fileCards = [SELECT Card__c,FileId__c FROM GoogleFileCard__c WHERE FileId__c = :fileId AND Card__c = :cardId];
        delete fileCards;
    }

}