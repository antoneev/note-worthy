from django.conf import settings
from django.db import models
from django.contrib.postgres.fields import ArrayField


class Question(models.Model):
    text = models.TextField()
    options = ArrayField(models.CharField(max_length=200))
    answerIndex = models.IntegerField()
    class_session = models.ForeignKey('ClassSession', on_delete=models.CASCADE, related_name='questions')

    def __str__(self):
        return self.text


class ClassSession(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='class_sessions'
    )
    session_name = models.CharField(max_length=100, db_index=True)
    transcript = models.TextField(blank=True, default='')
    summary = models.TextField(blank=True, default='')
    bar_plot = models.FileField(null=True, blank=True)
    scatter_plot = models.FileField(null=True, blank=True)
    line_plot = models.FileField(null=True, blank=True)

    def __str__(self):
        return self.session_name


class QuestionResponse(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='question_responses'
    )
    question = models.ForeignKey('Question', on_delete=models.CASCADE, related_name='responses')
    selected_index = models.IntegerField()

    class Meta(object):
        unique_together = ('author', 'question')

    def __str__(self):
        return self.question.text + " - " + str(self.selected_index)
