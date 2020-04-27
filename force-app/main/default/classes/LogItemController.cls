/**
 * Created by IvanSteniakin on 3/5/2020.
 */

public with sharing class LogItemController {

    @AuraEnabled
    public static LogItem__c insertNewLogItem(LogItem__c logItem) {
        System.debug(JSON.serialize(logItem));
        insert logItem;
        return logItem;
    }
}