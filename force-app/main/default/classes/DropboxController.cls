/**
 * Created by IvanSteniakin on 4/20/2020.
 */
public with sharing class DropboxController {

    static public List<DropboxFile> dropboxFiles = new List<DropboxFile>();


    public class DropboxFile{
        @AuraEnabled
        public String id;
        @AuraEnabled
        public String url;
        @AuraEnabled
        public String name;
        DropboxFile(String id,String url, String name){
            this.id = id;
            this.url = url;
            this.name = name;
        }
    }
    @AuraEnabled
    public static List<DropboxFile> getFilesList() {//todo should get the token as argument
        String subPath = '';
        String url = 'https://api.dropboxapi.com/2/files/list_folder';
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setMethod('POST');
        request.setHeader('Authorization', 'Bearer ' + 'OpmgQ2ABbIAAAAAAAAAASb0ZHaXbBbgBho61Dkj_zXAIrbzfMGNLGcBjgodwie5h');
        request.setHeader('Content-Type', 'application/json');

        retrieve('', request);
        return dropboxFiles;
    }

    public static void retrieve(String subPath, HttpRequest request) {

        request.setBody('{\"path\":' + '\"' + subPath + '\"' + '}');
        Http http = new Http();
        HttpResponse res = http.send(request);

        JSON2FilesList json2Apex = JSON2FilesList.parse(res.getBody());
        for (JSON2FilesList.Entries entry : json2Apex.entries) {
            if (entry.x_tag == 'folder') {
                retrieve(entry.path_display, request);
            } else {
                String url = 'https://api.dropboxapi.com/2/sharing/list_shared_links';
                HttpRequest requestUrl = new HttpRequest();
                requestUrl.setEndpoint(url);
                requestUrl.setMethod('POST');
                requestUrl.setHeader('Authorization', 'Bearer ' + 'OpmgQ2ABbIAAAAAAAAAASb0ZHaXbBbgBho61Dkj_zXAIrbzfMGNLGcBjgodwie5h');
                requestUrl.setHeader('Content-Type', 'application/json');
                requestUrl.setBody('{\"path\":' + '\"' + entry.path_display + '\",' + '\"direct_only\": true}');

                Http httpUrl = new Http();
                HttpResponse fileUrl = httpUrl.send(requestUrl);

                if (JSON2Url.parse(fileUrl.getBody()).links.size() != 0) {
                    dropboxFiles.add(new DropboxFile(entry.id, entry.name, JSON2Url.parse(fileUrl.getBody()).links[0].url));
                } else {
                    String urlToCreate = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';
                    HttpRequest requestNewUrl = new HttpRequest();
                    requestNewUrl.setEndpoint(urlToCreate);
                    requestNewUrl.setMethod('POST');
                    requestNewUrl.setHeader('Authorization', 'Bearer ' + 'OpmgQ2ABbIAAAAAAAAAASb0ZHaXbBbgBho61Dkj_zXAIrbzfMGNLGcBjgodwie5h');
                    requestNewUrl.setHeader('Content-Type', 'application/json');
                    requestNewUrl.setBody('{\"path\":' + '\"' + entry.path_display + '\",' + '\"settings\": {\"requested_visibility\": \"public\"}');

                    Http httpNewUrl = new Http();
                    HttpResponse fileNewUrl = httpNewUrl.send(requestNewUrl);
                    dropboxFiles.add(new DropboxFile(entry.id, entry.name, JSON2NewUrl.parse(fileNewUrl.getBody()).url));
                }
            }
        }
    }
}