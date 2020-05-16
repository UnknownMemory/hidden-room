from django.db import models
from django.conf import settings


class Chatroom(models.Model):
    chatroom_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=50, null=True)
    creation_date = models.DateTimeField(auto_now=True)

class ChatroomUser(models.Model):
    chatroom = models.ForeignKey(Chatroom, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False)
    joined_date = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['chatroom', 'user'], name='unique_user_chatroom') 
        ]

class PrivateChatroom(models.Model):
    chatroom_id = models.BigIntegerField(unique=True)
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user1', null=False)
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user2', null=False)
    creation_date = models.DateTimeField(auto_now=True)