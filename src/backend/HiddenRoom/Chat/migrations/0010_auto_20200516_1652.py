# Generated by Django 3.0.6 on 2020-05-16 14:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0009_auto_20200516_1646'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='chatroomuser',
            constraint=models.UniqueConstraint(fields=('chatroom_id', 'user'), name='unique_user_chatroom'),
        ),
    ]
