# Generated by Django 3.0.6 on 2020-12-03 15:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0009_auto_20200524_0105'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='friend',
            constraint=models.UniqueConstraint(fields=('user_id', 'user2_id'), name='unique_friendship'),
        ),
    ]
