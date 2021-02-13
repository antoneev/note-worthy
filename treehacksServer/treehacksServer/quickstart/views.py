from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import views, permissions, status as rest_status
from rest_framework.response import Response


class StatusCheckView(views.APIView):
    """
    API endpoint that allows to check if server is up or not
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """
        Return a list of all users.
        """
        return Response({'data': 'Pong'})
        # return Response(status=rest_status.HTTP_200_OK, data={'data': 'Pong'})
