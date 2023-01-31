# Script to copy all data from TMA-Mythic-Keys collection to TESTING-TMA-Mythic-Keys collection in Cloud Firestore
# tragicmuffin

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate(r'D:\Coding\WWW\web-github\wow\_private\tragicmuffin-cloudapps-firebase-adminsdk-nunz8-1873d98490.json')
default_app = firebase_admin.initialize_app(cred)

db = firestore.client()

liveDocsData = db.collection(u'TMA-Mythic-Keys').get()
testDocs = db.collection(u'TESTING-TMA-Mythic-Keys')


for doc in liveDocsData:
    testDocs.document(u'{}'.format(doc.id)).set(doc.to_dict())
