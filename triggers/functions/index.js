const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
exports.newVehicle = functions.firestore
    .document('log-vehicle/{timestamp}')
    .onCreate((snap, context) => {
      const newValue = snap.data();
      var db = admin.firestore();
      var usersRef = db.collection('users');
      var logUnAck = db.collection('log-unacknowledged');
      var logAck = db.collection('log-acknowledged');

      

      if(newValue.resident == false){
        var query = usersRef.where('user_type', '==', 'guard').get()
          .then(snapshot => {
            if(snapshot.empty){
              console.log('No guards founc');
              return 'you need to add users before contiuning';
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
      } else{
        var mUserID = 'none';
        var mUserRegistrationToken = 'none';
        var query = usersRef.where('user_type', '!=', 'guard').get()
          .then(snapshot =>{
            if(snapshot.empty){
              console.log('No normal or poc Users found');
              return 'you need to add users before contiuning';
            }
            snapshot.forEach(doc =>{
              doc.data().vehicles.forEach(vehicle =>{
                if(vehicle == newValue.vehicle_no){
                  mUserID = doc.data().uid;
                  mUserRegistrationToken = doc.data().token;
                  //do something here
                  break;
                }
              });
            });
          });
      }
      
      return 'complete';
    });

exports.test = functions.https.onRequest((req, res) => {
        res.status(200).send(ret,'yoooooo');
    });