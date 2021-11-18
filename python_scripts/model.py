import os
import uuid 
from python_speech_features import mfcc
from python_speech_features import delta
import scipy.io.wavfile as wavy
import numpy as np
import tensorflow as tf
import keras
from keras.models import Model, load_model, Sequential
import pickle
from pydub import AudioSegment
import sys
from flask import Flask
import json
import cgi 
from flask import request
import base64
app = Flask(__name__)

@app.route("/upload", methods = ['POST'])
def model():
    f = open('./temp.txt', 'a')
    f.write("start1")
    f.close()

    print("IN UPLOAD")
    body = request.data

    content = json.loads(body.decode('utf-8'))
    file_path = content['file_path']
    file_name = content['file_name']
    
    sound = AudioSegment.from_mp3(file_path)
    wav_file_path="./recorded_audios/converted/" + file_name.split('.')[0] + ".wav" ### Path of audio file
    sound.export(wav_file_path, format="wav")
    newAudio = AudioSegment.from_wav(wav_file_path)

    f = open('./temp.txt', 'a')
    f.write("start2")
    f.close()
    
    (rate,sig) = wavy.read(wav_file_path)
    mfcc_feat = mfcc(sig,rate,numcep=15,nfilt=40,preemph=0.97)
    mfcc_d = delta(mfcc_feat,1)
    mfcc_dd = delta(mfcc_d,1)
    feat = np.concatenate((mfcc_feat,mfcc_d,mfcc_dd),axis=1)
    final_feats=[]
    
    f = open('./temp.txt', 'a')
    f.write("start3")
    f.close()
    
    for i in range(3,len(feat)-3):
        args = (feat[i-3],feat[i-2],feat[i-1],feat[i],feat[i+1],feat[i+2],feat[i+3])
        xt=[]
        xt = np.concatenate(args)
        final_feats.append(xt)
    
    final_feats = np.array(final_feats)

    f = open('./temp.txt', 'a')
    f.write("start4")
    f.close()
    
    print("BEFORE BTP SAV")
#    sys.path.append("../../")
    model = pickle.load(open('./BTP_FP.sav', 'rb'))
    print("AFTER BTP SAV")
    
    f = open('./temp.txt', 'a')
    f.write("start5")
    f.close()
    
    yhat_classes = model.predict(final_feats)
    a=0
    kt=0
    for i in range(len(yhat_classes)):
        if yhat_classes[i]==1:
            a+=1
            if a==1:
                kt=i
        elif a>0:
            k=0
            #print(i)
            j=i+1
            while j<=i+5 and j<len(yhat_classes):
                if yhat_classes[j]==1:
                    k+=1
                j+=1
            if a<=28 and k<2:
                for j in range(kt,i):
                    yhat_classes[j]=0
                a=0
            if k<2:
                a=0
            else:
                yhat_classes[i]=1
    
    print(yhat_classes) ### yhat_classes is an array of 1 and 0, in which 1 represents detected filled pause at that frame and 0 represents normal speech
    ###For ersion of yhat_classes to time array, each frame is of .01 seconds. And total no. of frames equal to total no. of elements in yhat_classes

    print(type(yhat_classes))
    json_yhat = yhat_classes.tolist()
    print(type(json_yhat))

    #dct = {'features': final_feats, 'output': yhat_classes}
    dct = {'output': json_yhat}
    json_obj = json.dumps(dct)

    os.remove("./recorded_audios/converted/" + file_name.split('.')[0] + ".wav")    

    return json_obj


@app.route("/record", methods = ['POST'])
def model2():
    print("IN RECORD")
    body = request.files['blob_details']
    
    file_name = str(uuid.uuid4())
    path = "./recorded_audios/received/" + file_name
    with open(path, 'wb') as f:
        f.write(request.files['blob_details'].read())

    sound = AudioSegment.from_file(path)
    sound.export("./recorded_audios/converted/" + file_name + ".wav", format="wav")
    wav="./recorded_audios/converted/" + file_name + ".wav" ### Path of audio file

    (rate,sig) = wavy.read(wav)
    mfcc_feat = mfcc(sig,rate,numcep=15,nfilt=40,preemph=0.97)
    mfcc_d = delta(mfcc_feat,1)
    mfcc_dd = delta(mfcc_d,1)
    feat = np.concatenate((mfcc_feat,mfcc_d,mfcc_dd),axis=1)
    final_feats=[]
    
    for i in range(3,len(feat)-3):
        args = (feat[i-3],feat[i-2],feat[i-1],feat[i],feat[i+1],feat[i+2],feat[i+3])
        xt=[]
        xt = np.concatenate(args)
        final_feats.append(xt)
    
    final_feats = np.array(final_feats)

    f = open('./temp.txt', 'a')
    f.write("start6")
    f.close()
    
    print("BEFORE BTP SAV")
    model = pickle.load(open('./BTP_FP.sav', 'rb'))
    print("AFTER BTP SAV")
    yhat_classes = model.predict(final_feats)
    a=0
    kt=0
    for i in range(len(yhat_classes)):
        if yhat_classes[i]==1:
            a+=1
            if a==1:
                kt=i
        elif a>0:
            k=0
            #print(i)
            j=i+1
            while j<=i+5 and j<len(yhat_classes):
                if yhat_classes[j]==1:
                    k+=1
                j+=1
            if a<=28 and k<2:
                for j in range(kt,i):
                    yhat_classes[j]=0
                a=0
            if k<2:
                a=0
            else:
                yhat_classes[i]=1
    
    print(yhat_classes) ### yhat_classes is an array of 1 and 0, in which 1 represents detected filled pause at that frame and 0 represents normal speech
    ###For ersion of yhat_classes to time array, each frame is of .01 seconds. And total no. of frames equal to total no. of elements in yhat_classes

    print(type(yhat_classes))
    json_yhat = yhat_classes.tolist()
    print(type(json_yhat))
    
    #dct = {'features': final_feats, 'output': yhat_classes}
    dct = {'output': json_yhat}
    json_obj = json.dumps(dct)
    
    os.remove("./recorded_audios/received/" + file_name)
    os.remove("./recorded_audios/converted/" + file_name + ".wav")
    
    return json_obj

#if __name__ == "__main__":
app.run(host='127.0.0.1', port=5000)
