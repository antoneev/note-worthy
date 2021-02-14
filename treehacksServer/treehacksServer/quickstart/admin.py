from django.contrib import admin

from treehacksServer.quickstart import models as quickstart_models

admin.site.register(quickstart_models.Question)
admin.site.register(quickstart_models.ClassSession)
admin.site.register(quickstart_models.QuestionResponse)
