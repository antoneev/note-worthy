import re
import pandas as pd
import os
from textblob import TextBlob
import matplotlib.pyplot as plt
import numpy as np

from django.conf import settings


class SentimentAnalysis(object):
    scatter_plot_dir = settings.MEDIA_ROOT + '/scatterPlots/'
    bar_plot_dir = settings.MEDIA_ROOT + '/barPlots/'
    line_plot_dir = settings.MEDIA_ROOT + '/linePlots/'

    def __init__(self, id, transcript):
        self.id = id
        self.transcript = transcript
        self.positive = ['Positive']
        self.negative = ['Negative']
        self.neutral = ['Neutral']
        self._create_directories()

    def generatePlots(self):
        cleaned_dataset = self._dataFiltering()
        cleaned_dataset = self._addFeatures(cleaned_dataset)
        self._getPolarityStatistics(cleaned_dataset)
        return self._scatterPlot(cleaned_dataset), self._barPlot(), self._linePlot(cleaned_dataset)

    def _create_directories(self):
        if not os.path.exists(os.path.dirname(self.scatter_plot_dir)):
            try:
                os.makedirs(os.path.dirname(self.scatter_plot_dir))
            except OSError as exc:  # Guard against race condition
                pass

        if not os.path.exists(os.path.dirname(self.bar_plot_dir)):
            try:
                os.makedirs(os.path.dirname(self.bar_plot_dir))
            except OSError as exc:  # Guard against race condition
                pass

        if not os.path.exists(os.path.dirname(self.line_plot_dir)):
            try:
                os.makedirs(os.path.dirname(self.line_plot_dir))
            except OSError as exc:  # Guard against race condition
                pass

    def _dataFiltering(self):
        string = []
        for l in re.split(r"[.?!]", self.transcript):
            if l not in [".", "?", "!"]:
                string.append(l)
        df = pd.DataFrame(string)
        df = df.rename(columns={0: 'Sentences'})
        return df

    def _addFeatures(self, cleaned_dataset):
        cleaned_dataset['Subjectivity'] = cleaned_dataset['Sentences'].apply(self._getSubjectivity)
        cleaned_dataset['Polarity'] = cleaned_dataset['Sentences'].apply(self._getPolarity)
        cleaned_dataset['Analysis'] = cleaned_dataset['Polarity'].apply(self._getAnalysis)
        return cleaned_dataset

    def _getSubjectivity(self, text):
        return TextBlob(text).sentiment.subjectivity

    def _getPolarity(self, text):
        return TextBlob(text).sentiment.polarity

    def _getAnalysis(self, score):
        if score < 0:
            return 'Negative'
        elif score == 0:
            return 'Neutral'
        else:
            return 'Positive'

    def _getPolarityStatistics(self, cleaned_dataset):
        self.positive_count = (cleaned_dataset['Analysis'] == "Positive").sum()
        self.negative_count = (cleaned_dataset['Analysis'] == "Negative").sum()
        self.neutral_count = (cleaned_dataset['Analysis'] == "Neutral").sum()

    def _scatterPlot(self, df):
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
        save_location = self.scatter_plot_dir + str(self.id) + ".png"
        plt.savefig(save_location, edgecolor=f.get_edgecolor())
        return save_location

    def _barPlot(self):
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
        save_location = self.bar_plot_dir + str(self.id) + ".png"
        plt.savefig(save_location, pad_inches=0.5)
        return save_location

    def _linePlot(self, df):
        plt.rcdefaults()
        plt.rcParams['axes.titlepad'] = 10
        (fig_width, fig_height) = plt.rcParams['figure.figsize']
        plt.rcParams['figure.edgecolor'] = 'b'
        fig_size = [fig_width * 1.4, fig_height * 1.6]
        f = plt.figure(figsize=fig_size, frameon=True)
        x = [i + 1 for i in range(df.shape[0])]
        y = df['Polarity']
        ax = plt.gca()
        ax.tick_params(axis='x', colors='black')
        ax.tick_params(axis='y', colors='black')

        plt.plot(x, y)

        plt.ylabel("Polarity", labelpad=10)
        plt.xlabel("Time (by sentence number)", labelpad=10)
        plt.title("Sentence Polarity vs Time", pad=20)
        # Change location as required
        save_location = self.line_plot_dir + str(self.id) + ".png"
        plt.savefig(save_location, pad_inches=0.5)
        return save_location
