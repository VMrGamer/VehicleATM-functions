const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
exports.newVehicle = functions.firestore
    .document('log-vehicle/{timestamp}')
    .onCreate((snap, context) => {
      const newValue = snap.data();
      var db = admin.firestore();
      var usersRef = db.collection('users');
      // This will be the master function for log-vehicle document

      //Check for resident
      if(newValue.resident == false){
        var query = usersRef.where('user_type', '==', 'guard').get()
          .then(snapshot => {
            if(snapshot.empty){
              console.log('No Matching Documents.');
              return 'Somethin Fishy';
            }

            snapshot.forEach(doc => {
              var message = {
                notification: {
                  title: 'New Non Resient Vehicle Entered',
                  body: 'Vehicle No: '.concat(newValue.vehicle_no)
                },
                token: doc.data().token
              };
              admin.messaging().send(message)
                .then((response) => {
                  console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                  console.log('Error sending message:', error);
                });
            });
            
          }).catch(err =>{
            console.log('Error getting Documents', err);
          });
      }

      //TODO: Get registrationID token here
      //TODO: Figure out a way to map Resident: true to another function to update the resident history data
      return 'complete';
    });

exports.test = functions.https.onRequest((req, res) => {
        res.status(200).send(ret,'yoooooo');
    });