const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
      // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      return res.redirect(303, snapshot.ref.toString());
    });
  });
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});
exports.createUser = functions.firestore
    .document('users/{uid}')
    .onCreate((snap, context) => {
      const newValue = snap.data();
      const name = newValue.name;
        var registrationToken = 'cIShh1x74U4:APA91bEfoc0gwPnnKJyaewL0EWwykUkup0JJbMEZ2QSQyUmgDv8iYmkKBiJJG1d65uzqt_6E6EnENbcoz0u5gpoaP9HiWnDBp5SQN8reQhy6ICr9e0eZ-4lvV3eq0DJ-gx1MzFHQzUjw';
        var message = {
            notification: {
                title: 'triggered',
                body: 'triggered'
            },
            token: registrationToken
        };
        admin.messaging().send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
    });
exports.newVehicle = functions.firestore
    .document('log-vehicle/{timestamp}')
    .onCreate((snap, context) => {
      const newValue = snap.data();
      const name = newValue.name;
        var registrationToken = 'cIShh1x74U4:APA91bEfoc0gwPnnKJyaewL0EWwykUkup0JJbMEZ2QSQyUmgDv8iYmkKBiJJG1d65uzqt_6E6EnENbcoz0u5gpoaP9HiWnDBp5SQN8reQhy6ICr9e0eZ-4lvV3eq0DJ-gx1MzFHQzUjw';
        var message = {
            notification: {
                title: newValue.vehicle_no,
                body: newValue.vehicle_no
            },  
            token: registrationToken
        };
        admin.messaging().send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
    });