/**
 * Created by IvanSteniakin on 4/27/2020.
 */

@IsTest
private class DropboxControllerTest {

    @IsTest
    static void testGetFilesList() {
        String listFiles =  '{"entries": [' +
                '{".tag": "file", "name": "Get Started with Dropbox.pdf", "path_lower": "/get started with dropbox.pdf", ' +
                '"path_display": "/Get Started with Dropbox.pdf", "id": "id:75lEn1DcpEAAAAAAAAAABg", ' +
                '"client_modified": "2020-04-07T10:27:46Z", "server_modified": "2020-04-07T10:27:46Z", ' +
                '"rev": "015a2b0d5b1564f00000001ba797340", "size": 1102331, "is_downloadable": true, ' +
                '"content_hash": "f7ad488deb7d81790340ecd676fe6e47f0a6064fb99b982685b752d58611c1cb"}, ' +
                '{".tag": "file", "name": "Untitled.docx", "path_lower": "/untitled.docx", ' +
                '"path_display": "/Untitled.docx", "id": "id:75lEn1DcpEAAAAAAAAAADQ", ' +
                '"client_modified": "2020-04-20T20:35:57Z", "server_modified": "2020-04-20T20:35:58Z", ' +
                '"rev": "015a3bed8af03de00000001ba797340", "size": 11602, "is_downloadable": true, ' +
                '"content_hash": "d6b1322e61d6c2bf0f6a17e2d61518cb5922608df768a1fcb8064ec32fc876b7"}], ' +
                '"cursor": "AAFhSqqxbGrgjjjq7qJ0zHDKPozBpAHD4dCRePYnhgGHkA_jf5P1WLuXViZuOi_H2Gg2Y6-buWqRb5JeoRfD4ymB5dSG63czMec0uCXwytDJCohLM-SWr1RTGveCFNHXLBSFm5VZOKlkRJiqGWDGBAez16AMPNqTrQci9VrNcAG6otXVKJ6xhIJ9vLKz-22zXEA", ' +
                '"has_more": false}';

        String sharedLink = '{"links": [{".tag": "file", "url": "https://www.dropbox.com/scl/fi/j9qsvt0q6gm7gd4052rpc/Untitled.docx?dl=0&rlkey=w63q0k9ccq3zljwxeclb818xe", ' +
                '"id": "id:75lEn1DcpEAAAAAAAAAADQ", "name": "Untitled.docx", "path_lower": "/untitled.docx", ' +
                '"link_permissions": {"requested_visibility": {".tag": "team_only"}, "can_revoke": true, ' +
                '"effective_audience": {".tag": "public"}, "link_access_level": {".tag": "editor"}, ' +
                '"visibility_policies": [{"policy": {".tag": "team_only"}, "resolved_policy": {".tag": "shared_folder_only"}, ' +
                '"allowed": false}], "can_set_expiry": false, "can_remove_expiry": true, "allow_download": true, ' +
                '"can_allow_download": true, "can_disallow_download": false, "allow_comments": false, ' +
                '"team_restricts_comments": false, "audience_options": [{"audience": {".tag": "team"}, "allowed": false}, ' +
                '{"audience": {".tag": "public"}, "allowed": true}], "can_set_password": false, "can_remove_password": true, ' +
                '"require_password": false, "can_use_extended_sharing_controls": false}, "preview_type": "doc", ' +
                '"client_modified": "2020-04-20T20:35:57Z", "server_modified": "2020-04-20T20:35:58Z", ' +
                '"rev": "015a3bed8af03de00000001ba797340", "size": 11602}], "has_more": false}';
        String createdShareLink = '{\".tag\": \"file\", \"url\": \"https://www.dropbox.com/s/mdut2kwjn6pgd0f/Untitled.docx?dl=0\", ' +
                '\"id\": \"id:75lEn1DcpEAAAAAAAAAADA\", \"name\": \"Untitled.docx\", \"path_lower\": \"/untitled.docx\", ' +
                '\"link_permissions\": {\"resolved_visibility\": {\".tag\": \"public\"}, \"requested_visibility\": ' +
                '{\".tag\": \"public\"}, \"can_revoke\": true, \"visibility_policies\": [{\"policy\": {\".tag\": \"public\"}, ' +
                '\"resolved_policy\": {\".tag\": \"public\"}, \"allowed\": true}, {\"policy\": {\".tag\": \"team_only\"}, ' +
                '\"resolved_policy\": {\".tag\": \"team_only\"}, \"allowed\": false, \"disallowed_reason\": {\".tag\": ' +
                '\"user_not_on_team\"}}, {\"policy\": {\".tag\": \"password\"}, \"resolved_policy\": {\".tag\": \"password\"}, ' +
                '\"allowed\": false, \"disallowed_reason\": {\".tag\": \"user_account_type\"}}], \"can_set_expiry\": false, ' +
                '\"can_remove_expiry\": true, \"allow_download\": true, \"can_allow_download\": true, \"can_disallow_download\": false,' +
                ' \"allow_comments\": true, \"team_restricts_comments\": false, \"audience_options\": [{\"audience\": ' +
                '{\".tag\": \"public\"}, \"allowed\": true}, {\"audience\": {\".tag\": \"team\"}, \"allowed\": false, \"disallowed_reason\": ' +
                '{\".tag\": \"user_not_on_team\"}}, {\"audience\": {\".tag\": \"password\"}, \"allowed\": false, ' +
                '\"disallowed_reason\": {\".tag\": \"user_account_type\"}}]}, \"preview_type\": \"doc\", \"client_modified\": ' +
                '\"2020-04-20T20:31:20Z\", \"server_modified\": \"2020-04-20T20:31:20Z\", \"rev\": ' +
                '\"015a3bec827dba100000001ba797340\", \"size\": 11602}';

        Map<String,String> body = new Map<String,String>();
        body.put('listFiles',listFiles);
        body.put('sharedLink',sharedLink);
        body.put('createdShareLink',createdShareLink);

        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator(body));
        List<DropboxController.DropboxFile> dropboxFiles = DropboxController.getFilesList();
        System.assert(dropboxFiles.size() == 2);
    }
}