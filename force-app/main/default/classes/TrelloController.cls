/**
 * Created by IvanSteniakin on 3/13/2020.
 */

public with sharing class TrelloController {
    @AuraEnabled(Cacheable=true)
    public static List<List<Object>> getAllData() {
        return null;
    }

    @AuraEnabled
    public static User getCurrentUser(Id userId){
        return [SELECT Name FROM User WHERE Id = :userId];
    }
}