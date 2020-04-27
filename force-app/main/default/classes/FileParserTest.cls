/**
 * Created by IvanSteniakin on 4/27/2020.
 */

@IsTest
private class FileParserTest {
    @IsTest
    static void testParse() {
        String json = '{\"name\": \"Get Started with Dropbox.pdf\", \"url\": \"https://www.dropbox.com/s/894omr2jejhorox/Get%20Started%20with%20Dropbox.pdf?dl=0\", \"id\": \"id:75lEn1DcpEAAAAAAAAAABg\"}';
        FileParser obj = FileParser.parse(json);
        System.assert(obj != null);
    }
}