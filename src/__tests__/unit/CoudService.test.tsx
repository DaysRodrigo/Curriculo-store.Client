import { getUrl, uploadFile } from '@/Services/CloudService';
import { API_URL } from '@/config/api';

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () =>
            Promise.resolve([
                { id: 1, name: 'Produto 1' },
                { id: 2, name: 'Produto 2' },
            ]),
    })
) as jest.Mock;

jest.mock('@/config/api', () => ({
  API_URL: 'http://localhost:5001',
}));

describe('getUrl', () => {

    it('Should fetch and return an url', async () => {
        //Arrange

        const fakeFile = new File(['file content'], 'file.txt', { type: 'text/plain' });
        const fakeUrl = 'http://example.com/presigned-url';
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValueOnce({ url: fakeUrl })
        });

        //Act
        const result = await getUrl(fakeFile);

        //Assert
        expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/cloudstorage/generate-presigned-url?fileName=${encodeURIComponent(fakeFile.name)}&contentType=${encodeURIComponent(fakeFile.type)}`
        );
        expect(result).toEqual(fakeUrl);
    });
})

describe('uploadFile', () => {


    it('Should upload a file and return the file url', async () => {
        //Arrange
        const fakeFile = new File(['file content'], 'file.txt', { type: 'text/plain' });
        const fakePresignedUrl = 'http://example.com/presigned-url?signature=abc123';
        const expectedFileUrl = 'http://example.com/presigned-url';

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValueOnce({ url: fakePresignedUrl })
        })
        .mockResolvedValueOnce({
            ok: true,
            status: 200
        });

        //Act
        const result = await uploadFile(fakeFile);

        //Assert
        expect(fetch).toHaveBeenCalledWith(
        fakePresignedUrl,
        {
            method: "PUT",
            headers: {
                "Content-Type": fakeFile.type,
            },
            body: fakeFile,
        });
        expect(result).toEqual(expectedFileUrl);

    });

    it('Should throw an error if fetch for presigned url fails', async () => {
        // Arrange
        const fakeFile = new File(['file content'], 'file.txt', { type: 'text/plain' });

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: jest.fn().mockResolvedValueOnce({ message: 'Error' })
        });

        // Act & Assert
        await expect(getUrl(fakeFile)).rejects.toThrow("Failed to get URL");
    });
});