/**
 * Created by IvanSteniakin on 3/13/2020.
 */

public with sharing class TrelloController {
    @AuraEnabled(Cacheable=true)
    public static List<Object> getAllData() {
        return [
                SELECT Name, Description__c,User__c, CardColumn__c,
                        CardColumn__r.Name, CardColumn__r.Dashboard__c,
                        CardColumn__r.Dashboard__r.Name, CardColumn__r.Dashboard__r.Description__c
                FROM Card__c
                ORDER BY CreatedDate
        ];
    }

    @AuraEnabled
    public static User getCurrentUser(Id userId) {
        return [SELECT Name FROM User WHERE Id = :userId];
    }
}