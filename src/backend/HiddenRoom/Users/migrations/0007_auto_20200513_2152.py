# Generated by Django 3.0.6 on 2020-05-13 19:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0006_auto_20200513_2144'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='friend',
            name='relationship_status',
        ),
        migrations.AddField(
            model_name='friend',
            name='relationship',
            field=models.CharField(choices=[('PENDING', 'Pending'), ('FRIENDS', 'Friends'), ('BLOCKED', 'Blocked'), ('UNKNOWN', 'Unknown')], default='PENDING', max_length=50),
        ),
    ]
