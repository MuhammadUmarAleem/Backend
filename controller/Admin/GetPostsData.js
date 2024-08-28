const { google } = require('googleapis');

// Replace these values with your service account credentials
const clientEmail = 'evemtly@dbchat-a50f6.iam.gserviceaccount.com';
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCgdCEnFAOzp81E
QbTDu9T87I/D7T46bYZ/zFMJzuaHtGhbYL0Qhaf81qRVdsI481PyAu+F06Wlk/pM
vdgpB55TU/oqkUW33vTRSXiYa6tc5o26BIBod35JFV0w+8S5kwPY521y1fONrjxK
QJeqvRj2sAa/c6wTdSRuZzutlvwlV2WlpKV9Ciyp9UbkIfji/20O7lLCYYqSyGKA
uiH4a/o84SNRvG6Prf58nMiFMjfGwulpg4DeuUUfEWwwBlvHG9XVJVPdmi+fMMTF
BJIfVPFPlkwzb0vVijj0dEUJaNWh3tUCWDiHaAXmsuLLKb6VDsO5jYgaZfqYlrFp
FiXFsGbtAgMBAAECggEAEn3Hq1IAajYyrwTWgP822M4ndFg1RXUFXNmOkVENmsKV
C0DfERYiKb6P0kSdNgR+3mNtuLHPQ4GGBU2UqYfV/HrvV/QFgZ75flwWAJTZ+xsb
5r3pkYCB5ojGhGRjg9J4TUlAgQ08pA2aJ6GBiR0BUT6wjGRXhqeHowyVIViG5wOY
O5lIASvRvzrAzgnL/arGXHMeFcIgKpemW0XxuI4BNLeJlIyu4yEG+Cp7LS36ErIN
92Mf1otRbPs17l2FZiqvW9xkIkop3ObNZupP6vgtKyrKvPkk+2Iy+bddDof3ObHC
/rXTiVUBRlDaMG3FCdrwqYlqJfgmriisJHUMJBV+wQKBgQDhIKLZoA30fErDQ/3L
QyIc/QkA+rPGrYtoyT6AlXGfCJ/nNWsbo9R5VolFtaZvkB4dBgGw8L91nG4plHww
g73TmrVz7sqpamZTyFOTrrts6FbAN1jSSQhfhxiZDLFzwhz4VDle9fAyfMn4JJsE
2qwbUu1WF5mMHBjUXFC5Yha2wQKBgQC2dQrCD4umDj7WVhX+ANiKhciGR2vxnMKV
ItfrBf8Z6A8pctEtgfTRs89AfWV9O2Snu7lbv7zirRyoaruNreEUXnV3syU9R2+V
izqyn8/nyeAX6TZYlceio42W/ioiJ5TCJlxCVzFayaZ3JOKmhbjK8Mu+e+UgoKmc
k8sw0HMHLQKBgQCJiCuUsc/0rT3rPo08cN3VQcwPWhkb5geF03OokCOimV0+nYa6
kwKJwhEIkimEfFG5P2MnGlyM2C0An+KirMj6DciOc7JBf2vWAUr1rMh5hxMASI+t
n8pKubiQP43k/xA9sQ5/cdX0sgGc45gEhiagZq/xaWd3je6pRWBXcJIZwQKBgQCU
0sMDp0pxGA2JJo6psGbwFk+Jt5gEa6kLnHAh87Iwn2g+lrioNehLZC8Ymy+9BkUD
y8tVWv/mpO1LMkPpPHrq8mE+UZF+elY51Gb8a/5ZQgDXgBIkD4fW0TEciBQ157Me
6cs3EYfgVbrCVAPLcCda4S5PIR+zjVjLroF+P4iTwQKBgQCiJ7WU2B0K3wmOKpyX
gEBKgz03cB9TQvYk3zzFxwacfC0sFZU2n8makhgNSUwUFZwgDfJGze8+AVDtnbZP
nci/jRgp+qTWmak5pxqxQ2eMofQ6ldQ3wJzS2qUBD2YfsaBNyxM3wrqrHAU+5B30
n6HM/kx0WaaridRYHux7Ynx08A==\n-----END PRIVATE KEY-----\n`;

const propertyId = '455801630';


async function GetPostsData(req, res) {
    // Initialize the JWT client with your service account credentials
    const jwtClient = new google.auth.JWT(
        clientEmail,
        null,
        privateKey.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/analytics.readonly']
    );

    // Authorize the client
    await jwtClient.authorize();

    // Initialize the Analytics Data API client
    const analyticsDataClient = google.analyticsdata('v1beta');

    let nextPageToken = null;
    let postClickData = [];

    do {
        // Initialize request parameters
        const requestParams = {
            property: `properties/${propertyId}`,
            requestBody: {
                dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                metrics: [
                    { name: 'eventCount' },
                ],
                dimensions: [
                    { name: 'customEvent:post_clicks' },
                ],
                dimensionFilter: {
                    filter: {
                        fieldName: 'eventName',
                        stringFilter: { value: 'post_click' }
                    }
                },
                pageToken: nextPageToken || undefined,
            },
            auth: jwtClient,
        };

        try {
            // Fetch the data
            const response = await analyticsDataClient.properties.runReport(requestParams);
            const rows = response.data.rows || [];

            // Process each row to get the postId and event count
            rows.forEach(row => {
                const postId = row.dimensionValues[0].value; // Assuming the first dimension is the postId
                const count = parseInt(row.metricValues[0].value); // Event count
                postClickData.push({ postId, count,row });
            });

            // Check for more pages of data
            nextPageToken = response.data.nextPageToken || null;

        } catch (error) {
            console.error('Error fetching analytics data:', error);
            break; // Exit loop on error
        }
    } while (nextPageToken); // Continue if there are more pages

    res.send(postClickData);
}

module.exports = {
    GetPostsData,
};
