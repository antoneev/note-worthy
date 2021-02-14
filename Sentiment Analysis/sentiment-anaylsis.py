
import re
import pandas as pd
from textblob import TextBlob
import matplotlib.pyplot as plt


class SentimentAnalysis:
    def __init__(self, filename):
        self.filename = filename
        self.positive = ['Positive']
        self.negative = ['Negative']
        self.neutral = ['Neutral']

    def dataFiltering(self):
        string = []
        with open(self.filename, "r") as f:
            full_text = f.read()
            for l in re.split(r"[.?!]", full_text):
                if l != ".":
                    string.append(l + "\n")
        df = pd.DataFrame(string)
        df = df.rename(columns={0: 'Sentences'})
        return df

    def getSubjectivity(self, text):
        return TextBlob(text).sentiment.subjectivity

    def getPolarity(self, text):
        return TextBlob(text).sentiment.polarity

    def getAnalysis(self, score):
        if score < 0:
            return 'Negative'
        elif score == 0:
            return 'Neutral'
        else:
            return 'Positive'

    def addFeatures(self, cleaned_dataset):
        cleaned_dataset['Subjectivity'] = cleaned_dataset['Sentences'].apply(self.getSubjectivity)
        cleaned_dataset['Polarity'] = cleaned_dataset['Sentences'].apply(self.getPolarity)
        cleaned_dataset['Analysis'] = cleaned_dataset['Polarity'].apply(self.getAnalysis)
        return cleaned_dataset

    def groupForExport(self, cleaned_dataset):
        pos_dataset = cleaned_dataset.loc[dataset['Analysis'].isin(self.positive)]
        neg_dataset = cleaned_dataset.loc[dataset['Analysis'].isin(self.negative)]
        neut_dataset = cleaned_dataset.loc[dataset['Analysis'].isin(self.neutral)]
        return (pos_dataset, neg_dataset, neut_dataset)

    def toCSV(self, pos_dataset, neg_dataset, neut_dataset):
        # Change location as required
        pos_dataset.to_csv('./SentimentAnalysis/positive.csv')
        neg_dataset.to_csv('./SentimentAnalysis/negative.csv')
        neut_dataset.to_csv('./SentimentAnalysis/neutral.csv')

    def getPolarityStatistics(self, cleaned_dataset):
        self.positive_count = (cleaned_dataset['Analysis'] == "Positive").sum()
        self.negative_count = (cleaned_dataset['Analysis'] == "Negative").sum()
        self.neutral_count = (cleaned_dataset['Analysis'] == "Neutral").sum()
        return self.positive_count, self.negative_count, self.neutral_count

    def scatterPlot(self, df):
        plt.rcdefaults()

        plt.rcParams['axes.titlepad'] = 20
        (fig_width, fig_height) = plt.rcParams['figure.figsize']
        fig_size = [fig_width * 1.4, fig_height * 1.6]
        f = plt.figure(figsize=fig_size, edgecolor="#04253a")

        N = df.shape[0]
        x = df["Subjectivity"]
        y = df["Polarity"]
        colors = np.random.rand(N)
        area = (20 * np.random.rand(N)) ** 2  # 0 to 15 point radii

        plt.scatter(x, y, s=area, c=colors, alpha=0.5)
        plt.ylabel("Polarity", labelpad=10)
        plt.xlabel("Subjectivity", labelpad=10)
        plt.title("Subjectivity vs Polarity", pad=20)
        # Change Location as Required
        plt.savefig("/content/drive/MyDrive/Sentiment Analysis/plots/sub_vs_pol.png", edgecolor=f.get_edgecolor())

    def barPlot(self):
        plt.rcdefaults()
        plt.rcParams['axes.titlepad'] = 10
        (fig_width, fig_height) = plt.rcParams['figure.figsize']
        plt.rcParams['figure.edgecolor'] = 'b'
        fig_size = [fig_width * 1.4, fig_height * 1.6]
        f = plt.figure(figsize=fig_size, frameon=True)
        x = ["Positive", "Negative", "Neutral"]
        y = [self.positive_count, self.negative_count, self.neutral_count]
        ax = plt.gca()
        ax.tick_params(axis='x', colors='black')
        ax.tick_params(axis='y', colors='black')

        y_pos = np.arange(len(x))
        plt.bar(y_pos, y, align='center', alpha=0.5, width=0.2)
        plt.xticks(y_pos, x)

        plt.ylabel("Sentiment Count", labelpad=10)
        plt.xlabel("Sentiment types", labelpad=10)
        plt.title("Sentiment Analysis", pad=20)
        # Change location as required
        plt.savefig("/content/drive/MyDrive/Sentiment Analysis/plots/sentiment_analysis.png", pad_inches=0.5)


# filename="/content/drive/MyDrive/Sentiment Analysis/demo.txt"
#
# s = SentimentAnalysis(filename)
# cleaned_dataset = s.dataFiltering()
# cleaned_dataset = s.addFeatures(cleaned_dataset)
# positive, negative, neutral = s.getPolarityStatistics(cleaned_dataset)
# s.scatterPlot(cleaned_dataset)
# s.barPlot()