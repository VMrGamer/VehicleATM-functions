const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
exports.newVehicle = functions.firestore
    .document('log-vehicle/{timestamp}')
    .onCreate((snap, context) => {
      const newValue = snap.data();

      // This will be the master function for log-vehicle document

      //Check for resident
      if(newValue.resident == false){
        
      }

      //TODO: Get registrationID token here
      //TODO: Figure out a way to map Resident: true to another function to update the resident history data
      //TODO: Figure out a way to map Resident: false data to another function, to alert the guard of new vehicle entered
      
    });