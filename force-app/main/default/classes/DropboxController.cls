/**
 * Created by IvanSteniakin on 4/20/2020.
 */
public with sharing class DropboxController {

    static public List<DropboxFile> dropboxFiles = new List<DropboxFile>();
    static final String TOKEN = DropboxToken__c.getInstance().Token__c;
    static final String LIST_FILES_URL = 'https://api.dropboxapi.com/2/files/list_folder';
    static final String SHARED_LINKS_URL = 'https://api.dropboxapi.com/2/sharing/list_shared_links';
    static final String CREATE_SHARE_LINK_URL = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';

    public class DropboxFile {
        @AuraEnabled
        public String id;
        @AuraEnabled
        public String url;
        @AuraEnabled
        public String name;

        DropboxFile(String id, String name, String url) {
            this.id = id;
            this.url = url;
            this.name = name;
        }
    }
    @AuraEnabled
    public static List<DropboxFile> getFilesList() {
        HttpRequest requestItems = new HttpRequest();
        requestItems.setEndpoint(LIST_FILES_URL);
        requestItems.setMethod('POST');
        requestItems.setHeader('Authorization', 'Bearer ' + TOKEN);
        requestItems.setHeader('Content-Type', 'application/json');

        retrieveAllFiles('', requestItems);
        return dropboxFiles;
    }

    private static void retrieveAllFiles(String subPath, HttpRequest requestItems) {
        requestItems.setBody('{\"path\":' + '\"' + subPath + '\"' + '}');

        Http http = new Http();
        HttpResponse items = http.send(requestItems);

        JSON2FilesList json2Apex = JSON2FilesList.parse(items.getBody());
        for (JSON2FilesList.Entries entry : json2Apex.entries) {
            if (entry.x_tag == 'folder') {
                retrieveAllFiles(entry.path_display, requestItems);
            } else {
                retrieveFile(entry);
            }
        }
    }

    private static void retrieveFile(JSON2FilesList.Entries entry) {
        HttpRequest requestFileUrl = new HttpRequest();
        requestFileUrl.setEndpoint(SHARED_LINKS_URL);
        requestFileUrl.setMethod('POST');
        requestFileUrl.setHeader('Authorization', 'Bearer ' + TOKEN);
        requestFileUrl.setHeader('Content-Type', 'application/json');
        requestFileUrl.setBody('{\"path\":' + '\"' + entry.path_display + '\",' + '\"direct_only\": true}');

        Http httpUrl = new Http();
        HttpResponse fileUrl = httpUrl.send(requestFileUrl);

        if (JSON2Url.parse(fileUrl.getBody()).links.size() != 0) {
            dropboxFiles.add(new DropboxFile(entry.id, entry.name, JSON2Url.parse(fileUrl.getBody()).links[0].url));
        } else {
            createUrlAndRetrieveFile(entry);
        }
    }

    private static void createUrlAndRetrieveFile(JSON2FilesList.Entries entry) {
        HttpRequest requestGenerateUrl = new HttpRequest();
        requestGenerateUrl.setEndpoint(CREATE_SHARE_LINK_URL);
        requestGenerateUrl.setMethod('POST');
        requestGenerateUrl.setHeader('Authorization', 'Bearer ' + TOKEN);
        requestGenerateUrl.setHeader('Content-Type', 'application/json');
        requestGenerateUrl.setBody('{\"path\":' + '\"' + entry.path_display + '\",' + '\"settings\": {\"requested_visibility\": \"public\"}');

        Http httpNewUrl = new Http();
        HttpResponse fileCreatedUrl = httpNewUrl.send(requestGenerateUrl);
        dropboxFiles.add(new DropboxFile(entry.id, entry.name, JSON2NewUrl.parse(fileCreatedUrl.getBody()).url));
    }
}