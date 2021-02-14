import math
from random import random

from django.contrib.auth import get_user_model
from django.db import transaction

from rest_framework import serializers

from treehacksServer.quickstart import models as quickstart_models
from treehacksServer.quickstart.question_generation import questions_generator
from treehacksServer.quickstart.summary_generator import summary_generator
from treehacksServer.quickstart.sentiment_analysis import sentiment_analysis

UserModel = get_user_model()
QuestionsGenerator = questions_generator.QuestionsGenerator.get_object()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = UserModel.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )

        return user

    class Meta:
        model = UserModel
        fields = ("id", "username", "password",)


class QuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = quickstart_models.Question
        fields = ('id', 'text', 'options', 'answerIndex',)
        read_only_fields = ('id', 'text', 'options', 'answerIndex',)


class ClassSessionCreateSerializer(serializers.ModelSerializer):
    questions = QuestionsSerializer(many=True, read_only=True)

    class Meta:
        model = quickstart_models.ClassSession
        fields = ('id', 'session_name', 'transcript', 'summary', 'questions')
        read_only_fields = ('id', 'transcript', 'summary', 'questions')

    @transaction.atomic()
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user

        # Create classroom session
        return super(ClassSessionCreateSerializer, self).create(validated_data)


class ClassSessionUpdateBaseSerializer(serializers.ModelSerializer):
    questions = QuestionsSerializer(many=True, read_only=True)

    class Meta:
        model = quickstart_models.ClassSession
        fields = ('id', 'session_name', 'transcript', 'summary', 'questions')
        read_only_fields = ('id', 'session_name', 'summary', 'questions')

    def generate_questions(self, transcript, instance):
        # Generate questions
        questions = QuestionsGenerator.generateQuestions(transcript, 2)

        # Add answer in options in random order. Create Questions object
        questionObjects = []
        for question in questions:
            index_to_insert = math.floor((len(question['distractors']) + 1) * random())
            question['distractors'].insert(index_to_insert, question['answer'])
            questionObjects.append(
                quickstart_models.Question(
                    text=question['question'],
                    options=question['distractors'],
                    answerIndex=index_to_insert,
                    class_session=instance,
                )
            )

        # Bulk create questions
        if len(questionObjects):
            quickstart_models.Question.objects.bulk_create(questionObjects)


class ClassSessionUpdateSerializer(ClassSessionUpdateBaseSerializer):
    class Meta(ClassSessionUpdateBaseSerializer.Meta):
        pass

    @transaction.atomic()
    def update(self, instance, validated_data):
        # generate questions
        self.generate_questions(validated_data['transcript'], instance)

        # Concatenate the transcript.
        validated_data['transcript'] = instance.transcript + " " + validated_data['transcript']

        return super(ClassSessionUpdateSerializer, self).update(instance, validated_data)


class ClassSessionEndSerializer(ClassSessionUpdateBaseSerializer):
    class Meta(ClassSessionUpdateSerializer.Meta):
        pass

    @transaction.atomic()
    def update(self, instance, validated_data):
        # generate questions
        self.generate_questions(validated_data['transcript'], instance)

        # Concatenate the transcript.
        validated_data['transcript'] = instance.transcript + " " + validated_data['transcript']

        # Generate summary
        validated_data['summary'] = summary_generator.summarize_deep_ai(validated_data['transcript'])

        # Generate analytics graphs
        analysis = sentiment_analysis.SentimentAnalysis(instance.id, validated_data['transcript'])
        scatter_plot, bar_plot, line_plot = analysis.generatePlots()
        validated_data['scatter_plot'] = scatter_plot
        validated_data['bar_plot'] = bar_plot
        validated_data['line_plot'] = line_plot

        # Create classroom session
        return super(ClassSessionEndSerializer, self).update(instance, validated_data)


class QuestionsAnswerSerializer(serializers.ModelSerializer):
    selectedIndex = serializers.SerializerMethodField('get_selectedIndex')

    def get_selectedIndex(self, instance):
        response = quickstart_models.QuestionResponse.objects.filter(
            author=self.context['request'].user,
            question=instance,
        ).first()
        return response.selected_index if response else None

    class Meta:
        model = quickstart_models.Question
        fields = ('id', 'text', 'options', 'answerIndex', 'selectedIndex')
        read_only_fields = ('id', 'text', 'options', 'answerIndex', 'selectedIndex')


class ClassSessionListDetailSerializer(serializers.ModelSerializer):
    questions = QuestionsAnswerSerializer(many=True)

    class Meta:
        model = quickstart_models.ClassSession
        fields = ('id', 'session_name', 'transcript', 'summary', 'questions', 'bar_plot', 'scatter_plot', 'line_plot',)
        read_only_fields = ('id', 'session_name', 'transcript', 'summary', 'questions', 'bar_plot', 'scatter_plot',
                            'line_plot',)


class ClassSessionDestroySerializer(serializers.ModelSerializer):
    class Meta:
        model = quickstart_models.ClassSession


# Quiz Serializers
class QuizResponseSerializer(serializers.ModelSerializer):
    question_id = serializers.IntegerField()
    selected_index = serializers.IntegerField()

    class Meta:
        model = quickstart_models.QuestionResponse
        fields = ('id', 'question_id', 'selected_index',)

    def validate(self, attrs):
        questionsCount = quickstart_models.Question.objects.filter(id=attrs['question_id']).count()
        if questionsCount != 1:
            raise Exception("Invalid question id")

        if quickstart_models.QuestionResponse.objects.filter(
                author=self.context['request'].user, question_id=attrs['question_id']
        ).exists():
            raise Exception("Question Response already exists")

        return attrs

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super(QuizResponseSerializer, self).create(validated_data)
