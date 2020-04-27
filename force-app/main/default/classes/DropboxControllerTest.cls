/**
 * Created by IvanSteniakin on 4/27/2020.
 */

@IsTest
private class DropboxControllerTest {
    @IsTest
    static void testGetFilesList() {
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
        List<DropboxController.DropboxFile> dropboxFiles = DropboxController.getFilesList();
        System.assert(dropboxFiles.size() == 2);
    }
}