# Generated by Django 3.0.6 on 2020-05-16 13:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0004_auto_20200516_1538'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='privatechatroom',
            constraint=models.UniqueConstraint(fields=('user2', 'user1'), name='unique_pm2'),
        ),
    ]
