const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
exports.newVehicle = functions.firestore
    .document('log-vehicle/{timestamp}')
    .onCreate((snap, context) => {
      const newValue = snap.data();
      var db = admin.firestore();
      var usersRef = db.collection('users');
      var eebuffRef = db.collection('entry-exit-buffer');

      var buffDocData = {
        rid: 'null',
        timestamp_entry: newValue.timestamp,
        timestamp_exit: 'null',
        vehicle_no: newValue.vehicle_no
      };
      eebuffRef.add(buffDocData);

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
                  title: 'Non Resient Vehicle Detected',
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
        var mUserID = [];
        var mUserRegistrationToken = [];
        var query = usersRef.where('user_type', '!=', 'guard').get()
          .then(snapshot =>{
            if(snapshot.empty){
              console.log('No normal or poc Users found');
              return 'you need to add users before contiuning';
            }
            snapshot.forEach(doc =>{
              doc.data().vehicles.forEach(vehicle =>{
                if(vehicle == newValue.vehicle_no){
                  mUserID.push(doc.data().uid);
                  mUserRegistrationToken.push(doc.data().token);
                }
              });
            });
          });
      }
      
      return 'complete';
    });
exports.newEntry = functions.firestore
    .document('entry-exit-buffer/{rid}')
    .onCreate((snap, context) => {
      var newValue = snap.data();
      var db = admin.firestore();
      var eebuffRef = db.collection('entry-exit-buffer');
      var ackRef = db.collection('log-acknowledged');
      var unackRef = db.collection('log-unacknowledged');
      var query = eebuffRef.where('vehicle_no', '==', newValue.vehicle_no).get()
          .then(snapshot =>{
            if(snapshot.empty){
              console.log('Document not found');
              return 'something is wrong';
            }
            snapshot.forEach(doc => {
              if(doc.id == snap.id){
              } else if(doc.data().timestamp_entry == 'null'){
                eebuffRef.doc(doc.id).set({
                  rid: newValue.rid,
                  timestamp_entry: newValue.timestamp_exit,
                  timestamp_exit: newValue.timestamp_entry,
                  vehicle_no: newValue.vehicle_no
                });
                return;
              } else if(doc.data().timestamp_exit == 'null'){
                var dataDoc = {
                  rid: doc.data().rid,
                  timestamp_entry: doc.data().timestamp_entry,
                  timestamp_exit: newValue.timestamp_entry,
                  vehicle_no: newValue.vehicle_no
                };
                if(dataDoc.rid == 'null'){
                  unackRef.add(dataDoc);
                } else {
                  ackRef.add(dataDoc);
                }
                eebuffRef.doc(doc.id).delete();
                eebuffRef.doc(snap.id).delete();
              }
            });
          });
      return "complete";
    });

exports.newEntry = functions.firestore
    .document('registration/{rid}')
    .onCreate((snap, context) => {
      var newValue = snap.data();
      var db = admin.firestore();
      var ackRef = db.collection('log-acknowledged');
      var unackRef = db.collection('log-unacknowledged');
      var eebuffRef = db.collection('entry-exit-buffer');
      var query = eebuffRef.where('vehicle_no', '==', newValue.vehicle_no).get()
          .then(snapshot)
    });
exports.test = functions.https.onRequest((req, res) => {
        res.status(200).send(ret,'yoooooo');
    });