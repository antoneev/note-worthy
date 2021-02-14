from gensim.models import KeyedVectors
from gensim.scripts.glove2word2vec import glove2word2vec
import pandas as pd
from pathlib import Path
import spacy
import _pickle as cPickle

nlp = spacy.load('en_core_web_sm')


class QuestionsGenerator(object):
    model_file = 'treehacksServer/quickstart/question_generation/data/embeddings/gloveModel'
    predictorPickleName = 'treehacksServer/quickstart/question_generation/data/pickles/nb-predictor.pkl'
    singleton = None

    def __init__(self):
        self.model = KeyedVectors.load(self.model_file, mmap='r')
        self.predictor = self._loadPickle(self.predictorPickleName)

    def _loadPickle(self, fileName):
        file = open(fileName, 'rb')
        content = cPickle.load(file)
        file.close()
        return content

    @staticmethod
    def get_object():
        if QuestionsGenerator.singleton:
            return QuestionsGenerator.singleton
        return QuestionsGenerator()

    def generateQuestions(self, text, count):
        """
        Generate a set of questions from the given text. Questions count is also passed as input.
        """
        # Double the count due to the modulo check below
        count *= 2

        # Extract words
        df = self._generateDf(text)
        wordsDf = self._prepareDf(df)

        # Predict
        labeledAnswers = self._predictWords(wordsDf, df)

        # Transform questions
        qaPairs = self._addQuestions(labeledAnswers, text)

        # Pick the best questions
        orderedQaPairs = self._sortAnswers(qaPairs)

        # Generate distractors
        questions = self._addDistractors(orderedQaPairs[:count], 4)

        # Get the questions ready
        finalQuestions = []
        for i in range(min(count, len(questions))):
            if i % 2 == 0:
                finalQuestions.append(questions[i])

        return finalQuestions

    def _generateDf(self, text):
        words = []
        self._addWordsForParagrapgh(words, text)
        wordColums = ['text', 'titleId', 'paragrapghId', 'sentenceId', 'wordCount', 'NER', 'POS', 'TAG', 'DEP', 'shape']
        return pd.DataFrame(words, columns=wordColums)

    def _addWordsForParagrapgh(self, newWords, text):
        doc = nlp(text)

        neStarts = self._getNEStartIndexs(doc)
        senStarts = self._getSentenceStartIndexes(doc)

        # index of word in spacy doc text
        i = 0
        while (i < len(doc)):
            # If the token is a start of a Named Entity, add it and push to index to end of the NE
            if (i in neStarts):
                word = neStarts[i]
                # add word
                currentSentence = self._getSentenceForWordPosition(word.start, senStarts)
                wordLen = word.end - word.start
                shape = ''
                for wordIndex in range(word.start, word.end):
                    shape += (' ' + doc[wordIndex].shape_)

                newWords.append([word.text, 0, 0, currentSentence, wordLen, word.label_, None, None, None, shape])
                i = neStarts[i].end - 1
            # If not a NE, add the word if it's not a stopword or a non-alpha (not regular letters)
            else:
                if (doc[i].is_stop == False and doc[i].is_alpha == True):
                    word = doc[i]
                    currentSentence = self._getSentenceForWordPosition(i, senStarts)
                    wordLen = 1
                    newWords.append([
                        word.text, 0, 0, currentSentence, wordLen, None, word.pos_, word.tag_, word.dep_, word.shape_
                    ])
            i += 1

    def _getNEStartIndexs(self, doc):
        return {ne.start: ne for ne in doc.ents}

    def _getSentenceStartIndexes(self, doc):
        return [sentence[0].i for sentence in doc.sents]

    def _getSentenceForWordPosition(self, wordPos, senStarts):
        for i in range(1, len(senStarts)):
            if (wordPos < senStarts[i]):
                return i - 1

    def _prepareDf(self, df):
        # One-hot encoding
        wordsDf = self._oneHotEncodeColumns(df)

        # Drop unused columns
        columnsToDrop = ['text', 'titleId', 'paragrapghId', 'sentenceId', 'shape']
        wordsDf = wordsDf.drop(columnsToDrop, axis=1)

        # Add missing colums
        predictorColumns = [
            'wordCount', 'NER_CARDINAL', 'NER_DATE', 'NER_EVENT', 'NER_FAC', 'NER_GPE', 'NER_LANGUAGE',
            'NER_LAW', 'NER_LOC', 'NER_MONEY', 'NER_NORP', 'NER_ORDINAL', 'NER_ORG', 'NER_PERCENT',
            'NER_PERSON', 'NER_PRODUCT', 'NER_QUANTITY', 'NER_TIME', 'NER_WORK_OF_ART', 'POS_ADJ',
            'POS_ADP', 'POS_ADV', 'POS_CCONJ', 'POS_DET', 'POS_INTJ', 'POS_NOUN', 'POS_NUM', 'POS_PART',
            'POS_PRON', 'POS_PROPN', 'POS_PUNCT', 'POS_SYM', 'POS_VERB', 'POS_X', 'TAG_''', 'TAG_-LRB-',
            'TAG_.', 'TAG_ADD', 'TAG_AFX', 'TAG_CC', 'TAG_CD', 'TAG_DT', 'TAG_EX', 'TAG_FW', 'TAG_IN',
            'TAG_JJ', 'TAG_JJR', 'TAG_JJS', 'TAG_LS', 'TAG_MD', 'TAG_NFP', 'TAG_NN', 'TAG_NNP', 'TAG_NNPS',
            'TAG_NNS', 'TAG_PDT', 'TAG_POS', 'TAG_PRP', 'TAG_PRP$', 'TAG_RB', 'TAG_RBR', 'TAG_RBS',
            'TAG_RP', 'TAG_SYM', 'TAG_TO', 'TAG_UH', 'TAG_VB', 'TAG_VBD', 'TAG_VBG', 'TAG_VBN', 'TAG_VBP',
            'TAG_VBZ', 'TAG_WDT', 'TAG_WP', 'TAG_WRB', 'TAG_XX', 'DEP_ROOT', 'DEP_acl', 'DEP_acomp',
            'DEP_advcl', 'DEP_advmod', 'DEP_agent', 'DEP_amod', 'DEP_appos', 'DEP_attr', 'DEP_aux',
            'DEP_auxpass', 'DEP_case', 'DEP_cc', 'DEP_ccomp', 'DEP_compound', 'DEP_conj', 'DEP_csubj',
            'DEP_csubjpass', 'DEP_dative', 'DEP_dep', 'DEP_det', 'DEP_dobj', 'DEP_expl', 'DEP_intj',
            'DEP_mark', 'DEP_meta', 'DEP_neg', 'DEP_nmod', 'DEP_npadvmod', 'DEP_nsubj', 'DEP_nsubjpass',
            'DEP_nummod', 'DEP_oprd', 'DEP_parataxis', 'DEP_pcomp', 'DEP_pobj', 'DEP_poss', 'DEP_preconj',
            'DEP_predet', 'DEP_prep', 'DEP_prt', 'DEP_punct', 'DEP_quantmod', 'DEP_relcl', 'DEP_xcomp'
        ]

        for feature in predictorColumns:
            if feature not in wordsDf.columns:
                wordsDf[feature] = 0

        return wordsDf

    def _oneHotEncodeColumns(self, df):
        columnsToEncode = ['NER', 'POS', "TAG", 'DEP']
        for column in columnsToEncode:
            one_hot = pd.get_dummies(df[column])
            one_hot = one_hot.add_prefix(column + '_')
            df = df.drop(column, axis=1)
            df = df.join(one_hot)

        return df

    def _predictWords(self, wordsDf, df):
        y_pred = self.predictor.predict_proba(wordsDf)

        labeledAnswers = []
        for i in range(len(y_pred)):
            labeledAnswers.append({'word': df.iloc[i]['text'], 'prob': y_pred[i][0]})

        return labeledAnswers

    def _addQuestions(self, answers, text):
        doc = nlp(text)
        currAnswerIndex = 0
        qaPair = []

        # Check wheter each token is the next answer
        for sent in doc.sents:
            for token in sent:
                # If all the answers have been found, stop looking
                if currAnswerIndex >= len(answers):
                    break

                # In the case where the answer is consisted of more than one token, check the following tokens as well.
                answerDoc = nlp(answers[currAnswerIndex]['word'])
                answerIsFound = True

                for j in range(len(answerDoc)):
                    if token.i + j >= len(doc) or doc[token.i + j].text != answerDoc[j].text:
                        answerIsFound = False

                # If the current token is corresponding with the answer, add it
                if answerIsFound:
                    question = self._blankAnswer(token.i, token.i + len(answerDoc) - 1, sent.start, sent.end, doc)
                    qaPair.append({'question': question,
                                   'answer': answers[currAnswerIndex]['word'],
                                   'prob': answers[currAnswerIndex]['prob']})
                    currAnswerIndex += 1

        return qaPair

    def _blankAnswer(self, firstTokenIndex, lastTokenIndex, sentStart, sentEnd, doc):
        leftPartStart = doc[sentStart].idx
        leftPartEnd = doc[firstTokenIndex].idx
        rightPartStart = doc[lastTokenIndex].idx + len(doc[lastTokenIndex])
        rightPartEnd = doc[sentEnd - 1].idx + len(doc[sentEnd - 1])
        return doc.text[leftPartStart:leftPartEnd] + '_____' + doc.text[rightPartStart:rightPartEnd]

    def _sortAnswers(self, qaPairs):
        return sorted(qaPairs, key=lambda qaPair: qaPair['prob'])

    def _addDistractors(self, qaPairs, count):
        for qaPair in qaPairs:
            distractors = self._generate_distractors(qaPair['answer'], count)
            qaPair['distractors'] = distractors

        return qaPairs

    def _generate_distractors(self, answer, count):
        answer = str.lower(answer)

        ##Extracting closest words for the answer.
        try:
            closestWords = self.model.most_similar(positive=[answer], topn=count)
        except:
            # In case the word is not in the vocabulary, or other problem not loading embeddings
            return []

        # Return count many distractors
        return list(map(lambda x: x[0], closestWords))[0:count]
