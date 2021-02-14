from django.shortcuts import render
from django.contrib.auth.models import User, Group
from django.contrib.auth import get_user_model

from rest_framework import views, permissions, viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView

from treehacksServer.quickstart import (
    models as quickstart_models,
    serializers as quickstart_serializers,
)
from treehacksServer.quickstart.chatbot import chatbot


class StatusCheckView(views.APIView):
    """
    API endpoint that allows to check if server is up or not
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({'data': 'Pong'})


class CreateUserView(CreateAPIView):
    """
    View to allow user signup
    """
    model = get_user_model()
    permission_classes = [permissions.AllowAny]
    serializer_class = quickstart_serializers.UserSerializer


# Class Session APIs
class ClassSessionBaseView(viewsets.GenericViewSet):
    """
    Base viewset for class session operations
    """
    serializer_class = NotImplementedError
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.class_sessions.all()


class ClassSessionCreateView(mixins.CreateModelMixin, ClassSessionBaseView):
    """
    View for handling class session create
    """
    serializer_class = quickstart_serializers.ClassSessionCreateSerializer


class ClassSessionUpdateView(mixins.UpdateModelMixin, ClassSessionBaseView):
    """
    View for handling class session update
    """
    serializer_class = quickstart_serializers.ClassSessionUpdateSerializer


class ClassSessionEndView(mixins.UpdateModelMixin, ClassSessionBaseView):
    """
    View for handling class session update
    """
    serializer_class = quickstart_serializers.ClassSessionEndSerializer


class ClassSessionListDetailView(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """
    View for handling class session list and details
    """
    serializer_class = quickstart_serializers.ClassSessionListDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.class_sessions.all()


class ClassSessionDestroyView(mixins.DestroyModelMixin, ClassSessionBaseView):
    """
    View for handling class session destroy
    """
    serializer_class = quickstart_serializers.ClassSessionDestroySerializer


# Quiz API
class QuizResponseCreateView(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    View for handling quiz question responses
    """
    model = quickstart_models.QuestionResponse
    serializer_class = quickstart_serializers.QuizResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# Chatbot API
class ChatBotQuestionAnswerView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, format=None):
        existing_questions = quickstart_models.Question.objects.filter(class_session_id=pk).values(
            'text', 'options', 'answerIndex',
        )
        if not len(existing_questions):
            return Response(
                status=status.HTTP_400_BAD_REQUEST, data={'error': "Unable to find questions"}
            )

        question = request.data.get('question', None)
        if not question:
            return Response(
                status=status.HTTP_400_BAD_REQUEST, data={'error': "question is required"}
            )

        question_answers = {
            existing_question['text']: existing_question['options'][existing_question['answerIndex']]
            for existing_question in existing_questions
        }
        answer = chatbot.ChatBot().get_reply(question, question_answers.keys())
        if len(answer):
            answer = answer[0]
            answer = question_answers.get(answer, answer)
        else:
            answer = None

        return Response({'answer': answer}, status=status.HTTP_200_OK)
