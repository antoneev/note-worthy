
def data_filtering(filename):
    string = []    
    with open(filename, "r") as f:
        full_text = f.read()
        for l in re.split(r"(\.)", full_text):
            if l != ".":
                string.append(l + "\n")
    df = pd.DataFrame(string)
    df['Sentences'] = df
    df.drop(0,axis=1)
    
    return df

def getSubjectivity(text):
    return TextBlob(text).sentiment.subjectivity

def getPolarity(text):
    return  TextBlob(text).sentiment.polarity

def getAnalysis(score):
    if score < 0:
        return 'Negative'
    elif score == 0:
        return 'Neutral'
    else:
        return 'Positive'
    
def groupForExport(dataset, positive, negative, neutral):
    pos_dataset = dataset.loc[dataset['Analysis'].isin(positive)]
    neg_dataset = dataset.loc[dataset['Analysis'].isin(negative)]
    neut_dataset = dataset.loc[dataset['Analysis'].isin(neutral)]
    return (pos_dataset, neg_dataset, neut_dataset)
    
def toCSV(pos_dataset, neg_dataset, neut_dataset):
    pos_dataset.to_csv('positive.csv')
    neg_dataset.to_csv('negative.csv')
    neut_dataset.to_csv('neutral.csv')
    return print("done")


import re
import pandas as pd
from textblob import TextBlob


filename='demo.txt'

positive = ['Positive']
negative = ['Negative']
neutral = ['Neutral']

cleaned_dataset = data_filtering(filename)

cleaned_dataset['Subjectivity'] = cleaned_dataset['Sentences'].apply(getSubjectivity)
cleaned_dataset['Polarity'] = cleaned_dataset['Sentences'].apply(getPolarity)
cleaned_dataset['Analysis'] = cleaned_dataset['Polarity'].apply(getAnalysis)

datasetPos, datasetNeg, datasetNeut = groupForExport(cleaned_dataset, positive, negative, neutral)
toCSV(datasetPos, datasetNeg, datasetNeut)

#print(datasetPos['Sentences'])
#print(datasetPos['Sentences'].size)