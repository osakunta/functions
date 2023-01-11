const functions = require('@google-cloud/functions-framework');
const calendar = require('@googleapis/calendar');

const auth = new calendar.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/calendar.readonly']
});

const getClient = async () => {
        const authClient = await auth.getClient();

        const client = await calendar.calendar({
                version: 'v3',
                auth: authClient
        });

        return client;
}

const getEvents = async (client) => {

        return {
                "events": await client.events.list({
                        calendarId: "c_0e61cd901383f3d7ae9ff52f57dceae240a1dac3c9b5e426448b8751bf7f4bce@group.calendar.google.com",
                        singleEvents: true
                }),
                "calendar": await client.calendars.get({
                        calendarId: "c_0e61cd901383f3d7ae9ff52f57dceae240a1dac3c9b5e426448b8751bf7f4bce@group.calendar.google.com",
                })
        }
}

const handler = (req, res) => {
        getClient().then(
                client => getEvents(client) 
        ).then(events => {
                res.send(events)
        }).catch(
                e => {
                        console.error(e);
                        res.status(500).send("Internal server error. Check the logs")
                }
        )

}

functions.http('public-calendars', handler);

exports = handler;
